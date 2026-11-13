Architectural Status: WATCH
Decision: COMMENT

# Architect review, pass 2 (delta against stage-02-planner.md; revision stage-03-revision.md sha d026be18...)

Note: bash was restricted, so this body was passed via GJC_RALPLAN_ARTIFACT directly instead of /tmp/architect-review-pass2b.md.

## Summary
All pass-1 blockers are closed in substance. No CRITICAL/HIGH. Two MEDIUM and one LOW cluster remain; all are one-line text fixes, none makes the plan unexecutable. Verdict does not worsen versus pass 1 (WATCH/COMMENT).

## Map check (counted from the revision text, row length 20, 15 rows each)
- Layout 2 (2.3): candles 4+1+2+3+1+3 = 14 (rows 2,5,7,9,12,14 in 1-based 행). Ring 10 cells: (12,13),(13,13),(14,13),(15,13),(15,12),(15,11),(14,11),(13,11),(12,11),(12,12); all floor, consecutive orthogonally adjacent, last (12,12) adjacent to first (12,13). G at row-index 12 col 12 = 열12 행13 = ring[0]; code values match (col,row-1) conversion exactly. S (1,2) not in ring.
- Layout 3 (2.4): candles 3+1+4+1+1+1+1+1+1+2 = 16 (counted per row 2,4,5,6,7,8,9,10,11,14). Ring 12 cells: (10,12)..(14,12),(14,11),(14,10),(13,10)..(10,10),(10,11); all floor, adjacent, closes to (10,12). G at row-index 11 col 10 = 열10 행12 = ring[0]; code values match. S (1,2) not in ring.
- Totals 12+14+16 = 42 = /42 denominator. Candle reachability from S not re-derived by me (planner states hand-checked); not a blocker.

## Prior blockers
Architect pass 1:
1. Edit list incomplete: PARTIALLY closed. Section 4 now has 12 items and covers 7/8/9장, 아직 안 정한 것, R2 범위, 판정 순서 8; remaining gaps are findings 2 and 3 below.
2. AC-4.2/4.4 checkability and source citation: CLOSED (ACs now state loop length 10/12, return-to-G after N valid turns, coordinates; 8장 records the AGENTS.md coordinate exception).
3. High-score contract: CLOSED (3.2: key lighting rules, always write at game end incl. 0, parseHighScore/nextHighScore pure with enumerated test values in 6장, thin wrapper untested).
4. AC-4.7 restart scope and code change list: CLOSED (D2 + AC-4.7 + AC-5.8; section 5 changes createState(0) in restartGame/goHome, matching current logic.js which uses createState(state.grid)).
Critic pass 1:
1. AC-5.4 browser-unobservable: reworked, but new defect (finding 1). Treat as closed for observability, reopened as MEDIUM text defect.
2. /12 ACs vs /42: MOSTLY closed (9.1 and 2.6); one 3장 HUD line missed (finding 2).
3. AC-4.4 checkability: closed.
4. AC-5.1 wording: closed (Network tab, .js modules excluded). LOW note: browsers may request favicon.ico (image); 'audio/image/font file requests 0' may be read strictly. Optional to say 'excluding favicon'.
5. Solver not reproducible: closed by downgrade (2.2 labels 85/91/80 as unverified, kept out of GAME_DESIGN, 8장).
6. Score logic not testable: closed (runScore, TOTAL_CANDLES, 6장 expectations).
7. Code change list gaps: closed (levels, logic, score.js, audio.js, strings, main, index.html, tests, sprites unchanged).
8. Doc edits incomplete: see finding 2/3, mostly closed.
9. Audio precedence: closed (3.1 end sound suppresses candle sound; try/catch silent).
10. Timeout AC: closed (AC-4.8).

## Internal consistency
- Scoring D3/D4, 2.5, 6장 tests, AC-4.5, AC-4.6, AC-5.5, AC-5.8: consistent. HUD /42 consistent in 2.6, 9.1, AC-4.1/4.3.
- D1 timer reset: 2.5 (60000 ms), AC-4.1: consistent. D2 restart: section 5, AC-4.7, 5.8, 9.1 AC-3.6 (layout-1 values): consistent. D4 final screen: 3.4, AC-4.6, AC-5.5 consistent.
- AC numbering: AC-4.1..4.9, AC-5.1..5.8 sequential; one wrong cross-reference (finding 3a).

## Findings
1. MEDIUM, AC-5.4: example 'layout 1 with 12 candles lit then lose' is unreachable because the 12th candle clears layout 1 (2.5). Max layout-1 loss score is 11. New in pass 2: AC-5.4 was rewritten in this revision to fix Critic-1, so it was not visible in pass 1. Fix: first run = clear layout 1, then lose on layout 2 with 0 lit (score 12); second run = lose on layout 1 with 0 lit; expect 최고 점수 12 after reload.
2. MEDIUM, section 4 edit 6 vs GAME_DESIGN.md 3장: the 게임 화면 bullet still says HUD '켜진 촛불 N/12' and edit 6 only rewrites '레이아웃 1.'. Leaves a /12 contradiction with 2.6. Not seen in pass 1 because the earlier edit list was too coarse to compare line by line. Fix: add HUD N/12 -> N/42 to edit 6.
3. LOW, stale text not in edit list: (a) 2.2 cites 'AC-4.4, AC-4.8' for win feasibility; correct is AC-4.9. (b) 2장 점수 sentence '시간 초과 점수는 그때 켜진 촛불 수다 (스펙 R9 확장)' and 아직 안 정한 것 item 2 '그때 켜진 촛불 수' conflict with cumulative D3; add to edits 3/12 (say cumulative). (c) 머리말 says 5장 전체 is user-approved with no marker while edit 8 adds agent-proposed maps (edit 1 says header unchanged); reword header. (d) Edit 7 targets a 4장 sentence that does not exist (harmless no-op; say 'none'). Edit 8 should name the full 3-sentence line '레이아웃 2, 3은 아직 없다. ... 나머지는 R2 이후 채운다.'
4. Out of delta (not raised as a finding): 4장 and 6장 R1-era 'R1에서 바닥으로 그린다' columns are pre-existing and unaffected here.

## Root Cause
Section 4 was authored as a pattern edit list rather than from a line-by-line diff of current GAME_DESIGN.md; two quoted-phrase edits missed adjacent same-line occurrences.

## Recommendations
Apply findings 1-3 as inline text fixes in the revision (or as executor notes); no new ralplan pass required for these. Executor should diff GAME_DESIGN.md for remaining '/12', '12/12', '레이아웃 1만' strings after editing.

## Architectural Status
WATCH

## Code Review Recommendation
COMMENT

## Tradeoffs
Fixing inline now costs minutes; deferring leaves a /12 contradiction that the human acceptance step would hit. No design alternative changes.
