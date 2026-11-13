// 화면에 보이는 문구는 모두 여기에 둔다 (AGENTS.md 규칙).
export const STRINGS = {
  title: "Lantern Ghost",
  start: "시작",
  restart: "다시 시작",
  home: "처음으로",
  win: "승리",
  final: "모든 저택을 밝혔다",
  lose: "패배",
};

export function timerText(timeLeftMs) {
  return `남은 시간 ${Math.ceil(timeLeftMs / 1000)}초`;
}

export function candleText(lit, total) {
  return `켜진 촛불 ${lit}/${total}`;
}

export function totalCandleText(lit, total) {
  return `총 켜진 촛불 ${lit}/${total}`;
}

export function highScoreText(score) {
  return `최고 점수 ${score}`;
}
