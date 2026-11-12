// The only place with hex colors. Values are the GAME_DESIGN.md chapter 6 palette.
// Index 1 = background, 2 = wall, 3 = floor, 4 = unlit candle, 5 = lit candle, 6 = ghost, 7 = guard, 8 = sight cone.
export const PALETTE = {
  1: "#0b0b14",
  2: "#2a2a40",
  3: "#3d3d5c",
  4: "#f2e6b0",
  5: "#ffcc33",
  6: "#e8f4ff",
  7: "#cc3344",
  8: "#8888aa",
};

export const TILE_SIZE = 16;

// R1 draws only wall (2), floor (3), and ghost (6). Candle and guard tiles render as floor.
export function tileColorIndex(symbol) {
  if (symbol === "#") return 2;
  return 3;
}
