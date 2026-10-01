const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALES = ['', 'thousand', 'million', 'billion', 'trillion'];
function groupWords(value) {
 const parts=[];
 if(value>=100){parts.push(ONES[Math.floor(value/100)]+' hundred');value%=100;}
 if(value>=20)parts.push(TENS[Math.floor(value/10)]+(value%10?'-'+ONES[value%10]:''));
 else if(value>0)parts.push(ONES[value]);
 return parts.join(' ');
}
function integerWords(digits){
 if(digits==='0')return 'zero';
 const parts=[];
 for(let end=digits.length,scale=0;end>0;end-=3,scale++){
  // Only convert groups of at most three digits; the full number stays exact.
  const value=Number(digits.slice(Math.max(0,end-3),end));
  if(value)parts.unshift(groupWords(value)+(SCALES[scale]?' '+SCALES[scale]:''));
 }
 return parts.join(' ');
}
// US English without optional "and"; 15 integer digits and 6 decimal places.
export function readNumber(input){
 if(typeof input!=='string')return {ok:false,code:'type',error:'พิมพ์ตัวเลขในช่อง เช่น 167 หรือ 21,425'};
 const text=input.trim();
 if(!text)return {ok:false,code:'empty',error:'ลองพิมพ์ตัวเลข เช่น 167 หรือ 21,425'};
 const match=/^(-?)(\d+|[1-9]\d{0,2}(?:,\d{3})+)(?:\.(\d+))?$/.exec(text);
 if(!match)return {ok:false,code:'format',error:'ใช้ตัวเลข 0–9 เช่น 167, 21,425 หรือ 0.5 โดยใส่จุลภาคคั่นทุก 3 หลัก'};
 const integer=match[2].replaceAll(',','').replace(/^0+(?=\d)/,''),fraction=match[3]??'';
 if(integer.length>15)return {ok:false,code:'range',error:'รองรับจำนวนเต็มได้ถึง 999,999,999,999,999 (15 หลัก)'};
 if(fraction.length>6)return {ok:false,code:'precision',error:'รองรับทศนิยมไม่เกิน 6 ตำแหน่ง เช่น 0.123456'};
 const negative=match[1]==='-'&&(integer!=='0'||/[1-9]/.test(fraction));
 const formatted=(negative?'-':'')+integer.replace(/\B(?=(\d{3})+(?!\d))/g,',')+(fraction?'.'+fraction:'');
 const english=(negative?'minus ':'')+integerWords(integer)+(fraction?' point '+[...fraction].map(d=>ONES[Number(d)]).join(' '):'');
 return {ok:true,formatted,english,integer,fraction,negative};
}

const NUMBER_SOUNDS = Object.freeze({
 zero:'ซี-โร',one:'วัน',two:'ทู',three:'ธรี',four:'ฟอร์',five:'ไฟฟ์',six:'ซิคซ์',seven:'เซฟ-เวิน',eight:'เอท',nine:'ไนน์',ten:'เทน',
 eleven:'อิ-เลฟ-เวิน',twelve:'ทเวลฟ์',thirteen:'เธอร์-ทีน',fourteen:'ฟอร์-ทีน',fifteen:'ฟิฟ-ทีน',sixteen:'ซิคซ์-ทีน',seventeen:'เซฟ-เวิน-ทีน',eighteen:'เอ-ทีน',nineteen:'ไนน์-ทีน',
 twenty:'ทเวน-ที',thirty:'เธอร์-ที',forty:'ฟอร์-ที',fifty:'ฟิฟ-ที',sixty:'ซิคซ์-ที',seventy:'เซฟ-เวิน-ที',eighty:'เอ-ที',ninety:'ไนน์-ที',
 hundred:'ฮัน-เดร็ด',thousand:'เธา-เซินด์',million:'มิล-เลียน',billion:'บิล-เลียน',trillion:'ทริล-เลียน',point:'พอยนท์',minus:'ไม-นัส'
});
// Approximate Thai aid; do not echo unknown words or invent a partial reading.
export function numberPronunciation(english){
 if(typeof english!=='string'||!english.trim())return '';
 const words=english.trim().toLowerCase().split(/[\s-]+/);
 if(!words.every(word=>Object.hasOwn(NUMBER_SOUNDS,word)))return '';
 return words.map(word=>NUMBER_SOUNDS[word]).join(' ');
}
