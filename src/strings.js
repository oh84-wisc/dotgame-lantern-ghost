// All UI text lives here (AGENTS.md).
export const STRINGS = {
  title: "Lantern Ghost",
  start: "시작",
  restart: "다시 시작",
  home: "처음으로",
  win: "승리",
  lose: "패배",
};

export function timerText(timeLeftMs) {
  return `남은 시간 ${Math.ceil(timeLeftMs / 1000)}초`;
}

export function candleText(lit, total) {
  return `켜진 촛불 ${lit}/${total}`;
}
