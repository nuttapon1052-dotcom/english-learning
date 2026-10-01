import {test,expect} from '@playwright/test';

for(const width of [320,768,1440]){
 test('learning studio works at '+width+'px with filters, step navigation and pronunciation',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:900});
  await page.route('**/auth-config.json',route=>route.fulfill({json:{supabaseUrl:'',supabasePublicKey:''}}));
  await page.goto('/english-learning/');
  await expect(page.locator('.hero')).toBeVisible();
  const noOverflow=async()=>expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await noOverflow();
  await expect(page.locator('.hero-art .ui-icon').first()).toBeVisible();
  await page.locator('.main [data-nav="lessons"]').first().click();
  await expect(page.locator('.lesson-card')).toHaveCount(32);
  await expect(page.locator('.catalog-group')).toHaveCount(8);
  await noOverflow();
  await page.locator('[data-filter="6"]').click();
  await expect(page.locator('.lesson-card')).toHaveCount(4);
  await page.locator('#lessonSearch').fill('กำลังทำ');
  await expect(page.locator('.lesson-card')).toHaveCount(1);
  await page.locator('.lesson-card[data-lesson="27"]').click();
  await page.locator('[data-step="1"]').click();
  await expect(page.locator('[data-step="1"]')).toHaveAttribute('aria-current','step');
  await page.locator('#lessonThaiSound').check();
  await expect(page.locator('.thai-sound')).toHaveCount(6);
  await noOverflow();
  await page.locator('[data-step="2"]').click();
  await expect(page.locator('.coach-note')).toContainText('She is cooking dinner.');
  await noOverflow();
  await page.locator('[data-step="5"]').click();
  await page.locator('#writing').fill('I am reading now.');
  await page.reload();
  await expect(page.locator('#writing')).toHaveValue('I am reading now.');
  await page.locator('.lesson-breadcrumb [data-nav="lessons"]').click();
  await page.locator('[data-filter="all"]').click();
  await page.locator('#lessonSearch').fill('');
  await page.locator('#lessonStatus').selectOption('ongoing');
  await expect(page.locator('.lesson-card')).toHaveCount(1);
  await expect(page.locator('.lesson-card')).toContainText('ตอนนี้กำลังทำอะไร');
  await page.locator('#lessonStatus').selectOption('completed');
  await expect(page.locator('#clearFilters')).toBeVisible();
  await page.locator('#clearFilters').click();
  await expect(page.locator('.lesson-card')).toHaveCount(32);
  expect(errors).toEqual([]);
  await page.screenshot({path:'test-results/studio-'+width+'.png',fullPage:true});
 });
}
