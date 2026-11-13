import { test } from "node:test";
import assert from "node:assert/strict";
import { parseHighScore, nextHighScore, HIGH_SCORE_KEY } from "../src/score.js";

test("the high score lives under one localStorage key", () => {
  assert.equal(HIGH_SCORE_KEY, "lantern-ghost.highScore");
});

test("missing, empty, or non-integer stored values read as 0", () => {
  assert.equal(parseHighScore(null), 0);
  assert.equal(parseHighScore(""), 0);
  assert.equal(parseHighScore("abc"), 0);
  assert.equal(parseHighScore("-3"), 0);
  assert.equal(parseHighScore("1.5"), 0);
});

test("a stored integer string reads as that integer", () => {
  assert.equal(parseHighScore("17"), 17);
  assert.equal(parseHighScore("42"), 42);
});

test("nextHighScore keeps the larger of stored and new score", () => {
  assert.equal(nextHighScore(0, 0), 0);
  assert.equal(nextHighScore(42, 17), 42);
  assert.equal(nextHighScore(17, 42), 42);
  assert.equal(nextHighScore(12, 0), 12);
});
