import { getConfig } from "@/src/utils/get-config";
import { resolveDependencies } from "@/src/utils/resolve-dependencies";
import { fetchAvailableRegistries, fetchRegistry } from "@/src/utils/fetch";
import { writeRegistryItemSnippets } from "@/src/utils/write";
import * as p from "@clack/prompts";
import path from "path";
import { z } from "zod";

import type { CAC } from "cac";
import { BASE_URL } from "../constants";
import { highlight } from "../utils/color";
import { installDependencies } from "../utils/install";
import { analytics } from "../utils/analytics";

const addOptionsSchema = z.object({
  itemIds: z.array(z.string()).optional(),
  /**
   * @deprecated use `seed-design add-all` instead
   */
  all: z.boolean(),
  cwd: z.string(),
  baseUrl: z.string().optional(),
});

export const addCommand = (cli: CAC) => {
  cli
    .command("add [...item-ids]", "add items")
    .option("-a, --all", "[Deprecated] Add all items", {
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
    .action(async (itemIds, opts) => {
      const startTime = Date.now();
      p.intro("seed-design add");

      const {
        success,
        data: { all, ...options },
        error,
      } = addOptionsSchema.safeParse({ itemIds, ...opts });

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

      stop("Registry를 가져왔어요.");

      const selectedItemKeys: string[] = await (async () => {
        if (options.itemIds.length > 0) return options.itemIds;

        const selected = await p.multiselect({
          message: "추가할 항목을 선택해주세요 (스페이스 바로 여러 개 선택 가능)",
          options: publicRegistries
            .filter(({ hideFromCLICatalog }) => !hideFromCLICatalog)
            .flatMap(({ id: registryId, items }) =>
              items
                .filter(({ hideFromCLICatalog }) => !hideFromCLICatalog)
                .sort((a, b) => a.id.localeCompare(b.id))
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
        p.log.error("항목을 찾을 수 없어요.");

        process.exit(0);
      }

      p.log.message(`선택된 항목: ${highlight(selectedItemKeys.join(", "))}`);

      const filteredItemKeys: string[] = [];

      for (const itemKey of selectedItemKeys) {
        const [registryId, ...rest] = itemKey.split(":");
        const itemId = rest.join(":");

        if (!registryId || !itemId) {
          p.log.error(
            `${highlight(itemKey)}: 항목 이름이 잘못되었어요. ${highlight("ui:action-button")}과 같은 형식으로 입력해보세요.`,
          );

          process.exit(1);
        }

        const foundItem = publicRegistries
          .find((r) => r.id === registryId)
          ?.items.find((i) => i.id === itemId);

        if (!foundItem) {
          p.log.error(`${highlight(itemKey)}: 항목을 찾을 수 없어요.`);

          process.exit(1);
        }

        if (foundItem.deprecated) {
          const confirm = await p.confirm({
            message: `${highlight(foundItem.id)}: deprecated 되었어요. 추가할까요?`,
            initialValue: false,
          });

          if (confirm === false || p.isCancel(confirm)) {
            p.log.info(`${highlight(foundItem.id)}: 추가하지 않을게요.`);

            continue;
          }
        }

        filteredItemKeys.push(itemKey);
      }

      const { registryItemsToAdd, npmDependenciesToAdd } = resolveDependencies({
        selectedItemKeys: filteredItemKeys,
        publicRegistries,
      });

      p.log.info(
        `추가할 항목: ${highlight(registryItemsToAdd.map((r) => r.items.map((i) => `${r.registryId}:${i.id}`).join(", ")).join(", ") || "없음")}

설치할 의존성: ${highlight(Array.from(npmDependenciesToAdd).join(", ") || "없음")}`,
      );

      await writeRegistryItemSnippets({
        registryItemsToAdd,
        rootPath,
        cwd,
        baseUrl,
        config,
      });

      try {
        const { installed, filtered } = await installDependencies({
          cwd,
          deps: Array.from(npmDependenciesToAdd),
        });

        if (installed.size === 0) {
          p.log.message("모든 의존성이 이미 설치되어 있어요.");
        }

        if (installed.size) {
          p.log.message(`의존성 설치 완료: ${highlight(Array.from(installed).join(", "))}`);

          if (filtered.size) {
            p.log.message(
              `설치하지 않은 의존성 (이미 설치됨): ${highlight(Array.from(filtered).join(", "))}`,
            );
          }
        }
        p.outro("완료했어요.");
      } catch (error) {
        p.log.error(`추가에 실패했어요. ${error}`);
        p.outro(highlight("작업이 취소됐어요."));
        process.exit(1);
      }

      // add 성공 이벤트 추적
      const duration = Date.now() - startTime;
      const uniqueRegistries = new Set(registryItemsToAdd.map((r) => r.registryId));
      const hasDeprecated = selectedItemKeys.some((itemKey) => {
        const [registryId, ...rest] = itemKey.split(":");
        const itemId = rest.join(":");
        return publicRegistries.find((r) => r.id === registryId)?.items.find((i) => i.id === itemId)
          ?.deprecated;
      });

      await analytics.track(options.cwd, {
        event: "add",
        properties: {
          items_count: filteredItemKeys.length,
          registries: Array.from(uniqueRegistries),
          has_deprecated: hasDeprecated,
          dependencies_count: npmDependenciesToAdd.size,
          duration_ms: duration,
        },
      });
    });
};
