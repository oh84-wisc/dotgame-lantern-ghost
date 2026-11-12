import { test } from "node:test";
import assert from "node:assert/strict";
import { LAYOUT_1 } from "../src/levels.js";

// Expected values come from GAME_DESIGN.md chapter 5 (20 x 15 layout 1).
test("layout 1 is 20 columns by 15 rows", () => {
  assert.equal(LAYOUT_1.length, 15);
  for (const row of LAYOUT_1) assert.equal(row.length, 20);
});

test("layout 1 has 12 candles, one ghost start, one guard start", () => {
  const all = LAYOUT_1.join("");
  assert.equal(all.split("c").length - 1, 12);
  assert.equal(all.split("S").length - 1, 1);
  assert.equal(all.split("G").length - 1, 1);
});

test("layout 1 only uses the chapter 5 legend", () => {
  for (const ch of LAYOUT_1.join("")) {
    assert.ok("#.Scg".includes(ch) || ch === "G", `unexpected symbol ${ch}`);
  }
});
