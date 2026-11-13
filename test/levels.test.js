import { test } from "node:test";
import assert from "node:assert/strict";
import { LAYOUTS } from "../src/levels.js";

const CANDLES = [12, 14, 16];
const PATROL_LENGTHS = [8, 10, 12];

test("three layouts in fixed order, 20 columns by 15 rows each", () => {
  assert.equal(LAYOUTS.length, 3);
  for (const { rows } of LAYOUTS) {
    assert.equal(rows.length, 15);
    for (const row of rows) assert.equal(row.length, 20);
  }
});

test("each layout has exactly one S and one G", () => {
  for (const { rows } of LAYOUTS) {
    const all = rows.join("");
    assert.equal(all.split("S").length - 1, 1);
    assert.equal(all.split("G").length - 1, 1);
  }
});

test("candle counts are 12, 14, 16 (GAME_DESIGN.md chapter 5)", () => {
  LAYOUTS.forEach(({ rows }, i) => {
    assert.equal(rows.join("").split("c").length - 1, CANDLES[i], `layout ${i + 1}`);
  });
});

test("patrol loops are 8, 10, 12 tiles (GAME_DESIGN.md chapter 5)", () => {
  LAYOUTS.forEach(({ patrol }, i) => assert.equal(patrol.length, PATROL_LENGTHS[i], `layout ${i + 1}`));
});

test("patrol tiles are floor or the guard start, never wall, candle or S", () => {
  for (const { rows, patrol } of LAYOUTS) {
    for (const [x, y] of patrol) {
      const symbol = rows[y][x];
      assert.ok(symbol === "." || symbol === "G", `tile (${x},${y}) is '${symbol}'`);
    }
  }
});

test("each patrol step moves exactly one tile and the loop closes", () => {
  for (const { patrol } of LAYOUTS) {
    for (let i = 0; i < patrol.length; i++) {
      const [x1, y1] = patrol[i];
      const [x2, y2] = patrol[(i + 1) % patrol.length];
      assert.equal(Math.abs(x1 - x2) + Math.abs(y1 - y2), 1, `step ${i}`);
    }
  }
});

test("the guard start G is the first patrol tile", () => {
  for (const { rows, patrol } of LAYOUTS) {
    const [x, y] = patrol[0];
    assert.equal(rows[y][x], "G");
  }
});

test("every candle is reachable from S over non-wall tiles", () => {
  for (const { rows } of LAYOUTS) {
    const start = rows.flatMap((row, y) => [...row].flatMap((ch, x) => (ch === "S" ? [[x, y]] : [])))[0];
    const seen = new Set([start.join(",")]);
    const queue = [start];
    while (queue.length) {
      const [x, y] = queue.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;
        if (rows[ny] === undefined || rows[ny][nx] === undefined || rows[ny][nx] === "#") continue;
        if (seen.has(key)) continue;
        seen.add(key);
        queue.push([nx, ny]);
      }
    }
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === "c") assert.ok(seen.has(`${x},${y}`), `candle (${x},${y}) unreachable`);
      });
    });
  }
});
