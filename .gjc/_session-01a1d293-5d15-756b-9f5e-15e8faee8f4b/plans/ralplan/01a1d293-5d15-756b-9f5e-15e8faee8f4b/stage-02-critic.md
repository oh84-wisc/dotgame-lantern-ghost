Verdict: ITERATE

Scope: plan-only Critic review of stage-02-planner.md against GAME_DESIGN.md, AGENTS.md, src/logic.js, src/levels.js, src/main.js, index.html, tests. (Note: /tmp/critic-review-pass2.md was not written because bash is restricted to gjc/git commands and no write tool is available; this artifact is the verdict file.)

Verified OK (hand-checked against the map text)
- Layout 2 candles = 4+1+2+3+1+3 = 14; layout 3 = 3+1+4+1+1+1+1+1+1+2 = 16. Every row is 20 chars. Border is all #.
- L2 loop (12,13)->(13,13)->(14,13)->(15,13)->(15,12)->(15,11)->(14,11)->(13,11)->(12,11)->(12,12): 10 tiles, all floor, each step 4-adjacent, closes to G (12,13). Code values (x, y-1) are converted correctly.
- L3 loop starting at G (10,12): 12 tiles, all floor, adjacent, closes. Code values correct. S is not in either loop.
- Arithmetic is consistent: 12+14=26 (AC-4.3), 12+14+16=42, 80*0.12=9.6s and 91*0.12=10.9s.
- A hand-built L3 tour came to about 83 turns, so the claimed 80 is plausible. Solvability against the guard is NOT independently verified.
- AGENTS.md prohibitions: respected. No package.json, no external assets, no BGM, no mute or settings, no leaderboard (a single high score is not a leaderboard), palette unchanged, logic.js stays pure (runScore is pure), option B correctly rejected. Patrol coordinates in levels.js are a pre-existing exception, already flagged in section 8.
- Turn order 1-9 stays unchanged except step 8 (next layout or final win). Win-before-timeout ordering is preserved.

Findings

1. HIGH - AC-5.4 cannot be observed in a browser (section 7 AC-5.4, section 3.4). The high score is shown only on the final screen. A win always scores 42, so the final screen can never show a stored value that a lower score failed to lower. Section 3.4 and edit 5 define no high-score display on the lose or start screens. A reload test needs a place to read the value. Fix: either rewrite AC-5.4 as a devtools Local Storage check (lose with a lower N after a higher N: value unchanged; reload: value unchanged), or add `최고 점수 N` to the lose screen in 3장 and AC. Pick one and state it in the 3장 edit.

2. HIGH - Chapter 9 edits leave existing ACs contradicting the new /42 display (section 4 edits 2 and 9). Edit 9 touches only the 'win screen' wording of AC-3.3 and AC-3.4. These stay as `/12` and will fail in the browser once the HUD shows N/42: AC-2.6 (`N/12`), AC-3.1 (`N/12`), AC-3.4 (`N/12`), AC-3.6 (`0/12`), AC-3.3 (`12/12` after layout 1 now advances instead of winning). Fix: list each AC to rewrite, and mark AC-2.x/AC-3.x layout-1 specifics (loop cols 9-12, G (9,14)) as layout-1 scoped. AC-3.6 must say layout 1, 0/42.

3. MEDIUM - AC-4.4 is not checkable and AC-4.2 cites the wrong source. AC-4.4 asks a human to follow an 80-turn route that the AC says is not published. 'Can follow in 60s' is subjective. AC-4.2 and AC-4.4 cite '기획서 5장 2.3 / 2.4', which are plan section numbers, not doc sections. '80턴' and the shortest-turn table (2.2) are not in the doc edit list (edit 6 adds maps and loops only). Fix: add checkable loop ACs for layout 2 and layout 3 (after N valid turns the guard is back on G: 10 turns -> (12,13), 12 turns -> (10,12), same pattern as AC-2.7). Drop 'shortest 80 turns' from the AC, or put the number in the doc and say how a human checks it.

4. MEDIUM - AC-5.1 is false as written. 'File requests 0' is untrue: index.html and src/*.js modules are requests. Reword to 'no audio/image/font file requests', which is how AC-5.7 already says it.

5. MEDIUM - Solvability evidence is not reproducible. The table 85/91/80 comes from an 'agent solver' that is not a deliverable, not in the code change list, and not recorded in the doc. Executors and the human cannot re-verify. Fix: say where the solver output lives, or list the per-layout 'winnable' check as a human-verified AC and soften section 2.2 to 'unverified claim'.

6. MEDIUM - High-score tests are not runnable with the described structure (section 5 score.js, section 6). Cases 'empty / abc -> 0' and 'stored 42, new 17 -> 42' need pure functions (parse stored string, merge score) that take values, not a global localStorage. `node --test` has no browser localStorage. Fix: specify pure `parseHighScore(raw)` and `nextHighScore(stored, score)` with a thin storage wrapper that is not tested, and state which file holds them.

7. MEDIUM - Code change list misses real breakages (section 5 vs src/*). (a) restartGame/goHome call createState(state.grid), and main.js calls createState(LAYOUT_1); both must change to layout index 0 and the new LAYOUTS import. (b) main.js HUD and renderPanel use totalCandles(state), which is per-grid (12/14/16); the 42 denominator and cumulative count source (cleared + lit.length) are not named as functions. Step 8 must still compare against the per-layout total while the HUD uses 42, so these are two different functions. (c) index.html panel has one #panel-detail <p>; the final screen needs two lines (총 켜진 촛불 / 최고 점수); index.html is not in the change list. (d) The existing tests import LAYOUT_1/PATROL_1 and createState(LAYOUT_1) and assert 12/12 win; section 5 says only 'use section 6 values'. State that all goal-1~3 test cases are kept and ported, and the layout-1 win test is replaced.

8. LOW - Doc edits incomplete. Edit 1 removes the two R2-scope bullets but leaves the '**R2 범위**' heading; remove the heading too (user asked to remove the R2-only sentence). 5장 still says 'PATROL_1' in the code-value note and '레이아웃 2, 3은 아직 없다' - not in edit 6. 5장 heading/bullets still describe layout 1 only. Maps and loops are agent proposals; mark them `(에이전트 제안)` per the doc header convention (section 0 covers it generally, but say so in edit 6).

9. LOW - Audio edge cases. On a candle-lighting final turn, the candle sound and the clear/win/lose sound start at the same time; precedence is not defined. audio.js has no failure handling (AC-1.5 console errors 0) while score.js does. AudioContext creation at [시작] is correct, but [다시 시작] after a context error is unspecified.

10. LOW - AC-4.5 covers only caught/sight loss. Timeout in layout 2/3 (N = 12/26 + lit) is not an AC; add one clause.

Hidden risks
- Section 8 risk 1 (80-91 turns inside 60 s) is honestly noted; human play is the only gate. Acceptable.
- Section 8 risk 2 (coordinates in doc vs AGENTS 'no separate coordinates') needs the human's answer before execution, not after; keep it as a gate.

Tradeoff: the architecture (option A) is sound. All blocking items are plan-text precision fixes, not redesign.

Recommendation: ITERATE. Fix findings 1 and 2 (HIGH) and 3-7 (MEDIUM) in the next Planner revision; 8-10 are optional polish.
