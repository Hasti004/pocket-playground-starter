import { describe, expect, it } from "vitest";
import { idlePhase } from "@/lib/idle";

describe("Kiosk idle policy", () => {
  it("starts the warning at 105 seconds", () => {
    expect(idlePhase(104_999).remaining).toBeNull();
    expect(idlePhase(105_000)).toEqual({ reset: false, remaining: 15 });
  });
  it("returns to welcome at 120 seconds", () => {
    expect(idlePhase(119_999).reset).toBe(false);
    expect(idlePhase(120_000)).toEqual({ reset: true, remaining: 0 });
  });
});