import { lessons } from './lessons.js';

export const STORAGE_KEY = 'english-with-yuri-v1';
export const skillNames = ['ฟัง', 'พูด', 'อ่าน', 'เขียน'];
const ids = new Set(lessons.map(l => l.id));
const integer = (value, min, max, fallback = min) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Math.trunc(Number(value)))) : fallback;

export function freshProgress() {
  return { completed: [], currentLesson: 1, currentStep: 0, minutes: 15, xp: 0,
    mistakes: [], learnedWords: [], skill: Object.fromEntries(skillNames.map(k => [k, 0])),
    showThaiSound: false, assessment: null, awards: [], activity: [],
    updatedAt: 0, cursorUpdatedAt: 0 };
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
  base.mistakes = (Array.isArray(input.mistakes) ? input.mistakes : []).filter(x => x && ids.has(x.lesson) && ['ฟัง','อ่าน','เรียงคำ','เติมคำ'].includes(x.type)).slice(0, 200).map(x=>({lesson:x.lesson,type:x.type}));
  const words = new Map();
  // Rebuild from the trusted catalog, never render imported HTML as lesson content.
  for (const l of lessons.filter(l => base.completed.includes(l.id))) for (const word of l.words) words.set(word[0], word);
  const known = new Map(lessons.flatMap(l=>l.words).map(w=>[w[0],w]));
  for (const w of Array.isArray(input.learnedWords) ? input.learnedWords : []) if (Array.isArray(w) && known.has(w[0])) words.set(w[0], known.get(w[0]));
  base.learnedWords = [...words.values()];
  base.awards = [...new Set((Array.isArray(input.awards) ? input.awards : []).filter(x=>typeof x==='string' && /^(listen|read|arrange|fill|write|speak):[0-9]{1,2}$/.test(x) && ids.has(Number(x.split(':')[1]))))];
  base.activity = [...new Set((Array.isArray(input.activity) ? input.activity : []).filter(x=>typeof x==='string' && /^\d{4}-\d{2}-\d{2}$/.test(x)))].sort().slice(-365);
  base.updatedAt = integer(input.updatedAt, 0, Number.MAX_SAFE_INTEGER);
  base.cursorUpdatedAt = integer(input.cursorUpdatedAt, 0, Number.MAX_SAFE_INTEGER);
  return base;
}
export function mergeProgress(local, remote) {
  const a = normalizeProgress(local), b = normalizeProgress(remote);
  const latest = a.updatedAt >= b.updatedAt ? a : b;
  const cursor = a.cursorUpdatedAt >= b.cursorUpdatedAt ? a : b;
  return normalizeProgress({
    ...latest, currentLesson: cursor.currentLesson, currentStep: cursor.currentStep,
    cursorUpdatedAt: cursor.cursorUpdatedAt, updatedAt: Math.max(a.updatedAt,b.updatedAt),
    completed: [...a.completed,...b.completed],
    learnedWords: [...a.learnedWords,...b.learnedWords],
    awards: [...a.awards,...b.awards], activity: [...a.activity,...b.activity],
    xp: Math.max(a.xp,b.xp),
    skill: Object.fromEntries(skillNames.map(k=>[k,Math.max(a.skill[k],b.skill[k])]))
  });
}
export function accountKey(userId) { return userId ? STORAGE_KEY + ':' + userId : STORAGE_KEY; }
export function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
