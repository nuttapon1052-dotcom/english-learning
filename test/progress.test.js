import test from 'node:test';
import assert from 'node:assert/strict';
import {freshProgress,normalizeProgress,mergeProgress,accountKey} from '../src/progress.js';

test('untrusted imports cannot inject lesson content or invalid progress',()=>{
 const p=normalizeProgress({completed:[1,1,24,99,'2'],currentLesson:99,currentStep:40,skill:{ฟัง:999,พูด:-4},learnedWords:[['hello','<img onerror=alert(1)>','bad'],['evil','bad','bad']],awards:['listen:1','listen:1','listen:99']});
 assert.deepEqual(p.completed,[1,24]);assert.equal(p.currentLesson,1);assert.equal(p.currentStep,6);
 assert.equal(p.skill.ฟัง,100);assert.equal(p.skill.พูด,0);
 assert.equal(p.learnedWords.find(w=>w[0]==='hello')[1],'สวัสดี');
 assert.ok(!p.learnedWords.some(w=>w[0]==='evil'));
 assert.deepEqual(p.awards,['listen:1']);
});
test('cloud merging preserves completed lessons and newest lesson position',()=>{
 const a={...freshProgress(),completed:[1,2],currentLesson:3,currentStep:4,cursorUpdatedAt:100,updatedAt:200};
 const b={...freshProgress(),completed:[11],currentLesson:12,currentStep:2,cursorUpdatedAt:300,updatedAt:300};
 const p=mergeProgress(a,b);assert.deepEqual(p.completed,[1,2,11]);assert.equal(p.currentLesson,12);assert.equal(p.currentStep,2);assert.ok(p.learnedWords.length>10);
 assert.deepEqual(mergeProgress(p,p),p);
});
test('guest, learner A and learner B have separate local storage keys',()=>{
 assert.notEqual(accountKey(),accountKey('A'));assert.notEqual(accountKey('A'),accountKey('B'));
 assert.equal(normalizeProgress(null).completed.length,0);assert.equal(normalizeProgress([]).completed.length,0);
});
