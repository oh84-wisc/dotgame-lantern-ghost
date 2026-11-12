# Post-interview: intent reconciliation

## Evidence inspected
- .gjc/_session-01a1cdd6-8f1e-7322-8fc2-f29d715aa919/specs/deep-interview-dotgame-ghost-candles.md
- GAME_DESIGN.md v0 (chapter schedule: 4, 5, 6 in R1; 2 rest, 3, 9 in R2; 7, 8 in R3)
- stage-02-revision.md, stage-02-critic.md (OKAY), stage-02-architect.md (CLEAR/APPROVE)

## Resolved material decisions
- Chapter 9 (acceptance criteria): user chose 9-b. Chapter 9 waits until R2. The R1 report says implementation and tests are done, acceptance mapping pending.
- Non-goals retained: procedural layouts, real-time ghost movement, multiple rooms, mobile/touch, and every AGENTS.md forbidden item.
- Scope retained: one goal, one tile per key press on the map. Ghost, guard, candle, clock, and score logic are outside R1.

## Still open (not decided by user; human confirmations before 0-stage approval)
- D: key repeat handling (repeat event = extra step, or ignored).
- E: whether arrow keys block default page scroll.
- Ghost start tile, key bindings beyond arrow keys, 8-color palette values, layout content (spec deferrals).

material-open-items: D, E, and the spec deferrals above. None changes objective, scope, or non-goals.
