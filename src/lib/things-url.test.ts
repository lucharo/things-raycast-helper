import { buildThingsUrl, parseThingsUrl } from "./things-url";

describe("buildThingsUrl", () => {
  it("should build a basic URL with just title", () => {
    const url = buildThingsUrl({ title: "Test task" });
    expect(url).toContain("things:///add");
    expect(url).toContain("title=Test+task");
  });

  it("should include notes when provided", () => {
    const url = buildThingsUrl({
      title: "Test task",
      notes: "https://example.com",
    });
    expect(url).toContain("notes=https");
  });

  it("should handle when parameter", () => {
    const url = buildThingsUrl({
      title: "Test task",
      when: "today",
    });
    expect(url).toContain("when=today");
  });

  it("should handle evening when", () => {
    const url = buildThingsUrl({
      title: "Test task",
      when: "evening",
    });
    expect(url).toContain("when=evening");
  });

  it("should handle tags as comma-separated", () => {
    const url = buildThingsUrl({
      title: "Test task",
      tags: ["work", "urgent"],
    });
    expect(url).toContain("tags=work%2Curgent");
  });

  it("should include show-quick-entry when true", () => {
    const url = buildThingsUrl({
      title: "Test task",
      showQuickEntry: true,
    });
    expect(url).toContain("show-quick-entry=true");
  });

  it("should not include show-quick-entry when false", () => {
    const url = buildThingsUrl({
      title: "Test task",
      showQuickEntry: false,
    });
    expect(url).not.toContain("show-quick-entry");
  });

  it("should handle special characters in title", () => {
    const url = buildThingsUrl({ title: "Test & task with 'quotes'" });
    expect(url).toContain("title=");
    // Should be URL encoded
    expect(url).toContain("%26"); // &
  });

  it("should handle list parameter", () => {
    const url = buildThingsUrl({
      title: "Test task",
      list: "My Project",
    });
    expect(url).toContain("list=My+Project");
  });

  it("should handle deadline", () => {
    const url = buildThingsUrl({
      title: "Test task",
      deadline: "2024-12-31",
    });
    expect(url).toContain("deadline=2024-12-31");
  });
});

describe("parseThingsUrl", () => {
  it("should parse title from URL", () => {
    const parsed = parseThingsUrl("things:///add?title=Test+task");
    expect(parsed.title).toBe("Test task");
  });

  it("should parse notes from URL", () => {
    const parsed = parseThingsUrl("things:///add?title=Test&notes=Some+notes");
    expect(parsed.notes).toBe("Some notes");
  });

  it("should parse when from URL", () => {
    const parsed = parseThingsUrl("things:///add?title=Test&when=today");
    expect(parsed.when).toBe("today");
  });

  it("should parse tags from URL", () => {
    const parsed = parseThingsUrl("things:///add?title=Test&tags=work,urgent");
    expect(parsed.tags).toEqual(["work", "urgent"]);
  });

  it("should round-trip a complex task", () => {
    const original = {
      title: "Complex task",
      notes: "https://example.com",
      when: "today" as const,
      tags: ["work", "urgent"],
      showQuickEntry: true,
    };

    const url = buildThingsUrl(original);
    const parsed = parseThingsUrl(url);

    expect(parsed.title).toBe(original.title);
    expect(parsed.notes).toBe(original.notes);
    expect(parsed.when).toBe(original.when);
    expect(parsed.tags).toEqual(original.tags);
    expect(parsed.showQuickEntry).toBe(original.showQuickEntry);
  });
});
