## Verdict
**ITERATE**

## Claim Checks
- Reviewed stage-02-revision.md (sha 65d4e363...), stage-01-intent.md, GAME_DESIGN.md (2, 4, 5, 6, 9, 10 chapters), AGENTS.md.
- intent confirmed 5 decisions: all 5 are reflected correctly (HUD outside canvas as HTML; start screen + restart/home buttons; timeout score = lit candles with rule added to chapter 2; guard 1 tile per ghost tile; view follows patrol direction). Verified.
- AC-2.1, 2.2, 2.5, 3.2, 3.3 (timeout part), 3.4, 3.5 are yes/no judgeable in a browser. Caveat: hex colors (#f2e6b0, #ffcc33, #8888aa) cannot be reliably judged by eye; the AC should say how (devtools color picker / canvas pixel read) or say 'visibly distinct from floor and from each other'.
- AC-2.3 judgeable only if the guard is visible (color 7, #cc3344) and patrol path is known; AC-2.4 and AC-3.1 are NOT judgeable as written (see below).
- 2장 currently says 레이아웃 순서 = 3 layouts, 시계 per layout; plan says layout 1 win is final. This contradiction with existing 2장 row is not listed as a chapter-2 edit.

## Missing Evidence
Definitely missing (blocking):
1. Patrol path undefined. Plan says 'G(9열 14행)에서 고정 순찰 경로 8~12칸을 반복' but gives no cells, no loop vs ping-pong, no turnaround rule. Without it: AC-2.4 ('방향을 바꾸면') and AC-3.1 (which tile is a view tile at turn N) cannot be checked by a human, and unit-test expected values cannot come from the design doc (AGENTS.md). Path coordinates (as 5장-style map overlay or a cell list) must be added to the design doc, and the wall-facing case for AC-2.4 must occur on that path (or the AC must say how to see it). Row 14 is a corridor along the bottom wall, so choose the path deliberately.
2. Judgement order (unconfirmed default E) is ambiguous and under-specified: 'ghost first, judge at arrival cell; same or adjacent cell by arrival cell' does not say (a) whether the guard moves before the view test (judge vs new view or old view), (b) ghost steps onto the guard's own tile = lose or not, (c) guard steps onto ghost tile, (d) swap/pass-through, (e) last candle lit on the same turn as entering a view tile: win or lose, (f) timer hits 0 on same step as win/capture. Must be a numbered order in chapter 2 with a unit test per case.
3. No AC for the candle-count HUD (goal-2 scope item) and none for the HUD timer starting at [시작] and resetting on 다시 시작 (AC-3.5 lists 타이머 60 but not that it then counts down again).
4. Capture defeat: scope says 패배 화면 shows 켜진 촛불 N/12, AC-3.3 only checks timeout. Add the same check for capture, and decide win screen content.
5. Input behavior on start/end screens and during 120 ms move (key ignored? queued?) and timer state on end screens unspecified; 2장 says repeat keys ignored but not input during animation.
6. File/ownership list absent: no mention of src/strings.js (required by AGENTS.md for UI text, not in tree), main/render entry, index.html HUD elements, sprites.js entries for colors 4,5,7,8, 6장/4장 table updates ('사용 안 함 (R2)' rows).

Thin / possibly unclear: 'wall blocks view' (default D) is nearly vacuous with a 1-tile view; harmless but state it as 'wall tile in front = no view tile'. Default H harmless.

## Approval Boundary
Nothing proceeds to design-doc edit or coding until items 1 and 2 are fixed. Items 3-6 should be fixed in the same revision (small additive edits). Out of approval: layouts 2/3, anything not in the doc.

## Summary
- Clarity: medium; Verifiability: AC-2.4/3.1 fail due to undefined path; Completeness: patrol path, judgement cases, HUD count AC, file list missing; Big Picture: fits decisions and AGENTS.md; Principle/Option Consistency: ok (turn-based vs realtime B rejected consistently), but chapter-2 '3 layouts' row conflict unlisted; Alternatives Depth: thin but acceptable for a settled option; Risk/Verification Rigor: unit plan lists cases but not the E edge cases.

## Answers to the 4 questions
1. AC-2.1/2.2/2.5/3.2/3.3/3.4/3.5 yes/no (color hex needs a stated method); AC-2.3 conditional on guard visible; AC-2.4 and AC-3.1 not judgeable until patrol path is specified.
2. All 5 confirmed decisions reflected.
3. Must not pass without review: E (judgement order). D and H can pass.
4. ITERATE.

## Required Changes
1. Add the concrete patrol path (8~12 cells, loop or ping-pong, turnaround rule) to the design doc plan; make AC-2.4/3.1 reference it.
2. Replace default E with an explicit ordered rule covering cases (a)-(f); add a unit test per case with expected values from the doc.
3. Add AC for candle-count HUD, timer start/reset, and capture-defeat score display.
4. Specify input on non-game screens and during the 120 ms move.
5. List files/sections to change (strings.js, entry/render, index.html HUD, sprites, 4/6장 rows, 2장 '레이아웃 순서' row).
6. State a check method for hex colors in AC-2.1/2.2/2.4.
