import {test,expect} from '@playwright/test';
const base='https://example.supabase.co';
const users={
 A:{id:'00000000-0000-4000-8000-000000000001',email:'a@example.org',user_metadata:{full_name:'Learner A'}},
 B:{id:'00000000-0000-4000-8000-000000000002',email:'b@example.org',user_metadata:{full_name:'Learner B'}}
};
function createServer(){
 const rows=new Map();let revision=0;
 const server={rows,failWrites:false,async attach(context){
  await context.route('**/auth-config.json',route=>route.fulfill({json:{supabaseUrl:base,supabasePublicKey:'sb_publishable_test'}}));
  await context.route(base+'/**',async route=>{
   const req=route.request(),u=new URL(req.url()),key=req.headers().authorization?.replace('Bearer token-',''),user=users[key];
   if(!user)return route.fulfill({status:401,json:{message:'Unauthorized'}});
   if(u.pathname==='/auth/v1/user')return route.fulfill({json:user});
   if(u.pathname==='/auth/v1/logout')return route.fulfill({status:204});
   if(u.pathname==='/rest/v1/rpc/is_teacher')return route.fulfill({json:false});
   if(u.pathname!=='/rest/v1/learner_progress')throw new Error('Unexpected API request');
   const row=rows.get(user.id);
   if(req.method()==='GET')return route.fulfill({json:u.searchParams.get('user_id')==='eq.'+user.id&&row?[row]:[]});
   if(server.failWrites)return route.fulfill({status:503,json:{message:'Temporarily offline'}});
   const body=req.postDataJSON();
   if(req.method()==='POST'){
    if(body.user_id!==user.id)return route.fulfill({status:403,json:{message:'RLS denied'}});
    if(row)return route.fulfill({status:409,json:{code:'23505'}});
   }else if(req.method()==='PATCH'){
    if(u.searchParams.get('user_id')!=='eq.'+user.id || !row || u.searchParams.get('updated_at')!=='eq.'+row.updated_at)return route.fulfill({json:[]});
   }else throw new Error('Unexpected method');
   const next={user_id:user.id,state:body.state,updated_at:new Date(1700000000000+(++revision)).toISOString()};
   rows.set(user.id,next);return route.fulfill({json:[next]});
  });
 }};return server;
}
async function login(context,key){
 const page=await context.newPage();
 await page.goto('/english-learning/#access_token=token-'+key+'&refresh_token=refresh-'+key+'&expires_in=3600&type=signup');
 await expect(page.getByRole('heading',{name:'สวัสดี Learner '+key+'.'})).toBeVisible();
 await expect(page.locator('.sync-banner [data-sync-status]')).toHaveText('ซิงก์ความก้าวหน้าแล้ว');
 return page;
}
test('a second device restores completed lessons, cursor and writing; another account starts separately',async({browser})=>{
 const server=createServer(),contexts=[];
 try{
  const a=await browser.newContext();contexts.push(a);await server.attach(a);
  const page=await login(a,'A');
  await page.locator('.desktop-nav [data-nav="lessons"]').click();await page.locator('.lesson-card[data-lesson="2"]').click();
  for(let i=0;i<6;i++)await page.locator('#next').click();
  for(const word of ['He','is','ready.'])await page.locator('.word-bank .word-chip').getByText(word,{exact:true}).click();
  await page.locator('#checkArrange').click();await page.locator('#fill').fill('is');await page.locator('#checkFill').click();await page.locator('#next').click();
  await page.locator('.review-score [data-lesson="3"]').click();
  for(let i=0;i<5;i++)await page.locator('#next').click();
  await page.locator('#writing').fill('I work in an office.');
  // Logout must flush even when the debounced write has not started.
  await page.locator('.account-trigger').click();await page.locator('#logout').click();
  await expect(page.locator('.hero')).toBeVisible();
  expect(server.rows.get(users.A.id).state.completed).toEqual([2]);
  expect(server.rows.get(users.A.id).state.lessonDrafts[3].writing).toBe('I work in an office.');
  const b=await browser.newContext();contexts.push(b);await server.attach(b);
  const second=await login(b,'A');
  await expect(second.locator('.main .side-card').first()).toContainText('เรียนแล้ว 1 จาก 32 บท');
  await second.locator('.main [data-lesson="3"]').click();
  await expect(second.locator('#writing')).toHaveValue('I work in an office.');
  await expect(second.locator('.progress-info')).toContainText('อ่านและเขียน');
  const other=await browser.newContext();contexts.push(other);await server.attach(other);
  const otherPage=await login(other,'B');
  await expect(otherPage.locator('.main .side-card').first()).toContainText('เรียนแล้ว 0 จาก 32 บท');
  expect(server.rows.get(users.B.id).state.completed).toEqual([]);
 }finally{await Promise.all(contexts.map(c=>c.close()));}
});
test('failed writes retain the account and local draft; retry uploads them',async({browser})=>{
 const context=await browser.newContext(),server=createServer();await server.attach(context);
 try{
  const page=await login(context,'A');server.failWrites=true;
  await page.locator('.desktop-nav [data-nav="lessons"]').click();await page.locator('.lesson-card[data-lesson="3"]').click();
  for(let i=0;i<5;i++)await page.locator('#next').click();
  await page.locator('#writing').fill('I work at a shop.');
  await expect(page.locator('.sync-banner [data-sync-status]')).toContainText('ยังไม่ซิงก์');
  await page.locator('.account-trigger').click();await page.locator('#logout').click();
  await expect(page.getByRole('heading',{name:'สวัสดี Learner A.'})).toBeVisible();
  await expect(page.locator('.toast')).toContainText('ลองซิงก์ก่อนออกจากระบบ');
  server.failWrites=false;await page.locator('#syncNow').click();
  await expect(page.locator('.sync-banner [data-sync-status]')).toHaveText('ซิงก์ความก้าวหน้าแล้ว');
  expect(server.rows.get(users.A.id).state.lessonDrafts[3].writing).toBe('I work at a shop.');
 }finally{await context.close();}
});
test('the pagehide handler starts a versioned background save for pending progress',async({browser})=>{
 const context=await browser.newContext(),server=createServer();await server.attach(context);
 try{
  const page=await login(context,'A');
  await page.locator('.desktop-nav [data-nav="lessons"]').click();await page.locator('.lesson-card[data-lesson="3"]').click();
  await page.locator('#next').click();
  await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide')));
  await expect.poll(()=>server.rows.get(users.A.id)?.state.currentLesson).toBe(3);
  await expect.poll(()=>server.rows.get(users.A.id)?.state.currentStep).toBe(1);
 }finally{await context.close();}
});

test('foundation review syncs across devices and stays separate for another learner',async({browser})=>{
 const server=createServer(),contexts=[];
 try{
  const first=await browser.newContext();contexts.push(first);await server.attach(first);
  const page=await login(first,'A');await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('.desktop-nav [data-nav="vocab"]').click();
  await page.locator('[data-basic-category="days"]').click();
  await page.locator('[data-review-word="days:monday"]').click();
  await expect.poll(()=>server.rows.get(users.A.id)?.state.basicWordsReviewed).toEqual(['days:monday']);
  const second=await browser.newContext();contexts.push(second);await server.attach(second);
  const otherDevice=await login(second,'A');await otherDevice.emulateMedia({reducedMotion:'reduce'});await otherDevice.locator('.desktop-nav [data-nav="vocab"]').click();
  await otherDevice.locator('[data-basic-category="days"]').click();
  await expect(otherDevice.locator('[data-review-word="days:monday"]')).toBeDisabled();
  await otherDevice.locator('#bookContents').click();await otherDevice.locator('[data-basic-category="fruit"]').click();
  await otherDevice.locator('[data-review-word="fruit:apple"]').click();
  await expect.poll(()=>server.rows.get(users.A.id)?.state.basicWordsReviewed).toEqual(['days:monday','fruit:apple']);
  await page.reload();await expect(page.locator('[data-basic-total]')).toHaveText('2');
  expect(server.rows.get(users.A.id).state.completed).toEqual([]);
  expect(server.rows.get(users.A.id).state.learnedWords).toEqual([]);
  const third=await browser.newContext();contexts.push(third);await server.attach(third);
  const different=await login(third,'B');await different.emulateMedia({reducedMotion:'reduce'});await different.locator('.desktop-nav [data-nav="vocab"]').click();
  await different.locator('[data-basic-category="days"]').click();
  await expect(different.locator('[data-basic-total]')).toHaveText('0');
  await expect(different.locator('[data-review-word="days:monday"]')).toBeEnabled();
 }finally{await Promise.all(contexts.map(c=>c.close()));}
});
