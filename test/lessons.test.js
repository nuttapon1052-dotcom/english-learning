import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, roadmap } from '../src/lessons.js';

test('ships ten complete beginner lessons', () => {
  assert.equal(lessons.length, 10);
  assert.deepEqual(lessons.map(({ id }) => id), [1,2,3,4,5,6,7,8,9,10]);
  for (const lesson of lessons) {
    assert.ok(lesson.words.length >= 5 && lesson.words.length <= 8);
    assert.ok(lesson.examples.length >= 3 && lesson.examples.length <= 5);
    assert.ok(lesson.goal && lesson.grammar);
    for (const key of ['listen','choices','arrange','arranged','fill','blank','read','question','readChoices','write','accepts']) {
      assert.ok(lesson.practice[key], `lesson ${lesson.id} is missing ${key}`);
    }
  }
});

test('the roadmap covers all twelve weeks and marks future content honestly', () => {
  assert.equal(roadmap.length, 6);
  assert.equal(roadmap.filter(item => item[3] === 'soon').length, 2);
});
