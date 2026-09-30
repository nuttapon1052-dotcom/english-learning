// Read-only connectivity and anonymous-access checks. No account is created,
// no email sent, and no user data is queried with elevated privileges.
import {readFile} from 'node:fs/promises';
const config=JSON.parse(await readFile(new URL('../public/auth-config.json',import.meta.url),'utf8'));
if(!config.supabaseUrl || !config.supabasePublicKey)process.exit(0);
const base=new URL(config.supabaseUrl).origin;
const headers={apikey:config.supabasePublicKey};
const settingsResponse=await fetch(base+'/auth/v1/settings',{headers,signal:AbortSignal.timeout(20000)});
if(!settingsResponse.ok)throw new Error('Supabase auth connection failed: HTTP '+settingsResponse.status);
const settings=await settingsResponse.json();
if(settings.external?.email!==true)throw new Error('Email authentication is not enabled');
console.log('Supabase connection: OK. Email authentication enabled.');
console.log('Email confirmation: '+(settings.mailer_autoconfirm?'disabled':'required'));
for(const table of ['learner_profiles','learner_progress','teacher_accounts']){
 const response=await fetch(base+'/rest/v1/'+table+'?select=*&limit=0',{headers,signal:AbortSignal.timeout(20000)});
 const body=await response.json();
 if(response.status!==403 || body.code!=='42501')throw new Error('Expected anonymous access denial for '+table+'; received HTTP '+response.status+' code '+body.code);
 console.log(table+': exists; anonymous access denied.');
}
const rpc=await fetch(base+'/rest/v1/rpc/is_teacher',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(20000)});
const rpcBody=await rpc.json();
if(rpc.status!==403 || rpcBody.code!=='42501')throw new Error('Teacher check is not correctly protected: HTTP '+rpc.status+' code '+rpcBody.code);
console.log('Teacher role check: anonymous access denied.');
