import test from 'node:test';
import assert from 'node:assert/strict';
import {readNumber,numberPronunciation} from '../src/number-reader.js';
test('reads requested examples exactly with optional thousands commas',()=>{
 assert.deepEqual(readNumber('167'),{ok:true,formatted:'167',english:'one hundred sixty-seven',integer:'167',fraction:'',negative:false});
 assert.equal(readNumber('21,425').english,'twenty-one thousand four hundred twenty-five');
 assert.equal(readNumber('21425').formatted,'21,425');
});
test('spells zero, teens and irregular tens correctly',()=>{
 const examples=[['0','zero'],['7','seven'],['10','ten'],['11','eleven'],['12','twelve'],['13','thirteen'],['14','fourteen'],['15','fifteen'],['16','sixteen'],['17','seventeen'],['18','eighteen'],['19','nineteen'],['20','twenty'],['21','twenty-one'],['30','thirty'],['40','forty'],['50','fifty'],['60','sixty'],['70','seventy'],['80','eighty'],['90','ninety'],['99','ninety-nine']];
 for(const [input,expected] of examples)assert.equal(readNumber(input).english,expected,input);
});
test('reads hundreds and skips empty scale groups',()=>{
 const examples=[['100','one hundred'],['101','one hundred one'],['110','one hundred ten'],['999','nine hundred ninety-nine'],['1000','one thousand'],['1001','one thousand one'],['1010','one thousand ten'],['1100','one thousand one hundred'],['1,000,000','one million'],['1,000,001','one million one'],['1,001,000','one million one thousand'],['1,000,000,000','one billion'],['1,000,001,001','one billion one thousand one'],['1,000,000,000,000','one trillion'],['12,345,678','twelve million three hundred forty-five thousand six hundred seventy-eight']];
 for(const [input,expected] of examples)assert.equal(readNumber(input).english,expected,input);
});
test('preserves exact digits at maximum magnitude without rounding',()=>{
 const max=readNumber('999999999999999.123456');
 assert.equal(max.ok,true);assert.equal(max.formatted,'999,999,999,999,999.123456');
 assert.equal(max.english,'nine hundred ninety-nine trillion nine hundred ninety-nine billion nine hundred ninety-nine million nine hundred ninety-nine thousand nine hundred ninety-nine point one two three four five six');
 for(const input of ['1000000000000000','-1,000,000,000,000,000','999999999999999999999999999999'])assert.equal(readNumber(input).code,'range');
});
test('reads negatives and decimal digits including trailing zeros',()=>{
 const examples=[['-167','-167','minus one hundred sixty-seven'],['-21,425','-21,425','minus twenty-one thousand four hundred twenty-five'],['0.5','0.5','zero point five'],['12.05','12.05','twelve point zero five'],['1.2300','1.2300','one point two three zero zero'],['-0.001','-0.001','minus zero point zero zero one'],['0.123456','0.123456','zero point one two three four five six'],['-0','0','zero'],['-0.000','0.000','zero point zero zero zero']];
 for(const [input,formatted,english] of examples){const result=readNumber(input);assert.equal(result.formatted,formatted,input);assert.equal(result.english,english,input);}
});
test('trims outer whitespace and normalizes plain leading zeros',()=>{
 assert.equal(readNumber('  21,425  ').formatted,'21,425');assert.equal(readNumber('000167').english,'one hundred sixty-seven');
 assert.equal(readNumber('0000').formatted,'0');assert.equal(readNumber('00012.050').formatted,'12.050');assert.equal(readNumber('000000000000000000000001').english,'one');
});
test('rejects malformed grouping and unsupported input with Thai guidance',()=>{
 for(const input of ['21,42','1,23,456','1234,567','1,,000',',123','123,','0,123','01,234','1,000.2,3','1 000','1_000','1e3','NaN','Infinity','+12','--12','12-','.5','1.','1.2.3','one','๑๒','<img src=x onerror=alert(1)>']){
  const result=readNumber(input);assert.equal(result.ok,false,input);assert.equal(result.code,'format',input);assert.match(result.error,/ตัวเลข/,input);assert.equal(result.english,undefined,input);
 }
 assert.equal(readNumber('0.1234567').code,'precision');assert.equal(readNumber('1.0000000').code,'precision');
});
test('handles empty and non-text values without coercion',()=>{
 for(const input of ['', '   ', '\n\t'])assert.equal(readNumber(input).code,'empty');
 for(const input of [undefined,null,167,NaN,{},[],true])assert.equal(readNumber(input).code,'type');
});

test('Thai reading supports the requested examples and decimal signs',()=>{
 assert.equal(numberPronunciation(readNumber('167').english),'วัน ฮัน-เดร็ด ซิคซ์-ที เซฟ-เวิน');
 assert.equal(numberPronunciation(readNumber('21,425').english),'ทเวน-ที วัน เธา-เซินด์ ฟอร์ ฮัน-เดร็ด ทเวน-ที ไฟฟ์');
 assert.equal(numberPronunciation(readNumber('-0.05').english),'ไม-นัส ซี-โร พอยนท์ ซี-โร ไฟฟ์');
 assert.equal(numberPronunciation('  FORTY-two  '),'ฟอร์-ที ทู');
});
test('Thai aid covers every emitted word and rejects unknown text',()=>{
 const inputs=[...Array.from({length:100},(_,i)=>String(i)),'100','1000','1000000','1000000000','1000000000000','-0.123456'];
 for(const input of inputs){const result=readNumber(input);assert.equal(result.ok,true);assert.ok(numberPronunciation(result.english),input);}
 for(const text of ['', '  ',null,undefined,167,'one banana','<img src=x>','constructor','toString','__proto__'])assert.equal(numberPronunciation(text),'',String(text));
});
