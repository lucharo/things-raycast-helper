import { formatTitleWithEmoji } from "./frontmost-app";
import { CapturedContext } from "./types";

describe("formatTitleWithEmoji", () => {
  it("should add browser emoji for browser type", () => {
    const context: CapturedContext = {
      appName: "Safari",
      title: "Google",
      url: "https://google.com",
      type: "browser",
    };
    expect(formatTitleWithEmoji(context)).toBe("🌐 Google");
  });

  it("should add email emoji for email type", () => {
    const context: CapturedContext = {
      appName: "Mail",
      title: "Important Meeting",
      url: "message://123",
      type: "email",
    };
    expect(formatTitleWithEmoji(context)).toBe("📧 Important Meeting");
  });

  it("should add file emoji for file type", () => {
    const context: CapturedContext = {
      appName: "Finder",
      title: "Documents",
      url: "file:///Users/test/Documents",
      type: "file",
    };
    expect(formatTitleWithEmoji(context)).toBe("📁 Documents");
  });

  it("should add note emoji for note type", () => {
    const context: CapturedContext = {
      appName: "Notes",
      title: "Shopping List",
      url: "notes://123",
      type: "note",
    };
    expect(formatTitleWithEmoji(context)).toBe("📝 Shopping List");
  });

  it("should add message emoji for message type", () => {
    const context: CapturedContext = {
      appName: "Slack",
      title: "general - Company",
      url: null,
      type: "message",
    };
    expect(formatTitleWithEmoji(context)).toBe("💬 general - Company");
  });

  it("should add generic emoji for generic type", () => {
    const context: CapturedContext = {
      appName: "SomeApp",
      title: "Window Title",
      url: null,
      type: "generic",
    };
    expect(formatTitleWithEmoji(context)).toBe("📌 Window Title");
  });
});
