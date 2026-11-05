import { describe, expect, it } from "bun:test";
import { packageManagerTabItems } from "./package-manager";

describe("packageManagerTabItems", () => {
  it("builds one install-command tab per package manager, in order", () => {
    const items = packageManagerTabItems(["@seed-design/react", "clsx"]);

    expect(items.map((i) => i.value)).toEqual(["npm", "yarn", "pnpm", "bun"]);
    expect(items.every((i) => i.lang === "bash")).toBe(true);

    const codeByValue = Object.fromEntries(items.map((i) => [i.value, i.code]));
    expect(codeByValue.npm).toBe("npm install @seed-design/react clsx");
    expect(codeByValue.yarn).toBe("yarn add @seed-design/react clsx");
    expect(codeByValue.pnpm).toBe("pnpm add @seed-design/react clsx");
    expect(codeByValue.bun).toBe("bun add @seed-design/react clsx");
  });

  it("joins multiple dependencies with a single space", () => {
    const items = packageManagerTabItems(["a", "b", "c"]);
    expect(items[0].code).toBe("npm install a b c");
  });
});
