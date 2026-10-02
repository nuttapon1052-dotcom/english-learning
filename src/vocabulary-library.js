import {readNumber,numberPronunciation} from './number-reader.js';
import {vocabularyArtwork,vocabularyArtPreviews} from './vocabulary-art.js';
import {basicVocabulary,vocabularyCategories,findBasicWords,makeVocabularyQuiz} from './basic-vocabulary.js';

// Only the reviewed word IDs are persisted. A quiz score belongs to its current round.
export function createVocabularyLibrary({getState,shell,review,setThaiSound,speak,icon,esc}){
 let category='days',query='',unreviewed=false,quiz=null,numberInput='167';
 const categoryById=new Map(vocabularyCategories.map(c=>[c.id,c]));
 const selectedWords=()=>findBasicWords({category,query,unreviewed,reviewed:getState().basicWordsReviewed});
 const reviewed=()=>new Set(getState().basicWordsReviewed);
 function reset(){category='days';query='';unreviewed=false;quiz=null;numberInput='167';}
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
  return `<article class="basic-word-card card tone-${c.color}" data-basic-word="${w.id}"><div class="word-card-top"><span class="word-category">${c.title}</span><button class="sound-btn" data-vocab-speak="${esc(w.en)}" aria-label="ฟังคำว่า ${esc(w.en)}">${icon('volume')}</button></div>${artPicture(w.id,w.th)}<div class="basic-word-heading">${vocabularyArtwork[w.id]?'':`<span class="word-symbol" aria-hidden="true">${w.symbol?esc(w.symbol):icon(c.icon)}</span>`}<h3 lang="en">${esc(w.en)}</h3></div><p class="basic-translation">${esc(w.th)}</p>${getState().showThaiSound?`<p class="thai-sound">เสียงประมาณ: ${esc(w.sound)}</p>`:''}<details class="word-example"><summary>ลองใช้ในประโยค</summary><p lang="en">${esc(w.example)}</p><p>${esc(w.translation)}</p><button class="text-link" data-vocab-speak="${esc(w.example)}">ฟังประโยค ${icon('volume')}</button></details><button class="review-word ${seen?'reviewed':''}" data-review-word="${w.id}" ${seen?'disabled':''}>${icon(seen?'check':'cards')}${seen?'ทบทวนแล้ว':'ทำเครื่องหมายว่าทบทวนแล้ว'}</button></article>`;
 }
 function bindWords(){
  soundButtons();
  document.querySelectorAll('[data-review-word]').forEach(b=>b.onclick=()=>{
   review(b.dataset.reviewWord);b.disabled=true;b.classList.add('reviewed');b.innerHTML=icon('check')+'ทบทวนแล้ว';updateCounts();
   if(unreviewed)renderResults();
  });
 }
 function updateCounts(){
  const seen=reviewed();
  document.querySelectorAll('[data-basic-total]').forEach(el=>el.textContent=seen.size);
  document.querySelectorAll('[data-category-count]').forEach(el=>el.textContent=basicVocabulary.filter(w=>w.category===el.dataset.categoryCount&&seen.has(w.id)).length);
 }
 function renderResults(){
  const words=selectedWords(),c=categoryById.get(category);
  document.querySelector('#basicResultCount').textContent=words.length+' คำ';
  document.querySelector('#basicResults').innerHTML=words.length?words.map(wordCard).join(''):`<div class="empty basic-empty"><h3>ยังไม่มีคำที่ตรงกับตัวกรองนี้</h3><p>ลองค้นหาคำอื่น หรือเปิดดูทุกคำอีกครั้ง</p><button class="btn secondary" id="resetBasicSearch">ดูทุกคำ</button></div>`;
  document.querySelector('#basicGroupTitle').textContent=query.trim()?'ผลการค้นหาทุกหมวด':c?.title||'ศัพท์พื้นฐานทั้งหมด';
  document.querySelector('#basicTip').textContent=query.trim()?'ค้นหาได้ทั้งคำอังกฤษ คำแปลไทย และตัวเลข เช่น 20 หรือ 1st':c?.tip||'เลือกหมวดเพื่อดูคำแนะนำการใช้ แล้วลองพูดประโยคตัวอย่างให้เป็นเรื่องของคุณ';
  document.querySelector('#startBasicQuiz').disabled=!words.length;
  document.querySelector('#basicQuizSize').textContent=Math.min(10,words.length);
  bindWords();
  const resetButton=document.querySelector('#resetBasicSearch');
  if(resetButton)resetButton.onclick=()=>{query='';unreviewed=false;category='all';render();};
 }
 function render(){
  // Returning from another page always opens the library, not a stale quiz.
  quiz=null;
  shell(`<header class="page-head basic-library-head"><div><p class="eyebrow">A WORD FOR YOUR EVERYDAY</p><h1>คำเล็ก ๆ ที่ใช้ทุกวัน.</h1><p>พื้นฐานที่เปิดเรียนได้ทันที แยกจากเส้นทาง 32 บทเรียน</p></div><span class="basic-cover" aria-hidden="true">${icon('cards')}<small>abc</small></span></header>
  <section class="basic-intro"><div><span class="pill">FOUNDATION VOCABULARY</span><h2>${basicVocabulary.length} คำ เริ่มจากโลกใกล้ตัว</h2><p>เลือกหมวด → ฟังเสียง → ลองใช้ → ทบทวนสั้น ๆ</p></div><div class="basic-progress"><strong><span data-basic-total>${reviewed().size}</span><small> / ${basicVocabulary.length}</small></strong><span>คำที่เคยทบทวน</span></div></section>
  <div class="basic-categories" role="group" aria-label="หมวดศัพท์พื้นฐาน">${vocabularyCategories.map(c=>{const words=basicVocabulary.filter(w=>w.category===c.id);return `<button class="basic-category tone-${c.color} ${category===c.id?'active':''}" data-basic-category="${c.id}" aria-pressed="${category===c.id}">${vocabularyArtPreviews[c.id]?artPicture(vocabularyArtPreviews[c.id],c.title,{preview:true}):`<span class="category-illustration">${icon(c.icon)}</span>`}<span><small>${c.en}</small><strong>${c.title}</strong><span class="category-caption">${words.length} คำ · ทบทวน <b data-category-count="${c.id}">${words.filter(w=>reviewed().has(w.id)).length}</b></span></span></button>`;}).join('')}</div>
  ${numberReaderPanel()}
  <div class="basic-toolbar"><label class="search-field"><span>${icon('search')}</span><input id="basicSearch" type="search" value="${esc(query)}" placeholder="ค้นหาทุกหมวด เช่น apple แมว 20" aria-label="ค้นหาศัพท์พื้นฐานทุกหมวด"></label><button class="btn secondary" id="showAllBasic" aria-pressed="${category==='all'&&!query}">ดูทุกคำ</button></div>
  <div class="basic-preferences"><label class="toggle"><input id="basicThaiSound" type="checkbox" ${getState().showThaiSound?'checked':''}>คำอ่านไทยโดยประมาณ</label><label class="toggle"><input id="basicUnreviewed" type="checkbox" ${unreviewed?'checked':''}>เฉพาะคำที่ยังไม่ทบทวน</label></div>
  <section class="basic-section-head"><div><p class="eyebrow">EXPLORE & PRACTICE</p><h2 id="basicGroupTitle"></h2><p id="basicTip"></p></div><button class="btn primary" id="startBasicQuiz">${icon('target')} ทบทวน <span id="basicQuizSize">10</span> คำ</button></section>
  <div class="basic-results-meta"><span id="basicResultCount" role="status"></span><span>เสียงจากอุปกรณ์ · คำอ่านไทยเป็นตัวช่วยคร่าว ๆ</span></div>
  <div class="basic-word-grid" id="basicResults"></div>
  <p class="basic-footnote">“ทบทวนแล้ว” หมายถึงคุณทำเครื่องหมายเองหรือตอบถูกในแบบฝึก ไม่ใช่ผลรับรองว่าจำได้ถาวร ความก้าวหน้าส่วนนี้แยกจากบทเรียนและซิงก์กับบัญชีเมื่อเข้าสู่ระบบ</p>`);
  document.querySelectorAll('[data-basic-category]').forEach(b=>b.onclick=()=>{category=b.dataset.basicCategory;query='';render();document.querySelector('[data-basic-category="'+category+'"]').focus();});
  document.querySelector('#showAllBasic').onclick=()=>{category='all';query='';render();document.querySelector('#showAllBasic').focus();};
  document.querySelector('#basicSearch').oninput=e=>{query=e.target.value;renderResults();};
  document.querySelector('#basicThaiSound').onchange=e=>{setThaiSound(e.target.checked);renderResults();};
  document.querySelector('#basicUnreviewed').onchange=e=>{unreviewed=e.target.checked;renderResults();};
  document.querySelector('#startBasicQuiz').onclick=()=>startQuiz(selectedWords());
  renderResults();bindNumberReader();
 }
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
