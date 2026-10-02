import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {basicVocabulary} from '../src/basic-vocabulary.js';
import {vocabularyArtwork} from '../src/vocabulary-art.js';
test('all 140 picture words have unique stable in-bounds atlas cells',()=>{
 const words=basicVocabulary.filter(w=>!['days','months','numbers'].includes(w.category));
 assert.equal(words.length,140);assert.deepEqual(Object.keys(vocabularyArtwork).sort(),words.map(w=>w.id).sort());
 const cells=new Set();
 for(const w of words){
  const a=vocabularyArtwork[w.id];assert.equal(a.columns,4);assert.ok(a.row>=0&&a.row<a.rows);assert.ok(a.col>=0&&a.col<4);
  cells.add(a.file+':'+a.row+':'+a.col);
 }
 assert.equal(cells.size,140);
 for(const [id,col,row] of [['fruit:apple',0,0],['fruit:lemon',0,3],['fruit:lime',1,3],['fruit:pear',3,3],['animals:cat',0,0],['animals:goat',3,2],['animals:butterfly',3,4],['objects:watch',0,2],['objects:clock',1,2],['objects:glasses',3,5],['vegetables:eggplant',1,3],['colors:gold',3,2],['clothing:boots',3,3],['transport:subway',2,2],['places:pharmacy',3,2],['body:finger',3,2]]){
  assert.equal(vocabularyArtwork[id].col,col,id);assert.equal(vocabularyArtwork[id].row,row,id);
 }
});
test('the generated source atlases exist and have the intended grid aspect ratios',()=>{
 for(const [category,rows] of [['fruit',4],['animals',5],['objects',6],['vegetables',4],['colors',3],['clothing',4],['transport',3],['places',3],['body',3]]){
  const png=readFileSync(new URL('../public/vocab-art/'+category+'.png',import.meta.url));
  assert.equal(png.subarray(1,4).toString(),'PNG');
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
  assert.ok(width>=1000&&height>=1000);
  assert.ok(Math.abs(width/height-4/rows)<.005,category+' grid ratio');
 }
});
