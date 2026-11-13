// 순수 게임 규칙. 그리기, 타이머, 페이지 접근은 여기에 없다.
// 상태는 { layoutIndex, grid, patrol, ghost, lit, guard, cleared, timeLeftMs, screen } 이다.
// `cleared`는 앞서 클리어한 레이아웃들의 촛불 수 합이다. 함수는 받은 상태를 직접 바꾸지 않는다.
// 한 턴의 판정 순서는 기획서 2장을 따른다.
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

// 세 레이아웃의 촛불 합: 12 + 14 + 16 = 42 (화면 어디서나 분모로 쓴다).
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

// 지금까지의 판 점수: 클리어한 레이아웃의 촛불 + 이번 레이아웃에서 켠 촛불 (기획서 D3).
export function runScore(state) {
  return state.cleared + state.lit.length;
}

export function isCandleLit(state, x, y) {
  return state.lit.includes(`${x},${y}`);
}

// 경비병의 시야는 바로 앞 한 칸이며, 그 칸이 순찰 고리의 다음 칸이다.
export function sightTile(state) {
  const [x, y] = state.patrol[(state.guard.index + 1) % state.patrol.length];
  return { x, y };
}

function advanceGuard(state) {
  const index = (state.guard.index + 1) % state.patrol.length;
  const [x, y] = state.patrol[index];
  return { index, x, y };
}

// 유령이 한 칸 움직이면 한 턴이다. 턴을 쓰지 않으면 (벽이나 화면 밖, 모르는 방향,
// 입력을 무시하는 화면) 받은 상태 객체를 그대로 돌려준다.
export function stepTurn(state, direction) {
  if (state.screen !== "playing") return state;
  const delta = DIRECTIONS[direction];
  if (!delta) return state;
  const x = state.ghost.x + delta.dx;
  const y = state.ghost.y + delta.dy;
  if (isWall(state, x, y)) return state;

  // 판정 2~3: 유령이 새 칸에 들어가고, 꺼진 촛불이면 켠다.
  const key = `${x},${y}`;
  const lit = state.grid[y][x] === "c" && !state.lit.includes(key) ? [...state.lit, key] : state.lit;
  let next = { ...state, ghost: { x, y }, lit };

  // 판정 4: 유령이 경비병이 서 있는 칸에 들어가면 패배.
  if (x === state.guard.x && y === state.guard.y) return { ...next, screen: "lose" };

  // 판정 5: 경비병이 순찰 고리를 따라 한 칸 움직인다.
  const guard = advanceGuard(state);
  next = { ...next, guard };

  // 판정 6: 경비병이 유령이 있는 칸으로 들어오면 패배.
  if (guard.x === x && guard.y === y) return { ...next, screen: "lose" };

  // 판정 7: 경비병이 움직인 뒤 유령이 경비병의 시야 칸에 서 있으면 패배.
  const sight = sightTile(next);
  if (sight.x === x && sight.y === y && !isWall(state, sight.x, sight.y)) {
    return { ...next, screen: "lose" };
  }

  // 판정 8: 이 레이아웃의 촛불을 모두 켰으면, 레이아웃 1·2는 중간 화면 없이
  // 다음 레이아웃으로 바로 넘어가고, 레이아웃 3이면 최종 승리다.
  if (lit.length === totalCandles(state)) {
    if (state.layoutIndex === LAYOUTS.length - 1) return { ...next, screen: "win" };
    return { ...createState(state.layoutIndex + 1), screen: "playing" };
  }
  return next;
}

// 판정 10: 흐른 실제 시간만큼 줄인다. 승패 없이 타이머가 0이 되면 패배다.
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

// 승리·패배 화면의 [다시 시작]: 레이아웃 1부터 다시, 촛불과 점수는 0 (기획서 D2).
export function restartGame() {
  return { ...createState(0), screen: "playing" };
}

export function goHome() {
  return createState(0);
}
