Architectural Status: CLEAR
Decision: APPROVE

# Architect review, pass 3 (stage-04-revision.md, sha256 83f2ff27...)

Scope: delta stage-03 -> stage-04 only; F1-F3 closure; edit-list vs current GAME_DESIGN.md; AC numbering; AC-5.1 favicon exception.

## Prior findings
- F1 (AC-5.4 example unreachable): CLOSED. New AC-5.4: first game clears layout 1, loses in layout 2 with no candle lit (score 12); second game loses in layout 1 with 0 candles (score 0); expected high score 12. Consistent with 2.5 (loss score = previous layouts sum + current lit = 12+0) and 2.6 (N/42), and with nextHighScore(12,0)=12 in section 6. The parenthetical correctly states layout-1 loss max is 11 because the 12th candle triggers clearance (judgement step 8 after 4/6/7).
- F2 (HUD /12 in 3장 edit 6): CLOSED. Edit 6 now: "게임 화면: 현재 레이아웃. HUD에 남은 시간과 `켜진 촛불 N/42`를 보인다 (2.6). [R2-2]", plus a post-edit search for `/12`, `12/12`, `레이아웃 1만`, `R2 이후`. Matches GAME_DESIGN.md 3장 lines.
- F3 a-d (stale edit items): CLOSED. Edit 2 (title/ralplan sha line), edit 3 (time-out wording), edit 7 (4장 unchanged; verified GAME_DESIGN.md 4장 has no "레이아웃 2, 3은 아직 없다" - that sentence is in 5장), edit 8 (5장 sentence deletion, PATROL_1 -> LAYOUTS[i].patrol), edit 12 (duplicate list lines, item 1/2/5 rewording) all quote text that exists verbatim in current GAME_DESIGN.md (checked: 2장 나머지 heading and sha line, 점수 bullets, 판정 순서 8, R2 범위, 3장 bullets, 5장 closing bullets, 7장/8장 "어느 라운드에 채운다: R3", 아직 안 정한 것 items 1/2/5 and the old duplicate header lines).

## Verification results
- AC numbering: AC-4.1..4.9 and AC-5.1..5.8 contiguous, no duplicates. AC-4.2 (10 turns, G col 12 row 13) and AC-4.4 (12 turns, G col 10 row 12) match 2.3/2.4 G coordinates and ring lengths 10/12.
- AC-5.1 favicon exception: does not weaken the user's no-external-asset rule. It excludes only the browser-initiated favicon.ico request, not any asset the game loads or ships; audio, image and font requests stay at 0.

## New findings (delta-only)
1. LOW (non-blocking) - AC-5.7 vs AC-5.1 wording. AC-5.7 says image/audio/font requests are 0 with no favicon exclusion, while AC-5.1 now excludes favicon.ico. A literal tester could fail AC-5.7 on the browser's favicon request. Why new: the exception was introduced in stage-04 and was not present for AC-5.7 to diverge from earlier. Fix: add the same parenthetical (browser-auto favicon.ico excluded) to AC-5.7 or reference AC-5.1.
2. LOW (non-blocking, pre-existing, informational) - 4장 note and 6장 palette column still say "R2 이후"/"R1에서 하는 일" (e.g. 경비병 그림은 R2 이후에 그린다). Edit list intentionally leaves these unchanged; the stage-04 post-edit search targets `R2 이후` so the executor will see the 4장 hit and should decide explicitly. Not blocking; do not expand scope.

## Findings per prior item
- F1: closed
- F2: closed
- F3a: closed
- F3b: closed
- F3c: closed
- F3d: closed
- F3e: closed

No blockers. Architectural Status CLEAR; Decision APPROVE (two LOW caveats noted above).
