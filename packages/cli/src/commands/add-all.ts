import { fetchAvailableRegistries, fetchRegistry } from "@/src/utils/fetch";
import { getConfig } from "@/src/utils/get-config";
import { resolveDependencies } from "@/src/utils/resolve-dependencies";
import { writeRegistryItemSnippets } from "@/src/utils/write";
import * as p from "@clack/prompts";
import path from "path";
import { z } from "zod";

import type { CAC } from "cac";
import { BASE_URL } from "../constants";
import { analytics } from "../utils/analytics";
import { highlight } from "../utils/color";
import {
  CliCancelError,
  CliError,
  handleCliError,
  isCliCancelError,
  isVerboseMode,
} from "../utils/error";
import { installDependencies } from "../utils/install";

const addAllOptionsSchema = z.object({
  registryIds: z.array(z.string()).optional(),
  all: z.boolean(),
  includeDeprecated: z.boolean().optional(),
  cwd: z.string(),
  baseUrl: z.string().optional(),
  onDiff: z.enum(["overwrite", "backup"]).optional(),
});

export const addAllCommand = (cli: CAC) => {
  cli
    .command("add-all [...registry-ids]", "add all items from registries")
    .option("-a, --all", "Add all items from all registries", {
      default: false,
    })
    .option("--include-deprecated", "Include deprecated items when used with `--all`", {
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
    .option("--on-diff <mode>", "Action when file differs: overwrite or backup")
    .example("seed-design add-all ui --include-deprecated")
    .example("seed-design add-all ui lib breeze")
    .action(async (registryIds, opts) => {
      const startTime = Date.now();
      const verbose = isVerboseMode(opts);
      p.intro("seed-design add-all");

      try {
        const parsed = addAllOptionsSchema.safeParse({ registryIds, ...opts });
        if (!parsed.success) {
          throw parsed.error;
        }

        const { data: options } = parsed;

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

        const selectedRegistryIds: string[] = await (async () => {
          if (options.all) {
            const ids = publicRegistries.map((r) => r.id);
            p.log.message(`모든 레지스트리의 모든 항목을 추가합니다: ${highlight(ids.join(", "))}`);

            return ids;
          }

          if (options.registryIds?.length) {
            const availableIds = publicRegistries.map((r) => r.id);

            for (const registryId of options.registryIds) {
              if (!availableIds.includes(registryId)) {
                throw new CliError({
                  code: "REGISTRY_NOT_FOUND",
                  message: `레지스트리 '${registryId}'를 찾을 수 없어요.`,
                  details: [`사용 가능한 레지스트리: ${availableIds.join(", ")}`],
                });
              }
            }

            p.log.message(
              `선택된 레지스트리의 모든 항목을 추가합니다: ${highlight(options.registryIds.join(", "))}`,
            );

            return options.registryIds;
          }

          const selected = await p.multiselect({
            message: "추가할 레지스트리를 선택해주세요 (스페이스 바로 여러 개 선택 가능)",
            options: publicRegistries
              .filter(({ hideFromCLICatalog }) => !hideFromCLICatalog)
              .sort((a, b) => b.items.length - a.items.length)
              .map((registry) => ({
                label: registry.id,
                value: registry.id,
                hint: `${registry.items.length}개 항목 (${registry.items[0].id} 등)`,
              })),
          });

          if (p.isCancel(selected)) {
            throw new CliCancelError();
          }

          p.log.message(`선택된 레지스트리의 항목을 추가합니다: ${highlight(selected.join(", "))}`);

          return selected;
        })();

        const selectedRegistries = publicRegistries.filter((r) =>
          selectedRegistryIds.includes(r.id),
        );

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
            `${deprecatedCount}개의 deprecated 항목은 제외되었어요. --include-deprecated 옵션을 사용하면 추가할 수 있어요.`,
          );
        }

        if (!itemKeys.length) {
          throw new CliCancelError("추가할 항목이 없어요.");
        }

        p.log.message(`총 ${highlight(itemKeys.length.toString())}개의 항목을 추가합니다.`);

        const { registryItemsToAdd, npmDependenciesToAdd } = resolveDependencies({
          selectedItemKeys: itemKeys,
          publicRegistries,
        });

        await writeRegistryItemSnippets({
          registryItemsToAdd,
          rootPath,
          cwd,
          baseUrl,
          config,
          onDiff: options.onDiff,
        });

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

        // add-all 성공 이벤트 추적
        const duration = Date.now() - startTime;
        await analytics.track(options.cwd, {
          event: "add-all",
          properties: {
            registries: selectedRegistryIds,
            items_count: itemKeys.length,
            include_deprecated: options.includeDeprecated || false,
            dependencies_count: npmDependenciesToAdd.size,
            duration_ms: duration,
          },
        });
      } catch (error) {
        if (isCliCancelError(error)) {
          p.outro(highlight(error.message));
          process.exit(0);
        }

        handleCliError(error, {
          defaultMessage: "추가에 실패했어요.",
          defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
          verbose,
        });
      }
    });
};
