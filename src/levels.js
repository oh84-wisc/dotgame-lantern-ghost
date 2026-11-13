// Layout 1, copied character-for-character from GAME_DESIGN.md chapter 5.
// 20 columns x 15 rows = 320 x 240 px at 16 px per tile.
// Symbols: # wall, . floor, S ghost start, c candle, G guard start.
export const LAYOUT_1 = [
  "####################",
  "#S.....c..#.....c..#",
  "#..c.....#...c.....#",
  "#.........#........#",
  "#....c.......c.....#",
  "#.........#........#",
  "###.#####.##########",
  "#.....c............#",
  "#...........c......#",
  "#.........#.....c..#",
  "#.c.......#........#",
  "#.........##########",
  "#..c...........c...#",
  "#........G.........#",
  "####################",
];

// Guard patrol loop for layout 1, GAME_DESIGN.md chapter 5 (R2). Each entry is [x, y],
// x = column from 0, y = row index from 0 (the doc's row number minus 1). Loops back to index 0.
export const PATROL_1 = [
  [9, 13],
  [10, 13],
  [11, 13],
  [12, 13],
  [12, 12],
  [11, 12],
  [10, 12],
  [9, 12],
];
