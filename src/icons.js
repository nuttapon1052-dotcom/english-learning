// Original 24 × 24 outline icons. Decorative SVGs inherit the control's accessible label.
const paths = {
 "bookmark": '<path d="M6 3h12v19l-6-4-6 4Z"/><path d="M9 7h6"/>',
 "chevron-left": '<path d="m15 5-7 7 7 7"/>',
 "chevron-right": '<path d="m9 5 7 7-7 7"/>',
 "contents": '<path d="M8 5h13M8 12h13M8 19h13"/><circle cx="3" cy="5" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="19" r="1"/>',

 "fruit": '<path d="M12 7c-5-4-10 0-9 6 1 6 5 9 9 7 4 2 8-1 9-7 1-6-4-10-9-6Z"/><path d="M12 7c0-4 2-5 5-5 0 3-2 5-5 5Zm0 0L9 3"/>',
 "paw": '<ellipse cx="6" cy="8" rx="2" ry="3"/><ellipse cx="11" cy="5" rx="2" ry="3"/><ellipse cx="17" cy="7" rx="2" ry="3"/><path d="M6 17c0-3 3-6 6-6s6 3 6 6c0 4-4 2-6 2s-6 2-6-2Z"/><ellipse cx="21" cy="12" rx="1.5" ry="2.5"/>',
 "numbers": '<path d="m5 5 2-2v8M4 11h6m4-6c0-3 6-3 6 0 0 2-6 4-6 6h6M4 17h5m-5 4h5m7-7v8m-4-4h8"/>',
 "objects": '<rect x="3" y="12" width="8" height="9" rx="1"/><path d="M7 12V6a3 3 0 0 1 6 0v1m2 4h6v10h-6Zm0 4h6M5 16h4"/>',
  "home": "<path d=\"m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z\"/>",
  "book": "<path d=\"M12 5v16M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z\"/>",
  "target": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"1\"/>",
  "cards": "<rect x=\"7\" y=\"3\" width=\"13\" height=\"16\" rx=\"3\"/><path d=\"M4 7v12a3 3 0 0 0 3 3h9M11 8h5m-5 4h3\"/>",
  "chart": "<path d=\"M4 3v17h17M8 15l4-5 4 2 5-7M17 5h4v4\"/>",
  "sprout": "<path d=\"M12 21V11M12 14C4 14 3 9 3 4c6 0 9 3 9 10Zm0-3c0-6 4-8 9-8 0 5-3 8-9 8Z\"/>",
  "cup": "<path d=\"M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5ZM17 9h2a3 3 0 0 1 0 6h-2M7 3v2m5-2v2M3 23h16\"/>",
  "compass": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m16 8-2 6-6 2 2-6Z\"/>",
  "chat": "<path d=\"M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6 4V6a2 2 0 0 1 2-2ZM7 9h10M7 13h6\"/>",
  "bag": "<rect x=\"4\" y=\"7\" width=\"16\" height=\"14\" rx=\"3\"/><path d=\"M9 7V5a3 3 0 0 1 6 0v2M8 7v14m8-14v14\"/>",
  "spark": "<path d=\"m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4\"/>",
  "key": "<circle cx=\"8\" cy=\"8\" r=\"5\"/><path d=\"m12 12 9 9m-6-6 3-3m0 6 3-3\"/>",
  "route": "<circle cx=\"5\" cy=\"5\" r=\"2\"/><circle cx=\"19\" cy=\"19\" r=\"2\"/><path d=\"M7 5h9a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h9\"/>",
  "headphones": "<path d=\"M4 14v-3a8 8 0 0 1 16 0v3\"/><rect x=\"3\" y=\"12\" width=\"5\" height=\"9\" rx=\"2\"/><rect x=\"16\" y=\"12\" width=\"5\" height=\"9\" rx=\"2\"/>",
  "mic": "<rect x=\"9\" y=\"2\" width=\"6\" height=\"13\" rx=\"3\"/><path d=\"M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8\"/>",
  "pen": "<path d=\"m15 3 6 6L9 21H3v-6ZM12 6l6 6M3 15l6 6\"/>",
  "arrow": "<path d=\"M4 12h16m-6-6 6 6-6 6\"/>",
  "check": "<path d=\"m5 12 4 4L19 6\"/>",
  "clock": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>",
  "search": "<circle cx=\"10\" cy=\"10\" r=\"7\"/><path d=\"m15 15 6 6\"/>",
  "volume": "<path d=\"M4 9h4l5-4v14l-5-4H4ZM17 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14\"/>",
  "calendar": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M7 2v6m10-6v6M3 11h18m-13 4h2m4 0h2m-8 3h2\"/>",
  "shield": "<path d=\"m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6ZM8 12l3 3 5-6\"/>",
  "globe": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><ellipse cx=\"12\" cy=\"12\" rx=\"4\" ry=\"9\"/><path d=\"M3 12h18\"/>",
  "basket": "<path d=\"M3 9h18l-2 12H5ZM7 9l5-7 5 7M9 13v4m6-4v4\"/>",
  "activity": "<path d=\"M2 12h5l3-8 4 16 3-8h5\"/>",
  "user": "<circle cx=\"12\" cy=\"7\" r=\"4\"/><path d=\"M4 22v-2a8 8 0 0 1 16 0v2\"/>",
  "trophy": "<path d=\"M7 3h10v7a5 5 0 0 1-10 0ZM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4M12 15v6m-5 0h10\"/>"
};
export function icon(name) {
 return '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+(paths[name] || paths.book)+'</svg>';
}
const lessonSymbols = ["chat","user","bag","clock","cup","spark","target","route","chat","chat","basket","compass","cup","calendar","globe","shield","clock","calendar","cards","bag","pen","chat","mic","trophy","key","home","activity","basket","calendar","shield","globe","route"];
export const lessonIcon = id => icon(lessonSymbols[id-1]);
