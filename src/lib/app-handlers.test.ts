import { getAppHandler, getSupportedApps } from "./app-handlers";

describe("getAppHandler", () => {
  it("should return handler for Safari", () => {
    const handler = getAppHandler("Safari");
    expect(handler).not.toBeNull();
    expect(handler?.getContext).toBeDefined();
  });

  it("should return handler for Chrome", () => {
    const handler = getAppHandler("Google Chrome");
    expect(handler).not.toBeNull();
  });

  it("should return handler for Mail", () => {
    const handler = getAppHandler("Mail");
    expect(handler).not.toBeNull();
  });

  it("should return handler for Outlook", () => {
    const handler = getAppHandler("Microsoft Outlook");
    expect(handler).not.toBeNull();
  });

  it("should return handler for Finder", () => {
    const handler = getAppHandler("Finder");
    expect(handler).not.toBeNull();
  });

  it("should return null for unsupported app", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = getAppHandler("SomeRandomApp" as any);
    expect(handler).toBeNull();
  });
});

describe("getSupportedApps", () => {
  it("should return array of supported apps", () => {
    const apps = getSupportedApps();
    expect(Array.isArray(apps)).toBe(true);
    expect(apps.length).toBeGreaterThan(0);
  });

  it("should include common browsers", () => {
    const apps = getSupportedApps();
    expect(apps).toContain("Safari");
    expect(apps).toContain("Google Chrome");
    expect(apps).toContain("Arc");
  });

  it("should include email apps", () => {
    const apps = getSupportedApps();
    expect(apps).toContain("Mail");
    expect(apps).toContain("Microsoft Outlook");
  });
});
