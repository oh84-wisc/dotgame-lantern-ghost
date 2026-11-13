// Sound effects with Web Audio synthesis only (no audio files, no background music).
// GAME_DESIGN.md chapter 7. The AudioContext is created on the [시작] click (browser autoplay rule).
// Every call is wrapped: a sound failure never breaks play.
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
    // Ignore audio failures; the game continues silently.
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
