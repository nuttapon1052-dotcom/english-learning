import test from 'node:test';
import assert from 'node:assert/strict';
import {freshProgress,normalizeProgress,mergeProgress,importProgress,accountKey} from '../src/progress.js';

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

test('different devices merge awards into consistent activity counts',()=>{
 const a={...freshProgress(),awards:['listen:1','arrange:1'],xp:2,skill:{ฟัง:10,เขียน:10},updatedAt:10};
 const b={...freshProgress(),awards:['listen:2','write:2'],xp:2,skill:{ฟัง:10,เขียน:10},updatedAt:20};
 const p=mergeProgress(a,b);assert.equal(p.xp,4);assert.equal(p.skill.ฟัง,20);assert.equal(p.skill.เขียน,20);
});
test('a reset epoch prevents stale devices resurrecting old progress',()=>{
 const old={...freshProgress(),completed:[1,2],updatedAt:9999};
 const reset={...freshProgress(),resetAt:100,updatedAt:100};
 assert.deepEqual(mergeProgress(old,reset).completed,[]);
 assert.equal(mergeProgress(reset,old).resetAt,100);
});
test('lesson drafts merge independently and imported checked flags are validated',()=>{
 const a={...freshProgress(),lessonDrafts:{2:{arranged:['He','is','ready.'],fillValue:'is',arrangeChecked:true,fillChecked:true,writing:'I am happy.',updatedAt:20}}};
 const b={...freshProgress(),lessonDrafts:{3:{writing:'I work in an office.',updatedAt:30},2:{writing:'old',arranged:['<img>'],fillValue:'wrong',arrangeChecked:true,fillChecked:true,updatedAt:10}}};
 const p=mergeProgress(a,b);
 assert.equal(p.lessonDrafts[2].writing,'I am happy.');assert.equal(p.lessonDrafts[2].arrangeChecked,true);
 assert.equal(p.lessonDrafts[3].writing,'I work in an office.');
 const bad=normalizeProgress(b);assert.equal(bad.lessonDrafts[2].arrangeChecked,false);assert.equal(bad.lessonDrafts[2].fillChecked,false);assert.deepEqual(bad.lessonDrafts[2].arranged,[]);
});
test('mistake review merges corrections without reviving cleared errors',()=>{
 const a={...freshProgress(),mistakeEvents:{'2:ฟัง':{wrongAt:10,clearedAt:0}}};
 const b={...freshProgress(),mistakeEvents:{'2:ฟัง':{wrongAt:10,clearedAt:20},'3:อ่าน':{wrongAt:25,clearedAt:0}}};
 const p=mergeProgress(a,b);assert.deepEqual(p.mistakes,[{lesson:3,type:'อ่าน'}]);
 const newError={...freshProgress(),mistakeEvents:{'2:ฟัง':{wrongAt:30,clearedAt:0}}};
 assert.ok(mergeProgress(p,newError).mistakes.some(m=>m.lesson===2));
});

test('explicit guest and backup imports merge data without inheriting another namespace reset',()=>{
 const account={...freshProgress(),completed:[5],resetAt:100,updatedAt:300};
 const guest={...freshProgress(),completed:[2],resetAt:999,updatedAt:400};
 const p=importProgress(account,guest);
 assert.deepEqual(p.completed,[2,5]);assert.equal(p.resetAt,100);
});
