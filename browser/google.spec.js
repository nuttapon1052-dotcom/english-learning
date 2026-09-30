import { test, expect } from '@playwright/test';
const base='https://example.supabase.co';
async function mockConfig(page) {
 await page.route('**/auth-config.json',route=>route.fulfill({json:{supabaseUrl:base,supabasePublicKey:'sb_publishable_testing'}}));
}
test('Google button opens the provider with the correct return address',async({page})=>{
 await mockConfig(page);
 await page.route(base+'/auth/v1/settings',route=>route.fulfill({json:{external:{google:true}}}));
 await page.route(base+'/auth/v1/authorize?**',route=>route.fulfill({contentType:'text/html',body:'<h1>Mock provider</h1>'}));
 await page.goto('/english-learning/#account');
 await page.getByRole('button',{name:'เข้าสู่ระบบด้วย Google',exact:true}).click();
 await expect(page).toHaveURL(/\/auth\/v1\/authorize\?/);
 const url=new URL(page.url());
 expect(url.searchParams.get('provider')).toBe('google');
 expect(url.searchParams.get('redirect_to')).toBe('http://127.0.0.1:5173/english-learning/');
 expect(url.searchParams.get('prompt')).toBe('select_account');
});
test('Google provider awaiting setup keeps the email option usable',async({page})=>{
 await mockConfig(page);
 await page.route(base+'/auth/v1/settings',route=>route.fulfill({json:{external:{google:false}}}));
 await page.goto('/english-learning/#account');
 const google=page.getByRole('button',{name:'เข้าสู่ระบบด้วย Google',exact:true});
 await google.click();
 await expect(page.locator('#authFeedback')).toContainText('Google ยังไม่เปิดใช้งาน');
 await expect(google).toBeEnabled();
 await expect(page.locator('#email')).toBeVisible();
 await expect(page).toHaveURL(/#account$/);
});
test('Google callback restores a verified account and removes token parameters',async({page})=>{
 await mockConfig(page);
 let remote=null,revision=0;
 const user={id:'00000000-0000-4000-8000-000000000001',email:'learner@example.org',user_metadata:{full_name:'Google Learner'}};
 await page.route(base+'/**',route=>{
  const url=new URL(route.request().url());
  expect(route.request().headers().authorization).toBe('Bearer test-access');
  if(url.pathname==='/auth/v1/user')return route.fulfill({json:user});
  if(url.pathname==='/rest/v1/rpc/is_teacher')return route.fulfill({json:false});
  if(url.pathname==='/rest/v1/learner_progress'){
   if(route.request().method()==='GET')return route.fulfill({json:remote?[remote]:[]});
   const body=route.request().postDataJSON();
   remote={user_id:user.id,state:body.state,updated_at:new Date(1700000000000+(++revision)).toISOString()};
   return route.fulfill({json:[remote]});
  }
  throw new Error('Unexpected auth request');
 });
 await page.goto('/english-learning/#access_token=test-access&refresh_token=test-refresh&expires_in=3600&type=signup');
 await expect(page.getByRole('heading',{name:'สวัสดี Google Learner.'})).toBeVisible();
 await expect(page.locator('.sync-banner [data-sync-status]')).toContainText('ซิงก์ความก้าวหน้าแล้ว');
 expect(page.url()).toBe('http://127.0.0.1:5173/english-learning/#account');
 await page.reload();
 await expect(page.getByRole('heading',{name:'สวัสดี Google Learner.'})).toBeVisible();
});
test('cancelled Google login returns to a usable account form',async({page})=>{
 await mockConfig(page);
 await page.goto('/english-learning/#error=access_denied&error_description=cancelled');
 await expect(page.locator('#authForm')).toBeVisible();
 await expect(page.locator('.toast')).toContainText('ยกเลิกการเข้าสู่ระบบด้วย Google');
 await expect(page).toHaveURL(/#account$/);
});
