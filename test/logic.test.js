import { test } from "node:test";
import assert from "node:assert/strict";
import { LAYOUTS } from "../src/levels.js";
import {
  createState,
  stepTurn,
  tick,
  startGame,
  restartGame,
  goHome,
  isWall,
  totalCandles,
  runScore,
  sightTile,
  TIME_LIMIT_MS,
  TOTAL_CANDLES,
} from "../src/logic.js";

// Turn-ready state: the screen is "playing" and the ghost is placed by the test.
function playing(ghostX, ghostY, layoutIndex = 0) {
  const state = startGame(createState(layoutIndex));
  return { ...state, ghost: { x: ghostX, y: ghostY } };
}

function allCandlesExcept(layoutIndex, skip) {
  return LAYOUTS[layoutIndex].rows.flatMap((row, y) =>
    [...row].flatMap((symbol, x) => (symbol === "c" && !(x === skip[0] && y === skip[1]) ? [`${x},${y}`] : [])),
  );
}

test("layout candle counts 12 / 14 / 16 and the total denominator is 42", () => {
  assert.equal(totalCandles(createState(0)), 12);
  assert.equal(totalCandles(createState(1)), 14);
  assert.equal(totalCandles(createState(2)), 16);
  assert.equal(TOTAL_CANDLES, 42);
});

test("new game: ghost on S (column 1, row 2), guard on G, 60 s, start screen", () => {
  const state = createState(0);
  assert.deepEqual(state.ghost, { x: 1, y: 1 });
  assert.deepEqual(state.guard, { index: 0, x: 9, y: 13 });
  assert.equal(state.timeLeftMs, 60000);
  assert.equal(state.screen, "start");
  assert.deepEqual(state.lit, []);
  assert.equal(runScore(state), 0);
});

test("time limit is 60000 ms", () => {
  assert.equal(TIME_LIMIT_MS, 60000);
});

test("start screen ignores arrow input", () => {
  const state = createState(0);
  assert.equal(stepTurn(state, "right"), state);
});

test("[시작] moves to playing without moving the ghost", () => {
  const state = startGame(createState(0));
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
  assert.equal(isWall(createState(0), 10, 1), true);
  const state = playing(9, 1);
  assert.equal(stepTurn(state, "right"), state);
});

test("stepping onto an unlit candle lights it and the count goes to 1", () => {
  let state = playing(1, 1);
  for (let i = 0; i < 6; i++) state = stepTurn(state, "right");
  assert.deepEqual(state.ghost, { x: 7, y: 1 });
  assert.deepEqual(state.lit, ["7,1"]);
  assert.equal(runScore(state), 1);
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

test("layout 1 patrol loops back to the start after 8 turns", () => {
  let state = playing(1, 1);
  for (let i = 0; i < 8; i++) state = stepTurn(state, i % 2 === 0 ? "right" : "left");
  assert.deepEqual(state.guard, { index: 0, x: 9, y: 13 });
  assert.equal(state.screen, "playing");
});

test("layout 2 patrol loops back to G (12,13) after 10 valid turns", () => {
  // Ghost shuttles between (1,3) and (2,3), far from the guard, so no turn is caught.
  let state = playing(2, 3, 1);
  for (let i = 0; i < 10; i++) state = stepTurn(state, i % 2 === 0 ? "left" : "right");
  assert.deepEqual(state.guard, { index: 0, x: 12, y: 12 });
  assert.equal(state.screen, "playing");
});

test("layout 3 patrol loops back to G (10,12) after 12 valid turns", () => {
  // Ghost shuttles between (1,2) and (2,2), far from the guard.
  let state = playing(2, 2, 2);
  for (let i = 0; i < 12; i++) state = stepTurn(state, i % 2 === 0 ? "left" : "right");
  assert.deepEqual(state.guard, { index: 0, x: 10, y: 11 });
  assert.equal(state.screen, "playing");
});

test("sight tile is the next patrol tile", () => {
  assert.deepEqual(sightTile(playing(1, 1)), { x: 10, y: 13 });
  const state = playing(1, 1);
  assert.deepEqual(sightTile({ ...state, guard: { index: 7, x: 9, y: 12 } }), { x: 9, y: 13 });
});

test("sight tile turns at the patrol corner (12,13) of layout 1: index 3 sees (12,12)", () => {
  const state = playing(1, 1);
  assert.deepEqual(sightTile({ ...state, guard: { index: 3, x: 12, y: 13 } }), { x: 12, y: 12 });
});

test("ghost stepping onto the guard's tile loses at once", () => {
  const next = stepTurn({ ...playing(8, 13) }, "right"); // guard is on (9,13)
  assert.equal(next.screen, "lose");
});

test("ghost stepping onto the guard while the guard would step onto the ghost loses", () => {
  const next = stepTurn({ ...playing(10, 13) }, "left"); // guard at (9,13)
  assert.equal(next.screen, "lose");
});

test("guard stepping onto the ghost loses", () => {
  // Guard moves from (9,13) to (10,13); the ghost is standing there.
  const next = stepTurn({ ...playing(10, 12) }, "down");
  assert.equal(next.screen, "lose");
});

test("ghost on the guard's sight tile after the guard moves loses", () => {
  // Guard moves from index 0 to index 1 (10,13); its sight tile becomes (11,13).
  const next = stepTurn({ ...playing(11, 12) }, "down");
  assert.equal(next.screen, "lose");
});

test("clearing layout 1 hands over to layout 2 with no interstitial", () => {
  const state = { ...playing(3, 11), lit: allCandlesExcept(0, [3, 12]) };
  const next = stepTurn(state, "down");
  assert.equal(next.layoutIndex, 1);
  assert.equal(next.screen, "playing");
  assert.deepEqual(next.ghost, { x: 1, y: 1 });
  assert.deepEqual(next.lit, []);
  assert.equal(next.timeLeftMs, 60000);
  assert.equal(runScore(next), 12);
});

test("clearing layout 2 hands over to layout 3 and the score carries 26", () => {
  const state = { ...playing(12, 9, 1), lit: allCandlesExcept(1, [12, 8]), guard: { index: 0, x: 12, y: 12 } };
  // Ghost stands at (12,9) and the last candle is at (12,8) (row 9 col 12 is '.' in layout 2).
  const next = stepTurn({ ...state, ghost: { x: 12, y: 9 } }, "up");
  assert.equal(next.layoutIndex, 2);
  assert.equal(next.screen, "playing");
  assert.equal(runScore(next), 26);
});

test("clearing layout 3 is the final win with 42/42", () => {
  const state = {
    ...playing(10, 12, 2),
    lit: allCandlesExcept(2, [10, 13]),
    cleared: 26,
  };
  const next = stepTurn(state, "down");
  assert.equal(next.screen, "win");
  assert.equal(next.lit.length, 16);
  assert.equal(runScore(next), 42);
});

test("timer reaching 0 without a win or loss is a loss, score = lit candles", () => {
  const state = { ...playing(1, 1), lit: ["7,1", "16,1"] };
  const next = tick(state, 60000);
  assert.equal(next.screen, "lose");
  assert.equal(next.timeLeftMs, 0);
  assert.equal(runScore(next), 2);
});

test("loss in layout 2 scores cleared candles plus candles lit in layout 2", () => {
  // Ghost (12,11) steps down onto the guard at (12,12) of layout 2.
  const state = { ...playing(12, 11, 1), lit: ["4,1"], cleared: 12 };
  const next = stepTurn(state, "down");
  assert.equal(next.screen, "lose");
  assert.equal(runScore(next), 13);
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

test("[다시 시작] gives layout 1 again, score 0, timer 60 s, playing", () => {
  const ended = { ...playing(9, 9, 2), lit: ["7,1"], cleared: 26, timeLeftMs: 0, screen: "lose" };
  const next = restartGame(ended);
  assert.equal(next.layoutIndex, 0);
  assert.deepEqual(next.ghost, { x: 1, y: 1 });
  assert.deepEqual(next.guard, { index: 0, x: 9, y: 13 });
  assert.deepEqual(next.lit, []);
  assert.equal(runScore(next), 0);
  assert.equal(next.timeLeftMs, 60000);
  assert.equal(next.screen, "playing");
});

test("[처음으로] returns to the start screen on layout 1", () => {
  const ended = { ...playing(1, 1, 1), screen: "win" };
  const next = goHome(ended);
  assert.equal(next.screen, "start");
  assert.equal(next.layoutIndex, 0);
});

test("stepTurn does not mutate its input", () => {
  const state = playing(1, 1);
  const before = JSON.stringify(state);
  stepTurn(state, "right");
  assert.equal(JSON.stringify(state), before);
});
