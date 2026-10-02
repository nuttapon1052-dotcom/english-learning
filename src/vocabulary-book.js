// Pure book structure: categories and words are the only source of chapters and folios.
// New categories require no reader, pagination or contents changes.
export function createBookCatalogue(categories,words){
 const pages=[],chapters=[];
 for(const category of categories){
  const chapterWords=words.filter(word=>word.category===category.id);
  if(!chapterWords.length)continue;
  const firstPage=pages.length+1;
  chapterWords.forEach(word=>pages.push({id:word.id,word,category,folio:pages.length+1}));
  chapters.push({...category,count:chapterWords.length,firstPage,lastPage:pages.length});
 }
 return {pages,chapters};
}
export function getBookSpread(pages,position=0,visiblePages=2){
 const size=visiblePages===1?1:2;
 const bounded=Math.min(Math.max(0,Math.trunc(Number(position))||0),Math.max(0,pages.length-1));
 const index=Math.floor(bounded/size)*size;
 return {index,pages:pages.slice(index,index+size),size,total:Math.ceil(pages.length/size),number:pages.length?Math.floor(index/size)+1:0,hasPrevious:index>0,hasNext:index+size<pages.length};
}
export function findBookPages(catalogue,words){
 const ids=new Set(words.map(word=>word.id));
 return catalogue.pages.filter(page=>ids.has(page.id));
}
