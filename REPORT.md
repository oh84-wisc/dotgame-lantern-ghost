# REPORT — Lantern Ghost

저장소: https://github.com/oh84-wisc/dotgame-lantern-ghost
플레이: https://oh84-wisc.github.io/dotgame-lantern-ghost/

> 표기: R1 ledger = `.gjc/_session-01a1cdd6-8f1e-7322-8fc2-f29d715aa919/ultragoal/ledger.jsonl`,
> R2 ledger = `.gjc/_session-01a1ce45-d178-759a-8b38-bcf30fc0c6fb/ultragoal/ledger.jsonl`,
> R3 ledger = `.gjc/_session-01a1d293-5d15-756b-9f5e-15e8faee8f4b/ultragoal/ledger.jsonl`. 줄 번호는 파일의 줄이다.

## 1. 기획서가 어떻게 자랐는가

- **v0** (`dee3e88`): 한 줄 콘셉트, 이동 규칙 표, 범위 밖, 아직 안 정한 것 목록. R0에서 deep-interview 답을 숫자로 옮겼고, 맵·팔레트·판정은 일부러 비워 두었다.
- **v1** (`299c654`): 4장 오브젝트, 5장 레이아웃 1 맵(20×15, 촛불 12개), 6장 8색 팔레트. goal-1(맵 위에서 유령이 움직인다)이 필요로 하는 만큼만 추가했다.
- **v2** (`6f8406b`): 2장 점수·판정 순서 1~9, 3장 화면 흐름, 9장 수용 기준 AC 20개. goal-2(촛불·경비병·타이머)와 goal-3(승패·화면 전환)이 필요했다.
- **v3** (`8515635`): 5장 레이아웃 2·3, 7장 사운드·UI 문구, 8장 기술 스펙, 9장 AC-4.x·5.x. goal-4(레벨 2·3), goal-5(소리·최고 점수·최종 화면)가 필요했다.

## 2. 막힌 goal의 원인 분석, 그리고 replan이 없었던 이유

**막힌 goal: R3의 G001 (goal-4·goal-5).** nudge 예산 6을 전부 썼다.

- R3 ledger 2, 5, 11, 13, 14, 17줄: `nudge` attempt 1~6 / budget 6. 이유는 매번 "an active story still has resolvable work"였다. 17줄이 6/6이다.
- 그 사이 6~9줄: 에이전트가 `add_subgoal` steering을 4번 거절당했다 (`--title`, `--objective`, `--evidence`, `--rationale` 누락). 10줄에서 5번째 시도가 G002(사람 확인 전용)로 받아들여졌다.
- 18줄: 코드·테스트(43개)가 끝난 뒤 G001 complete checkpoint가 "unable to resolve an authoritative integration base"로 거절됐다. 19~20줄: G002를 active로 올렸다가 "quality-gate evidence missing"으로 pending으로 되돌렸다.

**원인 판정: 기획서 쪽도, 에이전트가 기획서를 안 따른 것도 아니다. ralplan 플랜의 goal 구조 쪽이다.**
R3 플랜(`b26e969c…`)은 goal-4·goal-5의 완료 조건을 "사람이 브라우저에서 확인"으로 썼지만, 사람 확인 단계를 별도 goal로 나누지 않았다. 그래서 pause gate가 G001을 "아직 할 일이 남은 goal"로 보고 6번 되돌렸다. 에이전트는 명령 인자를 몰라 steering을 4번 틀렸다. 이 부분은 에이전트 쪽이다.

**replan(`replan-N:` 커밋)은 하지 않았다.** 5.2의 첫째 신호(nudge 예산 소진)에 해당할 수 있었지만, 소진은 코드가 막힌 것이 아니라 pause gate가 사람 확인 단계를 알아보지 못해서 생겼고, 코드·테스트·사람 확인은 모두 끝난 상태였다. 그래서 plan을 다시 쓰는 대신 G002로 쪼개서 풀었다. 되돌아보면 사람 확인을 처음부터 별도 goal로 나눈 plan이 맞았고, 이 점이 이번 실행의 가장 큰 아쉬움이다.
다른 라운드는 nudge가 R1 ledger 4줄, R2 ledger 2줄에서 1번씩만 있었고 예산에 닿지 않았다. 같은 AC가 사람 확인에서 두 번 연속 X가 된 일은 없었고, 기획서에 없는 기능을 만든 일도 없었다.

**G001·G002가 complete 되지 못한 이유.** completion gate가 처음에는 `bun test:e2e`·`bun test:red-team`과 integration base를 요구했고(R1 ledger 15, 20줄), remote를 만든 뒤에는 architectReview·executorQa·iteration이 든 quality-gate JSON을 요구했다(R3 ledger 18~20줄). 스펙이 `package.json`·`bun`을 금지하므로 앞의 요구는 스펙과 충돌했다. 뒤의 요구는 실제 리뷰 결과가 필요한데 실행하지 않았고, 에이전트는 그 필드를 지어내지 않고 멈췄다. 두 goal은 blocked/pending으로 남겼다.

## 3. harness가 막은 것과 못 막은 것

**막은 것**
- AGENTS.md "좌표를 따로 적지 않는다": 경비병 순찰 고리가 맵 문자로 표현되지 않아 충돌했고, 에이전트가 임의로 어기지 않고 멈춰 사람에게 물었다. 승인 뒤 예외 한 줄을 넣었다 (`5e8d504`, R3 플랜 "Intent Reconciliation").
- AGENTS.md 완료 조건 "테스트 통과는 완료가 아니다": R1~R3 모두 goal이 사람 브라우저 확인 전에는 pause에 머물렀다.
- ralplan planner 질문: 승리하면 항상 42/42라 최고 점수가 첫 승리 뒤 의미가 없어진다는 점을 코드 전에 잡았다. 스펙을 바꾸지 않기로 했다.
- R1 critic 지적 C7과 R2·R3 architect/critic 재검토: 점수 분모 `/12`→`/42`, AC 문구, 5장 편집 목록의 빠진 항목이 플랜에서 고쳐졌다.
- 에이전트는 quality-gate 필드를 지어내지 않고 멈췄고, `--force`도 쓰지 않았다.

**못 막은 것**
- AGENTS.md 템플릿의 "index.html 열기"는 ES module을 쓰면 `file://`에서 열리지 않는다. 첫 브라우저 확인이 빈 화면(콘솔 CORS 오류)이었다. 실행 줄을 로컬 서버로 고쳤다 (R1, 사람 개입).
- ralplan 승인 gate가 R2와 R3에서 선택을 기록하지 못했고, 에이전트가 먼저 `handoff`로 바꾼 상태가 되돌려지지 않았다(`--force` 필요). 스펙의 `gjc ultragoal create-goals --brief-file`로 우회했다.
- R3 ralplan 기록에 stage-01 planner가 잘못된 내용(경로 문자열)으로 남았고, 두 번째 critic이 architect 타입으로 기록됐다.
- 에이전트가 `design-v3` 커밋 없이 기획서 변경을 goal-4·goal-5 커밋에 섞었고, 4장에 R1 시절 문구("R2 이후에 그린다")가 남았다. 사람이 짚은 뒤 `design-v3`로 정리했다 (`8515635`).
- 에이전트가 시키지 않은 G002 상태 변경(pending→active)을 했다가 되돌렸다 (R3 ledger 19~20줄).
- 무엇을 추가했어야 막혔을까: ① 사람 확인을 별도 goal로 나누는 플랜 규칙, ② AGENTS.md 실행 줄이 ES module과 맞는지 R0에서 확인하는 항목, ③ 기획서 변경은 `design-vN:` 커밋으로만 한다는 AGENTS.md 한 줄.

## 4. 사람이 개입한 횟수와 이유

- **승인 약 10회**: R1 ralplan 최종, 4~6장과 에이전트 제안 값(120 ms, 16×16 px), AGENTS.md 실행 줄 수정, R1 gate 결정(G002 blocked 유지), R2 플랜(재승인 포함), R3 플랜(재요청 포함), AGENTS.md 순찰 좌표 예외 문구, G002 사람 확인, remote 추가 뒤 gate 재시도.
- **반려 0회.**
- **확인 X 1회**: R1 브라우저 확인에서 빈 화면(`file://`, ES module CORS). 서버로 연 뒤 통과.
- **범위 밖 삭제 0회.**
- 사람 확인이 필요했던 이유는 모두 AGENTS.md 완료 조건과 스펙 5.1의 "사람 확인 → verify → checkpoint → 커밋"이다. R2·R3에서는 AC 전 항목(AC-1.x~5.8, 37개)을 직접 확인했고, 기획서 9장에 확인 표시를 남겼다 (`1aa0954`).
