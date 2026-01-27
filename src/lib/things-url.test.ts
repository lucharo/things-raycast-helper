import { describe, expect, it } from "bun:test";
import { buildThingsUrl, parseThingsUrl } from "./things-url";

describe("buildThingsUrl", () => {
  it("builds URL with title", () => {
    const url = buildThingsUrl({ title: "Test task" });
    expect(url).toContain("things:///add");
    expect(url).toContain("title=Test+task");
  });

  it("includes notes", () => {
    expect(buildThingsUrl({ title: "Test", notes: "https://example.com" })).toContain("notes=https");
  });

  it("includes when", () => {
    expect(buildThingsUrl({ title: "Test", when: "today" })).toContain("when=today");
    expect(buildThingsUrl({ title: "Test", when: "evening" })).toContain("when=evening");
  });

  it("includes tags comma-separated", () => {
    expect(buildThingsUrl({ title: "Test", tags: ["work", "urgent"] })).toContain("tags=work%2Curgent");
  });

  it("includes show-quick-entry when true", () => {
    expect(buildThingsUrl({ title: "Test", showQuickEntry: true })).toContain("show-quick-entry=true");
    expect(buildThingsUrl({ title: "Test", showQuickEntry: false })).not.toContain("show-quick-entry");
  });

  it("encodes special characters", () => {
    expect(buildThingsUrl({ title: "Test & task" })).toContain("%26");
  });

  it("includes list", () => {
    expect(buildThingsUrl({ title: "Test", list: "My Project" })).toContain("list=My+Project");
  });
});

describe("parseThingsUrl", () => {
  it("parses URL params", () => {
    expect(parseThingsUrl("things:///add?title=Test+task").title).toBe("Test task");
    expect(parseThingsUrl("things:///add?title=Test&notes=Note").notes).toBe("Note");
    expect(parseThingsUrl("things:///add?title=Test&when=today").when).toBe("today");
    expect(parseThingsUrl("things:///add?title=Test&tags=a,b").tags).toEqual(["a", "b"]);
  });

  it("round-trips params", () => {
    const original = { title: "Task", notes: "note", when: "today" as const, tags: ["a", "b"], showQuickEntry: true };
    const parsed = parseThingsUrl(buildThingsUrl(original));
    expect(parsed.title).toBe(original.title);
    expect(parsed.notes).toBe(original.notes);
    expect(parsed.when).toBe(original.when);
    expect(parsed.tags).toEqual(original.tags);
    expect(parsed.showQuickEntry).toBe(original.showQuickEntry);
  });
});
