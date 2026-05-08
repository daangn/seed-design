import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const componentsDir = join(currentDir, "..");

function readComponentFile(componentName: string, fileName: string): string {
  return readFileSync(join(componentsDir, componentName, fileName), "utf8");
}

describe("components public exports", () => {
  it("exposes compound components through namespace exports", () => {
    for (const componentName of ["Switch", "Checkbox", "RadioGroup", "TagGroup"]) {
      expect(readComponentFile(componentName, "index.ts")).toContain(
        `export * as ${componentName} from "./${componentName}.namespace";`,
      );
      expect(readComponentFile(componentName, `${componentName}.namespace.ts`)).toContain(
        " as Root",
      );
    }
  });

  it("keeps ProgressCircle namespace usage while exposing flat slots", () => {
    const index = readComponentFile("ProgressCircle", "index.ts");
    const implementation = readComponentFile("ProgressCircle", "ProgressCircle.tsx");
    const namespace = readComponentFile("ProgressCircle", "ProgressCircle.namespace.ts");

    expect(index).toContain('export * as ProgressCircle from "./ProgressCircle.namespace";');
    expect(index).toContain("ProgressCircleRoot");
    expect(index).toContain("ProgressCircleRange");
    expect(namespace).toContain("ProgressCircleRoot as Root");
    expect(namespace).toContain("ProgressCircleRange as Range");
    expect(implementation).toContain("export const ProgressCircleRoot");
    expect(implementation).toContain("export const ProgressCircleRange");
  });
});
