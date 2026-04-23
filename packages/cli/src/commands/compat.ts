import { fetchAvailableRegistries, fetchRegistry } from "@/src/utils/fetch";
import { getRawConfig } from "@/src/utils/get-config";
import * as p from "@clack/prompts";
import path from "path";
import { z } from "zod";

import type { CAC } from "cac";
import { BASE_URL } from "../constants";
import { analytics } from "../utils/analytics";
import { highlight } from "../utils/color";
import {
  analyzeRegistryItemCompatibility,
  findInstalledSnippetItemKeys,
  getProjectSeedPackageVersionSpecs,
  logCompatibilityReport,
} from "../utils/compatibility";
import { CliError, handleCliError, isCliCancelError, isVerboseMode } from "../utils/error";

const compatOptionsSchema = z.object({
  itemIds: z.array(z.string()).optional(),
  component: z.union([z.string(), z.array(z.string())]).optional(),
  all: z.boolean(),
  registry: z.string().optional(),
  cwd: z.string(),
  baseUrl: z.string().optional(),
});

function parseTargetInputs({
  itemIds,
  component,
}: {
  itemIds?: string[];
  component?: string | string[];
}) {
  const normalizeInput = (value: string) => value.trim().replace(/\s+/g, "-");
  const itemInputs = (itemIds ?? []).map(normalizeInput).filter(Boolean);
  const componentInputs = (Array.isArray(component) ? component : [component])
    .filter((value): value is string => !!value)
    .flatMap((value) => value.split(","))
    .map(normalizeInput)
    .filter(Boolean);

  return Array.from(new Set([...itemInputs, ...componentInputs]));
}

function resolveExplicitItemKeys({
  publicRegistries,
  targetInputs,
  defaultRegistry,
}: {
  publicRegistries: Array<{ id?: string; items?: Array<{ id?: string }> }>;
  targetInputs: string[];
  defaultRegistry?: string;
}) {
  const allItemKeys = publicRegistries
    .filter((registry): registry is { id: string; items: Array<{ id: string }> } => {
      return typeof registry.id === "string" && Array.isArray(registry.items);
    })
    .flatMap((registry) =>
      registry.items
        .filter((item): item is { id: string } => typeof item.id === "string")
        .map((item) => `${registry.id}:${item.id}`),
    );
  const result = new Set<string>();

  for (const input of targetInputs) {
    const itemKey = input.includes(":")
      ? input
      : defaultRegistry
        ? `${defaultRegistry}:${input}`
        : (() => {
            const matchedItemKeys = allItemKeys.filter((itemKey) => itemKey.endsWith(`:${input}`));
            if (!matchedItemKeys.length) {
              throw new CliError({
                message: `${highlight(input)}: 항목을 찾을 수 없어요.`,
                hint: `${highlight("ui:action-button")}처럼 registry를 포함해서 입력해보세요.`,
              });
            }

            if (matchedItemKeys.length > 1) {
              throw new CliError({
                message: `${highlight(input)}: 같은 이름의 항목이 여러 레지스트리에 있어요.`,
                details: matchedItemKeys.map((itemKey) => `- ${itemKey}`),
                hint: `${highlight("ui:action-button")}처럼 registry를 포함해서 입력해보세요.`,
              });
            }

            return matchedItemKeys[0];
          })();

    if (!allItemKeys.includes(itemKey)) {
      throw new CliError({
        message: `${highlight(itemKey)}: 항목을 찾을 수 없어요.`,
      });
    }

    result.add(itemKey);
  }

  return Array.from(result);
}

export const compatCommand = (cli: CAC) => {
  cli
    .command("compat [...item-ids]", "check snippet compatibility")
    .option("-c, --component <component>", "검사할 컴포넌트. 여러 번 또는 쉼표로 지정 가능")
    .option("-a, --all", "모든 registry 항목을 검사", {
      default: false,
    })
    .option("-r, --registry <registryId>", "컴포넌트 shorthand 입력 시 기본 registry")
    .option("--cwd <cwd>", "the working directory. defaults to the current directory.", {
      default: process.cwd(),
    })
    .option(
      "-u, --baseUrl <baseUrl>",
      "the base url of the registry. defaults to the current directory.",
      { default: BASE_URL },
    )
    .example("seed-design compat")
    .example("seed-design compat -c action-button")
    .example("seed-design compat ui:action-button ui:alert-dialog")
    .example("seed-design compat --all")
    .action(async (itemIds, opts) => {
      const startTime = Date.now();
      const verbose = isVerboseMode(opts);
      const trackCwd = typeof opts?.cwd === "string" ? opts.cwd : process.cwd();
      p.intro("seed-design compat");

      try {
        const parsed = compatOptionsSchema.safeParse({ itemIds, ...opts });
        if (!parsed.success) {
          throw parsed.error;
        }

        const { data: options } = parsed;
        const { start, stop } = p.spinner();

        start("Registry를 가져오고 있어요...");
        const publicRegistries = await (async () => {
          try {
            const registries = await Promise.all(
              (await fetchAvailableRegistries({ baseUrl: options.baseUrl })).map(async ({ id }) =>
                fetchRegistry({ baseUrl: options.baseUrl, registryId: id }),
              ),
            );
            stop("Registry를 가져왔어요.");
            return registries;
          } catch (error) {
            stop("Registry를 가져오지 못했어요.");
            throw error;
          }
        })();

        const targetInputs = parseTargetInputs({
          itemIds: options.itemIds,
          component: options.component,
        });

        const targetItemKeys = (() => {
          if (options.all) {
            return publicRegistries.flatMap((registry) =>
              registry.items.map((item) => `${registry.id}:${item.id}`),
            );
          }

          if (targetInputs.length > 0) {
            return resolveExplicitItemKeys({
              publicRegistries,
              targetInputs,
              defaultRegistry: options.registry,
            });
          }

          const rawConfigPromise = getRawConfig(options.cwd);
          return rawConfigPromise;
        })();

        const resolvedTargetItemKeys = Array.isArray(targetItemKeys)
          ? targetItemKeys
          : await (async () => {
              const rawConfig = await targetItemKeys;
              if (!rawConfig) {
                throw new CliError({
                  message: "seed-design.json 파일이 없어 설치된 스니펫 경로를 알 수 없어요.",
                  hint: "`seed-design init`으로 설정을 만든 뒤 실행하거나, `--all`/`-c`로 검사 대상을 직접 지정해주세요.",
                });
              }

              const rootPath = path.resolve(options.cwd, rawConfig.path);
              const installedItemKeys = findInstalledSnippetItemKeys({
                publicRegistries,
                rootPath,
              });

              if (!installedItemKeys.length) {
                p.log.info(
                  `${highlight(path.relative(options.cwd, rootPath) || rawConfig.path)}에서 설치된 스니펫을 찾지 못했어요.`,
                );
                return [];
              }

              return installedItemKeys;
            })();

        if (!resolvedTargetItemKeys.length) {
          try {
            await analytics.trackCommandOutcome(options.cwd, {
              command: "compat",
              status: "completed",
              result: "empty",
              properties: {
                duration_ms: Date.now() - startTime,
              },
            });
          } catch (telemetryError) {
            if (verbose) {
              console.error("[Telemetry] compat tracking failed:", telemetryError);
            }
          }
          p.outro("검사할 스니펫이 없어요.");
          process.exit(0);
        }

        const projectPackageVersions = getProjectSeedPackageVersionSpecs(options.cwd);
        const compatibilityReport = analyzeRegistryItemCompatibility({
          publicRegistries,
          itemKeys: resolvedTargetItemKeys,
          projectPackageVersions,
        });

        p.log.info(`검사 대상: ${highlight(compatibilityReport.checkedItemKeys.join(", "))}`);

        if (!compatibilityReport.issues.length) {
          p.outro("모든 스니펫이 현재 @seed-design/react, @seed-design/css와 호환돼요.");

          try {
            await analytics.trackCommandOutcome(options.cwd, {
              command: "compat",
              status: "completed",
              result: "compatible",
              properties: {
                checked_items_count: compatibilityReport.checkedItemKeys.length,
                incompatible_items_count: 0,
                duration_ms: Date.now() - startTime,
              },
            });
          } catch (telemetryError) {
            if (verbose) {
              console.error("[Telemetry] compat tracking failed:", telemetryError);
            }
          }

          process.exit(0);
        }

        logCompatibilityReport({
          report: compatibilityReport,
          title: "현재 프로젝트 버전과 호환되지 않는 스니펫을 찾았어요.",
        });
        p.log.info(
          "필요한 버전으로 @seed-design/react 또는 @seed-design/css를 맞춘 뒤 다시 실행해보세요.",
        );
        p.outro("호환성 이슈가 있어요.");

        try {
          await analytics.trackCommandOutcome(options.cwd, {
            command: "compat",
            status: "completed",
            result: "incompatible",
            properties: {
              checked_items_count: compatibilityReport.checkedItemKeys.length,
              incompatible_items_count: new Set(
                compatibilityReport.issues.map((issue) => issue.itemKey),
              ).size,
              issue_count: compatibilityReport.issues.length,
              duration_ms: Date.now() - startTime,
            },
          });
        } catch (telemetryError) {
          if (verbose) {
            console.error("[Telemetry] compat tracking failed:", telemetryError);
          }
        }

        process.exit(1);
      } catch (error) {
        if (isCliCancelError(error)) {
          try {
            await analytics.trackCommandOutcome(trackCwd, {
              command: "compat",
              status: "cancelled",
              properties: {
                duration_ms: Date.now() - startTime,
              },
            });
          } catch (telemetryError) {
            if (verbose) {
              console.error("[Telemetry] compat tracking failed:", telemetryError);
            }
          }
          p.outro(highlight(error.message));
          process.exit(0);
        }

        try {
          await analytics.trackCommandFailure(trackCwd, {
            command: "compat",
            error,
            properties: {
              duration_ms: Date.now() - startTime,
            },
          });
        } catch (telemetryError) {
          if (verbose) {
            console.error("[Telemetry] compat tracking failed:", telemetryError);
          }
        }

        handleCliError(error, {
          defaultMessage: "호환성 검사에 실패했어요.",
          defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
          verbose,
        });
        process.exit(1);
      }
    });
};
