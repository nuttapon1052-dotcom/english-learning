import test from 'node:test';
import assert from 'node:assert/strict';
import {createAuthClient} from '../src/auth.js';
const memory=()=>{const map=new Map();return {getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k),map};};
const response=(body,status=200)=>new Response(body===null?'':JSON.stringify(body),{status});
const opts={url:'https://example.supabase.co',key:'sb_publishable_testing',redirectUrl:'https://example.org/english-learning/'};
const session={access_token:'access',refresh_token:'refresh',expires_in:3600,user:{id:'A',email:'a@example.org'}};

test('without public config no login requests are sent',async()=>{
 let requests=0;
 for(const key of ['', 'sb_secret_private']){const client=createAuthClient({...opts,key,storage:memory(),fetchImpl:async()=>{requests++;}});assert.equal(client.configured,false);await assert.rejects(()=>client.signIn('a','password'));}
 assert.equal(requests,0);
});
test('signup awaiting email confirmation does not create a fake session',async()=>{
 const store=memory();const client=createAuthClient({...opts,storage:store,fetchImpl:async()=>response({user:session.user})});
 const result=await client.signUp('a@example.org','password-123','A');
 assert.equal(result.confirmationRequired,true);assert.equal(client.session,null);assert.equal(store.map.size,0);
});
test('passwords are never persisted; progress uses user JWT',async()=>{
 const store=memory(),calls=[];
 const client=createAuthClient({...opts,storage:store,fetchImpl:async(url,options)=>{calls.push({url,options});return response(url.includes('/token?')?session:null);}});
 await client.signIn('a@example.org','password-123');
 await client.putProgress('A',{completed:[1]});
 assert.ok(![...store.map.values()].some(v=>v.includes('password-123')));
 assert.equal(calls[1].options.headers.Authorization,'Bearer access');
 assert.equal(JSON.parse(calls[1].options.body).user_id,'A');
});
test('concurrent expired-token requests refresh once',async()=>{
 const store=memory();let refreshes=0;
 const client=createAuthClient({...opts,storage:store,fetchImpl:async url=>{
  if(url.includes('grant_type=password'))return response({...session,expires_at:1});
  if(url.includes('grant_type=refresh_token')){refreshes++;await new Promise(r=>setTimeout(r,10));return response({...session,access_token:'renewed'});}
  return response([]);
 }});
 await client.signIn('a@example.org','password-123');
 await Promise.all([client.getProgress('A'),client.getProgress('A')]);assert.equal(refreshes,1);
});
test('failed cloud writes are surfaced instead of marked saved',async()=>{
 const client=createAuthClient({...opts,storage:memory(),fetchImpl:async url=>url.includes('/token?')?response(session):response({message:'RLS denied'},403)});
 await client.signIn('a@example.org','password-123');await assert.rejects(()=>client.putProgress('B',{}),/RLS denied/);
});
test('recovery callback validates the user before reporting password-reset mode',async()=>{
 const client=createAuthClient({...opts,storage:memory(),fetchImpl:async()=>response(session.user)});
 const restored=await client.restore('#access_token=access&refresh_token=refresh&type=recovery&expires_in=3600');
 assert.equal(restored.user.id,'A');assert.equal(restored.recovery,true);
});

test('Google entry point checks provider availability and uses the website redirect',async()=>{
 const calls=[],store=memory();
 const client=createAuthClient({...opts,storage:store,fetchImpl:async(url,options)=>{calls.push({url,options});return response({external:{google:true}});}});
 const url=new URL(await client.googleSignInUrl());
 assert.equal(calls[0].url,opts.url+'/auth/v1/settings');
 assert.equal(calls[0].options.headers.apikey,opts.key);
 assert.equal(url.origin,opts.url);
 assert.equal(url.pathname,'/auth/v1/authorize');
 assert.equal(url.searchParams.get('provider'),'google');
 assert.equal(url.searchParams.get('redirect_to'),opts.redirectUrl);
 assert.equal(url.searchParams.get('prompt'),'select_account');
 assert.equal(url.searchParams.has('apikey'),false);
 assert.equal(store.map.size,0);
});
test('disabled Google provider is surfaced without creating a session',async()=>{
 const client=createAuthClient({...opts,storage:memory(),fetchImpl:async()=>response({external:{google:false}})});
 await assert.rejects(()=>client.googleSignInUrl(),error=>error.code==='provider_disabled');
 assert.equal(client.session,null);
});
test('Google callback validates identity and uses its JWT for cloud progress',async()=>{
 const calls=[];
 const client=createAuthClient({...opts,storage:memory(),fetchImpl:async(url,options)=>{
  calls.push({url,options});return response(url.endsWith('/auth/v1/user')?session.user:[]);
 }});
 const restored=await client.restore('#access_token=google-access&refresh_token=google-refresh&expires_in=3600&type=signup');
 assert.equal(restored.user.id,'A');assert.equal(restored.recovery,false);
 await client.getProgress('A');
 assert.equal(calls[0].options.headers.Authorization,'Bearer google-access');
 assert.equal(calls[1].options.headers.Authorization,'Bearer google-access');
});
test('cancelled OAuth callbacks report cancellation without accepting identity',async()=>{
 let requests=0;
 const client=createAuthClient({...opts,storage:memory(),fetchImpl:async()=>{requests++;}});
 await assert.rejects(()=>client.restore('#error=access_denied&error_description=cancelled'),error=>error.code==='access_denied');
 assert.equal(requests,0);assert.equal(client.session,null);
});
