import { fetchRegistryItems } from "@/src/utils/fetch";
import { transform } from "@/src/utils/transformers";
import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { highlight } from "./color";
import type { Config } from "@/src/utils/get-config";
import type { PublicRegistry } from "@/src/schema";

export async function writeRegistryItemSnippets({
  registryItemsToAdd,
  rootPath,
  cwd,
  baseUrl,
  config,
}: {
  registryItemsToAdd: { registryId: string; items: PublicRegistry["items"] }[];
  rootPath: string;
  cwd: string;
  baseUrl: string;
  config: Config;
}) {
  const registryResult: { name: string; path: string }[] = [];

  for (const { registryId, items } of registryItemsToAdd) {
    const registryPath = path.join(rootPath, registryId);

    fs.ensureDirSync(registryPath);

    const registryItems = await fetchRegistryItems({
      baseUrl,
      registryId,
      registryItemIds: items.map((i) => i.id),
    });

    for (const { id, snippets } of registryItems) {
      const transformedSnippets = await Promise.all(
        snippets.map(async (file) => {
          const content = await transform({ filename: file.path, config, raw: file.content });

          let filePath = path.join(registryPath, file.path);
          if (!config.tsx) {
            filePath = filePath.replace(/\.tsx$/, ".jsx");
            filePath = filePath.replace(/\.ts$/, ".js");
          }

          return {
            filePath,
            content,
            relativePath: path.relative(cwd, filePath),
            name: `${registryId}:${id}`,
          };
        }),
      );

      await Promise.all(
        transformedSnippets.map(async ({ filePath, content }) => {
          await fs.ensureDir(path.dirname(filePath));
          await fs.writeFile(filePath, content);
        }),
      );

      const snippetResults = transformedSnippets.map(({ name, relativePath }) => ({
        name,
        path: relativePath,
      }));

      registryResult.push(...snippetResults);

      p.log.success(
        `${highlight(`${registryId}:${id}`)} 관련 스니펫 다운로드 완료: ${highlight(snippetResults.map((r) => r.path).join(", "))}`,
      );
    }
  }
}
