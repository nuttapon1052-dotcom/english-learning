# AI vocabulary illustrations and number reader

## Artwork
Nine original AI-generated PNG atlases cover 140 words: 16 fruit, 20 animals, 24 everyday objects, 16 vegetables, 12 colors, 16 clothing items, 12 vehicles, 12 places, and 12 body terms.
Created with the image generation tool on 2026-10-01 and 2026-10-02. No external image hosts or runtime image API.
The owner requested generated illustrations in place of the repeated category symbols.
Visually inspected all cells against the explicit ID mapping in src/vocabulary-art.js:
- fruit.png: 4 columns × 4 rows (apple through pear).
- animals.png: 4 columns × 5 rows (cat through butterfly).
- objects.png: 4 columns × 6 rows (book through glasses).
- vegetables.png: 4 columns × 4 rows (carrot through chili pepper).
- colors.png: 4 columns × 3 rows (red through gold).
- clothing.png: 4 columns × 4 rows (T-shirt through boots).
- transport.png: 4 columns × 3 rows (car through scooter).
- places.png: 4 columns × 3 rows (school through pharmacy).
- body.png: 4 columns × 3 rows (head through finger).

The UI displays individual cells with fixed square cropping, lazy loading and async decoding.
Category cards show a preview; each vocabulary card has its own image and an accessible Thai label.
Image files are shared across cards and cached by the browser. Each atlas is loaded only when its category preview or cards are visible.
Lesson IDs, vocabulary IDs and review progress remain unchanged.

## Number reader
Available in the vocabulary library; expands automatically when Numbers is selected.
Type plain digits or correctly grouped thousands commas. Results update immediately, with:
- formatted numeral;
- US English words without optional “and”;
- approximate Thai pronunciation;
- an explicit speech button using the existing device speech service.

Examples: 167 → one hundred sixty-seven; 21,425 → twenty-one thousand four hundred twenty-five.
Supports an integer part of up to 15 digits, a leading minus, and up to 6 decimal places.
Fractional zeros are preserved and read digit by digit. No full-number floating-point conversion.
Rejects malformed commas, exponent notation, non-digits and out-of-range input; disables playback for invalid values.
The note explains the optional British “and”; Thai text is a reading aid rather than a phonetic transcription.
Typed numbers are temporary tools, not added to lesson progress or review scores.

## Verification
Node tests: exact numeric fixtures, grouping, precision bounds, signs, decimals, Thai-token coverage and invalid values.
Artwork tests: all 140 mappings, unique valid cells and PNG dimensions/aspect ratios.
Playwright: input and speech text, error handling, layout at 320/1440px, all images decoded and CSS crop geometry.
Existing lesson, vocabulary, account and synchronization tests remain enabled.
