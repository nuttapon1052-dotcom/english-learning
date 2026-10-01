import {test,expect} from '@playwright/test';
import {lessons} from '../src/lessons.js';
function orderedChips(p){
 const remaining=[...p.arrange],result=[];let sentence=p.arranged;
 while(remaining.length){
  const index=remaining.findIndex(w=>sentence===w || sentence.startsWith(w+' '));
  if(index<0)throw new Error('Unsolvable word bank');
  const [word]=remaining.splice(index,1);result.push(word);sentence=sentence.slice(word.length).trimStart();
 }
 return result;
}
for(const l of lessons){
 test('lesson '+l.id+' exposes every exercise and can be completed and restored',async({page})=>{
  await page.route('**/auth-config.json',route=>route.fulfill({json:{supabaseUrl:'',supabasePublicKey:''}}));
  await page.goto('/english-learning/#learn-'+l.id);
  await expect(page.locator('.goal-box')).toContainText(l.goal);
  await page.locator('#next').click();
  await expect(page.locator('.word-row')).toHaveCount(l.words.length);
  if(l.id===2)await expect(page.locator('.word-en').getByText('is',{exact:true})).toBeVisible();
  await page.locator('#next').click();await expect(page.locator('.example')).toHaveCount(l.examples.length);
  await expect(page.locator('.coach-note')).toContainText(l.notes.why);
  await page.locator('#next').click();
  await page.locator('[data-listen-choice="'+l.practice.answer+'"]').click();
  await expect(page.locator('.feedback')).toContainText('ถูกต้อง');
  await page.locator('#next').click();await page.locator('#next').click();
  await page.locator('[data-read-choice="'+l.practice.readAnswer+'"]').click();
  await page.locator('#writing').fill(l.practice.writingExample);
  await page.locator('#checkWrite').click();await expect(page.locator('#writeFeedback')).toContainText('ยังไม่ได้ตัดสินไวยากรณ์');
  await page.locator('#next').click();
  await page.locator('#next').click();await expect(page.locator('.toast')).toContainText('ตรวจคำตอบ');
  for(const word of orderedChips(l.practice))await page.locator('.word-bank .word-chip').getByText(word,{exact:true}).click();
  await page.locator('#checkArrange').click();
  await expect(page.locator('#arrangeFeedback .feedback')).not.toHaveClass(/wrong/);
  await page.locator('#fill').fill(l.practice.blank);await page.locator('#checkFill').click();
  await page.locator('#next').click();
  await expect(page.getByRole('heading',{name:'เก่งมาก! วันนี้คุณทำได้อีกหนึ่งก้าว'})).toBeVisible();
  await page.locator('.review-score [data-nav="progress"]').click();await page.reload();
  await expect(page.locator('.stats-grid .stat').first()).toContainText('1 / 32');
 });
}
