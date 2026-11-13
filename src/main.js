// Browser glue: input, timer frames, drawing, and screen panels. Rules live in logic.js.
import { LAYOUT_1 } from "./levels.js";
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
  totalCandles,
} from "./logic.js";
import { PALETTE, TILE_SIZE, tileColorIndex, candleColorIndex } from "./sprites.js";
import { STRINGS, timerText, candleText } from "./strings.js";

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
const primaryButton = document.getElementById("primary");
const secondaryButton = document.getElementById("secondary");

let state = createState(LAYOUT_1);
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
    const sight = sightTile(state.guard);
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
  hudCandles.textContent = candleText(state.lit.length, totalCandles(state));
}

function renderPanel() {
  const total = totalCandles(state);
  if (state.screen === "playing") {
    panel.hidden = true;
  } else {
    panel.hidden = false;
    if (state.screen === "start") {
      panelMessage.textContent = STRINGS.title;
      panelDetail.textContent = "";
      primaryButton.textContent = STRINGS.start;
      secondaryButton.hidden = true;
    } else {
      panelMessage.textContent = state.screen === "win" ? STRINGS.win : STRINGS.lose;
      panelDetail.textContent = candleText(state.lit.length, total);
      primaryButton.textContent = STRINGS.restart;
      secondaryButton.textContent = STRINGS.home;
      secondaryButton.hidden = false;
    }
  }
  shownScreen = state.screen;
}

function frame(now) {
  const elapsed = now - lastFrame;
  lastFrame = now;
  state = tick(state, elapsed);
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
  state = next;
  lockedUntil = now + MOVE_LOCK_MS;
});

primaryButton.addEventListener("click", () => {
  state = state.screen === "start" ? startGame(state) : restartGame(state);
});

secondaryButton.addEventListener("click", () => {
  state = goHome(state);
});

applyTheme();
renderPanel();
requestAnimationFrame(frame);
