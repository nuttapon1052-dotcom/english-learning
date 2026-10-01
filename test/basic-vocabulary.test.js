import test from 'node:test';
import assert from 'node:assert/strict';
import {basicVocabulary,vocabularyCategories,findBasicWords,makeVocabularyQuiz} from '../src/basic-vocabulary.js';
const wordsIn=id=>basicVocabulary.filter(w=>w.category===id);
test('the standalone library has six complete groups and 120 stable unique entries',()=>{
 assert.deepEqual(vocabularyCategories.map(c=>c.id),['days','months','numbers','fruit','animals','objects']);
 assert.equal(basicVocabulary.length,120);
 assert.equal(new Set(basicVocabulary.map(w=>w.id)).size,120);
 for(const w of basicVocabulary){
  for(const key of ['id','category','en','th','sound','example','translation'])assert.ok(w[key]?.trim(),w.id+' '+key);
  assert.ok(vocabularyCategories.some(c=>c.id===w.category));
  assert.ok(/[.!?]$/.test(w.example),w.id);
 }
});
test('days and months have the reviewed Thai meanings and correct order',()=>{
 assert.deepEqual(wordsIn('days').map(w=>[w.en,w.th]),[
 ['Monday','วันจันทร์'],['Tuesday','วันอังคาร'],['Wednesday','วันพุธ'],['Thursday','วันพฤหัสบดี'],['Friday','วันศุกร์'],['Saturday','วันเสาร์'],['Sunday','วันอาทิตย์']]);
 assert.deepEqual(wordsIn('months').map(w=>w.en),['January','February','March','April','May','June','July','August','September','October','November','December']);
 assert.deepEqual(wordsIn('months').map(w=>w.th),['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']);
 assert.ok(wordsIn('days').every(w=>w.example.includes('on '+w.en)));
 assert.ok(wordsIn('months').every(w=>w.example.includes('in '+w.en)));
});
test('numbers include 0–20, tens, large numbers and irregular ordinals',()=>{
 const num=wordsIn('numbers'),bySymbol=new Map(num.map(w=>[w.symbol,w.en]));
 const low=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
 low.forEach((en,i)=>assert.equal(bySymbol.get(String(i)),en));
 assert.deepEqual(['30','40','50','60','70','80','90'].map(n=>bySymbol.get(n)),['thirty','forty','fifty','sixty','seventy','eighty','ninety']);
 assert.deepEqual(['100','1,000','1,000,000'].map(n=>bySymbol.get(n)),['one hundred','one thousand','one million']);
 assert.deepEqual(['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th'].map(n=>bySymbol.get(n)),['first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth']);
});
test('commonly confused basic nouns keep distinct meanings',()=>{
 const byEn=new Map(basicVocabulary.map(w=>[w.en,w]));
 assert.equal(byEn.get('lemon').th,'เลมอน');assert.equal(byEn.get('lime').th,'มะนาว');
 assert.equal(byEn.get('watch').th,'นาฬิกาข้อมือ');assert.equal(byEn.get('clock').th,'นาฬิกาแขวนหรือตั้งโต๊ะ');
 assert.equal(byEn.get('sheep').example,'There are two sheep.');
 assert.equal(byEn.get('fish').example,'There are three fish in the tank.');
 assert.equal(byEn.get('glasses').th,'แว่นตา');
});
test('search spans categories and supports Thai, case, numerals and review filters',()=>{
 assert.deepEqual(findBasicWords({category:'days',query:'APPLE'}).map(w=>w.id),['fruit:apple','fruit:pineapple']);
 assert.deepEqual(findBasicWords({query:'แมว'}).map(w=>w.id),['animals:cat']);
 assert.deepEqual(findBasicWords({query:'1000'}).map(w=>w.id),['numbers:one-thousand','numbers:one-million']);
 assert.deepEqual(findBasicWords({query:'1st'}).map(w=>w.en),['first']);
 assert.equal(findBasicWords({category:'days',unreviewed:true,reviewed:['days:monday']}).length,6);
 assert.equal(findBasicWords({query:'<script>'}).length,0);
});
test('quiz rounds are bounded and every question has one unique correct choice from its group',()=>{
 for(const c of vocabularyCategories){
  const source=wordsIn(c.id),snapshot=source.map(w=>w.id);
  const questions=makeVocabularyQuiz(source,{random:()=>0.42});
  assert.equal(questions.length,Math.min(10,source.length));
  assert.equal(new Set(questions.map(q=>q.word.id)).size,questions.length);
  for(const q of questions){
   assert.equal(q.choices.length,4);assert.equal(q.choices.filter(w=>w.id===q.word.id).length,1);
   assert.equal(new Set(q.choices.map(w=>w.th)).size,4);
   assert.ok(q.choices.every(w=>w.category===q.word.category));
  }
  assert.deepEqual(source.map(w=>w.id),snapshot);
 }
 assert.deepEqual(makeVocabularyQuiz([]),[]);
 assert.equal(makeVocabularyQuiz([basicVocabulary[0]])[0].choices.length,4);
});
