import test from 'node:test';
import assert from 'node:assert/strict';
import {createAuthClient} from '../src/auth.js';
import {saveCloudProgress} from '../src/cloud-progress.js';
import {freshProgress,normalizeProgress} from '../src/progress.js';
const response=(data,status=200)=>new Response(JSON.stringify(data),{status});
function server(initial=null){
 let row=initial?structuredClone(initial):null,revision=0,reads=0,release=null,barrier=null;
 const api={
  get row(){return row;},
  race(){reads=0;barrier=new Promise(r=>release=r);},
  failWrites:false,
  async fetch(url,options){
   const u=new URL(url),body=options.body?JSON.parse(options.body):null;
   if(u.pathname==='/auth/v1/token')return response({access_token:'token-A',refresh_token:'refresh-A',expires_in:3600,user:{id:'A',email:'a@example.org'}});
   assert.equal(options.headers.Authorization,'Bearer token-A');
   assert.equal(u.pathname,'/rest/v1/learner_progress');
   if(options.method==='GET'){
    const snapshot=row?structuredClone(row):null;
    if(barrier && reads++<2){if(reads===2){release();}await barrier;}
    return response(snapshot?[snapshot]:[]);
   }
   if(api.failWrites)return response({message:'offline',code:'network_error'},503);
   if(options.method==='POST' && row)return response({code:'23505'},409);
   if(options.method==='PATCH' && (!row || u.searchParams.get('updated_at')!=='eq.'+row.updated_at))return response([]);
   assert.ok(['POST','PATCH'].includes(options.method));
   row={user_id:'A',state:structuredClone(body.state),updated_at:'v'+(++revision)};
   return response([row]);
  }
 };return api;
}
async function client(api){
 const data=new Map(),storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const auth=createAuthClient({url:'https://example.supabase.co',key:'sb_publishable_test',storage,fetchImpl:api.fetch});
 await auth.signIn('a@example.org','not-persisted');return auth;
}
test('a new device restores completed lessons, position, drafts, settings and assessment',async()=>{
 const state=normalizeProgress({...freshProgress(),completed:[2],currentLesson:3,currentStep:5,minutes:30,showThaiSound:true,assessment:2,awards:['listen:2','fill:2'],lessonDrafts:{3:{writing:'I work in an office.',updatedAt:200}},updatedAt:200,cursorUpdatedAt:200});
 const api=server({user_id:'A',state,updated_at:'v0'}),auth=await client(api);
 const saved=await saveCloudProgress(auth,'A',freshProgress());
 assert.deepEqual(saved.state,state);
});
for(const initial of [null,{user_id:'A',state:freshProgress(),updated_at:'v0'}]){
 test('simultaneous '+(initial?'updates':'first inserts')+' preserve both devices\' completed lessons',async()=>{
  const api=server(initial),a=await client(api),b=await client(api);api.race();
  const one={...freshProgress(),completed:[1],awards:['listen:1'],updatedAt:100};
  const two={...freshProgress(),completed:[2],awards:['listen:2'],updatedAt:200};
  await Promise.all([saveCloudProgress(a,'A',one),saveCloudProgress(b,'A',two)]);
  assert.deepEqual(api.row.state.completed,[1,2]);assert.equal(api.row.state.xp,2);assert.equal(api.row.state.skill.ฟัง,20);
 });
}
test('a stale device cannot undo a deliberate cloud reset',async()=>{
 const old={...freshProgress(),completed:[1,2],updatedAt:100};
 const api=server({user_id:'A',state:old,updated_at:'v0'}),auth=await client(api);
 const next={...freshProgress(),resetAt:200,updatedAt:200};
 await saveCloudProgress(auth,'A',next,{reset:true});
 await saveCloudProgress(auth,'A',{...old,updatedAt:9999});
 assert.deepEqual(api.row.state.completed,[]);assert.equal(api.row.state.resetAt,200);
});
test('a failed cloud write does not mutate the local backup or report success',async()=>{
 const api=server(),auth=await client(api),local={...freshProgress(),completed:[2],updatedAt:100},copy=structuredClone(local);
 api.failWrites=true;
 await assert.rejects(()=>saveCloudProgress(auth,'A',local),/offline/);
 assert.deepEqual(local,copy);assert.equal(api.row,null);
});
