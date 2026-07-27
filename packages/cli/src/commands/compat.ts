import { fetchAvailableRegistries, fetchCompatManifest, fetchRegistry } from "@/src/utils/fetch";
import { getRawConfig } from "@/src/utils/get-config";
import * as p from "@clack/prompts";
import path from "path";
import { z } from "zod";

import type { CAC } from "cac";
import type { CompatManifest } from "@/src/schema";
import { BASE_URL } from "../constants";
import { analytics } from "../utils/analytics";
import { highlight } from "../utils/color";
import {
  analyzePackagePeerCompatibility,
  analyzeRegistryItemCompatibility,
  type CompatibilityReport,
  findInstalledSnippetItemKeys,
  getCompatPackageNames,
  getInstalledManifestPackages,
  getProjectSeedPackageVersionSpecs,
  logCompatibilityReport,
  logPackagePeerReport,
  type PackagePeerReport,
} from "../utils/compatibility";
import { CliError, handleCliError, isCliCancelError, isVerboseMode } from "../utils/error";

const compatOptionsSchema = z.object({
  itemIds: z.array(z.string()).optional(),
  component: z.union([z.string(), z.array(z.string())]).optional(),
  all: z.boolean(),
  registry: z.string().optional(),
  cwd: z.string(),
  baseUrl: z.string().default(BASE_URL),
  framework: z.enum(["react", "lynx"]).optional(),
  with: z.union([z.string(), z.array(z.string())]).optional(),
  json: z.boolean().optional(),
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

/** `--with css@1.2.4` 입력을 `{ "@seed-design/css": "1.2.4" }`로 파싱해요. 스코프 생략 시 @seed-design/ 보충. */
function parseWithOverrides(withInputs: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const input of withInputs) {
    const at = input.lastIndexOf("@");
    if (at <= 0) {
      throw new CliError({
        message: `${highlight(input)}: --with 형식이 올바르지 않아요.`,
        hint: `${highlight("css@1.2.4")} 또는 ${highlight("@seed-design/css@1.2.4")}처럼 입력해주세요.`,
      });
    }
    const rawName = input.slice(0, at);
    const version = input.slice(at + 1);
    const name = rawName.startsWith("@") ? rawName : `@seed-design/${rawName}`;
    result[name] = version;
  }
  return result;
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

/**
 * 스니펫 호환성 검사: 설치된(또는 지정된) 스니펫이 프로젝트의 seed 버전 범위와 맞는지 확인해요.
 * 검사 대상이 없으면 null 을 돌려줘요. (--with 가상 조회 모드에서는 호출하지 않아요.)
 */
async function runSnippetCheck({
  options,
  framework,
  jsonMode,
}: {
  options: z.infer<typeof compatOptionsSchema>;
  framework: string;
  jsonMode: boolean;
}): Promise<CompatibilityReport | null> {
  const fetchRegistries = async () => {
    const available = await fetchAvailableRegistries({ baseUrl: options.baseUrl, framework });
    return Promise.all(
      available.map(({ id }) =>
        fetchRegistry({ baseUrl: options.baseUrl, framework, registryId: id }),
      ),
    );
  };

  let publicRegistries: Awaited<ReturnType<typeof fetchRegistries>>;
  if (jsonMode) {
    publicRegistries = await fetchRegistries();
  } else {
    const { start, stop } = p.spinner();
    start("Registry를 가져오고 있어요...");
    try {
      publicRegistries = await fetchRegistries();
      stop("Registry를 가져왔어요.");
    } catch (error) {
      stop("Registry를 가져오지 못했어요.");
      throw error;
    }
  }

  const targetInputs = parseTargetInputs({
    itemIds: options.itemIds,
    component: options.component,
  });

  let resolvedTargetItemKeys: string[];
  if (options.all) {
    resolvedTargetItemKeys = publicRegistries.flatMap((registry) =>
      registry.items.map((item) => `${registry.id}:${item.id}`),
    );
  } else if (targetInputs.length > 0) {
    resolvedTargetItemKeys = resolveExplicitItemKeys({
      publicRegistries,
      targetInputs,
      defaultRegistry: options.registry,
    });
  } else {
    const rawConfig = await getRawConfig(options.cwd);
    if (!rawConfig) {
      // seed-design.json 이 없으면 설치된 스니펫을 자동 발견할 수 없어요.
      // 스니펫 없이 패키지만 쓰는 프로젝트(라이브러리 등)도 있으므로, 에러 대신 스니펫 검사를 건너뛰어요.
      if (!jsonMode) {
        p.log.info(
          "seed-design.json 이 없어 스니펫 검사는 건너뛰어요. (`--all`/`-c`로 대상을 지정하면 검사할 수 있어요.)",
        );
      }
      return null;
    }
    const rootPath = path.resolve(options.cwd, rawConfig.path);
    const installedItemKeys = findInstalledSnippetItemKeys({ publicRegistries, rootPath });
    if (!installedItemKeys.length && !jsonMode) {
      p.log.info(
        `${highlight(path.relative(options.cwd, rootPath) || rawConfig.path)}에서 설치된 스니펫을 찾지 못했어요.`,
      );
    }
    resolvedTargetItemKeys = installedItemKeys;
  }

  if (!resolvedTargetItemKeys.length) return null;

  return analyzeRegistryItemCompatibility({
    publicRegistries,
    itemKeys: resolvedTargetItemKeys,
    projectPackageVersions: getProjectSeedPackageVersionSpecs(options.cwd, framework),
    framework,
  });
}

export const compatCommand = (cli: CAC) => {
  cli
    .command("compat [...item-ids]", "check snippet and package compatibility")
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
    .option("-f, --framework <framework>", "프레임워크 (react 또는 lynx)")
    .option(
      "-w, --with <pkg@version>",
      "설치본 대신 가정한 버전으로 패키지 간 호환을 조회 (예: css@1.2.4). 여러 번 지정 가능",
    )
    .option("--json", "결과를 JSON으로 출력 (에이전트/CI용)", { default: false })
    .example("seed-design compat")
    .example("seed-design compat -c action-button")
    .example("seed-design compat --with css@1.2.4")
    .example("seed-design compat --json")
    .action(async (itemIds, opts) => {
      const startTime = Date.now();
      const verbose = isVerboseMode(opts);
      const trackCwd = typeof opts?.cwd === "string" ? opts.cwd : process.cwd();

      const parsed = compatOptionsSchema.safeParse({ itemIds, ...opts });
      const jsonMode = parsed.success ? Boolean(parsed.data.json) : false;

      if (!jsonMode) p.intro("seed-design compat");

      try {
        if (!parsed.success) throw parsed.error;

        const { data: options } = parsed;
        const rawConfig = await getRawConfig(options.cwd);
        const framework = options.framework ?? rawConfig?.framework ?? "react";
        const withInputs = options.with
          ? Array.isArray(options.with)
            ? options.with
            : [options.with]
          : [];
        const withOverrides = parseWithOverrides(withInputs);
        const isVirtualQuery = withInputs.length > 0;

        // 패키지 간 호환 (manifest 기반). manifest 미배포/접근불가 시 패키지 검사는 건너뛰어요.
        // 다만 "검사 못 함"을 "문제 없음"으로 읽히게 두지 않으려고 사유를 들고 다녀요.
        let manifest: CompatManifest | null = null;
        let packagesUncheckedReason: string | null = null;
        try {
          manifest = await fetchCompatManifest({ baseUrl: options.baseUrl, framework });
        } catch (error) {
          if (isVirtualQuery) throw error; // --with 는 manifest 가 필수
          packagesUncheckedReason =
            error instanceof CliError ? error.message : "호환성 매니페스트를 가져오지 못했어요.";
          if (verbose) console.error("[compat] manifest fetch 실패:", error);
        }

        let peerReport: PackagePeerReport | null = null;
        if (manifest) {
          const installedPackages = getInstalledManifestPackages({ manifest, cwd: options.cwd });
          const installedVersions: Record<string, string> = {};
          const declaredPeers: Record<string, Record<string, string>> = {};
          for (const [name, info] of Object.entries(installedPackages)) {
            installedVersions[name] = info.version;
            declaredPeers[name] = info.declaredPeers;
          }
          // --with 로 가정한 버전은 설치본과 다르므로 설치본의 peer 선언을 fallback 으로 쓰지 않아요.
          for (const [name, version] of Object.entries(withOverrides)) {
            installedVersions[name] = version;
            if (installedPackages[name]?.version !== version) delete declaredPeers[name];
          }
          peerReport = analyzePackagePeerCompatibility({
            manifest,
            installedVersions,
            declaredPeers,
          });
        }

        // 스니펫 호환 (가상 조회 모드에서는 설치본과 무관하므로 생략)
        const snippetReport = isVirtualQuery
          ? null
          : await runSnippetCheck({ options, framework, jsonMode });

        const ok = (peerReport?.ok ?? true) && (snippetReport?.issues.length ?? 0) === 0;
        // 아무것도 검사하지 못했으면 ok(=true)를 "문제 없음"으로 보고하지 않아요.
        const checkedNothing = !peerReport && !snippetReport;

        if (jsonMode) {
          console.log(
            JSON.stringify(
              {
                ok,
                packagesUnchecked: packagesUncheckedReason,
                packages: peerReport,
                snippets: snippetReport,
              },
              null,
              2,
            ),
          );
        } else {
          if (peerReport) {
            logPackagePeerReport({ report: peerReport });
          }
          if (packagesUncheckedReason) {
            p.log.warn(`패키지 간 호환성은 검사하지 못했어요: ${packagesUncheckedReason}`);
          }
          if (snippetReport) {
            p.log.info(`스니펫 검사 대상: ${highlight(snippetReport.checkedItemKeys.join(", "))}`);
            if (snippetReport.issues.length) {
              logCompatibilityReport({
                report: snippetReport,
                title: "현재 프로젝트 버전과 호환되지 않는 스니펫을 찾았어요.",
                framework,
              });
            } else {
              p.log.success(
                `모든 스니펫이 현재 ${getCompatPackageNames(framework).join(", ")}와 호환돼요.`,
              );
            }
          }
          p.outro(
            checkedNothing
              ? "검사한 항목이 없어요."
              : ok
                ? "호환성 이슈가 없어요."
                : "호환성 이슈가 있어요.",
          );
        }

        // json 모드에서는 stdout 을 깨끗한 JSON 으로 유지하기 위해 telemetry 안내 출력을 생략해요.
        if (!jsonMode) {
          try {
            await analytics.trackCommandOutcome(options.cwd, {
              command: "compat",
              status: "completed",
              result: ok ? "compatible" : "incompatible",
              properties: {
                checked_items_count: snippetReport?.checkedItemKeys.length ?? 0,
                incompatible_items_count: snippetReport
                  ? new Set(snippetReport.issues.map((issue) => issue.itemKey)).size
                  : 0,
                package_issue_count: peerReport?.issues.length ?? 0,
                virtual_query: isVirtualQuery,
                duration_ms: Date.now() - startTime,
              },
            });
          } catch (telemetryError) {
            if (verbose)
              console.error("[Telemetry] compat 이벤트 전송에 실패했어요:", telemetryError);
          }
        }

        process.exit(ok ? 0 : 1);
      } catch (error) {
        if (isCliCancelError(error)) {
          try {
            await analytics.trackCommandOutcome(trackCwd, {
              command: "compat",
              status: "cancelled",
              properties: { duration_ms: Date.now() - startTime },
            });
          } catch (telemetryError) {
            if (verbose)
              console.error("[Telemetry] compat 이벤트 전송에 실패했어요:", telemetryError);
          }
          if (!jsonMode) p.outro(highlight(error.message));
          process.exit(0);
        }

        try {
          await analytics.trackCommandFailure(trackCwd, {
            command: "compat",
            error,
            properties: { duration_ms: Date.now() - startTime },
          });
        } catch (telemetryError) {
          if (verbose)
            console.error("[Telemetry] compat 이벤트 전송에 실패했어요:", telemetryError);
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
