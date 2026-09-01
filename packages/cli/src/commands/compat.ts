import { fetchAvailableRegistries, fetchRegistry } from "@/src/utils/fetch";
import { getRawConfig } from "@/src/utils/get-config";
import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { multiple, optional } from "@optique/core/modifiers";
import { argument, command, constant, option } from "@optique/core/primitives";
import { string } from "@optique/core/valueparser";
import path from "path";

import { analytics } from "../utils/analytics";
import { highlight } from "../utils/color";
import {
  baseUrlOption,
  cwdLongOption,
  frameworkOption,
  type ParsedOptions,
} from "../utils/cli-options";
import { exampleFooter } from "../utils/help";
import {
  analyzeRegistryItemCompatibility,
  findInstalledSnippetItemKeys,
  formatCompatibilityReport,
  getCompatPackageNames,
  getProjectSeedPackageVersionSpecs,
} from "../utils/compatibility";
import { CliError, ExitCode, exitCodeFor, isCliCancelError, reportCliError } from "../utils/error";

function parseTargetInputs({
  itemIds,
  component,
}: {
  itemIds: readonly string[];
  component: readonly string[];
}) {
  const normalizeInput = (value: string) => value.trim().replace(/\s+/g, "-");
  const itemInputs = itemIds.map(normalizeInput).filter(Boolean);
  const componentInputs = component
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

export const compatParser = command(
  "compat",
  object({
    command: constant("compat"),
    itemIds: multiple(argument(string({ metavar: "ITEM_ID" }))),
    component: multiple(
      option("-c", "--component", string({ metavar: "COMPONENT" }), {
        description: message`검사할 컴포넌트입니다. 여러 번 또는 쉼표로 지정할 수 있습니다.`,
      }),
    ),
    all: option("-a", "--all", { description: message`모든 레지스트리 항목을 검사합니다.` }),
    registry: optional(
      option("-r", "--registry", string({ metavar: "REGISTRY_ID" }), {
        description: message`컴포넌트 이름만 입력했을 때 사용할 기본 레지스트리입니다.`,
      }),
    ),
    cwd: cwdLongOption,
    baseUrl: baseUrlOption,
    framework: frameworkOption,
  }),
  {
    brief: message`설치된 스니펫의 호환성을 검사합니다`,
    footer: exampleFooter([
      "seed-design compat",
      "seed-design compat -c action-button",
      "seed-design compat ui:action-button ui:alert-dialog",
      "seed-design compat --all",
    ]),
  },
);

/**
 * Like `docs`, and unlike `add` and `init`, this command draws no clack frame: it answers a
 * question rather than walking someone through a change, and it never prompts. What it found
 * goes to stdout, one line each; what it checked, how the check ended and why it failed go to
 * stderr. A pipeline reading the findings gets them and nothing else, and a CI watching
 * stderr for trouble sees the trouble.
 */
export async function runCompat({ verbose, ...options }: ParsedOptions<typeof compatParser>) {
  const startTime = Date.now();
  const trackCwd = options.cwd;

  try {
    const rawConfig = await getRawConfig(options.cwd);
    const framework = options.framework ?? rawConfig?.framework ?? "react";

    const publicRegistries = await Promise.all(
      (await fetchAvailableRegistries({ baseUrl: options.baseUrl, framework })).map(({ id }) =>
        fetchRegistry({ baseUrl: options.baseUrl, framework, registryId: id }),
      ),
    );

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
            console.error(
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
          console.error("[Telemetry] compat 이벤트 전송에 실패했어요:", telemetryError);
        }
      }
      console.error("검사할 스니펫이 없어요.");
      // Nothing installed is not the same as not knowing where to look, which is why a
      // missing config leaves through the catch below instead of here.
      process.exit(ExitCode.answered);
    }

    const projectPackageVersions = getProjectSeedPackageVersionSpecs(options.cwd, framework);
    const compatibilityReport = analyzeRegistryItemCompatibility({
      publicRegistries,
      itemKeys: resolvedTargetItemKeys,
      projectPackageVersions,
      framework,
    });

    console.error(`검사 대상: ${highlight(compatibilityReport.checkedItemKeys.join(", "))}`);

    if (!compatibilityReport.issues.length) {
      const compatPkgNames = getCompatPackageNames(framework);
      console.error(`모든 스니펫이 현재 ${compatPkgNames.join(", ")}와 호환돼요.`);

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
          console.error("[Telemetry] compat 이벤트 전송에 실패했어요:", telemetryError);
        }
      }

      process.exit(ExitCode.answered);
    }

    console.log(
      formatCompatibilityReport({
        report: compatibilityReport,
        title: "현재 프로젝트 버전과 호환되지 않는 스니펫을 찾았어요.",
        framework,
      })
        .map(({ text }) => text)
        .join("\n"),
    );
    const compatPkgList = getCompatPackageNames(framework);
    console.error(`필요한 버전으로 ${compatPkgList.join(" 또는 ")}를 맞춘 뒤 다시 실행해보세요.`);
    console.error("호환성 이슈가 있어요.");

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
        console.error("[Telemetry] compat 이벤트 전송에 실패했어요:", telemetryError);
      }
    }

    process.exit(ExitCode.answeredNegatively);
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
          console.error("[Telemetry] compat 이벤트 전송에 실패했어요:", telemetryError);
        }
      }
      console.error(highlight(error.message));
      process.exit(ExitCode.cancelled);
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
        console.error("[Telemetry] compat 이벤트 전송에 실패했어요:", telemetryError);
      }
    }

    reportCliError(error, {
      defaultMessage: "호환성 검사에 실패했어요.",
      defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
      verbose,
    });
    process.exit(exitCodeFor(error));
  }
}
