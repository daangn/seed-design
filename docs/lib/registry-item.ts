import { readFile } from "node:fs/promises";
import path from "node:path";
import type { GeneratedRegistryItem } from "@/registry/schema";

/** `public/__registry__/<id>.json`을 읽는다. 예: `react/ui/action-button`. */
export async function readRegistryItem(id: string): Promise<GeneratedRegistryItem> {
  const file = path.join(process.cwd(), "public/__registry__", `${id}.json`);
  return JSON.parse(await readFile(file, "utf8"));
}
