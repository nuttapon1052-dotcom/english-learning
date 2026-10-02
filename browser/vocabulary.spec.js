import {test,expect} from '@playwright/test';
import {basicVocabulary} from '../src/basic-vocabulary.js';
const blankConfig=async page=>page.route('**/auth-config.json',route=>route.fulfill({json:{supabaseUrl:'',supabasePublicKey:''}}));
for(const width of [320,768,1440]){
 test('foundation library browse, search, audio and persistence at '+width+'px',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:900});await blankConfig(page);
  await page.addInitScript(()=>{window.__spoken=[];Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},speak(u){window.__spoken.push(u.text);}}});});
  await page.goto('/english-learning/#vocab');
  await expect(page.locator('.basic-word-card')).toHaveCount(7);
  const noOverflow=async()=>expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await noOverflow();
  for(const [category,count] of [['months',12],['numbers',41],['fruit',16],['animals',20],['objects',24],['vegetables',16],['colors',12],['clothing',16],['transport',12],['places',12],['body',12]]){
   await page.locator('[data-basic-category="'+category+'"]').click();
   await expect(page.locator('.basic-word-card')).toHaveCount(count);
   await noOverflow();
  }
  await page.locator('#basicSearch').fill('แมว');
  await expect(page.locator('.basic-word-card')).toHaveCount(1);
  await expect(page.locator('.basic-word-card h3')).toHaveText('cat');
  await page.locator('#basicSearch').fill('1st');await expect(page.locator('.basic-word-card h3')).toHaveText('first');
  await page.locator('#basicSearch').fill('Monday');
  await page.locator('[data-vocab-speak="Monday"]').click();
  await expect.poll(()=>page.evaluate(()=>window.__spoken)).toEqual(['Monday']);
  await page.locator('.word-example summary').click();
  await expect(page.locator('.word-example')).toContainText('I study English on Monday.');
  await page.locator('#basicThaiSound').check();
  await expect(page.locator('.thai-sound')).toHaveCount(1);
  await page.locator('[data-review-word="days:monday"]').click();
  await expect(page.locator('[data-basic-total]')).toHaveText('1');
  await page.reload();
  await expect(page.locator('[data-review-word="days:monday"]')).toBeDisabled();
  await expect(page.locator('[data-basic-total]')).toHaveText('1');
  await page.locator('#basicUnreviewed').check();
  await expect(page.locator('.basic-word-card')).toHaveCount(6);
  await page.locator('#basicSearch').fill('no-such-word');
  await expect(page.locator('#startBasicQuiz')).toBeDisabled();
  await page.locator('#resetBasicSearch').click();
  await expect(page.locator('.basic-word-card')).toHaveCount(200);
  await noOverflow();
  await page.locator('[data-vocab-source="lessons"]').click();
  await expect(page.locator('.vocab-table')).toContainText('คำแรกของคุณ');
  await expect(page.locator('.basic-word-card')).toHaveCount(0);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('english-with-yuri-v1')));
  expect(saved.completed).toEqual([]);expect(saved.learnedWords).toEqual([]);expect(saved.xp).toBe(0);
  expect(saved.basicWordsReviewed).toEqual(['days:monday']);
  expect(errors).toEqual([]);
 });
}
test('vocabulary quiz gives feedback, prevents repeat scoring and retries only missed words',async({page})=>{
 await blankConfig(page);await page.goto('/english-learning/#vocab');
 await page.locator('#startBasicQuiz').click();
 let wrongId;
 for(let i=0;i<7;i++){
  const en=await page.locator('.quiz-word>strong').textContent(),word=basicVocabulary.find(w=>w.en===en);
  await expect(page.locator('#nextBasicWord')).toBeDisabled();
  const options=page.locator('[data-basic-answer]');
  await expect(options).toHaveCount(4);
  if(i===0){
   wrongId=word.id;const distractor=await options.evaluateAll((buttons,id)=>buttons.find(b=>b.dataset.basicAnswer!==id).dataset.basicAnswer,word.id);
   await page.locator('[data-basic-answer="'+distractor+'"]').click();
   await expect(page.locator('#basicQuizFeedback')).toContainText(word.th);
  }else await page.locator('[data-basic-answer="'+word.id+'"]').click();
  await expect(page.locator('[data-basic-answer]').first()).toBeDisabled();
  await page.locator('#nextBasicWord').click();
 }
 await expect(page.locator('.basic-quiz-score')).toHaveText('6 / 7');
 await expect(page.locator('.quiz-missed li')).toHaveCount(1);
 await page.locator('#retryBasicWords').click();
 await expect(page.locator('.progress-info')).toContainText('1 / 1');
 await page.locator('[data-basic-answer="'+wrongId+'"]').click();await page.locator('#nextBasicWord').click();
 await expect(page.locator('.basic-quiz-score')).toHaveText('1 / 1');
 await page.locator('#finishBasicQuiz').click();
 await expect(page.locator('[data-basic-total]')).toHaveText('7');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('english-with-yuri-v1')));
 expect(saved.basicWordsReviewed).toHaveLength(7);expect(saved.completed).toEqual([]);expect(saved.xp).toBe(0);
});
test('dashboard opens the foundation library even after visiting lesson vocabulary',async({page})=>{
 await blankConfig(page);await page.goto('/english-learning/#vocab');
 await page.locator('[data-vocab-source="lessons"]').click();
 await page.locator('.brand').click();await page.locator('.foundation-banner [data-nav="vocab"]').click();
 await expect(page.locator('.basic-library-head')).toBeVisible();
});
