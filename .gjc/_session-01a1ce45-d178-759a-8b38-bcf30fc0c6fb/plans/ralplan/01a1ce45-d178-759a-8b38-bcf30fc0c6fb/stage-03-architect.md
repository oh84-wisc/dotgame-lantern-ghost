# Architect review (R2 revision stage-03, pass 2, delta-only)

## Summary
Pass 1 blockers (a)-(d) are resolved. P1 patrol ring, P2 turn order (1-10), P3 state contract and P4 R2 scope are written down and consistent with GAME_DESIGN.md chapter 2 and 5. No new blocker. Status CLEAR, recommendation APPROVE, with low non-blocking caveats.

## Resolution of prior findings
- (a) Patrol path: 8-tile loop (9,14)->(12,14)->(12,13)->(9,13). Verified against chapter 5 map: row 13 cols 9-12 and row 14 cols 9-12 are all '.', G at (9,14). Length 8 is inside the 2장 8~12 range. Marked as proposal needing human approval before entering chapter 5; levels.js gets a constant only after that. Resolved.
- (b) Turn order: P2 defines wall-block (no turn), ghost move, candle, ghost-onto-guard, guard step, guard-onto-ghost, swap, post-move sight, win after loss, timeout last. Covers cases (a)-(e) from pass 1. Resolved.
- (c) State contract: P3 lists state shape, stepTurn/tick pure functions, clock/lock/timers kept in main. logic.js purity preserved. Resolved.
- (d) Layout 1 win scope: P4 adds an R2-only qualifier to the 2장 layout row. Resolved.

## Delta checks
- Boundaries: logic.js pure, hex only in sprites.js, map copied in levels.js, strings in new strings.js, main.js new for input/timers. No violation.
- 2장 confirmed numbers (16px, 320x240, 120ms, 60s, sight 1 tile, patrol 8-12, key repeat ignored, arrow default blocked): no conflict.
- Features not in design: start/win/lose screens, restart/home, N/12 are user-confirmed intent answers. The 120 ms input lock and 'ignore keys on non-game screens' are new rules but listed under proposals needing approval; acceptable.

## Caveats (non-blocking, LOW)
1. index.html HUD CSS uses #f2e6b0 and #0b0b14, which duplicates hex outside sprites.js (design 6장: hex only in sprites.js). Prefer injecting from sprites.js in main.js, or state an explicit exception in the design when approved.
2. P4 edits wording of a confirmed 2장 row. Keep the original text and append the R2 qualifier; present it to the human for approval.
3. Timeout-vs-win same-tick ordering is covered by P2 item 10 (win/loss first); keep one test for it.
4. AC-2.4 asserts corner views visually; the human must wait for the guard to reach corners (up to 8 turns); fine.

## Architectural Status
CLEAR

## Code Review Recommendation
APPROVE
