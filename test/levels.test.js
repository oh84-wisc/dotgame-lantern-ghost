import { test } from "node:test";
import assert from "node:assert/strict";
import { LAYOUT_1, PATROL_1 } from "../src/levels.js";

test("layout 1 is 20 columns by 15 rows", () => {
  assert.equal(LAYOUT_1.length, 15);
  for (const row of LAYOUT_1) assert.equal(row.length, 20);
});

test("layout 1 has one S and one G", () => {
  const all = LAYOUT_1.join("");
  assert.equal(all.split("S").length - 1, 1);
  assert.equal(all.split("G").length - 1, 1);
});

test("patrol loop has 8 tiles, all floor or the guard start", () => {
  assert.equal(PATROL_1.length, 8);
  for (const [x, y] of PATROL_1) {
    const symbol = LAYOUT_1[y][x];
    assert.ok(symbol === "." || symbol === "G", `tile (${x},${y}) is '${symbol}'`);
  }
});

test("patrol loop steps one tile each time and closes back to the start", () => {
  for (let i = 0; i < PATROL_1.length; i++) {
    const [x1, y1] = PATROL_1[i];
    const [x2, y2] = PATROL_1[(i + 1) % PATROL_1.length];
    assert.equal(Math.abs(x1 - x2) + Math.abs(y1 - y2), 1, `step ${i} is not one tile`);
  }
});
