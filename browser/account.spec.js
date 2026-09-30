import { test, expect } from '@playwright/test';
for (const width of [1440,390]) {
 test('account click survives delayed initialization at width '+width,async({page})=>{
  await page.setViewportSize({width,height:900});
  let release;
  const ready=new Promise(resolve=>{release=resolve;});
  await page.route('**/auth-config.json',async route=>{await ready;await route.fulfill({json:{supabaseUrl:'https://example.supabase.co',supabasePublicKey:'sb_publishable_test'}});});
  await page.goto('/english-learning/');
  try {
   await page.locator('.account-trigger').click();
   await expect(page).toHaveURL(/#account$/);
  } finally {release();}
  await expect(page.locator('#authForm')).toBeVisible();
 });
}
test('published header opens the account form',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('https://nuttapon1052-dotcom.github.io/english-learning/');
 await expect(page.locator('.hero')).toBeVisible();
 await page.locator('.account-trigger').click();
 await expect(page.locator('#authForm')).toBeVisible();
 expect(errors).toEqual([]);
});
