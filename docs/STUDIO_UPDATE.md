# Learning studio · 2026-10-01

## Content review and additions

Reviewed all 24 existing lessons against their goals, grammar, examples, listening/read keys and fill/arrange exercises. The earlier am/is/are repair remains intact. Added a specific incorrect/correct contrast, a Thai explanation and a personal speaking/writing task to every lesson. Renamed lesson 24 from “final mission” to “real-life communication mission” because the course now continues.

The catalog now contains **32 lessons, 8 paths and 192 distinct vocabulary entries**. Lesson IDs 1–24 remain stable; no database migration or progress reset is required.

| New lesson | Teaching focus | Important distinction |
|---|---|---|
| 25 | Possession | my + noun versus mine; your versus you're |
| 26 | There is/are and place | singular/uncountable versus plural; in/on/under |
| 27 | Present continuous | be + -ing versus simple present habits; spelling exceptions |
| 28 | Quantity | countable/uncountable; some/any exceptions; much/many |
| 29 | Frequency | before main verbs, after be; never without a second negative |
| 30 | Rules | mustn't is prohibited; don't have to is optional |
| 31 | Experience | have/has + past participle; finished past time uses past simple |
| 32 | Future conditions | if + present simple, will + base verb |

Each added lesson has six vocabulary entries, four translated examples, explained grammar, listening/reading questions, a solvable word bank, a dictated fill exercise and a full writing model. Paths 7–8 extend and reinforce the earlier foundations; they are not a certified CEFR assessment.

## Interface

Original inline SVG icon family and favicon; cream/forest green palette; conversational hero artwork built with HTML/CSS. Catalog groups lessons by path, shows goals, and filters by query, path and persisted learning status. Empty results offer a reset action. A resume card leads to the saved cursor.

The lesson workspace exposes all seven steps with an accessible navigation landmark and current-step state. Thai pronunciation can be toggled in place. Coaching contrasts appear alongside examples; personal transfer tasks are visible at the start. The existing final exercise completion gate remains required.

## Verification

Node tests check all 32 answer keys against independent reviewed meanings, complete vocabulary/examples and word banks, the full am/is/are coverage and coaching fields. Playwright visits and completes every lesson and reloads saved progress. Additional UI coverage checks 320, 768 and 1440px, filters, step navigation, pronunciation and draft persistence. Existing login/Google and cloud merge/retry/account-isolation cases remain part of the suite.

Cloud tests use a simulated REST service; they do not claim to be a live two-device Google login test. No auth credentials, database policies or sync algorithms are changed.
