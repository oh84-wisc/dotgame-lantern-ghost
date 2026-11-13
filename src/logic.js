// Pure game logic. No rendering, timers, or page access.
// A state is { layoutIndex, grid, patrol, ghost, lit, guard, cleared, timeLeftMs, screen }.
// `cleared` is the candle count of all earlier layouts. Functions never mutate their input.
// Turn order follows GAME_DESIGN.md chapter 2.
import { LAYOUTS } from "./levels.js";

export const TIME_LIMIT_MS = 60000;

const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

function countCandles(rows) {
  let count = 0;
  for (const row of rows) {
    for (const symbol of row) if (symbol === "c") count++;
  }
  return count;
}

// Candles in all three layouts: 12 + 14 + 16 = 42 (the denominator shown everywhere).
export const TOTAL_CANDLES = LAYOUTS.reduce((sum, layout) => sum + countCandles(layout.rows), 0);

export function createState(layoutIndex) {
  const layout = LAYOUTS[layoutIndex];
  if (!layout) throw new Error(`no layout at index ${layoutIndex}`);
  let ghost = null;
  layout.rows.forEach((row, y) => {
    const x = row.indexOf("S");
    if (x !== -1) ghost = { x, y };
  });
  if (!ghost) throw new Error(`layout ${layoutIndex} has no ghost start tile 'S'`);
  const [startX, startY] = layout.patrol[0];
  if (layout.rows[startY][startX] !== "G") throw new Error(`layout ${layoutIndex} patrol start is not 'G'`);
  return {
    layoutIndex,
    grid: layout.rows,
    patrol: layout.patrol,
    ghost,
    lit: [],
    guard: { index: 0, x: startX, y: startY },
    cleared: LAYOUTS.slice(0, layoutIndex).reduce((sum, earlier) => sum + countCandles(earlier.rows), 0),
    timeLeftMs: TIME_LIMIT_MS,
    screen: "start",
  };
}

export function isWall(state, x, y) {
  if (y < 0 || y >= state.grid.length) return true;
  if (x < 0 || x >= state.grid[y].length) return true;
  return state.grid[y][x] === "#";
}

export function totalCandles(state) {
  return countCandles(state.grid);
}

// Score of the run so far: candles lit in cleared layouts plus candles lit in this one (D3).
export function runScore(state) {
  return state.cleared + state.lit.length;
}

export function isCandleLit(state, x, y) {
  return state.lit.includes(`${x},${y}`);
}

// The guard's sight is the one tile straight ahead, which is the next patrol tile.
export function sightTile(state) {
  const [x, y] = state.patrol[(state.guard.index + 1) % state.patrol.length];
  return { x, y };
}

function advanceGuard(state) {
  const index = (state.guard.index + 1) % state.patrol.length;
  const [x, y] = state.patrol[index];
  return { index, x, y };
}

// One ghost step is one turn. Returns the same state object when the turn is not used
// (wall or edge, unknown direction, or a screen where input is ignored).
export function stepTurn(state, direction) {
  if (state.screen !== "playing") return state;
  const delta = DIRECTIONS[direction];
  if (!delta) return state;
  const x = state.ghost.x + delta.dx;
  const y = state.ghost.y + delta.dy;
  if (isWall(state, x, y)) return state;

  // 2-3: the ghost enters T and lights an unlit candle.
  const key = `${x},${y}`;
  const lit = state.grid[y][x] === "c" && !state.lit.includes(key) ? [...state.lit, key] : state.lit;
  let next = { ...state, ghost: { x, y }, lit };

  // 4: the ghost steps onto the guard's current tile.
  if (x === state.guard.x && y === state.guard.y) return { ...next, screen: "lose" };

  // 5: the guard moves one tile along the patrol loop.
  const guard = advanceGuard(state);
  next = { ...next, guard };

  // 6: the guard steps onto the ghost.
  if (guard.x === x && guard.y === y) return { ...next, screen: "lose" };

  // 7: the ghost stands on the guard's sight tile after the guard has moved.
  const sight = sightTile(next);
  if (sight.x === x && sight.y === y && !isWall(state, sight.x, sight.y)) {
    return { ...next, screen: "lose" };
  }

  // 8: all candles of this layout lit. Layouts 1 and 2 hand over to the next layout
  // with no interstitial; clearing layout 3 is the final win.
  if (lit.length === totalCandles(state)) {
    if (state.layoutIndex === LAYOUTS.length - 1) return { ...next, screen: "win" };
    return { ...createState(state.layoutIndex + 1), screen: "playing" };
  }
  return next;
}

// 10: elapsed real time. The timer reaching 0 without a win or loss is a loss.
export function tick(state, elapsedMs) {
  if (state.screen !== "playing") return state;
  const timeLeftMs = Math.max(0, state.timeLeftMs - elapsedMs);
  if (timeLeftMs === 0) return { ...state, timeLeftMs, screen: "lose" };
  return { ...state, timeLeftMs };
}

export function startGame(state) {
  if (state.screen !== "start") return state;
  return { ...state, screen: "playing" };
}

// [다시 시작] from a win or lose screen: layout 1 again, all candles and score back to 0 (D2).
export function restartGame() {
  return { ...createState(0), screen: "playing" };
}

export function goHome() {
  return createState(0);
}
