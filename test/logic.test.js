import { test } from "node:test";
import assert from "node:assert/strict";
import { LAYOUT_1 } from "../src/levels.js";
import { createState, moveGhost, isWall } from "../src/logic.js";

test("ghost starts on the S tile of layout 1 (column 1, row 1)", () => {
  const state = createState(LAYOUT_1);
  assert.deepEqual(state.ghost, { x: 1, y: 1 });
});

test("one move right goes exactly one tile", () => {
  const state = createState(LAYOUT_1);
  const next = moveGhost(state, "right");
  assert.deepEqual(next.ghost, { x: 2, y: 1 });
});

test("one move down goes exactly one tile", () => {
  const state = createState(LAYOUT_1);
  const next = moveGhost(state, "down");
  assert.deepEqual(next.ghost, { x: 1, y: 2 });
});

test("moving into a wall leaves the ghost in place", () => {
  const state = createState(LAYOUT_1);
  const next = moveGhost(state, "up"); // row 0 is the outer wall
  assert.deepEqual(next.ghost, { x: 1, y: 1 });
});

test("moving into the inner wall at column 10 is blocked", () => {
  // Row 1 is "#S.....c..#....." so column 10 is wall.
  assert.equal(isWall(createState(LAYOUT_1), 10, 1), true);
  const state = { grid: LAYOUT_1, ghost: { x: 9, y: 1 } };
  assert.deepEqual(moveGhost(state, "right").ghost, { x: 9, y: 1 });
});

test("candle and guard tiles are walkable", () => {
  // Row 1 column 7 is a candle; the ghost starts at column 1 and walks right.
  let state = createState(LAYOUT_1);
  for (let i = 0; i < 6; i++) state = moveGhost(state, "right");
  assert.deepEqual(state.ghost, { x: 7, y: 1 });
});

test("moveGhost does not mutate its input", () => {
  const state = createState(LAYOUT_1);
  const before = JSON.stringify(state);
  moveGhost(state, "right");
  assert.equal(JSON.stringify(state), before);
});

test("unknown direction leaves the ghost in place", () => {
  const state = createState(LAYOUT_1);
  assert.deepEqual(moveGhost(state, "diagonal").ghost, { x: 1, y: 1 });
});
