import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const progressCircleSource = readFileSync(
  join(currentDir, "..", "ProgressCircle", "ProgressCircle.tsx"),
  "utf8",
);

function readEffectDependencies(marker: string): string {
  const markerIndex = progressCircleSource.indexOf(marker);
  expect(markerIndex).toBeGreaterThanOrEqual(0);

  const dependencyStart = progressCircleSource.indexOf("}, [", markerIndex);
  expect(dependencyStart).toBeGreaterThanOrEqual(0);

  const dependencyEnd = progressCircleSource.indexOf("]);", dependencyStart);
  expect(dependencyEnd).toBeGreaterThanOrEqual(0);

  return progressCircleSource.slice(dependencyStart, dependencyEnd);
}

describe("ProgressCircle", () => {
  it("restarts indeterminate animation when size changes", () => {
    expect(readEffectDependencies("runOnMainThread(startLoop)")).toContain("numSize");
  });

  it("restarts determinate transition when size changes", () => {
    expect(readEffectDependencies("runOnMainThread(startAnimation)")).toContain("numSize");
  });
});
