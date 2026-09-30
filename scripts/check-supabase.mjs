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
console.log('Google authentication: '+(settings.external?.google===true?'enabled':'not enabled; owner setup required'));
console.log('Email confirmation: '+(settings.mailer_autoconfirm?'disabled':'required'));
for(const table of ['learner_profiles','learner_progress','teacher_accounts']){
 const response=await fetch(base+'/rest/v1/'+table+'?select=*&limit=0',{headers,signal:AbortSignal.timeout(20000)});
 const body=await response.json();
 if(![401,403].includes(response.status) || body.code!=='42501')throw new Error('Expected anonymous access denial for '+table+'; received HTTP '+response.status+' code '+body.code);
 console.log(table+': exists; anonymous access denied.');
}
const rpc=await fetch(base+'/rest/v1/rpc/is_teacher',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(20000)});
const rpcBody=await rpc.json();
if(![401,403].includes(rpc.status) || rpcBody.code!=='42501')throw new Error('Teacher check is not correctly protected: HTTP '+rpc.status+' code '+rpcBody.code);
console.log('Teacher role check: anonymous access denied.');

if(settings.external?.google===true){
 const authorize=new URL(base+'/auth/v1/authorize');
 authorize.searchParams.set('provider','google');
 authorize.searchParams.set('redirect_to','https://nuttapon1052-dotcom.github.io/english-learning/');
 authorize.searchParams.set('prompt','select_account');
 const oauth=await fetch(authorize,{redirect:'manual',signal:AbortSignal.timeout(20000)});
 if(![302,303,307].includes(oauth.status))throw new Error('Google authorization did not redirect: HTTP '+oauth.status);
 const location=oauth.headers.get('location');
 if(!location)throw new Error('Google authorization redirect is missing');
 const destination=new URL(location);
 if(destination.protocol!=='https:' || destination.hostname!=='accounts.google.com')throw new Error('Google authorization did not select the Google provider');
 if(destination.searchParams.get('redirect_uri')!==base+'/auth/v1/callback')throw new Error('Google callback address does not match this Supabase project');
 if(!destination.searchParams.get('client_id')?.endsWith('.apps.googleusercontent.com'))throw new Error('Google OAuth client ID is not a Web application client ID');
 if(destination.searchParams.get('response_type')!=='code')throw new Error('Google authorization response type is incorrect');
 console.log('Google authorization redirect: OK. Google host, OAuth client and Supabase callback match.');
 // Do not log the Location header: it contains transient OAuth state.
}
