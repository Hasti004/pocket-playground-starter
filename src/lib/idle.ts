export const IDLE_WARNING_MS = 105_000;
export const IDLE_RESET_MS = 120_000;

export function idlePhase(elapsed: number) {
  if (elapsed >= IDLE_RESET_MS) return { reset: true, remaining: 0 };
  return { reset: false, remaining: elapsed >= IDLE_WARNING_MS ? Math.ceil((IDLE_RESET_MS - elapsed) / 1000) : null };
}