import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.join(currentDir, "__fixtures__");

export function readFixture(...segments: string[]): string {
  return readFileSync(path.join(fixtureRoot, ...segments), "utf8");
}

export function normalizeForAssert(text: string): string {
  return text.replace(/\r\n/g, "\n").trim();
}
