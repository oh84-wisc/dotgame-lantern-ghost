// Layout 1, copied character-for-character from GAME_DESIGN.md chapter 5.
// 20 columns x 15 rows = 320 x 240 px at 16 px per tile.
// Symbols: # wall, . floor, S ghost start, c candle (drawn as floor in R1), G guard start (drawn as floor in R1).
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
