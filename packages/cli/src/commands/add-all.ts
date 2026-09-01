import { fetchAvailableRegistries, fetchRegistry } from "@/src/utils/fetch";
import { getConfig } from "@/src/utils/get-config";
import { resolveDependencies } from "@/src/utils/resolve-dependencies";
import { writeRegistryItemSnippets } from "@/src/utils/write";
import * as p from "@clack/prompts";
import { object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { multiple } from "@optique/core/modifiers";
import { argument, command, constant, option } from "@optique/core/primitives";
import { string } from "@optique/core/valueparser";
import path from "path";

import { analytics } from "../utils/analytics";
import { highlight } from "../utils/color";
import { resolveSeedVersion } from "../utils/registry-source";
import {
  baseUrlOption,
  cwdOption,
  frameworkOption,
  includeDeprecatedOption,
  onDiffOption,
  type ParsedOptions,
  seedReactVersionOption,
} from "../utils/cli-options";
import { canPrompt } from "../utils/interactive";
import { exampleFooter } from "../utils/help";
import {
  analyzeRegistryItemCompatibility,
  getProjectSeedPackageVersionSpecs,
  logCompatibilityReport,
} from "../utils/compatibility";
import {
  CliCancelError,
  CliError,
  ExitCode,
  exitCodeFor,
  isCliCancelError,
  reportCliError,
} from "../utils/error";
import { installDependencies } from "../utils/install";

export const addAllParser = command(
  "add-all",
  object({
    command: constant("add-all"),
    registryIds: multiple(argument(string({ metavar: "REGISTRY_ID" }))),
    all: option("-a", "--all", {
      description: message`모든 레지스트리의 모든 항목을 추가합니다.`,
    }),
    includeDeprecated: includeDeprecatedOption,
    cwd: cwdOption,
    baseUrl: baseUrlOption,
    seedReactVersion: seedReactVersionOption,
    framework: frameworkOption,
    onDiff: onDiffOption,
  }),
  {
    brief: message`레지스트리의 모든 항목을 추가합니다`,
    footer: exampleFooter([
      "seed-design add-all ui --include-deprecated",
      "seed-design add-all ui lib breeze",
    ]),
  },
);

export async function runAddAll({ verbose, ...options }: ParsedOptions<typeof addAllParser>) {
  const startTime = Date.now();
  const trackCwd = options.cwd;
  p.intro("seed-design add-all");

  try {
    const cwd = options.cwd;
    const versionSource = resolveSeedVersion(options);
    const baseUrl = versionSource?.baseUrl ?? options.baseUrl;
    const config = await getConfig(cwd);
    const framework = versionSource?.framework ?? options.framework ?? config.framework;
    const rootPath = path.resolve(cwd, config.path);

    const { start, stop } = p.spinner();
    start("Registry를 가져오고 있어요...");

    const publicRegistries = await (async () => {
      try {
        const registries = await Promise.all(
          (await fetchAvailableRegistries({ baseUrl, framework })).map(async ({ id }) =>
            fetchRegistry({ baseUrl, framework, registryId: id }),
          ),
        );
        stop("Registry를 가져왔어요.");

        return registries;
      } catch (error) {
        stop("Registry를 가져오지 못했어요.");
        throw error;
      }
    })();

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
              message: `레지스트리 '${registryId}'를 찾을 수 없어요.`,
              details: [`사용 가능한 레지스트리: ${availableIds.join(", ")}`],
            });
          }
        }

        p.log.message(
          `선택된 레지스트리의 모든 항목을 추가합니다: ${highlight(options.registryIds.join(", "))}`,
        );

        return [...options.registryIds];
      }

      if (!canPrompt()) {
        throw new CliError({
          message: "추가할 레지스트리를 지정해주세요.",
          details: [`사용 가능한 레지스트리: ${publicRegistries.map((r) => r.id).join(", ")}`],
          hint: `${highlight("seed-design add-all ui")}처럼 레지스트리를 인자로 넘기거나, 전부 추가하려면 ${highlight("--all")}을 사용해주세요.`,
        });
      }

      const selected = await p.multiselect({
        message: "추가할 레지스트리를 선택해주세요 (스페이스 바로 여러 개 선택 가능)",
        options: publicRegistries
          .filter(({ hideFromCLICatalog }) => !hideFromCLICatalog)
          .sort((a, b) => b.items.length - a.items.length)
          .map((registry) => {
            const firstItemId = registry.items[0]?.id;
            const hint = firstItemId
              ? `${registry.items.length}개 항목 (${firstItemId} 등)`
              : `${registry.items.length}개 항목 (항목 없음)`;

            return {
              label: registry.id,
              value: registry.id,
              hint,
            };
          }),
      });

      if (p.isCancel(selected)) {
        throw new CliCancelError();
      }

      p.log.message(`선택된 레지스트리의 항목을 추가합니다: ${highlight(selected.join(", "))}`);

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

    const deprecatedCount = selectedRegistries.reduce(
      (count, r) => count + r.items.filter((item) => item.deprecated).length,
      0,
    );

    if (!options.includeDeprecated && deprecatedCount > 0) {
      p.log.info(
        `${deprecatedCount}개의 deprecated 항목은 제외되었어요. --include-deprecated 옵션을 사용하면 추가할 수 있어요.`,
      );
    }

    // Not a cancellation: nobody stopped anything, the selection simply holds nothing to add,
    // and reporting that as the `0` a cancellation earns would read as a completed install.
    if (!itemKeys.length) {
      throw new CliError({
        message: "추가할 항목이 없어요.",
        ...(deprecatedCount > 0 && {
          hint: `선택한 레지스트리의 항목이 모두 deprecated예요. ${highlight("--include-deprecated")} 옵션을 사용하면 추가할 수 있어요.`,
        }),
      });
    }

    p.log.message(`총 ${highlight(itemKeys.length.toString())}개의 항목을 추가합니다.`);

    const { registryItemsToAdd, npmDependenciesToAdd } = resolveDependencies({
      selectedItemKeys: itemKeys,
      publicRegistries,
    });

    const compatibilityReport = analyzeRegistryItemCompatibility({
      publicRegistries,
      itemKeys: registryItemsToAdd.flatMap(({ registryId, items }) =>
        items.map((item) => `${registryId}:${item.id}`),
      ),
      projectPackageVersions: getProjectSeedPackageVersionSpecs(options.cwd, framework),
      framework,
    });

    logCompatibilityReport({
      report: compatibilityReport,
      title: "현재 프로젝트 버전과 호환되지 않을 수 있는 스니펫이 있어요.",
      framework,
    });

    const { unresolved } = await writeRegistryItemSnippets({
      registryItemsToAdd,
      rootPath,
      cwd,
      baseUrl,
      framework,
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

    // Raised only once everything else has been done, so a rerun with `--on-diff` has the rest
    // of the work already behind it.
    if (unresolved.length) {
      throw new CliError({
        message: "내용이 다른 파일이 있어 일부 스니펫을 받지 못했어요.",
        details: unresolved,
        hint: `${highlight("--on-diff")}에 overwrite·backup·skip 중 하나를 지정해 다시 실행해주세요.`,
      });
    }

    p.outro("완료했어요.");

    // add-all 성공 이벤트 추적
    const duration = Date.now() - startTime;
    try {
      await analytics.trackCommandOutcome(options.cwd, {
        command: "add-all",
        status: "completed",
        properties: {
          registries: selectedRegistryIds,
          items_count: itemKeys.length,
          include_deprecated: options.includeDeprecated,
          dependencies_count: npmDependenciesToAdd.size,
          duration_ms: duration,
        },
      });
    } catch (telemetryError) {
      if (verbose) {
        console.error("[Telemetry] add-all 이벤트 전송에 실패했어요:", telemetryError);
      }
    }
  } catch (error) {
    if (isCliCancelError(error)) {
      try {
        await analytics.trackCommandOutcome(trackCwd, {
          command: "add-all",
          status: "cancelled",
          properties: {
            duration_ms: Date.now() - startTime,
          },
        });
      } catch (telemetryError) {
        if (verbose) {
          console.error("[Telemetry] add-all 이벤트 전송에 실패했어요:", telemetryError);
        }
      }
      p.outro(highlight(error.message));
      process.exit(ExitCode.cancelled);
    }

    try {
      await analytics.trackCommandFailure(trackCwd, {
        command: "add-all",
        error,
        properties: {
          duration_ms: Date.now() - startTime,
        },
      });
    } catch (telemetryError) {
      if (verbose) {
        console.error("[Telemetry] add-all 이벤트 전송에 실패했어요:", telemetryError);
      }
    }

    reportCliError(error, {
      defaultMessage: "추가에 실패했어요.",
      defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
      verbose,
    });
    process.exit(exitCodeFor(error));
  }
}
