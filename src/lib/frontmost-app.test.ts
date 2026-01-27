import { describe, expect, it } from "bun:test";
import { formatTitleWithEmoji } from "./frontmost-app";
import { CapturedContext } from "./types";

describe("formatTitleWithEmoji", () => {
  const cases: [CapturedContext["type"], string][] = [
    ["browser", "🌐"],
    ["email", "📧"],
    ["file", "📁"],
    ["note", "📝"],
    ["generic", "📌"],
  ];

  cases.forEach(([type, emoji]) => {
    it(`adds ${emoji} for ${type}`, () => {
      const ctx: CapturedContext = { appName: "App", title: "Title", url: null, type };
      expect(formatTitleWithEmoji(ctx)).toBe(`${emoji} Title`);
    });
  });
});
