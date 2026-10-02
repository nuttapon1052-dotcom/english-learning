import {test,expect} from '@playwright/test';
import {basicVocabulary,vocabularyCategories} from '../src/basic-vocabulary.js';

 const blankConfig=async page=>page.route('**/auth-config.json',route=>route.fulfill({json:{supabaseUrl:'',supabasePublicKey:''}}));
 const settle=async page=>expect(page.locator('#bookStage')).toHaveAttribute('data-turning','false');
 async function chapter(page,id){
  if(!await page.locator('[data-basic-category="'+id+'"]').count()){await page.locator('#bookContents').click();await settle(page);}
  await page.locator('[data-basic-category="'+id+'"]').click();await settle(page);
 }
 for(const width of [320,768,1440]){
  test('picture book contents, search, audio and review persistence at '+width+'px',async({page})=>{
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await blankConfig(page);
   await page.addInitScript(()=>{window.__spoken=[];Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},speak(u){window.__spoken.push(u.text);}}});});
   await page.goto('/english-learning/#vocab');
   await expect(page.locator('.book-contents-page')).toBeVisible();
   await expect(page.locator('[data-basic-category]')).toHaveCount(vocabularyCategories.length);
   const size=width<=900?1:2;
   const noOverflow=async()=>expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
   await noOverflow();
   for(const c of vocabularyCategories){
    await chapter(page,c.id);
    const words=basicVocabulary.filter(w=>w.category===c.id);
    await expect(page.locator('#basicResults .basic-word-card')).toHaveCount(Math.min(size,words.length));
    await expect(page.locator('#basicResultCount')).toHaveText(words.length+' คำ');
    await expect(page.locator('#bookPageJump option')).toHaveCount(Math.ceil(words.length/size));
    await expect(page.locator('#basicResults .basic-word-card h3').first()).toHaveText(words[0].en);
    await noOverflow();
   }
   await page.locator('#basicSearch').fill('แมว');
   await expect(page.locator('#basicResults .basic-word-card h3')).toHaveText('cat');
   await page.locator('#basicSearch').fill('cafe');await expect(page.locator('#basicResults .basic-word-card h3')).toHaveText('café');
   await page.locator('#basicSearch').fill('1st');await expect(page.locator('#basicResults .basic-word-card h3')).toHaveText('first');
   await page.locator('#basicSearch').fill('Monday');
   await page.locator('[data-vocab-speak="Monday"]').click();
   await expect.poll(()=>page.evaluate(()=>window.__spoken)).toEqual(['Monday']);
   await expect(page.locator('#basicResults .word-example')).toContainText('I study English on Monday.');
   await page.locator('#basicThaiSound').check();await expect(page.locator('#basicResults .thai-sound')).toHaveCount(1);
   await page.locator('[data-review-word="days:monday"]').click();await expect(page.locator('[data-basic-total]')).toHaveText('1');
   await page.reload();await chapter(page,'days');
   await expect(page.locator('[data-review-word="days:monday"]')).toBeDisabled();await expect(page.locator('[data-basic-total]')).toHaveText('1');
   await page.locator('#basicUnreviewed').check();
   await expect(page.locator('#basicResultCount')).toHaveText('6 คำ');
   await expect(page.locator('[data-review-word="days:monday"]')).toHaveCount(0);
   await page.locator('#basicSearch').fill('no-such-word');await expect(page.locator('#startBasicQuiz')).toBeDisabled();
   await expect(page.locator('#nextBookPage')).toBeDisabled();
   await page.locator('#resetBasicSearch').click();
   await expect(page.locator('#basicResultCount')).toHaveText(basicVocabulary.length+' คำ');
   await expect(page.locator('#basicResults .basic-word-card')).toHaveCount(size);await noOverflow();
   await page.locator('[data-vocab-source="lessons"]').click();await expect(page.locator('.vocab-table')).toContainText('คำแรกของคุณ');
   await expect(page.locator('.basic-word-card')).toHaveCount(0);
   const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('english-with-yuri-v1')));
   expect(saved.completed).toEqual([]);expect(saved.learnedWords).toEqual([]);expect(saved.xp).toBe(0);expect(saved.basicWordsReviewed).toEqual(['days:monday']);
   expect(errors).toEqual([]);
  });
 }
 for(const width of [320,1440]){
  test('physical page turns, folios and keyboard navigation at '+width+'px',async({page})=>{
   await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'no-preference'});await blankConfig(page);await page.goto('/english-learning/#vocab');
   await chapter(page,'fruit');const size=width<=900?1:2;
   await expect(page.locator('#basicResults .basic-word-card h3').first()).toHaveText('apple');
   await page.locator('#nextBookPage').click();
   await expect(page.locator('#bookStage')).toHaveAttribute('data-turning','true');
   await expect(page.locator('#nextBookPage')).toBeDisabled();
   const physical=await page.locator('.book-turn-leaf').evaluate(leaf=>{
    const animation=leaf.getAnimations()[0];animation.pause();animation.currentTime=400;
    const style=getComputedStyle(leaf),front=getComputedStyle(leaf.querySelector('.book-turn-front'));
    const result={transform:style.transform,origin:style.transformOrigin,backface:front.backfaceVisibility,hidden:leaf.parentElement.getAttribute('aria-hidden')};
    animation.play();return result;
   });
   expect(physical.transform).not.toBe('none');expect(physical.transform).toContain('matrix3d');
   expect(parseFloat(physical.origin)).toBe(0);
   expect(physical.backface).toBe('hidden');expect(physical.hidden).toBe('true');await settle(page);
   await expect(page.locator('#basicResults .basic-word-card h3').first()).toHaveText(size===1?'banana':'orange');
   await expect(page.locator('.book-turn-layer')).toHaveCount(0);
   await page.locator('#previousBookPage').click();await settle(page);
   await expect(page.locator('#basicResults .basic-word-card h3').first()).toHaveText('apple');
   await expect(page.locator('#previousBookPage')).toBeDisabled();
   await page.locator('#bookStage').focus();await page.locator('#bookStage').press('ArrowRight');await settle(page);
   await expect(page.locator('#basicResults .basic-word-card h3').first()).toHaveText(size===1?'banana':'orange');
   const lastValue=await page.locator('#bookPageJump option').last().getAttribute('value');
   await page.locator('#bookPageJump').selectOption(lastValue);await settle(page);
   await expect(page.locator('#nextBookPage')).toHaveText('หมวดถัดไป');
   await page.locator('#nextBookPage').click();await settle(page);
   await expect(page.locator('#basicGroupTitle')).toHaveText('สัตว์รอบตัว');
   await expect(page.locator('#basicResults .basic-word-card h3').first()).toHaveText('cat');
   await chapter(page,'body');
   await page.locator('#bookPageJump').selectOption(await page.locator('#bookPageJump option').last().getAttribute('value'));await settle(page);
   await expect(page.locator('#nextBookPage')).toBeDisabled();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  });
 }
 test('reduced motion, live search during a turn, resize and touch navigation',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:1440,height:900});await blankConfig(page);await page.goto('/english-learning/#vocab');
  await chapter(page,'fruit');await page.locator('#nextBookPage').click();
  await page.locator('#basicSearch').fill('แมว');
  await expect(page.locator('.book-turn-layer')).toHaveCount(0);await settle(page);
  await expect(page.locator('#basicResults .basic-word-card h3')).toHaveText('cat');
  await page.emulateMedia({reducedMotion:'reduce'});await chapter(page,'fruit');
  await page.locator('#nextBookPage').click();await settle(page);await expect(page.locator('.book-turn-layer')).toHaveCount(0);
  await expect(page.locator('#basicResults .basic-word-card h3').first()).toHaveText('orange');
  await page.setViewportSize({width:320,height:900});
  await expect(page.locator('#basicResults .basic-word-card')).toHaveCount(1);
  await expect(page.locator('#basicResults .basic-word-card h3')).toHaveText('orange');
  await page.locator('#bookStage').dispatchEvent('pointerdown',{clientX:240,clientY:300,pointerId:11,pointerType:'touch'});
  await page.locator('#bookStage').dispatchEvent('pointerup',{clientX:120,clientY:304,pointerId:11,pointerType:'touch'});
  await expect(page.locator('#basicResults .basic-word-card h3')).toHaveText('mango');
  await page.locator('#bookStage').dispatchEvent('pointerdown',{clientX:120,clientY:300,pointerId:12,pointerType:'touch'});
  await page.locator('#bookStage').dispatchEvent('pointerup',{clientX:240,clientY:304,pointerId:12,pointerType:'touch'});
  await expect(page.locator('#basicResults .basic-word-card h3')).toHaveText('orange');
  expect(errors).toEqual([]);
 });

test('vocabulary quiz gives feedback, prevents repeat scoring and retries only missed words',async({page})=>{
 await blankConfig(page);await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/english-learning/#vocab');
 await page.locator('[data-basic-category="days"]').click();
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
