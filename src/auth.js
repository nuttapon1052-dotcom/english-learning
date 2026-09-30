// Supabase handles passwords, verification and tokens. The frontend only uses
// the public API key; database policies enforce access for every request.
export function createAuthClient({ url, key, storage = globalThis.localStorage, fetchImpl = globalThis.fetch, redirectUrl }) {
  const base = String(url || '').replace(/\/$/, '');
  let keyRole = '';
  try { keyRole = JSON.parse(atob(String(key).split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role; } catch { /* publishable keys are not JWTs */ }
  const publicKey = String(key || '').startsWith('sb_publishable_') || keyRole === 'anon';
  const configured = /^https:\/\/[^/]+$/.test(base) && publicKey;
  const sessionKey = 'yuri-auth:' + base;
  let session = null, refreshing = null;
  try { session = JSON.parse(storage?.getItem(sessionKey) || 'null'); } catch { /* no stored session */ }
  function remember(data) {
    session = data?.access_token && data?.refresh_token ? {
      access_token: data.access_token, refresh_token: data.refresh_token,
      expires_at: data.expires_at || Math.floor(Date.now()/1000) + (data.expires_in || 3600), user: data.user
    } : null;
    try { session ? storage?.setItem(sessionKey, JSON.stringify(session)) : storage?.removeItem(sessionKey); } catch { /* session continues in memory */ }
    return session;
  }
  async function request(path, { method='GET', body, token, headers={}, keepalive=false } = {}) {
    if (!configured) throw new Error('ยังไม่ได้เปิดระบบบัญชีผู้ใช้ กรุณาเรียนแบบไม่สมัครก่อน');
    const response = await fetchImpl(base + path, {
      method, keepalive, cache:'no-store', headers: { apikey: key, 'Content-Type':'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...headers },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(15000)
    });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { /* non-json errors */ }
    if (!response.ok) {
      const error = new Error(data?.msg || data?.message || data?.error_description || 'เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่');
      error.status = response.status; error.code = data?.error_code || data?.code; throw error;
    }
    return data;
  }
  async function token(force=false) {
    if (!session) throw new Error('กรุณาเข้าสู่ระบบอีกครั้ง');
    if (!force && session.expires_at > Date.now()/1000 + 60) return session.access_token;
    if (!refreshing) refreshing = request('/auth/v1/token?grant_type=refresh_token', { method:'POST', body:{refresh_token:session.refresh_token} })
      .then(data=>remember(data).access_token)
      .catch(error=>{ if ([400,401,403].includes(error.status)) remember(null); throw error; })
      .finally(()=>{refreshing=null;});
    return refreshing;
  }
  async function authorized(path, options={}) {
    const access = await token();
    try { return await request(path,{...options,token:access}); }
    catch(error) { if(error.status !== 401) throw error; return request(path,{...options,token:await token(true)}); }
  }
  return {
    configured,
    get session() { return session; },
    async restore(hash='') {
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      if (params.has('error')) {
        const error = new Error('การเข้าสู่ระบบถูกยกเลิกหรือไม่สำเร็จ');
        error.code = params.get('error_code') || params.get('error');
        throw error;
      }
      const recovery = params.get('type') === 'recovery';
      if (params.has('access_token') && params.has('refresh_token')) {
        remember({access_token:params.get('access_token'),refresh_token:params.get('refresh_token'),expires_in:Number(params.get('expires_in'))||3600});
      }
      if (!configured || !session) return { user:null, recovery:false };
      const user = await authorized('/auth/v1/user');
      session.user = user; remember(session); return {user,recovery};
    },
    async googleSignInUrl() {
      const settings = await request('/auth/v1/settings');
      if (settings?.external?.google !== true) {
        const error = new Error('ยังไม่ได้เปิดการเข้าสู่ระบบด้วย Google');
        error.code = 'provider_disabled'; throw error;
      }
      const destination = new URL(base + '/auth/v1/authorize');
      destination.searchParams.set('provider','google');
      destination.searchParams.set('redirect_to',redirectUrl);
      destination.searchParams.set('prompt','select_account');
      return destination.href;
    },
    async signIn(email,password) {
      const data = await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
      remember(data); return data.user;
    },
    async signUp(email,password,name) {
      const data = await request('/auth/v1/signup?redirect_to=' + encodeURIComponent(redirectUrl),{
        method:'POST',body:{email,password,data:{display_name:name}}
      });
      if (data?.access_token) remember(data);
      return {user:data?.access_token ? data.user : null, confirmationRequired:!data?.access_token};
    },
    async signOut() {
      // Clear only after server logout succeeds; offline sessions stay recoverable.
      if (session) await authorized('/auth/v1/logout',{method:'POST'});
      remember(null);
    },
    async recover(email) {
      await request('/auth/v1/recover?redirect_to=' + encodeURIComponent(redirectUrl),{method:'POST',body:{email}});
    },
    async updatePassword(password) { return authorized('/auth/v1/user',{method:'PUT',body:{password}}); },
    async getProgress(userId) {
      const rows = await authorized('/rest/v1/learner_progress?user_id=eq.' + encodeURIComponent(userId) + '&select=state,updated_at');
      return rows?.[0] || null;
    },
    async compareAndSetProgress(userId,state,version=null,{keepalive=false}={}) {
      const query='user_id=eq.'+encodeURIComponent(userId)+(version!==null?'&updated_at=eq.'+encodeURIComponent(version):'');
      const path='/rest/v1/learner_progress'+(version!==null?'?'+query:'');
      const options={
        method:version!==null?'PATCH':'POST',body:version!==null?{state}:{user_id:userId,state},
        headers:{Prefer:'return=representation'},keepalive
      };
      try {
        let rows;
        if(keepalive){
          if(!session || session.expires_at<=Date.now()/1000+15)throw new Error('Session needs refreshing before syncing');
          if(new TextEncoder().encode(JSON.stringify(options.body)).length>60000)throw new Error('Progress requires a normal sync');
          rows=await request(path,{...options,token:session.access_token});
        }else rows=await authorized(path,options);
        return Array.isArray(rows)?rows[0]||null:null;
      }catch(error){
        // A racing first insert is retried as a versioned update, never an upsert.
        if(version===null && error.status===409 && error.code==='23505')return null;
        throw error;
      }
    },
    async isTeacher() { return Boolean(await authorized('/rest/v1/rpc/is_teacher',{method:'POST',body:{}})); },
    async getLearners() {
      // Both endpoints are protected by RLS; a student cannot request other users.
      const [profiles, progress] = await Promise.all([
        authorized('/rest/v1/learner_profiles?select=id,display_name,email,created_at&order=created_at.desc&limit=500'),
        authorized('/rest/v1/learner_progress?select=user_id,state,updated_at&limit=500')
      ]);
      return profiles.map(profile=>({...profile,progress:progress.find(p=>p.user_id===profile.id)||null}));
    }
  };
}
