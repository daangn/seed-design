import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";
import { validateConfig } from "./schema.js";
import type { KontextConfig } from "./types.js";

export function parseKontextFile(filePath: string): KontextConfig {
  const raw = readFileSync(filePath, "utf-8");
  const data = parseYaml(raw);
  return validateConfig(data, filePath);
}
