import { getConfig } from "@/src/utils/get-config";
import { resolveDependencies } from "@/src/utils/resolve-dependencies";
import { fetchAvailableRegistries, fetchRegistry } from "@/src/utils/fetch";
import { writeRegistryItemSnippets } from "@/src/utils/write";
import * as p from "@clack/prompts";
import path from "path";
import color from "picocolors";
import { z } from "zod";

import type { CAC } from "cac";
import { BASE_URL } from "../constants";
import { highlight } from "../utils/color";
import { installDependencies } from "../utils/install";

const addOptionsSchema = z.object({
  snippetIds: z.array(z.string()).optional(),
  /**
   * @deprecated use `seed-design add-all` instead
   */
  all: z.boolean(),
  cwd: z.string(),
  baseUrl: z.string().optional(),
});

export const addCommand = (cli: CAC) => {
  cli
    .command("add [...snippet-ids]", "add snippet")
    .option("-a, --all", "[Deprecated] Add all snippets", {
      default: false,
    })
    .option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", {
      default: process.cwd(),
    })
    .option(
      "-u, --baseUrl <baseUrl>",
      "the base url of the registry. defaults to the current directory.",
      { default: BASE_URL },
    )
    .example("seed-design add ui:action-button")
    .example("seed-design add ui:alert-dialog")
    .action(async (snippetIds, opts) => {
      p.intro(color.bgCyan("seed-design add"));

      const {
        success,
        data: { all, ...options },
        error,
      } = addOptionsSchema.safeParse({ snippetIds, ...opts });

      if (!success) {
        p.log.error(`잘못된 옵션이에요: ${error?.message}`);

        process.exit(1);
      }

      if (all) {
        p.log.error(
          "`--all` 옵션은 더 이상 지원되지 않아요. 대신 `seed-design add-all` 명령어를 사용해주세요.",
        );

        process.exit(1);
      }

      const cwd = options.cwd;
      const baseUrl = options.baseUrl;
      const config = await getConfig(cwd);
      const rootPath = path.resolve(cwd, config.path);

      const { start, stop } = p.spinner();

      start("Registry를 가져오고 있어요...");

      const publicRegistries = await Promise.all(
        (await fetchAvailableRegistries({ baseUrl })).map(async ({ id }) =>
          fetchRegistry({ baseUrl, registryId: id }),
        ),
      );

      stop();

      const selectedItemKeys: string[] = await (async () => {
        if (options.snippetIds.length > 0) return options.snippetIds;

        const selected = await p.multiselect({
          message: "추가할 스니펫을 선택해주세요 (스페이스 바로 여러 개 선택 가능)",
          options: publicRegistries
            .filter(({ hideFromCLICatalog }) => !hideFromCLICatalog)
            .flatMap(({ id: registryId, items }) =>
              items
                .filter(({ hideFromCLICatalog }) => !hideFromCLICatalog)
                .map(({ id, description, deprecated }) => ({
                  label: `${deprecated ? "(deprecated) " : ""}${highlight(registryId)}:${id}`,
                  value: `${registryId}:${id}`,
                  hint: description,

                  // used for sorting
                  deprecated,
                  registryItemCount: items.length,
                })),
            )
            .sort((a, b) => {
              if (a.deprecated !== b.deprecated) return a.deprecated ? 1 : -1;

              return b.registryItemCount - a.registryItemCount;
            }),
        });

        if (p.isCancel(selected)) {
          p.log.error("취소되었어요.");
          process.exit(0);
        }

        return selected;
      })();

      if (!selectedItemKeys?.length) {
        p.log.error("스니펫을 찾을 수 없어요.");

        process.exit(0);
      }

      p.log.message(`선택된 스니펫: ${highlight(selectedItemKeys.join(", "))}`);

      const filteredItemKeys: string[] = [];

      for (const item of selectedItemKeys) {
        const [registryId, ...rest] = item.split(":");
        const itemId = rest.join(":");

        if (!registryId || !itemId) {
          p.log.error(`잘못된 스니펫 형식이에요: "${item}"`);
          process.exit(1);
        }

        const foundItem = publicRegistries
          .find((r) => r.id === registryId)
          ?.items.find((i) => i.id === itemId);

        if (!foundItem) {
          p.log.error(`스니펫을 찾을 수 없어요: "${item}"`);
          process.exit(1);
        }

        if (foundItem.deprecated) {
          const confirm = await p.confirm({
            message: `${highlight(foundItem.id)}는 deprecated 되었어요. 추가할까요?`,
            initialValue: false,
          });

          if (confirm === false || p.isCancel(confirm)) {
            p.log.info(`${highlight(foundItem.id)} 스니펫은 추가하지 않을게요.`);

            continue;
          }
        }

        filteredItemKeys.push(item);
      }

      const { registryItemsToAdd, npmDependenciesToAdd } = resolveDependencies({
        selectedItemKeys: filteredItemKeys,
        publicRegistries,
      });

      p.log.info(
        `추가할 스니펫: ${highlight(registryItemsToAdd.map((r) => r.items.map((i) => `${r.registryId}:${i.id}`).join(", ")).join(", ") || "없음")}
설치할 의존성: ${highlight(Array.from(npmDependenciesToAdd).join(", ") || "없음")}`,
      );

      const registryResult = await writeRegistryItemSnippets({
        registryItemsToAdd,
        rootPath,
        cwd,
        baseUrl,
        config,
      });

      const { installed, filtered } = await installDependencies({
        cwd,
        deps: Array.from(npmDependenciesToAdd),
      });

      if (installed.size) {
        p.log.message(`설치된 의존성: ${highlight(Array.from(installed).join(", "))}`);
      }

      if (filtered.size) {
        p.log.message(`이미 설치된 의존성: ${highlight(Array.from(filtered).join(", "))}`);
      }

      if (registryResult.length) {
        for (const registry of registryResult) {
          p.log.message(`추가된 파일: ${highlight(registry.path)}`);
        }
      }

      p.outro("스니펫 추가 완료.");
    });
};
