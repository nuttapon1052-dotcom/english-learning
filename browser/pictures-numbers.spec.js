import {test,expect} from '@playwright/test';
import {basicVocabulary} from '../src/basic-vocabulary.js';
import {vocabularyArtwork} from '../src/vocabulary-art.js';
async function setup(page){
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.route('**/auth-config.json',route=>route.fulfill({json:{supabaseUrl:'',supabasePublicKey:''}}));
 await page.addInitScript(()=>{window.__spoken=[];Object.defineProperty(window,'speechSynthesis',{value:{cancel(){},speak(u){window.__spoken.push(u.text);}}});});
 await page.goto('/english-learning/#vocab');
}
for(const width of [320,1440]){
 test('typed numbers, exact speech and responsive results at '+width+'px',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:900});await setup(page);
  await page.locator('[data-basic-category="numbers"]').click();
  await expect(page.locator('#numberReader')).toHaveAttribute('open','');
  await page.locator('#numberInput').fill('167');
  await expect(page.locator('#numberEnglish')).toHaveText('one hundred sixty-seven');
  await expect(page.locator('#numberThai')).toContainText('วัน ฮัน-เดร็ด');
  await page.locator('#numberInput').fill('21,425');
  await expect(page.locator('#numberEnglish')).toHaveText('twenty-one thousand four hundred twenty-five');
  await page.locator('#speakNumber').click();
  await expect.poll(()=>page.evaluate(()=>window.__spoken.at(-1))).toBe('twenty-one thousand four hundred twenty-five');
  await page.locator('#numberInput').fill('21425');await expect(page.locator('#numberFormatted')).toHaveText('21,425');
  await page.locator('#numberInput').fill('-12.05');await expect(page.locator('#numberEnglish')).toHaveText('minus twelve point zero five');
  await page.locator('#numberInput').fill('999999999999999.123456');
  await expect(page.locator('#numberEnglish')).toContainText('nine hundred ninety-nine trillion');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  for(const input of ['1,23','1000000000000000','1.2345678','<img src=x>','']){
   await page.locator('#numberInput').fill(input);await expect(page.locator('#speakNumber')).toBeDisabled();
   await expect(page.locator('#numberResult')).toBeHidden();await expect(page.locator('#numberError')).not.toBeEmpty();
  }
  await page.locator('[data-number-example="1,000,000"]').click();
  await expect(page.locator('#numberEnglish')).toHaveText('one million');await expect(page.locator('#speakNumber')).toBeEnabled();
  expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('english-with-yuri-v1')||'{}').completed||[])).toEqual([]);
  expect(errors).toEqual([]);
 });

 test('AI illustrations load and crop correctly through every book page at '+width+'px',async({page})=>{
  test.setTimeout(90000);
  await page.setViewportSize({width,height:900});await setup(page);
  const size=width<=900?1:2;
  for(const [category,count] of [['fruit',16],['animals',20],['objects',24],['vegetables',16],['colors',12],['clothing',16],['transport',12],['places',12],['body',12]]){
   if(!await page.locator('[data-basic-category="'+category+'"]').count())await page.locator('#bookContents').click();
   await page.locator('[data-basic-category="'+category+'"]').click();
   await expect(page.locator('#basicResultCount')).toHaveText(count+' คำ');
   const seen=new Set();
   for(let offset=0;offset<count;offset+=size){
    if(offset)await page.locator('#bookPageJump').selectOption(String(offset));
    await expect(page.locator('#basicResults .basic-word-card .vocab-picture')).toHaveCount(Math.min(size,count-offset));
    await page.locator('#basicResults .vocab-picture img').evaluateAll(imgs=>imgs.forEach(img=>img.loading='eager'));
    await expect.poll(()=>page.locator('#basicResults .vocab-picture img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>=1000))).toBeTruthy();
    const measurements=await page.locator('#basicResults .basic-word-card').evaluateAll(cards=>cards.map(card=>{
     const crop=card.querySelector('.vocab-picture'),img=crop.querySelector('img'),a=crop.getBoundingClientRect(),b=img.getBoundingClientRect();
     return {id:card.dataset.basicWord,width:a.width,height:a.height,imageWidth:b.width,imageHeight:b.height,left:b.left-a.left,top:b.top-a.top,label:crop.getAttribute('aria-label')};
    }));
    for(const m of measurements){
     seen.add(m.id);const a=vocabularyArtwork[m.id];
     expect(m.label).toContain('ภาพประกอบ');
     expect(Math.abs(m.width-m.height)).toBeLessThan(1);
     expect(Math.abs(m.imageWidth/m.width-a.columns)).toBeLessThan(.02);
     expect(Math.abs(m.imageHeight/m.height-a.rows)).toBeLessThan(.02);
     expect(Math.abs(m.left/m.width+a.col)).toBeLessThan(.02);
     expect(Math.abs(m.top/m.height+a.row)).toBeLessThan(.02);
    }
   }
   expect([...seen]).toEqual(basicVocabulary.filter(w=>w.category===category).map(w=>w.id));
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  }
 });

}
