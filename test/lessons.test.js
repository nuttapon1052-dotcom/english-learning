import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, roadmap } from '../src/lessons.js';

test('24 complete lessons cover six usable learning paths', () => {
  assert.equal(lessons.length,24);
  assert.deepEqual(lessons.map(l=>l.id),Array.from({length:24},(_,i)=>i+1));
  assert.equal(roadmap.length,6);
  assert.ok(roadmap.every(r=>r[3]==='ready'));
  for(const l of lessons){
    assert.ok(l.goal && l.grammar);
    assert.ok(l.words.length>=5 && l.words.length<=8);
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
