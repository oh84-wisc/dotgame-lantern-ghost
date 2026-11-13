// Pure game logic. No rendering, timers, or page access.
// A state is { grid, ghost, lit, guard, timeLeftMs, screen }. Functions never mutate their input.
// Turn order follows GAME_DESIGN.md chapter 2 (R2).
import { PATROL_1 } from "./levels.js";

export const TIME_LIMIT_MS = 60000;

const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

export function createState(layout) {
  let ghost = null;
  for (let y = 0; y < layout.length; y++) {
    const x = layout[y].indexOf("S");
    if (x !== -1) ghost = { x, y };
  }
  if (!ghost) throw new Error("layout has no ghost start tile 'S'");
  const [startX, startY] = PATROL_1[0];
  if (layout[startY][startX] !== "G") throw new Error("patrol start is not the guard tile 'G'");
  return {
    grid: layout,
    ghost,
    lit: [],
    guard: { index: 0, x: startX, y: startY },
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
  let count = 0;
  for (const row of state.grid) {
    for (const symbol of row) if (symbol === "c") count++;
  }
  return count;
}

export function isCandleLit(state, x, y) {
  return state.lit.includes(`${x},${y}`);
}

// The guard's sight is the one tile straight ahead, which is the next patrol tile.
export function sightTile(guard) {
  const [x, y] = PATROL_1[(guard.index + 1) % PATROL_1.length];
  return { x, y };
}

function advanceGuard(guard) {
  const index = (guard.index + 1) % PATROL_1.length;
  const [x, y] = PATROL_1[index];
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
  const guard = advanceGuard(state.guard);
  next = { ...next, guard };

  // 6: the guard steps onto the ghost.
  if (guard.x === x && guard.y === y) return { ...next, screen: "lose" };

  // 7: the ghost stands on the guard's sight tile after the guard has moved.
  const sight = sightTile(guard);
  if (sight.x === x && sight.y === y && !isWall(state, sight.x, sight.y)) {
    return { ...next, screen: "lose" };
  }

  // 8: all candles lit.
  if (lit.length === totalCandles(state)) return { ...next, screen: "win" };
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

export function restartGame(state) {
  return { ...createState(state.grid), screen: "playing" };
}

export function goHome(state) {
  return createState(state.grid);
}
