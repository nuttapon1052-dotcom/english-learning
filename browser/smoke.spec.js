import { test, expect } from '@playwright/test';
test('guest can navigate, search, finish lesson 24 and retain progress',async({page})=>{
 await page.goto('/english-learning/');
 await expect(page.getByRole('heading',{name:/ภาษาอังกฤษ/})).toBeVisible();
 await page.locator('.desktop-nav [data-nav="lessons"]').click();
 await expect(page.locator('.lesson-card')).toHaveCount(32);
 await page.locator('#lessonSearch').fill('อีเมล');await expect(page.locator('.lesson-card')).toHaveCount(1);
 await page.locator('#lessonSearch').fill('');await page.locator('[data-lesson="24"]').click();
 for(let i=0;i<6;i++)await page.locator('#next').click();
 await page.locator('#next').click();await expect(page.locator('.toast')).toContainText('ตรวจคำตอบ');
 for(const word of ['I','would','like','a return ticket.'])await page.locator('.word-bank .word-chip').getByText(word,{exact:true}).click();
 await page.locator('#checkArrange').click();
 await page.locator('#fill').fill('helpful');await page.locator('#checkFill').click();await page.locator('#next').click();
 await expect(page.getByRole('heading',{name:'เก่งมาก! วันนี้คุณทำได้อีกหนึ่งก้าว'})).toBeVisible();
 await page.locator('.review-score [data-nav="progress"]').click();
 await expect(page.locator('.stats-grid .stat').first()).toContainText('1 / 32');
 await page.reload();await expect(page.locator('.stats-grid .stat').first()).toContainText('1 / 32');
});
test('mobile layout has no horizontal page overflow and account is honest before setup',async({page})=>{
 await page.route('**/auth-config.json',route=>route.fulfill({json:{supabaseUrl:'',supabasePublicKey:''}}));
 await page.setViewportSize({width:390,height:844});
 await page.goto('/english-learning/');
 await expect(page.locator('.hero')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
 await page.locator('.account-trigger').click();
 await expect(page.getByRole('heading',{name:'ระบบบัญชีกำลังเตรียมเปิดใช้งาน'})).toBeVisible();
 await expect(page.locator('#authForm')).toHaveCount(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
});

test('configured account displays real login and signup forms',async({page})=>{
 await page.goto('/english-learning/#account');
 await expect(page.locator('#authForm')).toBeVisible();
 await expect(page.locator('#email')).toHaveAttribute('type','email');
 await page.locator('[data-auth-mode="signup"]').click();
 await expect(page.locator('#displayName')).toBeVisible();
 await expect(page.locator('#passwordConfirm')).toBeVisible();
 await expect(page.getByRole('heading',{name:'ระบบบัญชีกำลังเตรียมเปิดใช้งาน'})).toHaveCount(0);
});
