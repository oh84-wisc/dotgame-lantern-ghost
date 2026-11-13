// Browser glue: input, timer frames, drawing, sound, high score, and screen panels. Rules live in logic.js.
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

const MOVE_LOCK_MS = 120; // GAME_DESIGN.md chapter 2: one tile takes 120 ms; keys during the move are ignored.

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

// A finished run (win or loss, including a 0 score) updates and saves the high score.
function finishRun(finished) {
  highScore = nextHighScore(highScore, runScore(finished));
  writeHighScore(highScore);
}

// Sound and run-end effects for one state change. When one turn both ends the run and lights a
// candle, only the end sound plays (GAME_DESIGN.md chapter 7).
function applyEvents(prev, next) {
  if (prev.screen !== "playing") return; // a finished run is handled once, when it ends
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
  event.preventDefault(); // arrow keys never scroll the page
  if (event.repeat) return; // one press = one tile
  const now = performance.now();
  if (now < lockedUntil) return;
  const next = stepTurn(state, direction);
  if (next === state) return; // wall or edge: no turn used
  applyEvents(state, next);
  state = next;
  lockedUntil = now + MOVE_LOCK_MS;
});

primaryButton.addEventListener("click", () => {
  if (state.screen === "start") {
    unlockAudio(); // AudioContext is created on a user gesture
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
