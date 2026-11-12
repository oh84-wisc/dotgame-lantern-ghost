# Architect 리뷰 pass 2 — R1 revision (stage-02-revision.md, sha256 c6beaf5d…)

범위: 직전 리뷰(stage-01-architect, C1~C7) 중 revision이 해소를 주장하는 항목만 델타 검토. 읽기 전용, 테스트/빌드 미실행.

## 해소 확인
- C1 (격자/유령 위치 분리): §4 logic.js 상태 형태 `{grid, ghost:{x,y}}`, grid 불변, 유령을 격자 문자로 표현하지 않음; 시작/촛불/경비병 시작 칸 통행·표시는 4-3·4-6로 확정 항목화. 해소.
- C2 (의존 방향·단일 출처): §4 '의존 방향(고정)' — levels.js는 다른 src import 금지, logic.js→levels.js만, sprites.js→levels.js, 팔레트 hex 단일 출처 sprites.js, logic→sprites 금지. static.test.js가 금지 토큰·hex 위치를 자동 점검. 해소.
- C3 (moveGhost 계약): 4-4 차단 시 반환 계약, 4-5 잘못된 direction을 4장 필수 확정 항목에 포함하고 logic.test.js에 대응 항목 있음. 해소.
- C4 (키 repeat/스크롤): §6 미정 D·E로 이관, index.html은 결정대로만 구현. 새 기능 추가 없음. 해소.
- C5 (경비병 시작 칸 표시): 4-6에 '경비병 스프라이트 vs 바닥'을 확정 항목으로 명시. 해소.
- C6 (9장 처리): §3.2 옵션 9-a(권고)/9-b와 §6 C항목으로 사람 결정화, §5 매핑표 번호 칸은 승인 후 기입. 해소.
- C7 (http.server): §4 index.html·§7에서 http.server 기본, file:// 괄호 제거. 해소.

## 신규 사항 (novelty 근거 없음 → 차단 아님)
- 비차단 참고(LOW): levels.test.js가 GAME_DESIGN.md 5장 코드블록을 파싱하므로 0단계 형식 요건(제목 줄+펜스 블록 1개)이 계획에 이미 포함됨 — 추가 조치 불필요.

## Findings
없음 (미해소 CRITICAL/HIGH/MEDIUM 없음).

## Architectural Status
CLEAR

## Decision
APPROVE
