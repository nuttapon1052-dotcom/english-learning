import './styles.css';
import { lessons, roadmap } from './lessons.js';
import { freshProgress, normalizeProgress, mergeProgress, accountKey, todayKey } from './progress.js';
import { createAuthClient } from './auth.js';
import { loadAuthConfig } from './config.js';

let user = null, auth = null, isTeacher = false, cloudReady = false, authBusy = true;
let syncState = 'local', syncTimer, syncing = null, syncAgain = false, identityVersion = 0;
let accountMode = 'login', recoveryMode = false, courseFilter = 'all', courseSearch = '';
function loadLocal(id) { try { return normalizeProgress(JSON.parse(localStorage.getItem(accountKey(id)) || '{}')); } catch { return freshProgress(); } }
let state = loadLocal();
let page = location.hash.slice(1) || 'today';
if(page.includes('access_token=') || page.includes('error=')) page = 'account';
let lessonSession = { selected: {}, arranged: [], showTranscript: false, recording: false, recognitionText: '', audioUrl: null };
const esc = value => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const app = document.querySelector('#app');
const icons = { today:'⌂', lessons:'▤', practice:'◎', vocab:'◇', progress:'↗' };
const labels = { today:'วันนี้', lessons:'บทเรียน', practice:'ฝึกทักษะ', vocab:'คำศัพท์', progress:'ความก้าวหน้า' };
const courseIcons = ['🌱','☕','🧭','💬','🧳','🚀'];
const courseRanges = [[1,4],[5,8],[9,12],[13,16],[17,20],[21,24]];
const knownWords = new Set(lessons.flatMap(l=>l.words.map(w=>w[0]))).size;

function writeLocal() {
  try { localStorage.setItem(accountKey(user?.id), JSON.stringify(state)); }
  catch { toast('พื้นที่บันทึกในเครื่องไม่พร้อม กรุณาส่งออกข้อมูลในหน้าความก้าวหน้า'); }
}
function save() {
  state.updatedAt = Date.now();
  state.activity = [...new Set([...state.activity,todayKey()])].slice(-365);
  state = normalizeProgress(state);
  writeLocal();
  if(user && cloudReady) {
    syncState = 'pending'; clearTimeout(syncTimer);
    syncTimer = setTimeout(()=>{syncCloud().catch(()=>{});},700);
  }
}
function syncText() { return !user ? 'เก็บความก้าวหน้าในเครื่องนี้' : ({saved:'ซิงก์ความก้าวหน้าแล้ว',pending:'รอซิงก์ความก้าวหน้า',syncing:'กำลังซิงก์…',error:'ยังไม่ซิงก์ · ข้อมูลอยู่ในเครื่อง',loading:'กำลังโหลดบัญชี'}[syncState] || 'ข้อมูลอยู่ในเครื่อง'); }
async function syncCloud() {
  if(!user || !cloudReady) return;
  if(syncing) { syncAgain=true; return syncing; }
  const version=identityVersion, id=user.id;
  syncState='syncing';
  syncing=(async()=>{
    try {
      do {
        syncAgain=false;
        const snapshot=normalizeProgress(state);
        const remote=await auth.getProgress(id);
        if(version!==identityVersion)return;
        const merged=mergeProgress(snapshot,remote?.state);
        await auth.putProgress(id,merged);
        if(version!==identityVersion)return;
        state=mergeProgress(state,merged); writeLocal();
        if(state.updatedAt>snapshot.updatedAt)syncAgain=true;
      } while(syncAgain && version===identityVersion);
      if(version===identityVersion) syncState='saved';
    } catch(error) { if(version===identityVersion)syncState='error'; throw error; }
    finally { syncing=null; updateSyncLabel(); }
  })();
  return syncing;
}
function updateSyncLabel() { document.querySelectorAll('[data-sync-status]').forEach(el=>el.textContent=syncText()); }
async function adoptUser(nextUser) {
  identityVersion++; clearTimeout(syncTimer); cloudReady=false; isTeacher=false;
  user=nextUser; lessonSession={selected:{},arranged:[],showTranscript:false,recording:false,recognitionText:'',audioUrl:null}; state=loadLocal(user?.id); syncState=user?'loading':'local';
  if(!user)return;
  const version=identityVersion;
  try {
    const remote=await auth.getProgress(user.id);
    if(version!==identityVersion)return;
    state=mergeProgress(state,remote?.state); writeLocal(); cloudReady=true; syncState='saved';
    isTeacher=await auth.isTeacher();
    await syncCloud();
  } catch { if(version===identityVersion) syncState='error'; }
}
async function retryCloud() {
  if(!user)return;
  const version=identityVersion;
  const remote=await auth.getProgress(user.id);
  if(version!==identityVersion)return;
  state=mergeProgress(state,remote?.state); writeLocal(); cloudReady=true;
  isTeacher=await auth.isTeacher();
  await syncCloud();
}
function shell(content) {
  const activeKey=page.startsWith('learn-')?'lessons':page;
  const nav=Object.keys(labels).map(key=>`<button class="nav-btn ${activeKey===key?'active':''}" data-nav="${key}" ${activeKey===key?'aria-current="page"':''}><span aria-hidden="true">${icons[key]}</span>${labels[key]}</button>`).join('');
  const mobile=Object.keys(labels).map(key=>`<button class="${activeKey===key?'active':''}" data-nav="${key}" ${activeKey===key?'aria-current="page"':''}><span class="nav-icon" aria-hidden="true">${icons[key]}</span>${labels[key]}</button>`).join('');
  const name=user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'ผู้เรียน';
  app.innerHTML=`<div class="app"><a class="skip-link" href="#main-content">ข้ามไปเนื้อหา</a>
  <header class="topbar"><button class="brand" data-nav="today"><span class="logo">y.</span><span>English <small>with Yuri</small></span></button>
  <span class="top-note">A little every day. A lot more confidence.</span>
  <button class="account-trigger" data-nav="account"><span class="profile-btn" aria-hidden="true">${user?esc(name.slice(0,1)):'↗'}</span><span>${user?esc(name):'เข้าสู่ระบบ'}</span></button></header>
  <aside class="sidebar"><p class="nav-caption">YOUR LEARNING SPACE</p><nav class="desktop-nav" aria-label="เมนูหลัก">${nav}</nav>
  <div class="sidebar-tip"><span>✦</span><strong>วันละนิด ก็ไปได้ไกล</strong><p>ฟัง ลองพูด แล้วค่อย ๆ ใช้<br>ไม่ต้องรอให้พร้อมทุกอย่าง</p><button data-lesson="${state.currentLesson}" class="btn secondary">เรียนต่อ →</button></div>
  <button class="sidebar-account" data-nav="account">${user?'บัญชีของฉัน':'สมัครเพื่อเก็บความก้าวหน้า'} →</button></aside>
  <main class="main" id="main-content" tabindex="-1">${content}<footer class="site-footer"><strong>English with Yuri</strong><span>พื้นที่เล็ก ๆ สำหรับก้าวใหญ่ของคุณ</span><button data-nav="account">บัญชีและการบันทึกข้อมูล ↗</button></footer></main>
  <nav class="bottom-nav" aria-label="เมนูหลักบนมือถือ">${mobile}</nav></div>`;
  bindCommon();
}
function bindCommon() {
  document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>navigate(b.dataset.nav));
  document.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>startLesson(+b.dataset.lesson));
  document.querySelectorAll('[data-speak]').forEach(b=>b.onclick=()=>speak(b.dataset.speak));
}
function navigate(next) {
  if(lessonSession.recording){toast('หยุดอัดเสียงก่อนเปลี่ยนหน้าครับ');return;}
  page=next; location.hash=next; render(); scrollTo(0,0);
}
function speak(text,rate=1) { if(!('speechSynthesis' in window))return toast('อุปกรณ์นี้ไม่รองรับเสียงสังเคราะห์');speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=rate;speechSynthesis.speak(u); }
function toast(text) { document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=text;document.body.append(el);setTimeout(()=>el.remove(),4000); }
function render() {
  if(authBusy && page==='account')return renderAccount();
  if(authBusy){shell('<section class="card account-shell" role="status"><p class="eyebrow">WELCOME TO YOUR LEARNING SPACE</p><h2>กำลังเตรียมพื้นที่เรียนรู้…</h2><p>รอสักครู่</p></section>');return;}
  if(page.startsWith('learn-'))return renderLesson(+page.split('-')[1]);
  const views={today:renderToday,lessons:renderLessons,practice:renderPractice,vocab:renderVocab,progress:renderProgress,assessment:renderAssessment,account:renderAccount,teacher:renderTeacher};
  (views[page]||renderToday)();
}
function skillCards() {
  return Object.entries(state.skill).map(([name,value],i)=>`<button class="card skill" data-skill="${i}"><div class="skill-head"><span class="skill-symbol" aria-hidden="true">${['◉','◌','▤','✎'][i]}</span><span>${value}%</span></div><strong>${name}</strong><p>กิจกรรมฝึกที่ทำแล้ว</p><div class="bar"><i style="width:${value}%"></i></div></button>`).join('');
}
function bindSkills() {
  document.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>{state.currentStep=[3,4,5,5][+b.dataset.skill];state.cursorUpdatedAt=Date.now();save();startLesson(state.currentLesson);});
}
function renderToday() {
  const current=lessons.find(l=>l.id===state.currentLesson)||lessons[0];
  const pct=state.completed.includes(current.id)?100:Math.round(state.currentStep/7*100);
  const name=user?.user_metadata?.display_name || user?.user_metadata?.full_name || '';
  shell(`<div class="welcome-line"><span>${name?'สวัสดี '+esc(name)+' 👋':'ยินดีต้อนรับสู่พื้นที่เรียนรู้ของคุณ 👋'}</span><span data-sync-status>${syncText()}</span></div>
  <section class="hero"><div class="hero-content"><p class="eyebrow"><span class="badge-dot"></span> SMALL STEPS. REAL CONFIDENCE.</p><h1>ภาษาอังกฤษ<br>เริ่มได้ <em>ในแบบคุณ.</em></h1><p class="hero-copy">จากประโยคแรก ถึงบทสนทนาที่ใช้จริง<br>เรียนด้วยคำอธิบายไทย ฝึกครบ 4 ทักษะ<br>ทีละนิด ในจังหวะที่คุณเลือก</p><div class="actions"><button class="btn primary" data-lesson="${current.id}">${state.currentStep?'เรียนต่อจากจุดเดิม':'เริ่มเรียนวันนี้'} <span>↗</span></button><button class="btn hero-secondary" id="assessment">ลองประเมินพื้นฐาน</button></div><div class="hero-proof"><span>✓ ${lessons.length} บทเรียนพร้อมใช้</span><span>✓ เริ่มจากศูนย์ได้</span><span>✓ เรียนฟรี</span></div></div>
  <div class="hero-art" aria-hidden="true"><div class="art-orbit"></div><div class="hello-card"><span>YOUR FIRST CONVERSATION</span><strong>Hello,<br><em>world.</em></strong><div class="hello-divider"></div><p>โลกของคุณ กว้างขึ้นได้อีกนิด</p></div><div class="floating-word"><b>confidence</b><span>ความมั่นใจ / เริ่มได้ทุกวัน</span></div><div class="floating-sound"><span>▂ ▅ ▃ ▇ ▄ ▅ ▂</span><small>Listen. Speak. Repeat.</small></div><div class="art-spark">✦</div></div></section>
  <div class="dashboard-stats"><article><span class="stat-symbol">▤</span><div><strong>${state.completed.length}<small> / ${lessons.length}</small></strong><p>บทเรียนที่จบแล้ว</p></div></article><article><span class="stat-symbol">◇</span><div><strong>${state.learnedWords.length}</strong><p>คำศัพท์ในคลังของคุณ</p></div></article><article><span class="stat-symbol">✦</span><div><strong>${state.activity.length}</strong><p>วันที่มีกิจกรรมการเรียน</p></div></article></div>
  <div class="section-title"><div><p class="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2>ก้าวถัดไปของคุณ</h2></div><button class="text-link" data-nav="lessons">ดูทุกบทเรียน ↗</button></div>
  <section class="today-grid"><article class="card lesson-feature"><div class="big-icon">${current.icon}</div><div><div class="feature-meta"><span class="pill">บทที่ ${current.id}</span><span>${current.minutes} นาที</span></div><h3>${current.title}</h3><p>${current.subtitle}</p></div><div class="feature-bottom"><div class="feature-progress"><div class="bar"><i style="width:${pct}%"></i></div><span>${pct}% ของบทนี้</span></div><button class="btn primary" data-lesson="${current.id}">${pct===100?'ทบทวนอีกครั้ง':pct?'เรียนต่อ':'เริ่มบทเรียน'} →</button></div></article>
  <article class="card time-card"><span class="mini-label">MAKE ROOM FOR YOURSELF</span><h3>วันนี้ให้เวลากับตัวเองกี่นาที?</h3><p>ตั้งเป้าหมายที่พอดี ไม่ต้องเรียนรวดเดียว</p><div class="segmented">${[15,30,60].map(n=>`<button data-time="${n}" aria-pressed="${state.minutes===n}" class="${state.minutes===n?'active':''}">${n}<small>นาที</small></button>`).join('')}</div><p class="goal-note">✦ บทส่วนใหญ่ใช้เวลา 12–15 นาที</p></article></section>
  <div class="section-title"><div><p class="eyebrow">FOUR WAYS TO GROW</p><h2>ฝึกให้ครบทุกทักษะ</h2></div><span class="section-note">เปอร์เซ็นต์แสดงกิจกรรมที่ฝึก ไม่ใช่ระดับภาษา</span></div><div class="skill-row">${skillCards()}</div>
  <div class="section-title"><div><p class="eyebrow">YOUR LEARNING JOURNEY</p><h2>เลือกเส้นทางที่ใช่</h2><p>6 หมวด จากพื้นฐานสู่สถานการณ์จริง</p></div></div><div class="roadmap">${roadmap.map((r,i)=>courseCard(r,i)).join('')}</div>
  ${!user?`<section class="join-banner"><div><span class="eyebrow">KEEP YOUR LITTLE WINS</span><h2>ทุกก้าวของคุณ มีที่เก็บเสมอ</h2><p>บัญชีผู้ใช้ช่วยให้กลับมาเรียนต่อและซิงก์ข้ามเครื่องเมื่อเปิดระบบแล้ว</p></div><button class="btn primary" data-nav="account">ดูระบบบัญชี ↗</button></section>`:''}`);
  document.querySelector('#assessment').onclick=()=>navigate('assessment');
  document.querySelectorAll('[data-time]').forEach(b=>b.onclick=()=>{state.minutes=+b.dataset.time;save();renderToday();});
  bindCourses();bindSkills();
}
function courseCard(r,i) {
  const [min,max]=courseRanges[i],done=state.completed.filter(id=>id>=min&&id<=max).length;
  return `<button class="card course-card course-${i}" data-course="${i}"><div class="course-top"><span class="course-icon">${courseIcons[i]}</span><span class="course-count">04 LESSONS</span></div><span class="mini-label">${r[0]}</span><h3>${r[1]}</h3><p>${r[2]}</p><div class="course-bottom"><span>${done}/4 บทที่จบ</span><span>สำรวจหมวดนี้ ↗</span></div><div class="bar"><i style="width:${done/4*100}%"></i></div></button>`;
}
function bindCourses() { document.querySelectorAll('[data-course]').forEach(b=>b.onclick=()=>{courseFilter=b.dataset.course;courseSearch='';navigate('lessons');}); }
function lessonCards(items) {
  return items.map(l=>`<button class="card lesson-card" data-lesson="${l.id}"><span class="lesson-icon">${l.icon}</span><span><span class="muted-label">บท ${String(l.id).padStart(2,'0')} · ${l.minutes} นาที</span><h3>${l.title}</h3><p>${l.subtitle}</p></span><span class="circle-status ${state.completed.includes(l.id)?'done':''}" aria-label="${state.completed.includes(l.id)?'เรียนจบแล้ว':'เริ่มเรียน'}">${state.completed.includes(l.id)?'✓':'↗'}</span></button>`).join('');
}
function filteredLessons() {
  const range=courseFilter==='all'?null:courseRanges[Number(courseFilter)];
  const query=courseSearch.trim().toLocaleLowerCase();
  return lessons.filter(l=>(!range||(l.id>=range[0]&&l.id<=range[1]))&&(!query||(l.title+' '+l.subtitle+' '+l.goal).toLocaleLowerCase().includes(query)));
}
function renderLessons() {
  shell(`<header class="page-head"><p class="eyebrow">A PATH FOR EVERY BEGINNING</p><h1>บทเรียนของคุณ.</h1><p>${lessons.length} บท · ${knownWords} คำศัพท์ไม่ซ้ำ · ฟัง พูด อ่าน เขียนในทุกบท</p></header>
  <div class="catalog-toolbar"><label class="search-field"><span aria-hidden="true">⌕</span><input id="lessonSearch" type="search" placeholder="ค้นหาบทเรียน เช่น อาหาร อีเมล เดินทาง" aria-label="ค้นหาบทเรียน" value="${esc(courseSearch)}"></label><span id="resultCount" role="status">${filteredLessons().length} บท</span></div>
  <div class="filter-chips" role="group" aria-label="หมวดบทเรียน"><button data-filter="all" class="${courseFilter==='all'?'active':''}" aria-pressed="${courseFilter==='all'}">ทั้งหมด</button>${roadmap.map((r,i)=>`<button data-filter="${i}" aria-pressed="${courseFilter===String(i)}" class="${courseFilter===String(i)?'active':''}">${r[1]}</button>`).join('')}</div>
  <div class="lesson-grid" id="lessonResults">${lessonCards(filteredLessons())}</div>`);
  document.querySelector('#lessonSearch').oninput=e=>{
    courseSearch=e.target.value;const items=filteredLessons();document.querySelector('#resultCount').textContent=items.length+' บท';
    document.querySelector('#lessonResults').innerHTML=items.length?lessonCards(items):'<div class="empty"><h3>ยังไม่พบหัวข้อนี้</h3><p>ลองใช้คำค้นสั้นลง หรือเลือกหมวดทั้งหมด</p></div>';bindCommon();
  };
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{courseFilter=b.dataset.filter;renderLessons();});
}
function renderPractice() {
  const pending=state.mistakes.length;
  shell(`<header class="page-head"><p class="eyebrow">PRACTICE MAKES PROGRESS</p><h1>ฝึกอีกนิด มั่นใจอีกหน่อย.</h1><p>เริ่มจากสิ่งที่ยังไม่แม่น แล้วลองใหม่ได้ทุกวัน</p></header>
  <div class="today-grid"><article class="card lesson-feature"><div class="big-icon">🧠</div><div><span class="pill">เลือกจากสิ่งที่คุณเคยพลาด</span><h3>${pending?pending+' จุดที่กลับมาฝึกได้':'พร้อมสำหรับความรู้ใหม่'}</h3><p>${pending?'เราเก็บโจทย์ที่พลาดไว้ให้ลองอีกครั้ง':'ยังไม่มีข้อที่พลาด เริ่มบทเรียนหรือเลือกฝึกด้านล่าง'}</p></div><div class="feature-bottom"><button class="btn primary" id="reviewMistakes" ${pending?'':'disabled'}>เริ่มทบทวน →</button><button class="text-link" data-nav="lessons">เลือกบทเรียน</button></div></article>
  <article class="card time-card"><span class="mini-label">SPEAK A LITTLE LOUDER</span><h3>ได้เวลาใช้เสียงของคุณ</h3><p>ฟังต้นแบบ พูดตาม แล้วอัดเสียงเพื่อฟังตัวเอง ไม่มีคะแนนตัดสินการออกเสียง</p><button class="btn secondary" id="speakPractice">เปิดแบบฝึกพูด →</button></article></div>
  <div class="section-title"><div><h2>เริ่มจากทักษะที่อยากฝึก</h2></div></div><div class="skill-row">${skillCards()}</div>`);
  document.querySelector('#reviewMistakes').onclick=()=>{const m=state.mistakes[0];if(m){startLesson(m.lesson);state.currentStep=m.type==='ฟัง'?3:m.type==='อ่าน'?5:6;state.cursorUpdatedAt=Date.now();save();renderLesson(m.lesson);}};
  document.querySelector('#speakPractice').onclick=()=>{state.currentStep=4;state.cursorUpdatedAt=Date.now();save();startLesson(state.currentLesson);};
  bindSkills();
}
function renderVocab() {
  const words=state.learnedWords;
  shell(`<header class="page-head"><p class="eyebrow">WORDS OPEN WORLDS</p><h1>คลังคำเล็ก ๆ ของคุณ.</h1><p>${words.length} คำจากบทเรียนที่ทำจบ · กลับมาฟังและทบทวนได้เสมอ</p></header>
  <div class="vocab-page-grid"><section class="card vocab-table">${words.length?words.map(w=>`<div class="vocab-item"><div><strong class="word-en">${esc(w[0])}</strong><span class="word-th">${esc(w[1])}</span></div>${state.showThaiSound?`<span class="thai-sound">${esc(w[2])}</span>`:'<span></span>'}<button class="sound-btn" data-speak="${esc(w[0])}" aria-label="ฟังคำว่า ${esc(w[0])}">▶</button></div>`).join(''):`<div class="empty"><div class="emoji">📚</div><h3>คำแรกของคุณ รออยู่ในบทเรียน</h3><p>จบบทแรก แล้วคำศัพท์จะมาอยู่ตรงนี้</p><button class="btn primary" data-lesson="1">เริ่มบทแรก ↗</button></div>`}</section>
  <aside class="card side-card"><span class="eyebrow">LISTEN FIRST</span><h3>ฟังเสียงจริง ก่อนจำคำอ่าน</h3><p>คำอ่านไทยเป็นเพียงตัวช่วยคร่าว ๆ เสียงภาษาอังกฤษจากปุ่มฟังคือต้นแบบหลัก</p><label class="toggle"><input type="checkbox" id="thaiToggle" ${state.showThaiSound?'checked':''}> แสดงคำอ่านไทย</label><div class="tip-box">ลองฟัง → พูดตาม → ใช้ในประโยคสั้น ๆ</div></aside></div>`);
  document.querySelector('#thaiToggle').onchange=e=>{state.showThaiSound=e.target.checked;save();renderVocab();};
}
function renderProgress() {
  const done=state.completed.length;
  shell(`<header class="page-head"><p class="eyebrow">EVERY LITTLE WIN COUNTS</p><h1>คุณมาไกลขึ้นอีกนิด.</h1><p data-sync-status>${syncText()}</p></header>
  <div class="stats-grid"><article class="card stat"><span class="mini-label">LESSONS COMPLETED</span><div class="num">${done}<small> / ${lessons.length}</small></div><p>บทเรียนที่จบแล้ว</p><div class="bar"><i style="width:${done/lessons.length*100}%"></i></div></article><article class="card stat"><span class="mini-label">YOUR WORD BANK</span><div class="num">${state.learnedWords.length}</div><p>คำศัพท์ที่พบแล้ว</p></article><article class="card stat"><span class="mini-label">ACTIVE DAYS</span><div class="num">${state.activity.length}</div><p>วันที่มีกิจกรรมการเรียน</p></article></div>
  <div class="today-grid"><section class="card side-card"><h2>เส้นทางที่ผ่านมาของคุณ</h2><div class="journey-list">${roadmap.map((r,i)=>{const[a,b]=courseRanges[i],count=state.completed.filter(id=>id>=a&&id<=b).length;return `<div><span>${courseIcons[i]}</span><div><strong>${r[1]}</strong><div class="bar"><i style="width:${count/4*100}%"></i></div></div><b>${count}/4</b></div>`;}).join('')}</div></section>
  <aside class="card side-card"><span class="eyebrow">YOUR DATA, YOUR CHOICE</span><h2>ข้อมูลของฉัน</h2><p>${user?'ข้อมูลแยกตามบัญชี และจะซิงก์เมื่อเชื่อมต่อได้':'ขณะนี้บันทึกเฉพาะในเครื่องนี้ ส่งออกเพื่อสำรอง หรือดูระบบบัญชีเพื่อซิงก์เมื่อเปิดใช้งาน'}</p><button class="btn secondary" data-nav="account">บัญชีและการซิงก์ ↗</button><div class="settings-block"><button class="btn secondary" id="export">ส่งออกข้อมูล</button><label class="btn secondary" for="import">นำเข้าข้อมูล</label><input hidden type="file" id="import" accept="application/json"><button class="btn danger" id="reset">เริ่มความก้าวหน้าใหม่</button></div></aside></div>
  <div class="section-title"><div><h2>บันทึกการฝึกของคุณ</h2><p>ตัวนับกิจกรรม ไม่ใช่คะแนนรับรองความสามารถทางภาษา</p></div></div><div class="skill-row">${skillCards()}</div>`);
  document.querySelector('#export').onclick=exportData;document.querySelector('#import').onchange=importData;document.querySelector('#reset').onclick=resetData;bindSkills();
}

function renderAccount() {
  if(authBusy) { shell('<section class="account-shell card" role="status"><p class="eyebrow">YOUR LEARNING ACCOUNT</p><h1>กำลังเชื่อมต่อบัญชี…</h1><p>รอสักครู่ ความก้าวหน้าจะถูกโหลดแยกตามบัญชี</p></section>');return; }
  if(user && !recoveryMode) {
    const name=user.user_metadata?.display_name || user.user_metadata?.full_name || user.email;
    const guest=loadLocal(),hasGuest=guest.completed.length||guest.currentStep||guest.xp;
    shell(`<header class="page-head"><p class="eyebrow">YOUR OWN LEARNING SPACE</p><h1>สวัสดี ${esc(name)}.</h1><p>${esc(user.email)}</p></header><div class="today-grid"><article class="card side-card"><span class="pill">บัญชีผู้เรียน</span><h2>ทุกก้าว เป็นของคุณ</h2><p data-sync-status>${syncText()}</p><p>เรียนแล้ว ${state.completed.length} จาก ${lessons.length} บท · เรียนค้างที่บท ${state.currentLesson}</p><div class="actions"><button class="btn primary" data-lesson="${state.currentLesson}">เรียนต่อ →</button><button class="btn secondary" id="syncNow">ซิงก์อีกครั้ง</button></div>${isTeacher?'<div class="settings-block"><h3>สำหรับครู</h3><p>ดูรายชื่อผู้เรียนและความก้าวหน้าจากข้อมูลที่ซิงก์แล้ว</p><button class="btn secondary" data-nav="teacher">เปิดหน้าผู้เรียน ↗</button></div>':''}</article><aside class="card side-card"><h2>จัดการบัญชี</h2><p>เมื่อออกจากระบบ เว็บกลับไปใช้ความก้าวหน้าแบบไม่สมัคร ข้อมูลแต่ละบัญชีแยกกัน</p>${hasGuest?'<div class="notice">พบความก้าวหน้าแบบไม่สมัครในเครื่องนี้ นำเข้าเฉพาะเมื่อเป็นข้อมูลของคุณเอง</div><button class="btn secondary" id="importGuest">นำความก้าวหน้าในเครื่องเข้าบัญชีนี้</button>':''}<div class="settings-block"><button class="btn secondary" id="passwordEmail">ส่งลิงก์เปลี่ยนรหัสผ่าน</button><button class="btn danger" id="logout">ออกจากระบบ</button></div><p id="accountFeedback" role="status"></p></aside></div>`);
    document.querySelector('#syncNow').onclick=async e=>{e.target.disabled=true;try{await retryCloud();toast('ซิงก์ความก้าวหน้าแล้ว');}catch{toast('ยังเชื่อมต่อไม่ได้ ข้อมูลในเครื่องยังอยู่');}finally{e.target.disabled=false;updateSyncLabel();}};
    document.querySelector('#passwordEmail').onclick=async e=>{e.target.disabled=true;try{await auth.recover(user.email);document.querySelector('#accountFeedback').textContent='ส่งคำขอแล้ว โปรดตรวจอีเมลและกล่องสแปม';}catch(err){document.querySelector('#accountFeedback').textContent=authError(err);}finally{e.target.disabled=false;}};
    document.querySelector('#logout').onclick=async e=>{
      e.target.disabled=true;
      try{clearTimeout(syncTimer);if(syncing)await syncing.catch(()=>{});await auth.signOut();await adoptUser(null);navigate('today');toast('ออกจากระบบแล้ว');}
      catch(err){toast(authError(err));e.target.disabled=false;}
    };
    document.querySelector('#importGuest')?.addEventListener('click',()=>{
      if(confirm('ยืนยันว่าความก้าวหน้าแบบไม่สมัครในเครื่องนี้เป็นของคุณ และต้องการรวมกับบัญชีนี้?')){state=mergeProgress(state,guest);save();renderAccount();}
    });
    return;
  }
  if(!auth?.configured) {
    shell(`<section class="account-layout"><div class="account-intro"><p class="eyebrow">YOUR PROGRESS WILL HAVE A HOME</p><h1>เรียนรู้วันนี้<br>กลับมาต่อได้ทุกวัน.</h1><p>บัญชีผู้ใช้จะช่วยเก็บบทเรียนและความก้าวหน้าข้ามเครื่อง</p><div class="account-benefits"><span>✓ แยกความก้าวหน้าของแต่ละคน</span><span>✓ กลับมาเรียนต่อจากจุดเดิม</span><span>✓ ครูติดตามเส้นทางผู้เรียนได้</span></div></div><article class="card auth-card"><span class="auth-icon">✦</span><h2>ระบบบัญชีกำลังเตรียมเปิดใช้งาน</h2><p>คุณเรียนทุกบทได้ทันที ความก้าวหน้าจะเก็บอยู่ในเครื่องนี้จนกว่าจะเปิดระบบบัญชี</p><button class="btn primary" data-nav="today">เริ่มเรียนแบบไม่สมัคร →</button><button class="btn secondary" data-nav="progress">ดูหรือสำรองความก้าวหน้า</button></article></section>`);
    return;
  }
  const signup=accountMode==='signup',reset=accountMode==='reset',recover=recoveryMode;
  shell(`<section class="account-layout"><div class="account-intro"><p class="eyebrow">KEEP YOUR LITTLE WINS</p><h1>พื้นที่เรียนรู้<br>ที่เป็นของคุณ.</h1><p>เก็บความก้าวหน้า กลับมาเรียนต่อ แล้วค่อย ๆ ไปไกลกว่าเดิม</p><div class="account-benefits"><span>✓ ความก้าวหน้าแยกตามบัญชี</span><span>✓ ซิงก์บทเรียนข้ามเครื่อง</span><span>✓ เรียนฟรีในจังหวะของคุณ</span></div></div>
  <article class="card auth-card"><span class="auth-icon">y.</span><h2>${recover?'ตั้งรหัสผ่านใหม่':reset?'ลืมรหัสผ่าน?':signup?'เริ่มต้นบัญชีของคุณ':'ยินดีต้อนรับกลับมา'}</h2><p>${reset?'เราจะส่งลิงก์ให้คุณกลับเข้าบัญชี':recover?'ตั้งรหัสใหม่ แล้วใช้เข้าสู่ระบบครั้งต่อไป':'ทุกก้าวเล็ก ๆ ของคุณ จะกลับมาต่อได้เสมอ'}</p>
  ${!reset&&!recover?`<button class="btn google-login" type="button" id="googleLogin"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.22c1.88-1.73 2.99-4.28 2.99-7.36Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.61-2.41l-3.22-2.51c-.89.6-2.03.95-3.39.95-2.6 0-4.8-1.76-5.58-4.12H3.1v2.59A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.42 13.91A6 6 0 0 1 6.1 12c0-.66.11-1.3.32-1.91V7.5H3.1a10 10 0 0 0 0 9l3.32-2.59Z"/><path fill="#EA4335" d="M12 5.97c1.47 0 2.79.5 3.82 1.49l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.9 5.5l3.32 2.59C7.2 7.73 9.4 5.97 12 5.97Z"/></svg>เข้าสู่ระบบด้วย Google</button><div class="auth-divider"><span>หรือใช้อีเมล</span></div>`:''}
  ${!reset&&!recover?`<div class="segmented auth-tabs"><button data-auth-mode="login" class="${signup?'':'active'}" aria-pressed="${!signup}">เข้าสู่ระบบ</button><button data-auth-mode="signup" class="${signup?'active':''}" aria-pressed="${signup}">สมัครบัญชี</button></div>`:''}
  <form id="authForm">${signup?'<label for="displayName">ชื่อที่อยากให้เรียก</label><input class="text-input" id="displayName" name="displayName" autocomplete="nickname" required minlength="1" maxlength="80">':''}
  ${!recover?'<label for="email">อีเมล</label><input class="text-input" id="email" name="email" type="email" autocomplete="email" required maxlength="254">':''}
  ${!reset?`<label for="password">รหัสผ่าน${signup||recover?' (อย่างน้อย 8 ตัวอักษร)':''}</label><input class="text-input" id="password" name="password" type="password" autocomplete="${signup||recover?'new-password':'current-password'}" required ${signup||recover?'minlength="8"':''} maxlength="128">`:''}
  ${signup||recover?'<label for="passwordConfirm">ยืนยันรหัสผ่าน</label><input class="text-input" id="passwordConfirm" type="password" autocomplete="new-password" required minlength="8" maxlength="128">':''}
  <p id="authFeedback" role="alert" class="auth-feedback"></p><button class="btn primary" type="submit" id="authSubmit">${recover?'บันทึกรหัสใหม่':reset?'ส่งลิงก์รีเซ็ตรหัสผ่าน':signup?'สมัครบัญชี →':'เข้าสู่ระบบ →'}</button></form>
  ${!recover?`<button class="text-link" data-auth-mode="${reset?'login':'reset'}">${reset?'กลับไปเข้าสู่ระบบ':'ลืมรหัสผ่าน'}</button><button class="text-link" data-nav="today">เรียนแบบไม่สมัครก่อน</button>`:''}</article></section>`);
  document.querySelectorAll('[data-auth-mode]').forEach(b=>b.onclick=()=>{accountMode=b.dataset.authMode;renderAccount();});
  document.querySelector('#googleLogin')?.addEventListener('click',async e=>{
    const button=e.currentTarget,feedback=document.querySelector('#authFeedback');
    button.disabled=true;feedback.textContent='กำลังพาไปเลือกบัญชี Google…';
    try { location.assign(await auth.googleSignInUrl()); }
    catch(error) { feedback.textContent=authError(error);button.disabled=false; }
  });
  document.querySelector('#authForm').onsubmit=async e=>{
    e.preventDefault();const submit=document.querySelector('#authSubmit'),feedback=document.querySelector('#authFeedback');
    const email=document.querySelector('#email')?.value.trim(),password=document.querySelector('#password')?.value;
    const confirmPassword=document.querySelector('#passwordConfirm');
    if(confirmPassword && confirmPassword.value!==password){feedback.textContent='รหัสผ่านทั้งสองช่องยังไม่ตรงกัน';return;}
    submit.disabled=true;feedback.textContent='กำลังดำเนินการ…';
    try {
      if(recover){await auth.updatePassword(password);recoveryMode=false;renderAccount();toast('เปลี่ยนรหัสผ่านแล้ว');return;}
      if(reset){await auth.recover(email);feedback.textContent='หากอีเมลนี้มีบัญชี คุณจะได้รับลิงก์ โปรดตรวจกล่องสแปมด้วย';return;}
      let nextUser;
      if(signup){const result=await auth.signUp(email,password,document.querySelector('#displayName').value.trim());if(result.confirmationRequired){feedback.textContent='ตรวจอีเมลเพื่อยืนยันบัญชี แล้วกลับมาเข้าสู่ระบบ หากยังไม่ได้รับ ลองดูกล่องสแปม';return;}nextUser=result.user;}
      else nextUser=await auth.signIn(email,password);
      authBusy=true;renderAccount();await adoptUser(nextUser);authBusy=false;renderAccount();toast('เข้าสู่ระบบแล้ว');
    }catch(err){authBusy=false;if(!document.querySelector('#authFeedback'))renderAccount();const target=document.querySelector('#authFeedback');if(target)target.textContent=authError(err);}
    finally{const button=document.querySelector('#authSubmit');if(button)button.disabled=false;}
  };
}
function authError(error) {
  if(error.code==='provider_disabled')return 'Google ยังไม่เปิดใช้งาน กรุณาใช้อีเมลก่อน';
  if(error.code==='access_denied')return 'ยกเลิกการเข้าสู่ระบบด้วย Google แล้ว ลองใหม่ได้เมื่อพร้อม';
  if(error.status===429)return 'ขอใช้งานถี่เกินไป กรุณารอสักครู่แล้วลองใหม่';
  if(error.code==='email_not_confirmed')return 'โปรดยืนยันอีเมลก่อนเข้าสู่ระบบ';
  if(error.code==='invalid_credentials'||error.status===400)return 'ข้อมูลไม่ถูกต้องหรือยังใช้งานไม่ได้ โปรดตรวจอีเมลและรหัสผ่าน';
  if(error.name==='TimeoutError'||error.name==='TypeError')return 'เชื่อมต่อไม่ได้ กรุณาตรวจอินเทอร์เน็ตแล้วลองใหม่';
  return 'ดำเนินการไม่สำเร็จ กรุณาลองอีกครั้ง';
}
async function renderTeacher() {
  if(!user||!isTeacher){shell('<section class="card account-shell"><h1>หน้าสำหรับครู</h1><p>บัญชีนี้ยังไม่มีสิทธิ์ดูผู้เรียนคนอื่น</p><button class="btn secondary" data-nav="account">กลับหน้าบัญชี</button></section>');return;}
  shell('<header class="page-head"><p class="eyebrow">LEARNER OVERVIEW</p><h1>ทุกก้าวของผู้เรียน.</h1><p>แสดงเฉพาะความก้าวหน้าที่ซิงก์แล้ว สูงสุด 500 บัญชี</p></header><section class="card side-card" id="learnerList" aria-live="polite">กำลังโหลดผู้เรียน…</section>');
  const version=identityVersion;
  try {
    const rows=await auth.getLearners();if(page!=='teacher'||version!==identityVersion)return;
    document.querySelector('#learnerList').innerHTML=rows.length?`<div class="learner-table-wrap"><table class="learner-table"><thead><tr><th scope="col">ผู้เรียน</th><th scope="col">บทที่จบ</th><th scope="col">เรียนค้างที่</th><th scope="col">ซิงก์ล่าสุด</th></tr></thead><tbody>${rows.map(row=>{const p=normalizeProgress(row.progress?.state);return `<tr><td><strong>${esc(row.display_name)}</strong><span>${esc(row.email)}</span></td><td>${p.completed.length}/${lessons.length}</td><td>${row.progress?'บท '+p.currentLesson+' · ขั้น '+(p.currentStep+1)+'/7':'ยังไม่เริ่ม'}</td><td>${row.progress?esc(new Date(row.progress.updated_at).toLocaleString('th-TH')):'—'}</td></tr>`;}).join('')}</tbody></table></div>`:'ยังไม่มีผู้เรียนสมัคร';
  }catch{if(page==='teacher')document.querySelector('#learnerList').textContent='โหลดรายชื่อไม่ได้ ตรวจการเชื่อมต่อแล้วเปิดหน้านี้ใหม่';}
}
function renderAssessment(){
 shell(`<section class="assessment"><button class="back" data-nav="today">← กลับหน้าแรก</button><div class="card assessment-step"><p class="eyebrow">แบบประเมินทางเลือก</p><h1>ลองตอบ 3 ข้อสั้น ๆ</h1><p class="step-lead">ไม่มีผลต่อการเริ่มเรียน ใช้เพื่อแนะนำจุดเริ่มต้นเท่านั้น</p><div class="question">“I am happy.” หมายถึงอะไร?</div><div class="options" data-assess="1"><button class="option">ฉันมีความสุข</button><button class="option">ฉันหิว</button></div><div class="question">เลือกคำที่เติม: We ___ friends.</div><div class="options" data-assess="2"><button class="option">are</button><button class="option">am</button></div><div class="question">“Where” ใช้ถามเรื่องใด?</div><div class="options" data-assess="3"><button class="option">สถานที่</button><button class="option">เวลา</button></div><div class="step-actions"><span></span><button class="btn primary" id="finishAssess">ดูคำแนะนำ</button></div></div></section>`);
 document.querySelectorAll('[data-assess] .option').forEach(b=>b.onclick=()=>{b.parentElement.querySelectorAll('.option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');});
 document.querySelector('#finishAssess').onclick=()=>{const answers=[...document.querySelectorAll('[data-assess]')].map(x=>x.querySelector('.selected')===x.firstElementChild);const score=answers.filter(Boolean).length;state.assessment=score;save();toast(score>=2?'พื้นฐานดีเลย แนะนำเริ่มบท 2':'เริ่มบท 1 ได้เลย ยูริจะพาไปทีละขั้น');setTimeout(()=>startLesson(score>=2?2:1),800);};
}

function startLesson(id){if(!lessons.some(l=>l.id===id))id=1;if(state.currentLesson!==id)state.currentStep=0;state.currentLesson=id;state.cursorUpdatedAt=Date.now();save();lessonSession={selected:{},arranged:[],showTranscript:false,recording:false,recognitionText:'',audioUrl:null};navigate(`learn-${id}`);}
const steps=['เป้าหมาย','คำศัพท์','ตัวอย่าง','ฟัง','พูด','อ่านและเขียน','ทดสอบ'];
function renderLesson(id){
 const l=lessons.find(x=>x.id===id)||lessons[0];if(state.currentLesson!==l.id){state.currentLesson=l.id;state.currentStep=0;state.cursorUpdatedAt=Date.now();save();}const s=Math.min(state.currentStep,6); const body=stepBody(l,s);
 shell(`<section class="lesson-shell"><button class="back" data-nav="lessons">← บทเรียนทั้งหมด</button><div class="lesson-top"><div class="progress-info"><span>บทที่ ${l.id} · ${steps[s]}</span><span>${s+1} / 7</span></div><div class="bar"><i style="width:${(s+1)/7*100}%"></i></div></div><article class="card step-card">${body}<div class="step-actions"><button class="btn secondary" id="prev" ${s===0?'disabled':''}>← ย้อนกลับ</button><button class="btn primary" id="next">${s===6?'จบบทเรียน':'ไปต่อ →'}</button></div></article></section>`);
 bindStep(l,s);
}

function stepBody(l,s){
 if(s===0)return `<p class="eyebrow">บทที่ ${l.id} · ${l.minutes} นาที</p><h2>${l.icon} ${l.title}</h2><p class="step-lead">${l.subtitle}</p><div class="goal-box"><strong>🎯 เมื่อจบบทนี้ คุณจะ…</strong><br>${l.goal}</div><div class="tip-box">💚 ไม่ต้องจำทุกอย่างในครั้งเดียว ฟังและลองใช้ก่อน แล้วเราจะพากลับมาทบทวนอีกครั้ง</div>`;
 if(s===1)return `<p class="eyebrow">คำศัพท์ใหม่</p><h2>มารู้จัก ${l.words.length} คำสำคัญ</h2><p class="step-lead">แตะปุ่มเสียงเพื่อฟัง ระบบใช้เสียงสังเคราะห์จากอุปกรณ์ของคุณ</p><div class="vocab-list">${l.words.map(w=>`<div class="word-row"><div><span class="word-en">${w[0]}</span><span class="word-th">${w[1]}</span>${state.showThaiSound?`<span class="thai-sound">เสียงประมาณ: ${w[2]}</span>`:''}</div><button class="sound-btn" data-speak="${w[0]}" aria-label="ฟังคำว่า ${w[0]}">▶</button></div>`).join('')}</div>`;
 if(s===2)return `<p class="eyebrow">ประโยคตัวอย่าง</p><h2>ดูคำในประโยคจริง</h2>${l.examples.map(e=>`<div class="example"><button class="sound-btn" data-speak="${e[0]}" aria-label="ฟังประโยค">▶</button> <strong>${e[0]}</strong><p>${e[1]}</p>${state.showThaiSound?`<p class="thai-sound">เสียงประมาณ: ${e[2]}</p>`:''}</div>`).join('')}<div class="tip-box"><strong>ทำไมจึงเรียงแบบนี้?</strong><br>${l.grammar}</div>`;
 if(s===3){const p=l.practice,sel=lessonSession.selected.listen;return `<p class="eyebrow">ฝึกฟัง</p><h2>ฟังก่อน แล้วค่อยเปิดข้อความ</h2><div class="audio-panel"><button class="btn primary" id="listen">▶ ฟังประโยค</button><button class="btn ghost" id="repeat">↻ ฟังซ้ำ</button><select class="speed" id="speed" aria-label="ความเร็วเสียง"><option value=".7">ช้า 0.7×</option><option selected value="1">ปกติ 1×</option><option value="1.2">เร็ว 1.2×</option></select><button class="btn secondary" id="reveal">${lessonSession.showTranscript?'ซ่อนข้อความ':'เปิดข้อความ'}</button></div><p class="question ${lessonSession.showTranscript?'':'hidden-text'}">${p.listen}</p><p class="question">ประโยคนี้หมายถึงอะไร?</p><div class="options">${p.choices.map((x,i)=>`<button class="option ${sel===i?(i===p.answer?'correct':'wrong'):''}" data-listen-choice="${i}">${x}</button>`).join('')}</div>${sel!==undefined?`<div class="feedback ${sel===p.answer?'':'wrong'}">${sel===p.answer?'ดีมาก! คุณจับใจความได้ถูกต้อง':'ยังไม่ใช่ แต่ไม่เป็นไรนะ ลองฟังอีกครั้ง คำตอบคือ “'+p.choices[p.answer]+'”'}</div>`:''}`;}
 if(s===4)return `<p class="eyebrow">ฝึกพูด</p><h2>ฟังแล้วพูดตาม</h2><p class="step-lead">ใช้วิธี shadowing: ฟังต้นแบบ แล้วเลียนจังหวะทีละส่วน</p><div class="audio-panel"><button class="btn primary" data-speak="${l.practice.listen}">▶ ฟังต้นแบบ</button><strong>${l.practice.listen}</strong></div><div class="record-panel"><button class="record-btn ${lessonSession.recording?'recording':''}" id="record" aria-label="${lessonSession.recording?'หยุดอัดเสียง':'เริ่มอัดเสียง'}">${lessonSession.recording?'■':'●'}</button><p>${lessonSession.recording?'กำลังอัด… กดอีกครั้งเพื่อหยุด':'กดเพื่ออัดเสียง ระบบจะขอไมโครโฟนเมื่อกดเท่านั้น'}</p><p class="muted-label">เว็บไม่อัปโหลดไฟล์เสียงที่อัด การแปลงเสียงเป็นข้อความอาจใช้บริการของเบราว์เซอร์</p>${lessonSession.audioUrl?`<audio controls src="${lessonSession.audioUrl}"></audio><button class="btn danger" id="deleteAudio">ลบเสียง</button>`:''}${lessonSession.recognitionText?`<div class="tip-box">ระบบได้ยิน: <b>${esc(lessonSession.recognitionText)}</b><br><small>ใช้เพื่อเทียบคำเท่านั้น ไม่ใช่คะแนนความถูกต้องของการออกเสียง</small></div>`:''}</div>`;
 if(s===5){const p=l.practice,readSel=lessonSession.selected.read;return `<p class="eyebrow">อ่านและเขียน</p><h2>อ่านเรื่องสั้น แล้วลองเขียน</h2><div class="example"><p>${p.read}</p></div><p class="question">${p.question}</p><div class="options">${p.readChoices.map((x,i)=>`<button class="option ${readSel===i?(i===p.readAnswer?'correct':'wrong'):''}" data-read-choice="${i}">${x}</button>`).join('')}</div><p class="question">เขียนต่อจากคำเริ่มต้น (ตอบได้หลายแบบ)</p><label for="writing">${p.write} …</label><input class="text-input" id="writing" placeholder="พิมพ์ประโยคภาษาอังกฤษ" value="${esc(lessonSession.selected.writing||'')}"><div id="writeFeedback"></div><button class="btn secondary" id="checkWrite">ตรวจโครงสร้างเบื้องต้น</button><div class="notice" style="margin-top:16px">แบบฝึกคำตอบอิสระตรวจได้เพียงโครงสร้างพื้นฐาน ยังไม่สามารถตัดสินความเป็นธรรมชาติหรือความถูกต้องได้ทุกแบบ</div>`;}
 const p=l.practice;return `<p class="eyebrow">ทดสอบท้ายบท</p><h2>เรียงคำให้เป็นประโยค</h2><p class="step-lead">แตะคำตามลำดับ คุณแก้ใหม่ได้เสมอ</p><div class="answer-line">${lessonSession.arranged.map((x,i)=>`<button class="word-chip" data-remove-word="${i}">${x}</button>`).join('')}</div><div class="word-bank">${p.arrange.map((x,i)=>lessonSession.arranged.includes(x)?'':`<button class="word-chip" data-word="${i}">${x}</button>`).join('')}</div><button class="btn secondary" id="checkArrange">ตรวจคำตอบ</button><div id="arrangeFeedback"></div><p class="question">เติมคำที่ได้ยิน</p><button class="sound-btn" data-speak="${p.fill[0]}${p.blank}${p.fill[1]}">▶</button> ${p.fill[0]} <input class="text-input" id="fill" value="${esc(lessonSession.selected.fillValue||'')}" style="width:150px;display:inline-block" aria-label="คำที่หายไป"> ${p.fill[1]}<button class="btn secondary" id="checkFill">ตรวจคำตอบ</button><div id="fillFeedback"></div>`;
}

let recorder, chunks=[];
function bindStep(l,s){
 document.querySelector('#prev').onclick=()=>{state.currentStep=Math.max(0,s-1);state.cursorUpdatedAt=Date.now();save();renderLesson(l.id);};
 document.querySelector('#next').onclick=()=>{ if(s===6)return completeLesson(l);state.currentStep=s+1;state.cursorUpdatedAt=Date.now();save();renderLesson(l.id);scrollTo(0,0);};
 if(s===3){const play=()=>speak(l.practice.listen,+document.querySelector('#speed').value);document.querySelector('#listen').onclick=play;document.querySelector('#repeat').onclick=play;document.querySelector('#reveal').onclick=()=>{lessonSession.showTranscript=!lessonSession.showTranscript;renderLesson(l.id)};document.querySelectorAll('[data-listen-choice]').forEach(b=>b.onclick=()=>{lessonSession.selected.listen=+b.dataset.listenChoice;if(+b.dataset.listenChoice!==l.practice.answer)addMistake(l.id,'ฟัง');else bump('ฟัง','listen:'+l.id);renderLesson(l.id);});}
 if(s===4){document.querySelector('#record').onclick=()=>toggleRecord(l);const del=document.querySelector('#deleteAudio');if(del)del.onclick=()=>{URL.revokeObjectURL(lessonSession.audioUrl);lessonSession.audioUrl=null;renderLesson(l.id);};}
 if(s===5){document.querySelectorAll('[data-read-choice]').forEach(b=>b.onclick=()=>{lessonSession.selected.read=+b.dataset.readChoice;if(+b.dataset.readChoice!==l.practice.readAnswer)addMistake(l.id,'อ่าน');else bump('อ่าน','read:'+l.id);renderLesson(l.id);});document.querySelector('#checkWrite').onclick=()=>checkWriting(l);}
 if(s===6){document.querySelector('#fill').oninput=e=>{lessonSession.selected.fillValue=e.target.value;lessonSession.selected.fillPassed=false;};document.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{lessonSession.selected.arrangePassed=false;lessonSession.arranged.push(l.practice.arrange[+b.dataset.word]);renderLesson(l.id)});document.querySelectorAll('[data-remove-word]').forEach(b=>b.onclick=()=>{lessonSession.selected.arrangePassed=false;lessonSession.arranged.splice(+b.dataset.removeWord,1);renderLesson(l.id)});document.querySelector('#checkArrange').onclick=()=>{const ok=lessonSession.arranged.join(' ')===l.practice.arranged;feedback('arrangeFeedback',ok,ok?'เรียงถูกแล้ว! ประธานมาก่อน ตามด้วยกริยาและข้อมูลเพิ่มเติม':'ลองดูอีกครั้งนะ ประโยคที่ถูกคือ “'+l.practice.arranged+'”');lessonSession.selected.arrangePassed=ok;if(ok)bump('เขียน','arrange:'+l.id);else addMistake(l.id,'เรียงคำ');};document.querySelector('#checkFill').onclick=()=>{const ok=document.querySelector('#fill').value.trim().toLowerCase()===l.practice.blank.toLowerCase();feedback('fillFeedback',ok,ok?'ถูกต้อง! คุณฟังคำสำคัญได้แล้ว':'คำที่ได้ยินคือ “'+l.practice.blank+'” ลองฟังและพูดตามอีกครั้งนะ');lessonSession.selected.fillPassed=ok;if(ok)bump('ฟัง','fill:'+l.id);else addMistake(l.id,'เติมคำ');};}
}
function feedback(id,ok,text){document.querySelector('#'+id).innerHTML=`<div class="feedback ${ok?'':'wrong'}">${text}</div>`;}
function addMistake(lesson,type){if(!state.mistakes.some(x=>x.lesson===lesson&&x.type===type))state.mistakes.push({lesson,type});save();}
function bump(type,award){if(!award||state.awards.includes(award))return;state.awards.push(award);state.skill[type]=Math.min(100,state.skill[type]+10);state.xp++;save();}
function checkWriting(l){const val=document.querySelector('#writing').value.trim();lessonSession.selected.writing=val;let msg,ok=false;if(!val){msg='ลองเติมประโยคสั้น ๆ ก่อนนะ';}else if(val.split(/\s+/).length<3){msg='ประโยคนี้ยังสั้นมาก ลองเพิ่มกริยาหรือข้อมูล เช่น “'+l.examples[0][0]+'”';}else{ok=true;msg='โครงสร้างเบื้องต้นดูดี! คำตอบอิสระมีได้หลายแบบ ลองอ่านออกเสียงอีกครั้ง';bump('เขียน','write:'+l.id);}feedback('writeFeedback',ok,msg);}
async function toggleRecord(l){
 if(lessonSession.recording){recorder?.stop();lessonSession.recording=false;return;}
 if(!navigator.mediaDevices?.getUserMedia){toast('เบราว์เซอร์นี้ไม่รองรับการอัดเสียง');return;}
 try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=()=>{lessonSession.audioUrl=URL.createObjectURL(new Blob(chunks,{type:recorder.mimeType}));stream.getTracks().forEach(t=>t.stop());bump('พูด','speak:'+l.id);renderLesson(l.id);};recorder.start();lessonSession.recording=true;startRecognition();renderLesson(l.id);}catch{toast('ไม่สามารถใช้ไมโครโฟนได้ คุณยังฟังและพูดตามได้โดยไม่อัดเสียง');}
}
function startRecognition(){const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return;const rec=new R();rec.lang='en-US';rec.interimResults=false;rec.onresult=e=>lessonSession.recognitionText=e.results[0][0].transcript;rec.onerror=()=>{};rec.start();}
function completeLesson(l){if(!lessonSession.selected.arrangePassed||!lessonSession.selected.fillPassed){toast('ตรวจคำตอบเรียงคำและเติมคำให้ถูกทั้งสองข้อก่อนจบบทนะ');return;}if(!state.completed.includes(l.id))state.completed.push(l.id);l.words.forEach(w=>{if(!state.learnedWords.some(x=>x[0]===w[0]))state.learnedWords.push(w)});state.mistakes=state.mistakes.filter(x=>x.lesson!==l.id);state.currentLesson=lessons.find(next=>!state.completed.includes(next.id))?.id||l.id;state.currentStep=0;state.cursorUpdatedAt=Date.now();save();shell(`<section class="lesson-shell"><article class="card step-card review-score"><div class="trophy">🎉</div><p class="eyebrow">จบบทที่ ${l.id} แล้ว</p><h2>เก่งมาก! วันนี้คุณทำได้อีกหนึ่งก้าว</h2><p class="step-lead">ไม่จำเป็นต้องสมบูรณ์แบบ ทุกครั้งที่กลับมาทบทวน คุณจะเข้าใจชัดขึ้น</p><ul class="summary-list"><li>✓ รู้จักคำศัพท์ใหม่ ${l.words.length} คำ</li><li>✓ ตรวจคำตอบเรียงคำท้ายบทแล้ว</li><li>✓ ตรวจคำตอบเติมคำท้ายบทแล้ว</li></ul><div class="actions" style="justify-content:center"><button class="btn secondary" data-nav="progress">ดูความก้าวหน้า</button>${l.id<lessons.length?`<button class="btn primary" data-lesson="${l.id+1}">ไปบทถัดไป →</button>`:`<button class="btn primary" data-nav="today">กลับหน้าวันนี้</button>`}</div></article></section>`);}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='english-with-yuri-data.json';a.click();URL.revokeObjectURL(a.href);}
function importData(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);state=mergeProgress(state,normalizeProgress(parsed));state.cursorUpdatedAt=Date.now();save();renderProgress();toast('นำเข้าข้อมูลสำเร็จ');}catch{toast('ไฟล์ข้อมูลไม่ถูกต้อง');}};reader.readAsText(file);}
async function resetData(){
 if(!confirm(user?'เริ่มความก้าวหน้าของบัญชีนี้ใหม่ทั้งในเครื่องและคลาวด์? สำรองข้อมูลก่อนถ้าต้องการเก็บของเดิม':'เริ่มความก้าวหน้าในเครื่องนี้ใหม่?'))return;
 const next=freshProgress();next.updatedAt=Date.now();next.cursorUpdatedAt=next.updatedAt;
 try{clearTimeout(syncTimer);if(syncing)await syncing;if(user){if(!cloudReady)throw new Error('offline');await auth.putProgress(user.id,next);}state=next;writeLocal();syncState=user?'saved':'local';renderProgress();toast('เริ่มความก้าวหน้าใหม่แล้ว');}
 catch{toast('รีเซ็ตยังไม่สำเร็จ ข้อมูลเดิมยังอยู่ กรุณาเชื่อมต่อและลองใหม่');}
}


window.addEventListener('hashchange',()=>{
 const hash=location.hash.slice(1)||'today';
 if(hash.includes('access_token=')||hash.includes('error='))return;
 page=hash;render();
});
window.addEventListener('online',()=>{if(user)retryCloud().catch(()=>{syncState='error';updateSyncLabel();});});
window.addEventListener('pagehide',()=>{clearTimeout(syncTimer);if(user&&cloudReady)syncCloud().catch(()=>{});});
render();
async function initializeAccount(){
 const hash=location.hash;
 const params=new URLSearchParams(hash.replace(/^#/,''));
 const callback=params.has('access_token')||params.has('error');
 if(callback)history.replaceState(null,'',location.pathname+location.search+'#account');
 authBusy=true;
 try{
   const config=await loadAuthConfig();
   auth=createAuthClient({...config,redirectUrl:location.origin+location.pathname});
   if(auth.configured){
     const restored=await auth.restore(hash);recoveryMode=restored.recovery;
     if(restored.user)await adoptUser(restored.user);
   }
 }catch(error){syncState=user?'error':'local';if(callback)toast(error.code==='access_denied'?authError(error):'ลิงก์นี้ใช้ไม่ได้หรือเชื่อมต่อไม่สำเร็จ กรุณาลองเข้าสู่ระบบใหม่');}
 finally{authBusy=false;render();}
}
initializeAccount();
