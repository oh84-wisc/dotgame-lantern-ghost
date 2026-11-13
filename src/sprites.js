// hex 색을 적는 유일한 파일이다. 값은 기획서 6장의 팔레트와 같다.
// 번호: 1 = 배경, 2 = 벽, 3 = 바닥, 4 = 꺼진 촛불, 5 = 켜진 촛불, 6 = 유령, 7 = 경비병, 8 = 시야 칸.
export const PALETTE = {
  1: "#0b0b14",
  2: "#2a2a40",
  3: "#3d3d5c",
  4: "#f2e6b0",
  5: "#ffcc33",
  6: "#e8f4ff",
  7: "#cc3344",
  8: "#8888aa",
};

export const TILE_SIZE = 16;

// 벽(2) 또는 바닥(3)만 돌려준다. 촛불, 경비병, 유령 시작 칸은 바닥으로 그리고
// 그 위에 호출하는 쪽이 덧그린다.
export function tileColorIndex(symbol) {
  if (symbol === "#") return 2;
  return 3;
}

export function candleColorIndex(isLit) {
  return isLit ? 5 : 4;
}
