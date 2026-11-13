// High score storage. One localStorage key holds the best finished-run score (GAME_DESIGN.md chapter 8).
// parseHighScore and nextHighScore are pure and tested; the read/write wrappers are thin glue.
export const HIGH_SCORE_KEY = "lantern-ghost.highScore";

// Missing, empty, or non-integer values read as 0.
export function parseHighScore(raw) {
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return 0;
  return Number(raw);
}

export function nextHighScore(stored, score) {
  return Math.max(stored, score);
}

// If localStorage is unavailable (for example blocked storage), the game keeps running:
// the high score reads as 0 and the write is skipped.
export function readHighScore() {
  try {
    return parseHighScore(localStorage.getItem(HIGH_SCORE_KEY));
  } catch {
    return 0;
  }
}

export function writeHighScore(value) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(value));
  } catch {
    // Storage unavailable: skip the save.
  }
}
