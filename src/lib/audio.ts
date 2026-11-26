let audio: AudioContext | undefined;

/** Synthesized feedback; created only after an explicit user interaction. */
export function playFeedback(muted: boolean, kind: "tap" | "win" = "tap") {
  if (muted) return;
  try {
    audio ??= new AudioContext();
    const context = audio;
    void context.resume();
    const notes = kind === "win" ? [523.25, 659.25, 783.99, 1046.5] : [480];
    notes.forEach((frequency, i) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + i * 0.12;
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.035, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.2);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  } catch { /* Silent fallback for kiosks without audio output. */ }
}