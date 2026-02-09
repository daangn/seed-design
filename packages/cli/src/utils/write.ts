import { fetchRegistryItems } from "@/src/utils/fetch";
import { transform } from "@/src/utils/transformers";
import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { createPatch } from "diff";
import colorize from "@npmcli/disparity-colors";
import { highlight } from "./color";
import type { Config } from "@/src/utils/get-config";
import type { PublicRegistry } from "@/src/schema";

export async function writeRegistryItemSnippets({
  registryItemsToAdd,
  rootPath,
  cwd,
  baseUrl,
  config,
  onDiff,
}: {
  registryItemsToAdd: { registryId: string; items: PublicRegistry["items"] }[];
  rootPath: string;
  cwd: string;
  baseUrl: string;
  config: Config;
  onDiff?: "overwrite" | "backup";
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

      const writtenSnippets: typeof transformedSnippets = [];

      for (const snippet of transformedSnippets) {
        const { filePath, content, relativePath } = snippet;

        await fs.ensureDir(path.dirname(filePath));

        // 파일 존재 여부 확인
        if (fs.existsSync(filePath)) {
          const existingContent = await fs.readFile(filePath, "utf-8");

          // 내용이 동일하면 스킵
          if (existingContent === content) {
            p.log.info(`${highlight(relativePath)}: 이미 최신 상태예요.`);
            continue;
          }

          const filename = path.basename(filePath);
          const ext = path.extname(filePath);
          const base = path.basename(filePath, ext);
          const timestamp = Date.now();
          const legacyFilename = `legacy-${base}-${timestamp}${ext}`;

          // diff가 있는 경우
          const action = await (async () => {
            if (onDiff) return onDiff;

            // interactive mode
            const patch = createPatch(relativePath, existingContent, content);
            const coloredDiff = colorize(patch);

            p.log.message(
              `\n${highlight(relativePath)}: 현재 파일과 받으려는 파일의 내용이 달라요.\n`,
            );
            p.log.message(coloredDiff);

            return p.select({
              message:
                "현재 파일에 스타일 변경, 로깅 등 커스터마이징이 적용되어 있는 경우 신규 파일에 동일한 커스터마이징을 적용하는 것을 검토해보세요.",
              options: [
                { value: "overwrite", label: `${filename} 덮어쓰기` },
                {
                  value: "backup",
                  label: `기존 파일 내용을 ${legacyFilename}으로 옮기고 ${filename} 받기`,
                },
                { value: "skip", label: "새 파일 받지 않고 그대로 두기" },
              ],
            });
          })();

          if (p.isCancel(action) || action === "skip") {
            p.log.info(`${highlight(relativePath)}: 파일을 받지 않고 건너뛰었어요.`);
            continue;
          }

          if (action === "backup") {
            const dir = path.dirname(filePath);
            const legacyPath = path.join(dir, legacyFilename);
            await fs.rename(filePath, legacyPath);
            p.log.info(
              `${highlight(relativePath)}: 기존 파일을 ${highlight(path.relative(cwd, legacyPath))}로 옮겼어요.`,
            );
          }
        }

        await fs.writeFile(filePath, content);
        writtenSnippets.push(snippet);
      }

      if (writtenSnippets.length > 0) {
        const snippetResults = writtenSnippets.map(({ name, relativePath }) => ({
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
}
