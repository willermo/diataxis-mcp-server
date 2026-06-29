import { describe, expect, it } from "vitest";
import { slugifyPathSegment } from "../src/core/path-utils.js";

describe("slugifyPathSegment", () => {
  it("normalizes accented Latin text", () => {
    expect(slugifyPathSegment("Diátaxis Operational Summary for Agents")).toBe(
      "diataxis-operational-summary-for-agents"
    );
    expect(slugifyPathSegment("Perché usare Diátaxis")).toBe("perche-usare-diataxis");
  });

  it("falls back to untitled when input has no ASCII slug content", () => {
    expect(slugifyPathSegment("你好")).toBe("untitled");
  });
});
