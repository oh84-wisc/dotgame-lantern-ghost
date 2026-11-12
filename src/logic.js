// Pure game logic. No rendering or page access.
// A state is { grid: string[], ghost: { x, y } }. Functions never mutate their input.

const DIRECTIONS = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

export function createState(layout) {
  for (let y = 0; y < layout.length; y++) {
    const x = layout[y].indexOf("S");
    if (x !== -1) {
      return { grid: layout, ghost: { x, y } };
    }
  }
  throw new Error("layout has no ghost start tile 'S'");
}

export function isWall(state, x, y) {
  if (y < 0 || y >= state.grid.length) return true;
  if (x < 0 || x >= state.grid[y].length) return true;
  return state.grid[y][x] === "#";
}

// Moves the ghost exactly one tile. Blocked moves (wall, edge, unknown direction)
// return a new state with the same ghost position.
export function moveGhost(state, direction) {
  const delta = DIRECTIONS[direction];
  if (!delta) {
    return { grid: state.grid, ghost: { ...state.ghost } };
  }
  const x = state.ghost.x + delta.dx;
  const y = state.ghost.y + delta.dy;
  if (isWall(state, x, y)) {
    return { grid: state.grid, ghost: { ...state.ghost } };
  }
  return { grid: state.grid, ghost: { x, y } };
}
