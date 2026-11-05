import { access, realpath } from "node:fs/promises";
import { resolve } from "node:path";
import { DOCS_DIRECTORY, REPOSITORY_DIRECTORY } from "./constants.js";

const REQUIRED_FILES = ["lib/index.js", "lib/index.d.ts"];

export async function verifyLynxWorkspace() {
  const expected = {
    "@seed-design/css": resolve(REPOSITORY_DIRECTORY, "packages/css"),
    "@seed-design/lynx-react": resolve(REPOSITORY_DIRECTORY, "packages/lynx-react"),
    "@seed-design/lynx-css": resolve(REPOSITORY_DIRECTORY, "packages/lynx-css"),
  };

  for (const [packageName, expectedPath] of Object.entries(expected)) {
    const actualPath = await realpath(resolve(DOCS_DIRECTORY, "node_modules", packageName));
    const normalizedExpected = await realpath(expectedPath);
    if (actualPath !== normalizedExpected) {
      throw new Error(`${packageName}이 workspace를 가리키지 않습니다: ${actualPath}`);
    }
  }

  for (const file of REQUIRED_FILES) {
    const path = resolve(expected["@seed-design/lynx-react"], file);
    await access(path).catch(() => {
      throw new Error(`@seed-design/lynx-react 공개 산출물이 없습니다: ${path}`);
    });
  }
}
