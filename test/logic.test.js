import { test } from "node:test";
import assert from "node:assert/strict";
import { LAYOUT_1 } from "../src/levels.js";
import {
  createState,
  stepTurn,
  tick,
  startGame,
  restartGame,
  goHome,
  isWall,
  totalCandles,
  sightTile,
  TIME_LIMIT_MS,
} from "../src/logic.js";

// Turn-ready state: the screen is "playing" and the ghost is placed by the test.
function playing(ghostX, ghostY) {
  const state = startGame(createState(LAYOUT_1));
  return { ...state, ghost: { x: ghostX, y: ghostY } };
}

test("layout 1 has 12 candles (GAME_DESIGN.md chapter 5)", () => {
  assert.equal(totalCandles(createState(LAYOUT_1)), 12);
});

test("new game: ghost on S (column 1, row 2), guard on G, 60 s, start screen", () => {
  const state = createState(LAYOUT_1);
  assert.deepEqual(state.ghost, { x: 1, y: 1 });
  assert.deepEqual(state.guard, { index: 0, x: 9, y: 13 });
  assert.equal(state.timeLeftMs, 60000);
  assert.equal(state.screen, "start");
  assert.deepEqual(state.lit, []);
});

test("time limit is 60000 ms", () => {
  assert.equal(TIME_LIMIT_MS, 60000);
});

test("start screen ignores arrow input", () => {
  const state = createState(LAYOUT_1);
  assert.equal(stepTurn(state, "right"), state);
});

test("[시작] moves to playing without moving the ghost", () => {
  const state = startGame(createState(LAYOUT_1));
  assert.equal(state.screen, "playing");
  assert.deepEqual(state.ghost, { x: 1, y: 1 });
});

test("one press right moves the ghost exactly one tile", () => {
  const next = stepTurn(playing(1, 1), "right");
  assert.deepEqual(next.ghost, { x: 2, y: 1 });
});

test("a move into a wall uses no turn: same state object, guard does not move", () => {
  const state = playing(1, 1);
  assert.equal(stepTurn(state, "up"), state);
});

test("inner wall at column 10 blocks the ghost", () => {
  assert.equal(isWall(createState(LAYOUT_1), 10, 1), true);
  const state = playing(9, 1);
  assert.equal(stepTurn(state, "right"), state);
});

test("stepping onto an unlit candle lights it and the count goes to 1", () => {
  // Row 1 column 7 is a candle; walk right from column 1.
  let state = playing(1, 1);
  for (let i = 0; i < 6; i++) state = stepTurn(state, "right");
  assert.deepEqual(state.ghost, { x: 7, y: 1 });
  assert.deepEqual(state.lit, ["7,1"]);
  assert.equal(state.screen, "playing");
});

test("a lit candle stays lit when the ghost leaves and comes back", () => {
  let state = playing(6, 1);
  state = stepTurn(state, "right"); // onto candle (7,1)
  state = stepTurn(state, "left"); // away
  state = stepTurn(state, "right"); // back
  assert.deepEqual(state.lit, ["7,1"]);
});

test("guard advances one tile on each ghost turn", () => {
  const next = stepTurn(playing(1, 1), "right");
  assert.deepEqual(next.guard, { index: 1, x: 10, y: 13 });
});

test("patrol loops back to the start after 8 turns", () => {
  let state = playing(1, 1);
  for (let i = 0; i < 8; i++) state = stepTurn(state, i % 2 === 0 ? "right" : "left");
  assert.deepEqual(state.guard, { index: 0, x: 9, y: 13 });
  assert.equal(state.screen, "playing");
});

test("sight tile is the next patrol tile (GAME_DESIGN.md chapter 2, sight = tile straight ahead)", () => {
  assert.deepEqual(sightTile({ index: 0, x: 9, y: 13 }), { x: 10, y: 13 });
  assert.deepEqual(sightTile({ index: 7, x: 9, y: 12 }), { x: 9, y: 13 });
});

test("ghost stepping onto the guard's tile loses at once", () => {
  const state = { ...playing(8, 13) };
  const next = stepTurn(state, "right"); // guard is on (9,13)
  assert.equal(next.screen, "lose");
});

test("swap: ghost steps onto the guard's tile while the guard would step onto the ghost, loses", () => {
  // Ghost (10,13) moves left onto the guard at (9,13). Caught by step 4 before the guard moves.
  const next = stepTurn({ ...playing(10, 13) }, "left");
  assert.equal(next.screen, "lose");
});

test("sight tile turns at the patrol corner (12,13): index 3 sees (12,12)", () => {
  assert.deepEqual(sightTile({ index: 3, x: 12, y: 13 }), { x: 12, y: 12 });
});

test("guard stepping onto the ghost loses", () => {
  // Guard moves from (9,13) to (10,13); the ghost is standing there.
  const state = { ...playing(10, 12) };
  const next = stepTurn(state, "down");
  assert.equal(next.screen, "lose");
});

test("ghost on the guard's sight tile after the guard moves loses", () => {
  // Guard at index 0 moves to index 1 (10,13); its sight tile becomes (11,13).
  const state = { ...playing(11, 12) };
  const next = stepTurn(state, "down");
  assert.equal(next.screen, "lose");
});

test("the last candle wins, and candles lit count reaches 12", () => {
  const state = playing(3, 11);
  const allButLast = LAYOUT_1.flatMap((row, y) =>
    [...row].flatMap((symbol, x) => (symbol === "c" && !(x === 3 && y === 12) ? [`${x},${y}`] : [])),
  );
  const almost = { ...state, lit: allButLast };
  const next = stepTurn(almost, "down");
  assert.equal(next.lit.length, 12);
  assert.equal(next.screen, "win");
});

test("timer reaching 0 without a win or loss is a loss, score = lit candles", () => {
  const state = { ...playing(1, 1), lit: ["7,1", "16,1"] };
  const next = tick(state, 60000);
  assert.equal(next.screen, "lose");
  assert.equal(next.timeLeftMs, 0);
  assert.equal(next.lit.length, 2);
});

test("timer drops by the elapsed time with no input", () => {
  const state = playing(1, 1);
  const next = tick(state, 1000);
  assert.equal(next.timeLeftMs, 59000);
  assert.equal(next.screen, "playing");
});

test("input after the timer ran out is ignored", () => {
  const lost = tick(playing(1, 1), 60000);
  assert.equal(stepTurn(lost, "right"), lost);
});

test("win and loss screens ignore arrow input", () => {
  const won = { ...playing(1, 1), screen: "win" };
  assert.equal(stepTurn(won, "right"), won);
  const lost = { ...playing(1, 1), screen: "lose" };
  assert.equal(stepTurn(lost, "right"), lost);
});

test("[다시 시작] gives the first state again with the timer back at 60 s and playing", () => {
  const ended = { ...playing(9, 9), lit: ["7,1"], timeLeftMs: 0, screen: "lose" };
  const next = restartGame(ended);
  assert.deepEqual(next.ghost, { x: 1, y: 1 });
  assert.deepEqual(next.guard, { index: 0, x: 9, y: 13 });
  assert.deepEqual(next.lit, []);
  assert.equal(next.timeLeftMs, 60000);
  assert.equal(next.screen, "playing");
});

test("[처음으로] returns to the start screen", () => {
  const ended = { ...playing(1, 1), screen: "win" };
  assert.equal(goHome(ended).screen, "start");
});

test("stepTurn does not mutate its input", () => {
  const state = playing(1, 1);
  const before = JSON.stringify(state);
  stepTurn(state, "right");
  assert.equal(JSON.stringify(state), before);
});
