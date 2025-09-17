import { fetchRegistryItems } from "@/src/utils/fetch";
import { transform } from "@/src/utils/transformers";
import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { highlight } from "./color";
import type { Config } from "@/src/utils/get-config";
import type { PublicRegistry } from "@/src/schema";

export async function writeRegistryFiles({
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
  const registryResult = [];

  for (const { registryId, items } of registryItemsToAdd) {
    const registryPath = path.join(rootPath, registryId);

    fs.ensureDirSync(registryPath);

    const registryItems = await fetchRegistryItems({
      baseUrl,
      registryId,
      registryItemIds: items.map((i) => i.id),
    });

    for (const { id, files } of registryItems) {
      await Promise.all(
        files.map(async (file) => {
          let filePath = path.join(registryPath, file.path);

          const content = await transform({ filename: file.path, config, raw: file.content });

          if (!config.tsx) {
            filePath = filePath.replace(/\.tsx$/, ".jsx");
            filePath = filePath.replace(/\.ts$/, ".js");
          }

          await fs.writeFile(filePath, content);

          const relativePath = path.relative(cwd, filePath);

          registryResult.push({ name: `${registryId}:${id}`, path: relativePath });
        }),
      );

      p.log.success(`${highlight(`${registryId}:${id}`)} 관련 파일 ${files.length}개 추가 완료`);
    }
  }

  return registryResult;
}
