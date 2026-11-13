// 효과음은 Web Audio로 직접 합성한다 (오디오 파일 없음, 배경음악 없음).
// 기획서 7장 기준. AudioContext는 [시작]을 누를 때 처음 만든다 (브라우저가 사용자 클릭 전 소리를 막기 때문).
// 모든 소리 호출은 try/catch로 감싼다. 소리가 실패해도 게임은 계속된다.
let context = null;

export function unlockAudio() {
  try {
    if (!context) context = new AudioContext();
  } catch {
    context = null;
  }
}

function tone(startAt, { type, from, to, duration, gain }) {
  const osc = context.createOscillator();
  const amp = context.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, startAt);
  if (to !== from) osc.frequency.linearRampToValueAtTime(to, startAt + duration);
  amp.gain.setValueAtTime(gain, startAt);
  amp.gain.linearRampToValueAtTime(0.0001, startAt + duration);
  osc.connect(amp);
  amp.connect(context.destination);
  osc.start(startAt);
  osc.stop(startAt + duration);
}

function play(notes) {
  if (!context) return;
  try {
    const now = context.currentTime;
    for (const note of notes) tone(now + (note.delay ?? 0), note);
  } catch {
    // 소리 오류는 무시한다. 게임은 소리 없이 계속된다.
  }
}

export function playCandle() {
  play([{ type: "square", from: 880, to: 880, duration: 0.06, gain: 0.15 }]);
}

export function playClear() {
  play([{ type: "triangle", from: 440, to: 880, duration: 0.3, gain: 0.2 }]);
}

export function playLose() {
  play([{ type: "sawtooth", from: 220, to: 110, duration: 0.4, gain: 0.2 }]);
}

export function playWin() {
  play([
    { type: "triangle", from: 523, to: 523, duration: 0.15, gain: 0.2, delay: 0 },
    { type: "triangle", from: 659, to: 659, duration: 0.15, gain: 0.2, delay: 0.15 },
    { type: "triangle", from: 784, to: 784, duration: 0.15, gain: 0.2, delay: 0.3 },
  ]);
}
