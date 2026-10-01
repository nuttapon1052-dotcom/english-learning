import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, roadmap } from '../src/lessons.js';

test('32 complete lessons cover eight usable learning paths', () => {
  assert.equal(lessons.length,32);
  assert.deepEqual(lessons.map(l=>l.id),Array.from({length:32},(_,i)=>i+1));
  assert.equal(roadmap.length,8);
  assert.ok(roadmap.every(r=>r[3]==='ready'));
  for(const l of lessons){
    assert.ok(l.goal && l.grammar);
    assert.ok(l.words.length>=5 && l.words.length<=12);
    assert.ok(l.examples.length>=3);
    assert.ok(l.words.every(w=>w.length===3 && w.every(Boolean)));
    assert.ok(l.examples.every(e=>e.length===3 && e.every(Boolean)));
    const p=l.practice;
    for(const key of ['listen','choices','arrange','arranged','fill','blank','read','question','readChoices','write','accepts'])assert.ok(p[key],l.id+': '+key);
    assert.equal(p.fill.length,2,'fill sentence in lesson '+l.id);
    assert.ok(Number.isInteger(p.answer) && p.answer>=0 && p.answer<p.choices.length);
    assert.ok(Number.isInteger(p.readAnswer) && p.readAnswer>=0 && p.readAnswer<p.readChoices.length);
    assert.deepEqual(p.arrange.flatMap(w=>w.split(/\s+/)).sort(),p.arranged.split(/\s+/).sort(),'word bank for '+l.id);
  }
});

test('verb-to-be lesson includes all seven subject forms, including is',()=>{
 const l=lessons.find(l=>l.id===2),words=l.words.map(w=>w[0].toLowerCase());
 for(const word of ['i','you','we','they','he','she','it','am','is','are'])assert.ok(words.includes(word),word+' is taught');
 for(const [subject,verb] of [['I','am'],['You','are'],['We','are'],['They','are'],['He','is'],['She','is'],['It','is']]){
  assert.ok(l.examples.some(e=>e[0].startsWith(subject+' '+verb+' ')),subject+' has a matching verb example');
 }
 assert.equal(l.practice.blank,'is');assert.match(l.practice.arranged,/\bis\b/);
});
test('all lessons have complete writing examples and balanced answer positions',()=>{
 assert.deepEqual([...new Set(lessons.map(l=>l.practice.answer))].sort(),[0,1,2]);
 assert.deepEqual([...new Set(lessons.map(l=>l.practice.readAnswer))].sort(),[0,1,2]);
 for(const l of lessons){
  assert.ok(l.practice.writingExample.toLowerCase().startsWith(l.practice.write.toLowerCase()),'writing starter matches model in '+l.id);
  assert.ok(!/\s[.,!?]/.test(l.practice.fill[0]+l.practice.blank+l.practice.fill[1]),'fill punctuation in '+l.id);
 }
});
test('listening and reading answer keys preserve the reviewed meanings in all 32 lessons',()=>{
 const listening=['คุณชื่ออะไร','เธอใจดี','ฉันทำงานในสำนักงาน','ฉันตื่นเจ็ดโมง','ขอน้ำค่ะ/ครับ','คุณชอบหนังไหม','ฉันต้องการความช่วยเหลือ','ฉันเรียนเพราะอยากเดินทาง','คุณทำงานที่ไหน','วันนี้คุณว่างไหม','กระเป๋าใบนี้ราคาเท่าไร','ตรงไปแล้วเลี้ยวซ้าย','ขอเมนูได้ไหม','เจอกันตอนสามโมง','คุณควรใส่เสื้อแจ็กเก็ต','ฉันรู้สึกไม่สบาย','เราดูหนังเมื่อคืน','เธอมีแผนจะเรียนอังกฤษ','รถไฟเร็วกว่ารถบัส','อาหารเช้าเริ่มกี่โมง','ขอบคุณสำหรับข้อความ','ช่วยพูดซ้ำได้ไหม','ฉันจะโทรกลับ','ช่วยยืนยันเวลาได้ไหม','นี่คือโทรศัพท์ของคุณใช่ไหม','มีหนังสือสองเล่มบนชั้น','เธอกำลังทำอาหารเย็น','คุณมีน้ำบ้างไหม','เราออกกำลังกายสัปดาห์ละสองครั้ง','คุณไม่จำเป็นต้องนำอาหารกลางวันมา','คุณเคยไปญี่ปุ่นไหม','ถ้าฝนตก ฉันจะอยู่บ้าน'];
 const reading=['Nida','นักเรียน','ร้านอาหาร','ไปทำงาน','ชาและแซนด์วิช','ภาพยนตร์','ซื้ออาหาร','เพราะอยู่ใกล้','สถานที่','กินข้าวด้วยกัน','บัตร','ธนาคาร','ไม่ใส่น้ำตาล','เช้าวันเสาร์สิบโมง','เสื้อแจ็กเก็ตและร่ม','แพทย์','พี่สาว/น้องสาว','เดือนหน้า','สีน้ำเงิน','เจ็ดโมง','จันทร์เก้าโมง','ได้ยินไม่ชัด','หมายเลขโทรศัพท์','สิบโมง','Tom','ใต้โต๊ะ','อ่านหนังสือ','น้ำ','สัปดาห์ละสองครั้ง','นำอาหารมา','Tom','ทำอาหารที่บ้าน'];
 for(const l of lessons){const p=l.practice;assert.equal(p.choices[p.answer],listening[l.id-1],'listen '+l.id);assert.equal(p.readChoices[p.readAnswer],reading[l.id-1],'read '+l.id);}
});

test('every lesson explains a common mistake and offers a personal transfer task',()=>{
 for(const l of lessons){
  for(const field of ['avoid','use','why','challenge'])assert.ok(l.notes[field]?.trim(),'lesson '+l.id+' '+field);
  assert.notEqual(l.notes.avoid,l.notes.use);
 }
 assert.match(lessons[29].grammar,/ไม่จำเป็น/);
 assert.match(lessons[30].grammar,/past simple/);
 assert.match(lessons[31].grammar,/ไม่ใช้ will หลัง if/);
});
