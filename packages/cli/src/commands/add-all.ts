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

const addAllOptionsSchema = z.object({
  registryIds: z.array(z.string()).optional(),
  all: z.boolean(),
  includeDeprecated: z.boolean().optional(),
  cwd: z.string(),
  baseUrl: z.string().optional(),
});

export const addAllCommand = (cli: CAC) => {
  cli
    .command("add-all [...registry-ids]", "add all snippets from registries")
    .option("-a, --all", "Add all snippets from all registries", {
      default: false,
    })
    .option("--include-deprecated", "Include deprecated snippets when used with `--all`", {
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
    .example("seed-design add-all ui --include-deprecated")
    .example("seed-design add-all ui lib breeze")
    .action(async (registryIds, opts) => {
      p.intro(color.bgCyan("seed-design add-all"));

      const {
        success,
        data: options,
        error,
      } = addAllOptionsSchema.safeParse({ registryIds, ...opts });

      if (!success) {
        p.log.error(`잘못된 옵션이에요: ${error?.message}`);

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

      const selectedRegistryIds: string[] = await (async () => {
        if (options.all) {
          const ids = publicRegistries.map((r) => r.id);
          p.log.message(`모든 레지스트리의 스니펫을 추가합니다: ${highlight(ids.join(", "))}`);

          return ids;
        }

        if (options.registryIds?.length) {
          const availableIds = publicRegistries.map((r) => r.id);

          for (const registryId of options.registryIds) {
            if (!availableIds.includes(registryId)) {
              p.log.error(`레지스트리 '${registryId}'를 찾을 수 없어요.`);
              p.log.info(`사용 가능한 레지스트리: ${availableIds.join(", ")}`);

              process.exit(1);
            }
          }

          p.log.message(
            `선택된 레지스트리의 스니펫을 추가합니다: ${highlight(options.registryIds.join(", "))}`,
          );

          return options.registryIds;
        }

        const selected = await p.multiselect({
          message: "추가할 레지스트리를 선택해주세요 (스페이스 바로 여러 개 선택 가능)",
          options: publicRegistries
            .filter(({ hideFromCLICatalog }) => !hideFromCLICatalog)
            .map((registry) => ({
              label: registry.id,
              value: registry.id,
              hint: `${registry.items.length}개 스니펫`,
            })),
        });

        if (p.isCancel(selected)) {
          p.log.error("취소되었어요.");
          process.exit(0);
        }

        p.log.message(`선택된 레지스트리의 스니펫을 추가합니다: ${highlight(selected.join(", "))}`);

        return selected;
      })();

      const selectedRegistries = publicRegistries.filter((r) => selectedRegistryIds.includes(r.id));

      const itemKeys = selectedRegistries.flatMap((registry) =>
        registry.items
          .filter((item) => {
            if (item.deprecated) return options.includeDeprecated;

            return true;
          })
          .map((item) => `${registry.id}:${item.id}`),
      );

      const deprecatedCount = selectedRegistries.flatMap((r) =>
        r.items.filter((item) => item.deprecated).map(() => 1),
      ).length;

      if (!options.includeDeprecated && deprecatedCount > 0) {
        p.log.info(
          `${deprecatedCount}개의 deprecated 스니펫은 제외되었어요. --include-deprecated 옵션을 사용하면 추가할 수 있어요.`,
        );
      }

      if (!itemKeys.length) {
        p.log.error("추가할 스니펫이 없어요.");

        process.exit(0);
      }

      p.log.message(`총 ${highlight(itemKeys.length.toString())}개의 스니펫을 추가합니다.`);

      const { registryItemsToAdd, npmDependenciesToAdd } = resolveDependencies({
        selectedItemKeys: itemKeys,
        publicRegistries,
      });

      await writeRegistryItemSnippets({ registryItemsToAdd, rootPath, cwd, baseUrl, config });

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

      p.outro("모든 스니펫 추가 완료.");
    });
};
