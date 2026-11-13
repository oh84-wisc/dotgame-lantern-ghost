# Lantern Ghost

화면 하나짜리 도트 게임. 유령이 저택의 촛불을 모두 밝히기 전에 경비병에게 들키지 않고, 60초 안에 끝내야 합니다.

- 플레이 (GitHub Pages): https://oh84-wisc.github.io/dotgame-lantern-ghost/
- 기획 기준: [GAME_DESIGN.md](GAME_DESIGN.md) (규칙은 2장, 맵은 5장, 수용 기준은 9장)

## 실행 방법

HTML + Canvas 2D + ES modules로 만들었고 빌드 과정과 외부 의존성이 없습니다. `index.html`을 파일로 직접 열면 ES module 로드가 막히므로 (file:// CORS) 로컬 서버를 띄워야 합니다.

```sh
python3 -m http.server 8000
```

그다음 브라우저에서 http://localhost:8000/ 을 엽니다.

테스트는 Node 내장 러너로 실행합니다.

```sh
node --test test/
```

## 조작

| 키 | 동작 |
|---|---|
| 방향키 ↑ ↓ ← → | 유령이 한 칸 이동 (한 번 누르면 한 칸, 누르고 있어도 반복되지 않음) |
| [시작] 버튼 | 게임 시작 (타이머 시작) |
| [다시 시작] 버튼 | 레이아웃 1부터 다시 시작 (누적 촛불 0) |
| [처음으로] 버튼 | 시작 화면으로 |

벽이나 화면 밖으로 가는 방향키는 턴을 쓰지 않습니다. 레이아웃 1, 2를 클리어하면 중간 화면 없이 다음 레이아웃으로 넘어가며 타이머는 60초로 다시 시작합니다. 레이아웃 3을 클리어하면 최종 화면이 뜹니다. 최고 점수는 브라우저의 localStorage 키 `lantern-ghost.highScore` 하나에 저장됩니다.

## 레벨 추가 방법

현재 레벨은 레이아웃 3개(12·14·16개 촛불, 순찰 8·10·12칸)이고, 최종 승리는 배열의 마지막 레이아웃입니다. 레벨을 하나 더 추가하려면 다음 순서로 바꿉니다.

1. **기획서를 먼저 고칩니다.** AGENTS.md 규칙상 맵 숫자와 규칙은 GAME_DESIGN.md가 기준입니다. GAME_DESIGN.md 5장에 새 레이아웃의 20×15 문자 맵과 순찰 고리 설명을 넣습니다. 기호는 `#` 벽, `.` 바닥, `S` 유령 시작, `c` 촛불, `G` 경비병 시작입니다.
2. **`src/levels.js`에 맵을 넣습니다.** 5장의 문자 맵을 글자 그대로 옮긴 배열(`LAYOUT_n`)을 만들고, 순찰 고리를 `PATROL_n` 좌표 배열로 만듭니다. 좌표는 `[x, y]`이며 x는 열, y는 행 번호(0부터)입니다. 순찰 첫 칸은 `G` 칸이어야 하고, 연속한 칸은 상하좌우로 한 칸씩 떨어져 있어야 하며, 마지막 칸은 첫 칸과 인접해야 합니다. 순찰 좌표 배열은 AGENTS.md에 적힌 예외입니다 (맵 문자로 표현할 수 없는 경로만 해당).
3. **`LAYOUTS` 배열에 추가합니다.** 플레이 순서대로 `{ rows, patrol }`을 넣습니다. 마지막 항목이 최종 레이아웃이 됩니다.
4. **테스트 기대값을 맞춥니다.**
   - `test/levels.test.js`의 `CANDLES`, `PATROL_LENGTHS` 배열과 "three layouts" 테스트의 레이아웃 개수를 새 값으로 바꿉니다.
   - `test/logic.test.js`의 `TOTAL_CANDLES` 기대값 42와 "clearing layout 3 is the final win" 테스트를 새 최종 레이아웃 기준으로 고칩니다.
   - 새 레이아웃에 맞는 순찰 길이 테스트를 추가합니다.
   - 기대값은 GAME_DESIGN.md의 숫자에서 가져옵니다.
5. **확인합니다.** `node --test test/`가 통과하고, 로컬 서버에서 새 레이아웃을 직접 플레이합니다. 9장 수용 기준에 새 항목을 추가해 사람이 확인할 수 있게 합니다.

## 파일 구조

- `src/levels.js`: 레이아웃 맵과 순찰 좌표 (`LAYOUTS`)
- `src/logic.js`: 순수 게임 규칙 (상태를 받아 새 상태를 반환, 캔버스 없음)
- `src/main.js`: 입력, 타이머, 그리기, 소리, 최고 점수 저장, 패널
- `src/audio.js`: Web Audio 합성음 (오디오 파일 없음)
- `src/score.js`: 최고 점수 순수 함수와 localStorage 래퍼
- `src/strings.js`: 화면 문구
- `src/sprites.js`: 8색 팔레트
- `test/`: `node --test`로 실행하는 테스트
