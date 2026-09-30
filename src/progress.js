import { lessons } from './lessons.js';

export const STORAGE_KEY = 'english-with-yuri-v1';
export const skillNames = ['ฟัง', 'พูด', 'อ่าน', 'เขียน'];
const ids = new Set(lessons.map(l => l.id));
const catalog = new Map(lessons.map(l=>[l.id,l]));
const mistakeTypes = ['ฟัง','อ่าน','เรียงคำ','เติมคำ'];
const integer = (value, min, max, fallback = min) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Math.trunc(Number(value)))) : fallback;

export function freshProgress() {
  return { completed: [], currentLesson: 1, currentStep: 0, minutes: 15, xp: 0,
    mistakes: [], learnedWords: [], skill: Object.fromEntries(skillNames.map(k => [k, 0])),
    showThaiSound: false, assessment: null, awards: [], activity: [],
    updatedAt: 0, cursorUpdatedAt: 0, resetAt: 0, lessonDrafts: {}, mistakeEvents: {} };
}
export function normalizeProgress(input) {
  const base = freshProgress();
  if (!input || typeof input !== 'object' || Array.isArray(input)) return base;
  base.completed = [...new Set((Array.isArray(input.completed) ? input.completed : []).filter(id => ids.has(id)))].sort((a,b)=>a-b);
  base.currentLesson = ids.has(input.currentLesson) ? input.currentLesson : 1;
  base.currentStep = integer(input.currentStep, 0, 6);
  base.minutes = [15,30,60].includes(input.minutes) ? input.minutes : 15;
  base.xp = integer(input.xp, 0, 100000);
  for (const key of skillNames) base.skill[key] = integer(input.skill?.[key], 0, 100);
  base.showThaiSound = input.showThaiSound === true;
  base.assessment = input.assessment === null || input.assessment === undefined ? null : integer(input.assessment, 0, 3);
  const events = input.mistakeEvents && typeof input.mistakeEvents==='object' ? input.mistakeEvents : {};
  for(const [key,value] of Object.entries(events)) {
    const [lesson,type]=key.split(':');
    if(!ids.has(Number(lesson)) || !mistakeTypes.includes(type) || !value)continue;
    base.mistakeEvents[key]={wrongAt:integer(value.wrongAt,0,Number.MAX_SAFE_INTEGER),clearedAt:integer(value.clearedAt,0,Number.MAX_SAFE_INTEGER)};
  }
  for(const item of Array.isArray(input.mistakes)?input.mistakes:[]) {
    if(!item || !ids.has(item.lesson) || !mistakeTypes.includes(item.type))continue;
    const key=item.lesson+':'+item.type;
    if(!base.mistakeEvents[key])base.mistakeEvents[key]={wrongAt:Math.max(1,integer(input.updatedAt,0,Number.MAX_SAFE_INTEGER)),clearedAt:0};
  }
  base.mistakes=Object.entries(base.mistakeEvents).filter(([,e])=>e.wrongAt>e.clearedAt).map(([key])=>{const [lesson,type]=key.split(':');return {lesson:Number(lesson),type};});
  const words = new Map();
  // Rebuild from the trusted catalog, never render imported HTML as lesson content.
  for (const l of lessons.filter(l => base.completed.includes(l.id))) for (const word of l.words) words.set(word[0], word);
  const known = new Map(lessons.flatMap(l=>l.words).map(w=>[w[0],w]));
  for (const w of Array.isArray(input.learnedWords) ? input.learnedWords : []) if (Array.isArray(w) && known.has(w[0])) words.set(w[0], known.get(w[0]));
  base.learnedWords = [...words.values()];
  base.awards = [...new Set((Array.isArray(input.awards) ? input.awards : []).filter(x=>typeof x==='string' && /^(listen|read|arrange|fill|write|speak):[0-9]{1,2}$/.test(x) && ids.has(Number(x.split(':')[1]))))];
  base.activity = [...new Set((Array.isArray(input.activity) ? input.activity : []).filter(x=>typeof x==='string' && /^\d{4}-\d{2}-\d{2}$/.test(x)))].sort().slice(-365);
  base.xp = Math.max(base.xp,base.awards.length);
  const awardSkills={listen:'ฟัง',fill:'ฟัง',read:'อ่าน',speak:'พูด',arrange:'เขียน',write:'เขียน'};
  for(const key of skillNames)base.skill[key]=Math.max(base.skill[key],Math.min(100,base.awards.filter(a=>awardSkills[a.split(':')[0]]===key).length*10));
  for(const [key,draft] of Object.entries(input.lessonDrafts && typeof input.lessonDrafts==='object'?input.lessonDrafts:{})){
    const l=catalog.get(Number(key));if(!l || !draft || typeof draft!=='object')continue;
    const p=l.practice,bank=[...p.arrange],arranged=[];
    for(const word of Array.isArray(draft.arranged)?draft.arranged:[]){
      const index=bank.indexOf(word);if(index>=0){arranged.push(word);bank.splice(index,1);}
    }
    const fillValue=typeof draft.fillValue==='string'?draft.fillValue.slice(0,80):'';
    base.lessonDrafts[key]={
      arranged,fillValue,writing:typeof draft.writing==='string'?draft.writing.slice(0,500):'',
      listen:Number.isInteger(draft.listen)&&draft.listen>=0&&draft.listen<p.choices.length?draft.listen:null,
      read:Number.isInteger(draft.read)&&draft.read>=0&&draft.read<p.readChoices.length?draft.read:null,
      arrangeChecked:draft.arrangeChecked===true&&arranged.join(' ')===p.arranged,
      fillChecked:draft.fillChecked===true&&fillValue.trim().toLowerCase()===p.blank.toLowerCase(),
      updatedAt:integer(draft.updatedAt,0,Number.MAX_SAFE_INTEGER)
    };
  }
  base.resetAt = integer(input.resetAt,0,Number.MAX_SAFE_INTEGER);
  base.updatedAt = integer(input.updatedAt, 0, Number.MAX_SAFE_INTEGER);
  base.cursorUpdatedAt = integer(input.cursorUpdatedAt, 0, Number.MAX_SAFE_INTEGER);
  return base;
}
export function mergeProgress(local, remote) {
  const a = normalizeProgress(local), b = normalizeProgress(remote);
  // A deliberate reset must not be undone by another device's old cache.
  if(a.resetAt!==b.resetAt)return a.resetAt>b.resetAt?a:b;
  const latest = a.updatedAt >= b.updatedAt ? a : b;
  const lessonDrafts={};
  for(const key of new Set([...Object.keys(a.lessonDrafts),...Object.keys(b.lessonDrafts)])){
    const x=a.lessonDrafts[key],y=b.lessonDrafts[key];
    lessonDrafts[key]=!x?y:!y?x:x.updatedAt>=y.updatedAt?x:y;
  }
  const mistakeEvents={};
  for(const key of new Set([...Object.keys(a.mistakeEvents),...Object.keys(b.mistakeEvents)])){
    const x=a.mistakeEvents[key]||{},y=b.mistakeEvents[key]||{};
    mistakeEvents[key]={wrongAt:Math.max(x.wrongAt||0,y.wrongAt||0),clearedAt:Math.max(x.clearedAt||0,y.clearedAt||0)};
  }
  const cursor = a.cursorUpdatedAt >= b.cursorUpdatedAt ? a : b;
  return normalizeProgress({
    ...latest, lessonDrafts, mistakeEvents, mistakes:[], currentLesson: cursor.currentLesson, currentStep: cursor.currentStep,
    cursorUpdatedAt: cursor.cursorUpdatedAt, updatedAt: Math.max(a.updatedAt,b.updatedAt),
    completed: [...a.completed,...b.completed],
    learnedWords: [...a.learnedWords,...b.learnedWords],
    awards: [...a.awards,...b.awards], activity: [...a.activity,...b.activity],
    xp: Math.max(a.xp,b.xp),
    skill: Object.fromEntries(skillNames.map(k=>[k,Math.max(a.skill[k],b.skill[k])]))
  });
}
// Explicit imports cross storage namespaces; their reset history must not
// replace the target account's progress or revive it through automatic sync.
export function importProgress(current,imported){
 const target=normalizeProgress(current);
 return mergeProgress(target,{...normalizeProgress(imported),resetAt:target.resetAt});
}
export function accountKey(userId) { return userId ? STORAGE_KEY + ':' + userId : STORAGE_KEY; }
export function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
