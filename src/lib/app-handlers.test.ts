import { describe, expect, it } from "bun:test";
import { getAppHandler } from "./app-handlers";

describe("getAppHandler", () => {
  it("returns handler for supported apps", () => {
    expect(getAppHandler("Safari")).not.toBeNull();
    expect(getAppHandler("Google Chrome")).not.toBeNull();
    expect(getAppHandler("Mail")).not.toBeNull();
    expect(getAppHandler("Finder")).not.toBeNull();
    expect(getAppHandler("Notes")).not.toBeNull();
  });

  it("returns null for unsupported apps", () => {
    expect(getAppHandler("RandomApp")).toBeNull();
  });
});
