// 브라우저 연결부: 입력, 프레임 타이머, 그리기, 소리, 최고 점수, 화면 패널. 게임 규칙은 logic.js에 있다.
import {
  createState,
  stepTurn,
  tick,
  startGame,
  restartGame,
  goHome,
  isCandleLit,
  isWall,
  sightTile,
  runScore,
  TOTAL_CANDLES,
} from "./logic.js";
import { PALETTE, TILE_SIZE, tileColorIndex, candleColorIndex } from "./sprites.js";
import { STRINGS, timerText, candleText, totalCandleText, highScoreText } from "./strings.js";
import { readHighScore, writeHighScore, nextHighScore } from "./score.js";
import { unlockAudio, playCandle, playClear, playLose, playWin } from "./audio.js";

const MOVE_LOCK_MS = 120; // 기획서 2장: 한 칸 이동은 120 ms이고, 이동 중에 들어온 방향키는 무시한다.

const KEY_TO_DIRECTION = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
const hudTimer = document.getElementById("timer");
const hudCandles = document.getElementById("candles");
const panel = document.getElementById("panel");
const panelMessage = document.getElementById("panel-message");
const panelDetail = document.getElementById("panel-detail");
const panelHighScore = document.getElementById("panel-highscore");
const primaryButton = document.getElementById("primary");
const secondaryButton = document.getElementById("secondary");

let state = createState(0);
let highScore = readHighScore();
let lockedUntil = 0;
let lastFrame = performance.now();
let shownScreen = null;

function applyTheme() {
  document.title = STRINGS.title; // 탭 제목도 화면 문구와 같이 strings.js 한 곳에서 가져온다
  document.body.style.background = PALETTE[1];
  document.body.style.color = PALETTE[4];
  for (const button of [primaryButton, secondaryButton]) {
    button.style.background = PALETTE[3];
    button.style.color = PALETTE[4];
    button.style.border = `2px solid ${PALETTE[2]}`;
  }
  panel.style.background = PALETTE[1];
  panel.style.color = PALETTE[4];
}

function drawBoard() {
  ctx.fillStyle = PALETTE[1];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  state.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      ctx.fillStyle = PALETTE[tileColorIndex(row[x])];
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      if (row[x] === "c") {
        ctx.fillStyle = PALETTE[candleColorIndex(isCandleLit(state, x, y))];
        ctx.fillRect(x * TILE_SIZE + 4, y * TILE_SIZE + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      }
    }
  });
  if (state.screen === "playing" || state.screen === "lose" || state.screen === "win") {
    const sight = sightTile(state);
    if (!isWall(state, sight.x, sight.y)) {
      ctx.fillStyle = PALETTE[8];
      ctx.fillRect(sight.x * TILE_SIZE, sight.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
  ctx.fillStyle = PALETTE[7];
  ctx.fillRect(state.guard.x * TILE_SIZE, state.guard.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = PALETTE[6];
  ctx.fillRect(state.ghost.x * TILE_SIZE, state.ghost.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function renderHud() {
  hudTimer.textContent = timerText(state.timeLeftMs);
  hudCandles.textContent = candleText(runScore(state), TOTAL_CANDLES);
}

function renderPanel() {
  if (state.screen === "playing") {
    panel.hidden = true;
  } else {
    panel.hidden = false;
    if (state.screen === "start") {
      panelMessage.textContent = STRINGS.title;
      panelDetail.textContent = "";
      panelHighScore.textContent = "";
      primaryButton.textContent = STRINGS.start;
      secondaryButton.hidden = true;
    } else {
      panelMessage.textContent = state.screen === "win" ? STRINGS.final : STRINGS.lose;
      panelDetail.textContent =
        state.screen === "win"
          ? totalCandleText(runScore(state), TOTAL_CANDLES)
          : candleText(runScore(state), TOTAL_CANDLES);
      panelHighScore.textContent = highScoreText(highScore);
      primaryButton.textContent = STRINGS.restart;
      secondaryButton.textContent = STRINGS.home;
      secondaryButton.hidden = false;
    }
  }
  shownScreen = state.screen;
}

// 판이 끝나면 (승리든 패배든, 점수 0도 포함) 최고 점수를 갱신하고 저장한다.
function finishRun(finished) {
  highScore = nextHighScore(highScore, runScore(finished));
  writeHighScore(highScore);
}

// 상태가 바뀔 때마다 소리와 판 종료 처리를 한다. 한 턴에 판이 끝나면서 촛불도 켜지면
// 끝나는 소리만 낸다 (기획서 7장).
function applyEvents(prev, next) {
  if (prev.screen !== "playing") return; // 끝난 판은 끝나는 순간 한 번만 처리한다
  if (next.screen === "lose") {
    playLose();
    finishRun(next);
  } else if (next.screen === "win") {
    playWin();
    finishRun(next);
  } else if (next.layoutIndex > prev.layoutIndex) {
    playClear();
  } else if (next.lit.length > prev.lit.length) {
    playCandle();
  }
}

function frame(now) {
  const elapsed = now - lastFrame;
  lastFrame = now;
  const next = tick(state, elapsed);
  applyEvents(state, next);
  state = next;
  drawBoard();
  renderHud();
  if (state.screen !== shownScreen) renderPanel();
  requestAnimationFrame(frame);
}

window.addEventListener("keydown", (event) => {
  const direction = KEY_TO_DIRECTION[event.key];
  if (!direction) return;
  event.preventDefault(); // 방향키로 페이지가 스크롤되지 않게 막는다
  if (event.repeat) return; // 키를 길게 눌러도 한 번 누른 것으로 친다 (한 번 = 한 칸)
  const now = performance.now();
  if (now < lockedUntil) return;
  const next = stepTurn(state, direction);
  if (next === state) return; // 벽이나 화면 밖이면 턴을 쓰지 않는다
  applyEvents(state, next);
  state = next;
  lockedUntil = now + MOVE_LOCK_MS;
});

primaryButton.addEventListener("click", () => {
  if (state.screen === "start") {
    unlockAudio(); // 사용자가 클릭할 때 AudioContext를 만든다
    state = startGame(state);
  } else {
    state = restartGame();
  }
});

secondaryButton.addEventListener("click", () => {
  state = goHome();
});

applyTheme();
renderPanel();
requestAnimationFrame(frame);
