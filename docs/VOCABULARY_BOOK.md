# Vocabulary picture book

The foundation vocabulary view opens to a cover and contents spread. A desktop spread holds two words, one on each physical page; screens up to 900px show one page. The reader supports chapter jumps, printed folios, a page selector, arrows, scoped keyboard shortcuts, and horizontal touch gestures. Search and the unreviewed filter produce a smaller readable book while preserving each word's printed folio.

## Structure

- src/basic-vocabulary.js is the source of categories and word content.
- src/vocabulary-book.js builds the chapter catalogue, printed folios, filtered pages, and bounded one/two-page spreads. It has no browser state or fixed category count.
- src/vocabulary-library.js owns the reader view, contents, search, pagination, audio, review actions, and existing quizzes/number reader.
- src/vocabulary-art.js maps optional illustrations to stable word IDs.
- Book CSS is scoped to .vocabulary-book; lesson pages use their existing view.

## Adding a category

1. Add a category object with a unique id, title, en, icon, color, tip and rows in src/basic-vocabulary.js. Each row is English, Thai meaning, approximate pronunciation, English example, Thai example translation, and an optional printed symbol.
2. Keep published category IDs and English words stable because they form review IDs. Reorder chapters without changing those IDs if needed.
3. Add reviewed AI artwork and mappings in src/vocabulary-art.js, plus a category preview. A category without artwork displays its symbol or SVG icon.
4. Run npm test, npm run build, and browser tests.

Contents entries, category counts, page numbers, chapter navigation, search, and page selectors come from the catalogue. No new reader condition, layout branch, SQL change or fixed page limit is required. Empty categories are omitted until they have words.

## Page turns and accessibility

The target spread is rendered as the real accessible content. A temporary inert, aria-hidden overlay clones the outgoing sheet and the incoming reverse face. A Web Animations rotation moves the sheet around the spine, with backface visibility and paper shadows. All IDs and data attributes are removed from decorative copies. Controls are locked during a turn to prevent overlapping navigation; search, resize and leaving the view safely remove/cancel the visual layer. Readers with prefers-reduced-motion see an immediate page change.

Arrow shortcuts are scoped to the focused book region and do not intercept text inputs, page selectors or buttons. Horizontal gestures exclude interactive controls and preserve vertical scrolling. Audio uses the existing device speech service.

## Progress

Only reviewed vocabulary IDs are persisted and synchronized through the existing account progress service. Printed page numbers and the current reader position are presentation state. Quizzes still use the whole selected chapter or search result, up to 10 questions, regardless of which spread is visible.

## Verification

Pure tests cover future categories, empty chapters, stable word IDs, odd final pages, one/two-page traversal and original folios in filtered results. Browser tests cover contents, real 3D rotations, forward/backward turns, boundaries, chapter continuation, keyboard, touch, interrupted animation, resize, reduced motion, search, every artwork cell, numbers, and review synchronization between two devices and another account.
