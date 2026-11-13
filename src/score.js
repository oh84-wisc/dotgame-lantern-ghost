// 최고 점수 저장. localStorage 키 하나에 끝난 판 중 가장 높은 점수를 저장한다 (기획서 8장).
// parseHighScore, nextHighScore는 순수 함수라 테스트한다. 읽기/쓰기 함수는 얇은 연결부다.
export const HIGH_SCORE_KEY = "lantern-ghost.highScore";

// 값이 없거나 비었거나 정수가 아니면 0으로 읽는다.
export function parseHighScore(raw) {
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return 0;
  return Number(raw);
}

export function nextHighScore(stored, score) {
  return Math.max(stored, score);
}

// localStorage를 쓸 수 없어도 (예: 저장소가 막힌 브라우저) 게임은 계속된다:
// 최고 점수는 0으로 읽고, 저장은 건너뛴다.
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
    // 저장소를 쓸 수 없으면 저장을 건너뛴다.
  }
}
