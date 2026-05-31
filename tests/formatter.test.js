import { describe, it, expect } from "vitest";
import { generateMarkdown } from "../src/formatter.js";

describe("formatter.js", () => {
  it("should generate proper markdown for Critical severity", () => {
    const data = {
      severity: "Critical",
      title: "Memory Leak",
      issue: "The connection is never closed.",
      fix: "Add a finally block to close the connection."
    };

    const markdown = generateMarkdown(data);
    
    expect(markdown).toContain("### Critical: Memory Leak");
    expect(markdown).toContain("The current implementation introduces a critical issue.");
    expect(markdown).toContain("The connection is never closed.");
    expect(markdown).toContain("Add a finally block to close the connection.");
  });

  it("should fallback to a default intro if severity is unknown", () => {
    const data = {
      severity: "Unknown",
      title: "Something",
      issue: "Bad code.",
      fix: "Fix code."
    };

    const markdown = generateMarkdown(data);
    expect(markdown).toContain("The current implementation requires attention.");
  });

  it("should use custom templates when passed via config", () => {
    const data = {
      severity: "Nitpick",
      title: "Formatting",
      issue: "Indentation is off.",
      fix: "Fix indentation."
    };

    const config = {
      templates: {
        Nitpick: "This is a tiny nitpick."
      }
    };

    const markdown = generateMarkdown(data, config);
    expect(markdown).toContain("### Nitpick: Formatting");
    expect(markdown).toContain("This is a tiny nitpick.");
  });
});
