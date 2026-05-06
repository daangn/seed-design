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
import {
  analyzeRegistryItemCompatibility,
  getProjectSeedPackageVersionSpecs,
  logCompatibilityReport,
} from "../utils/compatibility";
import {
  CliCancelError,
  CliError,
  handleCliError,
  isCliCancelError,
  isVerboseMode,
} from "../utils/error";

const addOptionsSchema = z.object({
  itemIds: z.array(z.string()).optional(),
  /**
   * @deprecated use `seed-design add-all` instead
   */
  all: z.boolean(),
  cwd: z.string(),
  baseUrl: z.string().default(BASE_URL),
  onDiff: z.enum(["overwrite", "backup"]).optional(),
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
    .option("--on-diff <mode>", "Action when file differs: overwrite or backup")
    .example("seed-design add ui:action-button")
    .example("seed-design add ui:alert-dialog")
    .action(async (itemIds, opts) => {
      const startTime = Date.now();
      const verbose = isVerboseMode(opts);
      const trackCwd = typeof opts?.cwd === "string" ? opts.cwd : process.cwd();
      p.intro("seed-design add");

      try {
        const parsed = addOptionsSchema.safeParse({ itemIds, ...opts });
        if (!parsed.success) {
          throw parsed.error;
        }

        const {
          data: { all, ...options },
        } = parsed;

        if (all) {
          throw new CliError({
            message:
              "`--all` 옵션은 더 이상 지원되지 않아요. 대신 `seed-design add-all` 명령어를 사용해주세요.",
          });
        }

        const cwd = options.cwd;
        const baseUrl = options.baseUrl;
        const config = await getConfig(cwd);
        const rootPath = path.resolve(cwd, config.path);

        const { start, stop } = p.spinner();
        start("Registry를 가져오고 있어요...");

        const publicRegistries = await (async () => {
          try {
            const registries = await Promise.all(
              (await fetchAvailableRegistries({ baseUrl })).map(async ({ id }) =>
                fetchRegistry({ baseUrl, registryId: id }),
              ),
            );
            stop("Registry를 가져왔어요.");

            return registries;
          } catch (error) {
            stop("Registry를 가져오지 못했어요.");
            throw error;
          }
        })();

        const selectedItemKeys: string[] = await (async () => {
          if (options.itemIds?.length) {
            return options.itemIds;
          }

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
            throw new CliCancelError();
          }

          return selected;
        })();

        if (!selectedItemKeys?.length) {
          throw new CliCancelError("추가할 항목이 선택되지 않았어요.");
        }

        p.log.message(`선택된 항목: ${highlight(selectedItemKeys.join(", "))}`);

        const filteredItemKeys: string[] = [];

        for (const itemKey of selectedItemKeys) {
          const [registryId, ...rest] = itemKey.split(":");
          const itemId = rest.join(":");

          if (!registryId || !itemId) {
            throw new CliError({
              message: `${highlight(itemKey)}: 항목 이름이 잘못되었어요.`,
              hint: `${highlight("ui:action-button")}과 같은 형식으로 입력해보세요.`,
            });
          }

          const foundItem = publicRegistries
            .find((r) => r.id === registryId)
            ?.items.find((i) => i.id === itemId);

          if (!foundItem) {
            throw new CliError({
              message: `${highlight(itemKey)}: 항목을 찾을 수 없어요.`,
            });
          }

          if (foundItem.deprecated) {
            const confirm = await p.confirm({
              message: `${highlight(foundItem.id)}: deprecated 되었어요. 추가할까요?`,
              initialValue: false,
            });

            if (p.isCancel(confirm)) {
              throw new CliCancelError();
            }

            if (confirm === false) {
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

        const compatibilityReport = analyzeRegistryItemCompatibility({
          publicRegistries,
          itemKeys: registryItemsToAdd.flatMap(({ registryId, items }) =>
            items.map((item) => `${registryId}:${item.id}`),
          ),
          projectPackageVersions: getProjectSeedPackageVersionSpecs(options.cwd),
        });

        logCompatibilityReport({
          report: compatibilityReport,
          title: "현재 프로젝트 버전과 호환되지 않을 수 있는 스니펫이 있어요.",
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

        // add 성공 이벤트 추적
        const duration = Date.now() - startTime;
        const uniqueRegistries = new Set(registryItemsToAdd.map((r) => r.registryId));
        const hasDeprecated = selectedItemKeys.some((itemKey) => {
          const [registryId, ...rest] = itemKey.split(":");
          const itemId = rest.join(":");
          return publicRegistries
            .find((r) => r.id === registryId)
            ?.items.find((i) => i.id === itemId)?.deprecated;
        });

        try {
          await analytics.trackCommandOutcome(options.cwd, {
            command: "add",
            status: "completed",
            properties: {
              items_count: filteredItemKeys.length,
              registries: Array.from(uniqueRegistries),
              has_deprecated: hasDeprecated,
              dependencies_count: npmDependenciesToAdd.size,
              duration_ms: duration,
            },
          });
        } catch (telemetryError) {
          if (verbose) {
            console.error("[Telemetry] add 이벤트 전송에 실패했어요:", telemetryError);
          }
        }
      } catch (error) {
        if (isCliCancelError(error)) {
          try {
            await analytics.trackCommandOutcome(trackCwd, {
              command: "add",
              status: "cancelled",
              properties: {
                duration_ms: Date.now() - startTime,
              },
            });
          } catch (telemetryError) {
            if (verbose) {
              console.error("[Telemetry] add 이벤트 전송에 실패했어요:", telemetryError);
            }
          }
          p.outro(highlight(error.message));
          process.exit(0);
        }

        try {
          await analytics.trackCommandFailure(trackCwd, {
            command: "add",
            error,
            properties: {
              duration_ms: Date.now() - startTime,
            },
          });
        } catch (telemetryError) {
          if (verbose) {
            console.error("[Telemetry] add 이벤트 전송에 실패했어요:", telemetryError);
          }
        }

        handleCliError(error, {
          defaultMessage: "추가에 실패했어요.",
          defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
          verbose,
        });
        process.exit(1);
      }
    });
};
