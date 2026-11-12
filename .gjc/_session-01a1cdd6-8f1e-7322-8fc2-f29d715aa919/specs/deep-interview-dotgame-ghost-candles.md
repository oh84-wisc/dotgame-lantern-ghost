# Deep Interview Spec: Ghost Relights Candles (dotgame-lantern-ghost)

## Metadata
- Interview ID: 01a1cdd6-8f1e-7322-8fc2-f29d715aa919-di
- Rounds: 15 scored (Round 0 topology gate + 15 interview rounds)
- Final Ambiguity Score: 28%
- Type: greenfield
- Generated: 2026-11-12T13:40:00+09:00
- Threshold: 0.6
- Threshold Source: --quick mode default (no config.yml override)
- Initial Context Summarized: no
- Status: PASSED
- Auto-Answered Rounds: none
- Architect Failures: 0
- Lateral Reviews: none convened (all answers were direct user selections)
- Lateral Panel Failures: 0
- Refined Rounds: none
- Closure Overrides: none
- Restated Goal: A single-screen browser game with no dependencies where the player steps a ghost one grid tile per key press onto each of 10 to 20 candles across 3 fixed layouts played in order, each within a real-time 60-second countdown, while a fixed-patrol guard whose 1-tile flashlight cone catches the ghost for an immediate loss; the score is the candles lit at the moment of the catch.

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.60 | 0.40 | 0.240 |
| Constraint Clarity | 0.85 | 0.30 | 0.255 |
| Success Criteria | 0.75 | 0.30 | 0.225 |
| **Total Clarity** | | | **0.720** |
| **Ambiguity** | | | **0.280** |

Dimension scores are the minimum across the three active components (Ghost, Mansion, Guard).

## Topology
| Component | Status | Description | Coverage / Deferral Note |
|-----------|--------|-------------|--------------------------|
| Ghost | active | Steps one grid tile per key press; stepping onto a candle relights it; 60-second real-time countdown per layout | Goal 0.70 (start tile and key bindings not yet specified); constraints 0.85; criteria 0.80 |
| Mansion | active | One screen, one room; 3 fixed hand-authored layouts played in order; 10 to 20 candles per layout; win = all candles lit within 60 seconds | Goal 0.60 (layout content deferred by user); constraints 0.85; criteria 0.75 |
| Guard | active | Fixed patrol route of 8 to 12 steps; 1-tile flashlight cone ahead; catch = immediate loss; score = candles lit at the moment of catch | Goal 0.85 (start tile fixed per layout, same every run); constraints 0.85; criteria 0.85 |

No components were deferred.

## Established Facts
- R1: Player controls the ghost. Win = all candles lit before the guard catches it.
- R2: Mansion is one screen with one room and 10 to 20 candles.
- R3: Guard follows a fixed patrol route and catches the ghost only when the ghost is inside the flashlight cone.
- R4: Stepping onto a candle relights it instantly with no limit.
- R5: Win = all candles lit within a fixed time limit.
- R6: Catch ends the run as a loss. Lit candles are kept for the score.
- R7: Mansion uses several fixed hand-authored layouts, chosen in order.
- R8: Time limit is 60 seconds.
- R9: Score = number of candles lit at the moment of the catch.
- R10: Layout content is deferred by the user. The spec fixes the layout count and the rules, not the layout content.
- R11: Ghost moves one grid step per key press (turn-based).
- R12: The 60-second clock is a real-time countdown. Steps are turn-based, and the clock keeps running while the player takes time to choose a step.
- R13: Flashlight cone covers 1 tile straight ahead. Guard route loops 8 to 12 steps.
- R14: 3 layouts.
- R15: Guard starts its patrol at a fixed start tile per layout and repeats it on every run.

No established fact was disputed or superseded.

## Trigger Metadata
- R11: trigger D (scope/semantics tension). Turn-based movement vs. a 60-second limit. Status unresolved after R11, resolved in R12 (real-time countdown with turn-based steps). Ambiguity was flat across R11 and R12 because the minimum constraint score was held by Mansion and Guard, not Ghost.
- Arithmetic correction: R4 and R10 to R14 were initially scored with brownfield weights (criteria weight 0.25). They were corrected to greenfield weights (criteria 0.30) in R15. Corrected values: R4 = 62%, R10 to R13 = 35.5%, R14 and R15 = 28%. The threshold outcome is unchanged.

## Lateral Review Panel
No lateral panel was convened. The interview stayed in the progress/refined bands and produced no auto-answers, no refined free-text, and no unresolved disputes requiring a panel.

## Goal
A single-screen browser game with no dependencies. The player steps a ghost one grid tile per key press onto each of 10 to 20 candles across 3 fixed layouts played in order. Each layout has a real-time 60-second countdown. A fixed-patrol guard whose 1-tile flashlight cone catches the ghost for an immediate loss. The score is the number of candles lit at the moment of the catch.

## Constraints
- artifact:game-design-doc: A GAME_DESIGN.md spec is the single source of truth for the game. NOTE: this file does not exist in the repo yet; see Open Items.
- artifact:single-html-game: Deliver one index.html that runs in a browser.
- surface:canvas-screen: One screen rendered with Canvas 2D; no mobile or responsive layout.
- integration:none: No server, database, or external assets.
- constraint:no-deps: HTML, Canvas 2D, and plain JavaScript ES modules only; no build step, framework, or external library.
- Clock: real-time 60-second countdown per layout. Movement is turn-based (one step per key press); steps do not stop the clock.
- Ghost moves one grid tile per key press.
- Guard patrol: fixed route, 8 to 12 steps, fixed start tile per layout, identical every run.
- Guard flashlight cone: 1 tile straight ahead.
- Layout count: exactly 3, played in a fixed order.
- Candle count: 10 to 20 per layout.

## Non-Goals
- Procedurally generated or random layouts.
- Real-time (non-turn-based) ghost movement.
- Multiple rooms, multiple floors, or scrolling mansions.
- Layout content authoring as part of this spec (deferred by the user; see Deferrals).
- Mobile, touch, responsive layout, settings, difficulty selection, leaderboard, accounts, server, database, background music, level editor (all forbidden by AGENTS.md).

## Acceptance Criteria
- [ ] index.html opens in a browser with no server, no build step, and no external library.
- [ ] Movement is one grid tile per key press; stepping onto a candle relights it immediately.
- [ ] Each of the 3 layouts is played in order, with 10 to 20 candles each.
- [ ] Each layout has a real-time 60-second countdown that keeps running while the player is idle.
- [ ] The guard follows its fixed 8-to-12-step route from the same start tile on every run.
- [ ] The guard's 1-tile cone catches the ghost, which ends the run immediately as a loss.
- [ ] Winning = all candles in a layout lit before the countdown reaches zero.
- [ ] Score on a loss = number of candles lit at the moment of the catch.
- [ ] Timeout (countdown reaches zero before all candles are lit) ends the run as a loss; the score rule for timeouts is recorded as an Open Item.

## Deferrals
- Layout content (wall and candle placement for each of the 3 layouts) is deferred by the user in Round 10. The spec fixes the layout count (3), order, and candle range (10 to 20), but not the layout content.
- Convergence Pacing: no min-round floor, score-drop cap, or confidence dampening was applied. Bidirectional scoring was the pacing mechanism.

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| The player controls the ghost | Round 1 asked who drives the ghost | Player controls it |
| The mansion is large | Round 2 asked the room scale | One screen, one room, 10 to 20 candles |
| The guard uses a fixed pattern | Round 3 asked how the guard detects the ghost | Fixed route; catch only inside the 1-tile cone |
| The relight has a cost | Round 4 asked how relighting works | Instant, unlimited |
| The win has no time pressure | Round 5 asked what counts as a win | All lit within a fixed time limit |
| A catch has no further consequence | Round 6 asked what a catch does | Immediate loss; lit candles kept for score |
| Layouts are random | Round 7 asked how layouts are chosen | Several fixed hand-authored layouts, in order |
| The clock runs per step | Round 12 asked how the clock runs with turn-based steps | Real-time countdown; steps do not stop it |
| Score has no defined value | Round 9 asked what the score measures | Candles lit at the moment of the catch |

## Technical Context
Greenfield. The repo contains only AGENTS.md (no source files, no git history beyond the initial state). AGENTS.md defines: HTML + Canvas 2D + JavaScript ES modules; no dependencies, no build step; game logic in src/logic.js as pure functions; levels in src/levels.js (copied from GAME_DESIGN.md section 5 character grid maps); sprites in src/sprites.js as palette-index arrays; UI strings in src/strings.js; test command `node --test test/`; commit prefixes goal-N:, replan-N:, design-vN:, fix-N:.

## Ontology (Key Entities)
| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| Ghost | core domain | position, lit-candle count, grid step | Steps onto Candle to relight it |
| Candle | core domain | lit | Placed by Layout |
| Clock | supporting | 60-second real-time countdown | Ends the run as a loss when it reaches zero before all candles are lit |
| Layout | supporting | walls, candle positions (content deferred) | Game has 3 ordered Layouts |
| Guard | core domain | flashlight (1-tile cone), fixed patrol route (8 to 12 steps), fixed start tile per layout | Catches Ghost inside cone; catch ends run as a loss with score = lit candles |

## Ontology Convergence
| Round | Entity Count | New | Changed | Stable | Stability Ratio |
|-------|-------------|-----|---------|--------|----------------|
| 1 | 4 | 4 | - | - | N/A |
| 2 | 4 | 0 | 1 (Mansion renamed to Room) | 3 | 75% |
| 3 | 4 | 0 | 0 | 4 | 100% |
| 4 | 4 | 0 | 0 | 4 | 100% |
| 5 | 4 | 0 | 0 | 4 | 100% |
| 6 | 4 | 0 | 0 | 4 | 100% |
| 7 | 4 | 1 (Layout) | 0 | 3 | 80% |
| 8 | 4 | 0 | 0 | 4 | 100% |
| 9 | 4 | 0 | 0 | 4 | 100% |
| 10 | 4 | 0 | 0 | 4 | 100% |
| 11 | 4 | 0 | 0 | 4 | 100% |
| 12 | 5 | 1 (Clock) | 0 | 4 | 80% |
| 13 | 5 | 0 | 0 | 5 | 100% |
| 14 | 5 | 0 | 0 | 5 | 100% |
| 15 | 5 | 0 | 0 | 5 | 100% |

## Open Items
- Layout content for the 3 layouts (user-deferred, Round 10).
- Ghost start tile and key bindings (not asked; Ghost goal is 0.70).
- Score on timeout (not asked): the spec currently defines only score on a catch.
- GAME_DESIGN.md is referenced by AGENTS.md and by artifact:game-design-doc but does not exist in the repo. Layout content (AGENTS.md section 5) and the 8-color hex palette (section 6) must be supplied before implementation.
- Acceptance criteria numbering (AGENTS.md section 9) is not yet defined.

## Interview Transcript
<details>
<summary>Full Q&A (15 scored rounds + Round 0)</summary>

### Round 0
**Q:** Topology confirmation: Ghost, Mansion, Guard. Locked intent: artifact:game-design-doc, artifact:single-html-game, surface:canvas-screen, integration:none, constraint:no-deps.
**A:** Looks right
**Ambiguity:** not scored

### Round 1 (Ghost / goal)
**Q:** Who drives the ghost, and what counts as winning a run?
**A:** Player controls the ghost; win = all candles lit before the guard catches it
**Ambiguity:** 83% (Goal 0.20 min, Constraints 0.10 min, Criteria 0.20 min)

### Round 2 (Mansion / constraints)
**Q:** How big is one run's mansion?
**A:** Single screen, one room, about 10 to 20 candles
**Ambiguity:** 74%

### Round 3 (Guard / constraints)
**Q:** How does the guard move and catch the ghost?
**A:** Fixed patrol route; catches ghost if ghost is inside the flashlight cone
**Ambiguity:** 74% (flat; Ghost constraints still held the minimum)

### Round 4 (Ghost / constraints)
**Q:** How does the ghost relight a candle?
**A:** Walk onto the candle; instant relight, no limit
**Ambiguity:** 62% (corrected from 65%)

### Round 5 (Mansion / criteria)
**Q:** What ends a run as a win?
**A:** All candles lit within a fixed time limit
**Ambiguity:** 57%

### Round 6 (Guard / criteria)
**Q:** What happens when the guard catches the ghost?
**A:** Run ends immediately as a loss; lit candles are kept for the score
**Ambiguity:** 49.5%

### Round 7 (Mansion / goal)
**Q:** How is the single room's layout decided?
**A:** Several fixed hand-authored layouts, chosen in order
**Ambiguity:** 43.5%

### Round 8 (Ghost / criteria)
**Q:** How long is the time limit for lighting all candles in one layout?
**A:** 60 seconds
**Ambiguity:** 42%

### Round 9 (Guard / criteria)
**Q:** When the guard catches the ghost, what is the lit-candle score for?
**A:** Score = number of candles lit at the moment of the catch
**Ambiguity:** 37.5%

### Round 10 (Mansion / goal)
**Q:** Where do the room layouts come from? (AGENTS.md references GAME_DESIGN.md section 5, which is not in the repo.)
**A:** Defer layouts; spec only fixes the layout count and rules
**Ambiguity:** 39.25% (corrected to 35.5%)

### Round 11 (Ghost / constraints)
**Q:** How does the ghost move?
**A:** Grid step per key press (turn-based, no real-time speed)
**Ambiguity:** 39.25% (corrected to 35.5%); trigger D raised (clock semantics)

### Round 12 (Ghost / constraints)
**Q:** How does the clock run with turn-based steps?
**A:** Real-time countdown; the player can take as long as they want, but the 60 seconds keep running
**Ambiguity:** 39.25% (corrected to 35.5%); trigger D resolved

### Round 13 (Guard / constraints)
**Q:** How large is the guard's flashlight cone and how long is the patrol route?
**A:** Cone covers 1 tile straight ahead; route loops 8 to 12 steps
**Ambiguity:** 39.25% (corrected to 35.5%)

### Round 14 (Mansion / constraints)
**Q:** How many layouts does one game contain (played in order)?
**A:** 3 layouts
**Ambiguity:** 31.75% (corrected to 28%)

### Round 15 (Guard / goal)
**Q:** Where does the guard start its patrol at the beginning of each layout?
**A:** Fixed start tile per layout, with the patrol starting at the same tile every run
**Ambiguity:** 28%

### Restate gate
**Goal:** A single-screen browser game with no dependencies where the player steps a ghost one grid tile per key press onto each of 10 to 20 candles across 3 fixed layouts played in order, each within a real-time 60-second countdown, while a fixed-patrol guard whose 1-tile flashlight cone catches the ghost for an immediate loss; the score is the candles lit at the moment of the catch.
**Answer:** Yes, crystallize
</details>
