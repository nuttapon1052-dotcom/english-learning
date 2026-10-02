import test from 'node:test';
import assert from 'node:assert/strict';
import {basicVocabulary,vocabularyCategories} from '../src/basic-vocabulary.js';
import {createBookCatalogue,getBookSpread,findBookPages} from '../src/vocabulary-book.js';

test('the picture book covers every existing word exactly once in chapter order',()=>{
 const book=createBookCatalogue(vocabularyCategories,basicVocabulary);
 assert.deepEqual(book.pages.map(p=>p.id),basicVocabulary.map(w=>w.id));
 assert.equal(book.chapters.length,vocabularyCategories.length);
 assert.equal(book.pages[0].folio,1);
 assert.equal(book.pages.at(-1).folio,basicVocabulary.length);
 for(const c of book.chapters){
  const pages=book.pages.slice(c.firstPage-1,c.lastPage);
  assert.equal(pages.length,c.count);
  assert.ok(pages.every(p=>p.word.category===c.id));
 }
});
test('future chapters and illustrations need no hardcoded chapter or page limits',()=>{
 const future={id:'space',title:'อวกาศ',en:'Space',icon:'spark',color:'blue'};
 const extra=[{id:'space:moon',category:'space',en:'moon'},{id:'space:star',category:'space',en:'star'}];
 const original=createBookCatalogue(vocabularyCategories,basicVocabulary);
 const extended=createBookCatalogue([...vocabularyCategories,{id:'empty',title:'Not published'},future],[...basicVocabulary,...extra]);
 assert.deepEqual(extended.pages.slice(0,original.pages.length),original.pages);
 assert.equal(extended.chapters.length,original.chapters.length+1);
 assert.equal(extended.chapters.at(-1).firstPage,basicVocabulary.length+1);
 assert.equal(extended.chapters.at(-1).lastPage,basicVocabulary.length+2);
 assert.deepEqual(extended.pages.slice(-2).map(p=>p.id),extra.map(w=>w.id));
});
test('single pages and paired spreads never skip or repeat words, including an odd final page',()=>{
 const pages=Array.from({length:7},(_,i)=>({id:String(i),folio:i+1}));
 for(const size of [1,2]){
  const visited=[];
  for(let i=0;i<pages.length;i+=size){
   const spread=getBookSpread(pages,i,size);
   visited.push(...spread.pages.map(p=>p.id));
   assert.equal(spread.hasPrevious,i>0);
   assert.equal(spread.hasNext,i+size<pages.length);
  }
  assert.deepEqual(visited,pages.map(p=>p.id));
 }
 assert.deepEqual(getBookSpread(pages,6,2).pages,[pages[6]]);
 assert.equal(getBookSpread(pages,-8,2).index,0);
 assert.equal(getBookSpread(pages,999,2).index,6);
 assert.equal(getBookSpread(pages,NaN,1).index,0);
 assert.equal(getBookSpread([],100,2).number,0);
 assert.equal(getBookSpread([],100,2).hasNext,false);
});
test('search and unreviewed results retain the original printed folios',()=>{
 const book=createBookCatalogue(vocabularyCategories,basicVocabulary);
 const chosen=basicVocabulary.filter(w=>['fruit:apple','places:café','body:finger'].includes(w.id));
 const result=findBookPages(book,[...chosen].reverse());
 assert.deepEqual(result.map(p=>p.id),chosen.map(w=>w.id));
 assert.deepEqual(result.map(p=>p.folio),chosen.map(w=>book.pages.find(p=>p.id===w.id).folio));
 assert.equal(findBookPages(book,[]).length,0);
 const onMobile=getBookSpread(result,1,1),onDesktop=getBookSpread(result,onMobile.index,2);
 assert.ok(onDesktop.pages.some(p=>p.id===onMobile.pages[0].id));
});
