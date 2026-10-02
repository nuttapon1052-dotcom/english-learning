import {readNumber,numberPronunciation} from './number-reader.js';
import {vocabularyArtwork,vocabularyArtPreviews} from './vocabulary-art.js';
import {basicVocabulary,vocabularyCategories,findBasicWords,makeVocabularyQuiz} from './basic-vocabulary.js';
import {createBookCatalogue,getBookSpread,findBookPages} from './vocabulary-book.js';

export function createVocabularyLibrary({getState,shell,review,setThaiSound,speak,icon,esc}){
 const catalogue=createBookCatalogue(vocabularyCategories,basicVocabulary);
 const categoryById=new Map(vocabularyCategories.map(c=>[c.id,c]));
 const compact=matchMedia('(max-width: 900px)');
 let category=catalogue.chapters[0]?.id||'all',query='',unreviewed=false,quiz=null,numberInput='167',mode='contents',pageIndex=0;
 let turning=false,activeTurn=null,turnEpoch=0;
 const selectedWords=()=>findBasicWords({category,query,unreviewed,reviewed:getState().basicWordsReviewed});
 const reviewed=()=>new Set(getState().basicWordsReviewed);
 const readingPages=()=>findBookPages(catalogue,selectedWords());
 const currentSpread=()=>getBookSpread(readingPages(),pageIndex,compact.matches?1:2);
 function cancelTurn(){
  turnEpoch++;activeTurn?.cancel();activeTurn=null;turning=false;
  document.querySelector('.book-turn-layer')?.remove();
  const root=document.querySelector('#basicResults');
  if(root){root.inert=false;root.setAttribute('aria-busy','false');}
  const stage=document.querySelector('#bookStage');if(stage)stage.dataset.turning='false';
 }
 function reset(){cancelTurn();category=catalogue.chapters[0]?.id||'all';query='';unreviewed=false;quiz=null;numberInput='167';mode='contents';pageIndex=0;}
 function soundButtons(){
  document.querySelectorAll('[data-vocab-speak]').forEach(b=>b.onclick=()=>speak(b.dataset.vocabSpeak));
 }
  function artPicture(id,label,{preview=false}={}){
  const art=vocabularyArtwork[id];if(!art)return '';
  return `<span class="vocab-picture ${preview?'vocab-picture-preview':''}" ${preview?'aria-hidden="true"':`role="img" aria-label="ภาพประกอบ ${esc(label)}"`} style="--art-cols:${art.columns};--art-rows:${art.rows};--art-x:${-art.col*100}%;--art-y:${-art.row*100}%"><img src="${import.meta.env.BASE_URL+art.file}" alt="" loading="lazy" decoding="async" draggable="false"></span>`;
 }
 function numberReaderPanel(){
  return `<details class="number-reader" id="numberReader" ${category==='numbers'?'open':''}><summary><span class="reader-symbol">${icon('numbers')}</span><span><strong>พิมพ์ตัวเลข แล้วอ่านเป็นอังกฤษ</strong><small>ลอง 167 หรือ 21,425 · พร้อมฟังเสียง</small></span><span class="reader-expand" aria-hidden="true">+</span></summary><div class="number-reader-body"><label for="numberInput">อยากอ่านเลขอะไร?</label><input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" maxlength="32" class="text-input" id="numberInput" value="${esc(numberInput)}" aria-describedby="numberHint numberError" placeholder="เช่น 21,425"><p id="numberHint">พิมพ์มีหรือไม่มีคอมมาก็ได้ · จำนวนเต็มสูงสุด 15 หลัก และทศนิยม 6 ตำแหน่ง</p><div class="number-examples" aria-label="ตัวเลขตัวอย่าง">${['167','21,425','1,000,000','12.05'].map(n=>`<button type="button" data-number-example="${n}">${n}</button>`).join('')}</div><p id="numberError" role="status"></p><div class="number-result" id="numberResult" aria-live="polite" aria-atomic="true"><span class="eyebrow">READ IT OUT LOUD</span><span id="numberFormatted"></span><p lang="en" id="numberEnglish"></p><p class="number-thai"><span>คำอ่านไทยโดยประมาณ</span><span id="numberThai"></span></p></div><button type="button" class="btn primary" id="speakNumber">${icon('volume')} ฟังคำอ่านตัวเลข</button><p class="number-style-note">ใช้รูปแบบอเมริกัน เช่น one hundred sixty-seven · แบบอังกฤษอาจเติม and เป็น one hundred and sixty-seven<br>คำอ่านไทยช่วยเริ่มต้น ควรฟังเสียงควบคู่ไปด้วย</p></div></details>`;
 }
 function updateNumber(){
  const result=readNumber(numberInput),input=document.querySelector('#numberInput');
  input.setAttribute('aria-invalid',String(!result.ok&&result.code!=='empty'));
  document.querySelector('#numberError').textContent=result.ok?'':result.error;
  document.querySelector('#numberResult').hidden=!result.ok;
  document.querySelector('#speakNumber').disabled=!result.ok;
  document.querySelector('#numberFormatted').textContent=result.ok?result.formatted:'';
  document.querySelector('#numberEnglish').textContent=result.ok?result.english:'';
  document.querySelector('#numberThai').textContent=result.ok?numberPronunciation(result.english):'';
 }
 function bindNumberReader(){
  document.querySelector('#numberInput').oninput=e=>{numberInput=e.target.value;updateNumber();};
  document.querySelectorAll('[data-number-example]').forEach(b=>b.onclick=()=>{
   numberInput=b.dataset.numberExample;document.querySelector('#numberInput').value=numberInput;updateNumber();
  });
  document.querySelector('#speakNumber').onclick=()=>{const result=readNumber(numberInput);if(result.ok)speak(result.english);};
  updateNumber();
 }


 function wordCard(w){
  const seen=reviewed().has(w.id),c=categoryById.get(w.category);
  return `<article class="basic-word-card book-word-entry tone-${c.color}" data-basic-word="${esc(w.id)}">
   <div class="word-card-top"><span class="word-category">${esc(c.en)}</span><span class="book-word-mark ${seen?'is-reviewed':''}" aria-label="${seen?'คำนี้เคยทบทวนแล้ว':'คำศัพท์สำหรับทบทวน'}">${icon('bookmark')}</span></div>
   ${vocabularyArtwork[w.id]?artPicture(w.id,w.th):`<div class="book-word-symbol" aria-hidden="true">${w.symbol?esc(w.symbol):icon(c.icon)}</div>`}
   <div class="basic-word-heading"><h3 lang="en">${esc(w.en)}</h3><button type="button" class="sound-btn" data-vocab-speak="${esc(w.en)}" aria-label="ฟังคำว่า ${esc(w.en)}">${icon('volume')}</button></div>
   <p class="basic-translation">${esc(w.th)}</p>${getState().showThaiSound?`<p class="thai-sound">เสียงประมาณ: ${esc(w.sound)}</p>`:''}
   <details class="word-example" open><summary>ลองใช้ในประโยค</summary><p lang="en">${esc(w.example)}</p><p>${esc(w.translation)}</p><button type="button" class="text-link" data-vocab-speak="${esc(w.example)}">ฟังประโยค ${icon('volume')}</button></details>
   <button type="button" class="review-word ${seen?'reviewed':''}" data-review-word="${esc(w.id)}" ${seen?'disabled':''}>${icon(seen?'check':'bookmark')}${seen?'ทบทวนแล้ว':'ทำเครื่องหมายว่าทบทวนแล้ว'}</button>
  </article>`;
 }
 function paper(page){
  if(!page)return `<section class="book-paper book-end-page"><span class="book-end-symbol">${icon('sprout')}</span><p class="eyebrow">ONE CHAPTER AT A TIME</p><h2>อีกคำ<br>ที่คุ้นเคยขึ้น</h2><p>ลองทบทวนคำในหมวดนี้<br>หรือต่อหมวดถัดไปได้เลย</p>${nextChapter()?`<button type="button" class="btn secondary" data-next-chapter>หมวดถัดไป ${icon('chevron-right')}</button>`:'<button type="button" class="btn secondary" data-book-contents>กลับสารบัญ</button>'}</section>`;
  return `<section class="book-paper book-word-page tone-${page.category.color}" data-book-folio="${page.folio}">${wordCard(page.word)}<footer class="book-paper-footer"><span>${esc(page.category.title)}</span><span class="book-folio">${String(page.folio).padStart(3,'0')}</span></footer></section>`;
 }
 function cover(){
  const art=catalogue.chapters.filter(c=>vocabularyArtPreviews[c.id]).slice(0,4);
  return `<section class="book-paper book-cover-page"><div class="book-cover-border"><p class="book-edition">THE EVERYDAY PICTURE DICTIONARY</p><span class="book-cover-emblem">${icon('book')}</span><h2>Words<br><em>for your world.</em></h2><p class="book-cover-thai">เปิดโลกใกล้ตัว<br>ทีละคำ ทีละหน้า</p><div class="book-cover-mosaic" aria-hidden="true">${art.map(c=>artPicture(vocabularyArtPreviews[c.id],c.title,{preview:true})).join('')}</div><p class="book-cover-count">${catalogue.chapters.length} หมวด · ${basicVocabulary.length} คำที่ใช้ทุกวัน</p><button type="button" id="openVocabularyBook">เปิดหน้าแรก ${icon('chevron-right')}</button><span class="book-cover-signature">English with Yuri</span></div></section>`;
 }
 function contents(){
  return `<section class="book-paper book-contents-page"><header class="book-contents-heading"><span class="eyebrow">CONTENTS</span><h2>เรื่องรอบตัวเรา</h2><p>เลือกหมวด แล้วเปิดไปหน้าที่อยากเรียน</p></header><div class="book-toc-list" role="group" aria-label="สารบัญหมวดคำศัพท์">${catalogue.chapters.map((c,i)=>`<button type="button" class="book-toc-item tone-${c.color}" data-basic-category="${esc(c.id)}" aria-label="${esc(c.title)} ${c.count} คำ หน้า ${c.firstPage}"><span class="book-chapter-number">${String(i+1).padStart(2,'0')}</span>${vocabularyArtPreviews[c.id]?artPicture(vocabularyArtPreviews[c.id],c.title,{preview:true}):`<span class="book-toc-symbol">${icon(c.icon)}</span>`}<span class="book-toc-name"><strong>${esc(c.title)}</strong><small>${esc(c.en)} · ${c.count} คำ · ทบทวน <b data-category-count="${esc(c.id)}">${basicVocabulary.filter(w=>w.category===c.id&&reviewed().has(w.id)).length}</b></small></span><span class="book-toc-folio">${String(c.firstPage).padStart(3,'0')}</span></button>`).join('')}</div><footer class="book-paper-footer"><span>คำเล็ก ๆ สำหรับทุกวัน</span><span>สารบัญ</span></footer></section>`;
 }
 function spreadMarkup(){
  if(mode==='contents')return (compact.matches?'':cover())+contents();
  const spread=currentSpread();pageIndex=spread.index;
  if(!spread.pages.length)return `<section class="book-paper book-empty-page"><span>${icon('search')}</span><h2>ยังไม่พบคำนี้</h2><p>ลองคำอื่น หรือเปิดดูทุกคำอีกครั้ง</p><button type="button" class="btn secondary" id="resetBasicSearch">ดูทุกคำ</button></section>`;
  return spread.pages.map(paper).join('')+(spread.size===2&&spread.pages.length===1?paper(null):'');
 }
 function nextChapter(){
  if(query.trim()||unreviewed||category==='all')return null;
  return catalogue.chapters[catalogue.chapters.findIndex(c=>c.id===category)+1]||null;
 }
 function updateCounts(){
  const seen=reviewed();
  document.querySelectorAll('[data-basic-total]').forEach(el=>el.textContent=seen.size);
  document.querySelectorAll('[data-category-count]').forEach(el=>el.textContent=basicVocabulary.filter(w=>w.category===el.dataset.categoryCount&&seen.has(w.id)).length);
 }
 function bindWords(){
  soundButtons();
  document.querySelectorAll('[data-review-word]').forEach(b=>b.onclick=()=>{
   review(b.dataset.reviewWord);b.disabled=true;b.classList.add('reviewed');b.innerHTML=icon('check')+'ทบทวนแล้ว';updateCounts();
   const mark=b.closest('.book-word-entry').querySelector('.book-word-mark');mark.classList.add('is-reviewed');mark.setAttribute('aria-label','คำนี้เคยทบทวนแล้ว');
   if(unreviewed)renderResults();
  });
 }
 function updateControls(){
  const spread=currentSpread(),reading=mode==='reading',pages=readingPages();
  const previous=document.querySelector('#previousBookPage'),next=document.querySelector('#nextBookPage'),jump=document.querySelector('#bookPageJump');
  previous.disabled=turning||!reading||!spread.hasPrevious;
  next.disabled=turning||(reading&&(!pages.length||(!spread.hasNext&&!nextChapter())));
  const nextLabel=!reading?'เปิดหน้าแรก':spread.hasNext?'หน้าถัดไป':nextChapter()?'หมวดถัดไป':'จบเล่มแล้ว';
  next.innerHTML=`<span>${nextLabel}</span>${icon('chevron-right')}`;
  next.setAttribute('aria-label',nextLabel);
  document.querySelector('#bookPageStatus').textContent=!reading?`สารบัญ · ${catalogue.chapters.length} หมวด`:!pages.length?'ไม่พบคำศัพท์':`หน้า ${spread.pages.map(p=>p.folio).join('–')} · ${spread.number} / ${spread.total} ${spread.size===2?'คู่หน้า':'หน้า'}`;
  jump.innerHTML=!reading||!pages.length?'<option>เลือกหน้า</option>':Array.from({length:spread.total},(_,i)=>{
   const group=pages.slice(i*spread.size,(i+1)*spread.size);
   return `<option value="${i*spread.size}" ${i===spread.number-1?'selected':''}>${group.map(p=>p.folio).join('–')} · ${esc(group[0].word.en)}</option>`;
  }).join('');
  jump.disabled=turning||!reading||!pages.length;
  document.querySelector('#bookContents').disabled=turning;
 }
 function bindPapers(){
  bindWords();
  document.querySelectorAll('[data-basic-category]').forEach(b=>b.onclick=()=>openChapter(b.dataset.basicCategory));
  document.querySelectorAll('[data-book-contents]').forEach(b=>b.onclick=showContents);
  document.querySelectorAll('[data-next-chapter]').forEach(b=>b.onclick=()=>{const chapter=nextChapter();if(chapter)openChapter(chapter.id);});
  const open=document.querySelector('#openVocabularyBook');if(open)open.onclick=()=>openChapter(category==='all'?catalogue.chapters[0]?.id:category);
  const resetButton=document.querySelector('#resetBasicSearch');if(resetButton)resetButton.onclick=()=>{category='all';query='';unreviewed=false;mode='reading';pageIndex=0;render();};
 }
 function renderResults(){
  cancelTurn();
  const words=selectedWords(),c=categoryById.get(category),root=document.querySelector('#basicResults');
  if(!root)return;
  root.classList.toggle('is-contents',mode==='contents');root.classList.toggle('is-empty',mode==='reading'&&!words.length);
  root.innerHTML=spreadMarkup();
  document.querySelector('#basicResultCount').textContent=mode==='contents'?`${catalogue.chapters.length} หมวด · ${basicVocabulary.length} คำ`:`${words.length} คำ${query.trim()?'ที่พบ':''}`;
  document.querySelector('#basicGroupTitle').textContent=mode==='contents'?'สารบัญของคุณ':query.trim()?'คำที่กำลังค้นหา':c?.title||'ทุกคำในเล่ม';
  document.querySelector('#basicTip').textContent=query.trim()?'ค้นหาได้ทั่วทั้งเล่มด้วยคำอังกฤษ คำแปลไทย หรือตัวเลข':c?.tip||'เลือกหมวดจากสารบัญ ฟังเสียง และลองพูดประโยคให้เป็นเรื่องของคุณ';
  document.querySelector('.book-study-tools').hidden=mode==='contents';
  document.querySelector('#startBasicQuiz').disabled=mode==='contents'||!words.length;
  document.querySelector('#basicQuizSize').textContent=Math.min(10,words.length);
  document.querySelector('#basicSearch').value=query;
  document.querySelector('#basicUnreviewed').checked=unreviewed;
  document.querySelector('#bookStage').dataset.turning='false';
  bindPapers();updateControls();
 }
 function visualCopy(element){
  if(!element)return null;
  const copy=element.cloneNode(true);
  for(const node of [copy,...copy.querySelectorAll('*')]){
   for(const attribute of [...node.attributes])if(attribute.name==='id'||attribute.name.startsWith('data-')||attribute.name==='tabindex')node.removeAttribute(attribute.name);
  }
  copy.setAttribute('aria-hidden','true');copy.inert=true;
  return copy;
 }
 async function turn(change,direction=1){
  if(turning)return;
  const root=document.querySelector('#basicResults'),stage=document.querySelector('#bookStage');
  const before=[...root.children].map(visualCopy);
  change();renderResults();
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!stage.animate||!before.length)return;
  const after=[...root.children].map(visualCopy),single=compact.matches;
  const layer=document.createElement('div');layer.className='book-turn-layer';layer.setAttribute('aria-hidden','true');layer.inert=true;
  const leaf=document.createElement('div');leaf.className=`book-turn-leaf ${direction>0?'turn-forward':'turn-back'} ${single?'turn-single':''}`;
  const front=document.createElement('div'),back=document.createElement('div');front.className='book-turn-face book-turn-front';back.className='book-turn-face book-turn-back';
  const source=single?before[0]:before[direction>0?1:0],destination=single?after[0]:after[direction>0?0:1];
  if(!source||!destination)return;
  front.append(source);back.append(destination);leaf.append(front,back);
  if(!single){
   const fixed=document.createElement('div');fixed.className=`book-turn-fixed ${direction>0?'fixed-left':'fixed-right'}`;
   fixed.append(before[direction>0?0:1]);layer.append(fixed);
  }
  layer.append(leaf);stage.append(layer);
  turning=true;root.inert=true;root.setAttribute('aria-busy','true');stage.dataset.turning='true';updateControls();
  const epoch=turnEpoch,animation=leaf.animate([{transform:'rotateY(0deg)'},{transform:`rotateY(${direction>0?-180:180}deg)`}],{duration:800,easing:'cubic-bezier(.42,.08,.25,1)',fill:'forwards'});
  activeTurn=animation;
  try{await animation.finished;}catch{/* A search, resize or route change may interrupt a turn. */}
  finally{
   layer.remove();
   if(epoch===turnEpoch){activeTurn=null;turning=false;root.inert=false;root.setAttribute('aria-busy','false');stage.dataset.turning='false';if(stage.isConnected)updateControls();}
  }
 }
 function openChapter(id){
  if(!categoryById.has(id)||turning)return;
  turn(()=>{category=id;query='';mode='reading';pageIndex=0;const panel=document.querySelector('#numberReader');if(panel)panel.open=id==='numbers';},1);
  document.querySelector('#basicGroupTitle').focus({preventScroll:true});
 }
 function showContents(){
  if(turning)return;
  turn(()=>{mode='contents';query='';},-1);
  document.querySelector('#basicGroupTitle').focus({preventScroll:true});
 }
 function nextPage(){
  if(turning)return;
  if(mode==='contents')return openChapter(category==='all'?catalogue.chapters[0]?.id:category);
  const spread=currentSpread();
  if(spread.hasNext)return turn(()=>{pageIndex=spread.index+spread.size;},1);
  const chapter=nextChapter();if(readingPages().length&&chapter)openChapter(chapter.id);
 }
 function previousPage(){
  const spread=currentSpread();if(!turning&&mode==='reading'&&spread.hasPrevious)turn(()=>{pageIndex=spread.index-spread.size;},-1);
 }
 function render(){
  quiz=null;cancelTurn();
  shell(`<section class="vocabulary-book">
   <header class="page-head basic-library-head book-library-head"><div><p class="eyebrow">YOUR EVERYDAY WORD BOOK</p><h1>เปิดโลก ทีละหน้า.</h1><p>สมุดภาพคำศัพท์ภาษาอังกฤษสำหรับโลกใกล้ตัว</p></div><div class="book-reading-progress"><span>${icon('bookmark')} คำที่เคยทบทวน</span><strong><span data-basic-total>${reviewed().size}</span><small> / ${basicVocabulary.length}</small></strong></div></header>
   <div class="book-toolbar"><label class="search-field"><span>${icon('search')}</span><input id="basicSearch" type="search" value="${esc(query)}" placeholder="ค้นในเล่ม เช่น apple แมว 20" aria-label="ค้นหาศัพท์พื้นฐานทุกหมวด"></label><button type="button" id="bookContents" class="book-tool-button">${icon('contents')} สารบัญ</button><button type="button" id="showAllBasic" class="book-tool-button">ดูทุกคำ</button></div>
   <div class="book-preferences"><label class="toggle"><input id="basicThaiSound" type="checkbox" ${getState().showThaiSound?'checked':''}>คำอ่านไทยโดยประมาณ</label><label class="toggle"><input id="basicUnreviewed" type="checkbox" ${unreviewed?'checked':''}>เฉพาะคำที่ยังไม่ทบทวน</label></div>
   <div class="book-chapter-heading"><h2 id="basicGroupTitle" tabindex="-1"></h2><span id="basicResultCount" role="status"></span></div>
   <div class="book-desk"><div class="book-frame" id="bookStage" tabindex="0" role="region" aria-label="สมุดคำศัพท์ ใช้ลูกศรซ้ายและขวาเพื่อพลิกหน้า" data-turning="false"><div class="book-spread" id="basicResults" aria-busy="false"></div><span class="book-spine" aria-hidden="true"></span></div></div>
   <div class="book-reader-controls"><button type="button" id="previousBookPage" class="book-page-button" aria-label="หน้าก่อนหน้า">${icon('chevron-left')}<span>หน้าก่อน</span></button><div class="book-page-location"><span id="bookPageStatus" role="status" aria-live="polite" aria-atomic="true"></span><label class="book-jump-label"><span>ไปหน้า</span><select id="bookPageJump" aria-label="ไปหน้าคำศัพท์"></select></label></div><button type="button" id="nextBookPage" class="book-page-button"></button></div>
   <p class="book-gesture-hint">${icon('book')} ${compact.matches?'ปัดซ้าย–ขวา หรือใช้ปุ่มเพื่อพลิกหน้า':'ใช้ปุ่มหรือลูกศรบนคีย์บอร์ดเพื่อพลิกหน้า'}</p>
   <div class="book-study-tools"><details class="book-chapter-tip"><summary>${icon('spark')} เคล็ดลับสำหรับหมวดนี้</summary><p id="basicTip"></p></details><button type="button" class="btn primary" id="startBasicQuiz">${icon('target')} ทบทวน <span id="basicQuizSize">10</span> คำ</button></div>
   ${numberReaderPanel()}
   <p class="basic-footnote book-footnote">คำอ่านไทยและเสียงจากอุปกรณ์ช่วยเริ่มต้น · “ทบทวนแล้ว” คือคำที่คุณทำเครื่องหมายหรือตอบถูกในแบบฝึก ความก้าวหน้าจะซิงก์กับบัญชีเมื่อเข้าสู่ระบบ</p>
  </section>`);
  document.querySelector('#bookContents').onclick=showContents;
  document.querySelector('#showAllBasic').onclick=()=>{if(turning)return;turn(()=>{category='all';query='';mode='reading';pageIndex=0;},1);};
  document.querySelector('#basicSearch').oninput=e=>{query=e.target.value;mode='reading';pageIndex=0;renderResults();};
  document.querySelector('#basicThaiSound').onchange=e=>{setThaiSound(e.target.checked);renderResults();};
  document.querySelector('#basicUnreviewed').onchange=e=>{unreviewed=e.target.checked;mode='reading';pageIndex=0;renderResults();};
  document.querySelector('#previousBookPage').onclick=previousPage;document.querySelector('#nextBookPage').onclick=nextPage;
  document.querySelector('#bookPageJump').onchange=e=>{const target=Number(e.target.value),direction=target>=pageIndex?1:-1;turn(()=>{pageIndex=target;},direction);};
  document.querySelector('#startBasicQuiz').onclick=()=>{cancelTurn();startQuiz(selectedWords());};
  const stage=document.querySelector('#bookStage');
  stage.onkeydown=e=>{
   if(e.target.closest('button,input,select,textarea,a,summary'))return;
   if(e.key==='ArrowRight'){e.preventDefault();nextPage();}else if(e.key==='ArrowLeft'){e.preventDefault();previousPage();}
  };
  let gesture=null;
  stage.onpointerdown=e=>{gesture=!compact.matches||e.target.closest('button,input,select,textarea,a,summary')?null:{x:e.clientX,y:e.clientY,id:e.pointerId,time:Date.now()};};
  stage.onpointercancel=()=>{gesture=null;};
  stage.onpointerup=e=>{
   if(!gesture||e.pointerId!==gesture.id)return;
   const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y,elapsed=Date.now()-gesture.time;gesture=null;
   if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*2&&elapsed<900){if(dx<0)nextPage();else previousPage();}
  };
  renderResults();bindNumberReader();
 }
 compact.addEventListener('change',()=>{if(document.querySelector('.vocabulary-book')){renderResults();const hint=document.querySelector('.book-gesture-hint');hint.innerHTML=icon('book')+' '+(compact.matches?'ปัดซ้าย–ขวา หรือใช้ปุ่มเพื่อพลิกหน้า':'ใช้ปุ่มหรือลูกศรบนคีย์บอร์ดเพื่อพลิกหน้า');}});
  function startQuiz(words){
  const questions=makeVocabularyQuiz(words);
  if(!questions.length)return;
  quiz={questions,index:0,answers:[],selected:null};
  renderQuiz();document.querySelector('#vocabQuizTitle').focus();
 }
 function renderQuiz(){
  if(!quiz)return render();
  if(quiz.index>=quiz.questions.length)return renderQuizResult();
  const {word,choices}=quiz.questions[quiz.index],selected=quiz.selected,answered=selected!==null,correct=selected===word.id,c=categoryById.get(word.category);
  shell(`<section class="basic-quiz"><button class="back" id="leaveBasicQuiz">← กลับคลังศัพท์</button><div class="progress-info"><span>ทบทวนศัพท์ · ${c.title}</span><span>${quiz.index+1} / ${quiz.questions.length}</span></div><div class="bar"><i style="width:${quiz.index/quiz.questions.length*100}%"></i></div><article class="card basic-quiz-card"><p class="eyebrow">ONE WORD, ONE SMALL WIN</p><h1 id="vocabQuizTitle" tabindex="-1">คำนี้หมายถึงอะไร?</h1><div class="quiz-word"><strong lang="en">${esc(word.en)}</strong><button class="sound-btn" data-vocab-speak="${esc(word.en)}" aria-label="ฟังคำว่า ${esc(word.en)}">${icon('volume')}</button></div><div class="options">${choices.map(w=>`<button class="option ${answered?(w.id===word.id?'correct':w.id===selected?'wrong':''):''}" data-basic-answer="${w.id}" ${answered?'disabled':''}>${esc(w.th)}</button>`).join('')}</div><div id="basicQuizFeedback" role="status">${answered?`<div class="feedback ${correct?'':'wrong'}"><strong>${correct?'ถูกต้อง!':'ลองจำคำนี้อีกครั้งนะ'}</strong><p>${esc(word.en)} = ${esc(word.th)}</p><p lang="en">${esc(word.example)}</p><p>${esc(word.translation)}</p></div>`:''}</div><button class="btn primary basic-quiz-next" id="nextBasicWord" ${answered?'':'disabled'}>${quiz.index===quiz.questions.length-1?'ดูผลรอบนี้':'คำถัดไป'} ${icon('arrow')}</button><p class="basic-footnote">ตอบถูกแล้วจะบันทึกว่าเคยทบทวนคำนี้ โดยไม่เพิ่มคะแนนหรือจำนวนบทเรียน</p></article></section>`);
  soundButtons();
  document.querySelector('#leaveBasicQuiz').onclick=()=>{quiz=null;render();};
  document.querySelectorAll('[data-basic-answer]').forEach(b=>b.onclick=()=>{
   if(quiz.selected!==null)return;
   quiz.selected=b.dataset.basicAnswer;
   quiz.answers.push({word,correct:quiz.selected===word.id});
   if(quiz.selected===word.id)review(word.id);
   renderQuiz();document.querySelector('#nextBasicWord').focus();
  });
  document.querySelector('#nextBasicWord').onclick=()=>{
   if(quiz.selected===null)return;
   quiz.index++;quiz.selected=null;renderQuiz();document.querySelector('#vocabQuizTitle').focus();
  };
 }
 function renderQuizResult(){
  const correct=quiz.answers.filter(a=>a.correct).length,missed=quiz.answers.filter(a=>!a.correct).map(a=>a.word);
  shell(`<section class="basic-quiz"><article class="card basic-quiz-card"><span class="quiz-result-icon">${icon('sprout')}</span><p class="eyebrow">A LITTLE MORE FAMILIAR</p><h1 id="vocabQuizTitle" tabindex="-1">ทบทวนจบแล้ว</h1><div class="basic-quiz-score">${correct}<small> / ${quiz.questions.length}</small></div><p>คำที่ตอบถูกในรอบนี้ · ลองอีกครั้งได้เสมอ</p>${missed.length?`<h2>คำที่กลับมาฝึกต่อได้</h2><ul class="quiz-missed">${missed.map(w=>`<li><span><strong lang="en">${esc(w.en)}</strong><span>${esc(w.th)}</span></span><button class="sound-btn" data-vocab-speak="${esc(w.en)}" aria-label="ฟังคำว่า ${esc(w.en)}">${icon('volume')}</button></li>`).join('')}</ul>`:'<div class="tip-box">ลองนำคำที่เพิ่งทบทวนไปพูดเป็นประโยคของคุณเอง</div>'}<div class="actions">${missed.length?'<button class="btn primary" id="retryBasicWords">ฝึกคำที่พลาดอีกครั้ง</button>':''}<button class="btn secondary" id="finishBasicQuiz">กลับคลังศัพท์</button></div><p class="basic-footnote">คะแนนนี้แสดงเฉพาะรอบปัจจุบัน ส่วนคำที่เคยทบทวนจะบันทึกแยกไว้ให้</p></article></section>`);
  soundButtons();document.querySelector('#finishBasicQuiz').onclick=()=>{quiz=null;render();};
  const retry=document.querySelector('#retryBasicWords');if(retry)retry.onclick=()=>startQuiz(missed);
 }

 return {render,reset};
}
