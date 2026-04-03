import { getPackageInfo } from "@/src/utils/get-package-info";
import * as p from "@clack/prompts";
import { coerce, valid } from "semver";
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
import { fetchChangelog, fetchLatestVersion } from "../utils/fetch";

const SEED_SCOPE = "@seed-design/";

const upgradeOptionsSchema = z.object({
  packageName: z.string().optional(),
  cwd: z.string(),
  baseUrl: z.string(),
  raw: z.boolean(),
  all: z.boolean(),
});

function toFullPackageName(input: string): string {
  return input.startsWith(SEED_SCOPE) ? input : `${SEED_SCOPE}${input}`;
}

function toSlug(packageName: string): string {
  return packageName.replace(SEED_SCOPE, "");
}

function findInstalledSeedPackages(cwd: string): Record<string, string> {
  const packageInfo = getPackageInfo(cwd);
  const allDeps = {
    ...packageInfo.dependencies,
    ...packageInfo.devDependencies,
    ...packageInfo.peerDependencies,
    ...packageInfo.optionalDependencies,
  };

  const seedPackages: Record<string, string> = {};
  for (const [name, version] of Object.entries(allDeps)) {
    if (name.startsWith(SEED_SCOPE) && version) {
      seedPackages[name] = version;
    }
  }

  return seedPackages;
}

function resolveExactVersion(versionSpec: string): string | null {
  let normalized = versionSpec.trim();

  if (normalized.startsWith("workspace:")) {
    normalized = normalized.slice("workspace:".length).trim();
  }

  if (normalized.startsWith("npm:")) {
    const lastAt = normalized.lastIndexOf("@");
    if (lastAt > 4) {
      normalized = normalized.slice(lastAt + 1);
    }
  }

  if (valid(normalized)) return normalized;

  const coerced = coerce(normalized);
  if (coerced) return coerced.version;

  return null;
}

interface UpgradeOneResult {
  package: string;
  currentVersion: string;
  latestVersion: string;
  upToDate: boolean;
  changelog: string | null;
}

async function upgradeOne({
  targetPackage,
  currentVersionSpec,
  baseUrl,
}: {
  targetPackage: string;
  currentVersionSpec: string;
  baseUrl: string;
}): Promise<UpgradeOneResult> {
  const currentVersion = resolveExactVersion(currentVersionSpec);

  if (!currentVersion) {
    throw new CliError({
      message: `${targetPackage}의 버전을 파싱할 수 없어요: ${currentVersionSpec}`,
      hint: "package.json에서 버전 형식을 확인해주세요.",
    });
  }

  const latestVersion = await fetchLatestVersion(targetPackage);

  if (currentVersion === latestVersion) {
    return {
      package: targetPackage,
      currentVersion,
      latestVersion,
      upToDate: true,
      changelog: null,
    };
  }

  const slug = toSlug(targetPackage);
  const changelog = await fetchChangelog({
    baseUrl,
    packageSlug: slug,
    version: currentVersion,
  });

  return {
    package: targetPackage,
    currentVersion,
    latestVersion,
    upToDate: false,
    changelog,
  };
}

function printResultRaw(result: UpgradeOneResult & { error?: string }) {
  if (result.error) {
    console.error(`## ${result.package}\n\nError: ${result.error}\n`);
  } else if (result.upToDate) {
    console.log(`${result.package}@${result.currentVersion} is already up to date.\n`);
  } else {
    console.log(result.changelog);
    console.log("");
  }
}

function printResultInteractive(result: UpgradeOneResult & { error?: string }) {
  if (result.error) {
    p.log.error(`${highlight(result.package)}: ${result.error}`);
  } else if (result.upToDate) {
    p.log.info(
      `${highlight(result.package)}: ${highlight(result.currentVersion)} — 이미 최신 버전이에요.`,
    );
  } else {
    p.log.info(
      `${highlight(result.package)}: ${highlight(result.currentVersion)} → ${highlight(result.latestVersion)}`,
    );
    p.log.message(result.changelog ?? "");
    p.log.info(
      `업그레이드하려면: ${highlight(`bun add ${result.package}@${result.latestVersion}`)}`,
    );
  }
}

async function trackResults(cwd: string, results: UpgradeOneResult[], startTime: number) {
  try {
    for (const result of results) {
      await analytics.track(cwd, {
        event: "upgrade",
        properties: {
          package: result.package,
          current_version: result.currentVersion,
          latest_version: result.latestVersion,
          up_to_date: result.upToDate,
          duration_ms: Date.now() - startTime,
        },
      });
    }
  } catch {}
}

export const upgradeCommand = (cli: CAC) => {
  cli
    .command(
      "upgrade [package-name]",
      "패키지의 현재 버전과 최신 버전 사이의 변경사항을 확인합니다",
    )
    .option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", {
      default: process.cwd(),
    })
    .option("-u, --baseUrl <baseUrl>", "the base url for changelog lookup.", { default: BASE_URL })
    .option("--raw", "UI 없이 순수 마크다운만 출력합니다. LLM 파이프에 유용합니다.", {
      default: false,
    })
    .option("-a, --all", "설치된 모든 @seed-design 패키지의 변경사항을 확인합니다.", {
      default: false,
    })
    .example("seed-design upgrade")
    .example("seed-design upgrade react")
    .example("seed-design upgrade --all")
    .example("seed-design upgrade --all --raw")
    .action(async (packageName, opts) => {
      const startTime = Date.now();
      const verbose = isVerboseMode(opts);
      const parsed = upgradeOptionsSchema.safeParse({ packageName, ...opts });
      if (!parsed.success) {
        if (opts.raw) {
          console.error(parsed.error.message);
          process.exit(1);
        }
        p.intro("seed-design upgrade");
        handleCliError(parsed.error, {
          defaultMessage: "업그레이드 확인에 실패했어요.",
          defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
          verbose,
        });
        process.exit(1);
      }

      const { data: options } = parsed;
      const { raw, all } = options;

      if (!raw) p.intro("seed-design upgrade");

      try {
        const seedPackages = findInstalledSeedPackages(options.cwd);
        const packageNames = Object.keys(seedPackages);

        if (packageNames.length === 0) {
          throw new CliError({
            message: "프로젝트에 설치된 @seed-design 패키지를 찾을 수 없어요.",
            hint: "`bun add @seed-design/react`로 패키지를 설치해보세요.",
          });
        }

        if (options.packageName && all) {
          throw new CliError({
            message: "패키지명과 --all 옵션을 동시에 사용할 수 없어요.",
            hint: "`seed-design upgrade --all` 또는 `seed-design upgrade react` 중 하나만 사용해주세요.",
          });
        }

        // --all: iterate all packages
        if (all) {
          if (raw) {
            const results = await Promise.all(
              packageNames.map((name) =>
                upgradeOne({
                  targetPackage: name,
                  currentVersionSpec: seedPackages[name],
                  baseUrl: options.baseUrl,
                }).catch((error): UpgradeOneResult & { error: string } => ({
                  package: name,
                  currentVersion: seedPackages[name],
                  latestVersion: "unknown",
                  upToDate: false,
                  changelog: null,
                  error: error instanceof Error ? error.message : String(error),
                })),
              ),
            );

            for (const result of results) {
              printResultRaw(result);
            }

            await trackResults(options.cwd, results, startTime);
            process.exit(0);
          }

          // --all interactive
          const { start, stop } = p.spinner();
          start("모든 패키지의 변경사항을 가져오고 있어요...");
          const results = await Promise.all(
            packageNames.map((name) =>
              upgradeOne({
                targetPackage: name,
                currentVersionSpec: seedPackages[name],
                baseUrl: options.baseUrl,
              }).catch((error): UpgradeOneResult & { error: string } => ({
                package: name,
                currentVersion: seedPackages[name],
                latestVersion: "unknown",
                upToDate: false,
                changelog: null,
                error: error instanceof Error ? error.message : String(error),
              })),
            ),
          );
          stop("변경사항을 가져왔어요.");

          for (const result of results) {
            printResultInteractive(result);
          }

          p.outro("완료했어요.");
          await trackResults(options.cwd, results, startTime);
          process.exit(0);
        }

        // resolve target package
        let targetPackage: string;

        if (options.packageName) {
          targetPackage = toFullPackageName(options.packageName);

          if (!seedPackages[targetPackage]) {
            throw new CliError({
              message: `${highlight(targetPackage)}: 프로젝트에 설치되어 있지 않아요.`,
              hint: `설치된 패키지: ${packageNames.map((n) => highlight(n)).join(", ")}`,
            });
          }
        } else {
          // no package, no --all: interactive select
          if (raw) {
            throw new CliError({
              message: "--raw 모드에서는 패키지명 또는 --all 옵션이 필요해요.",
              hint: "예: `seed-design upgrade react --raw` 또는 `seed-design upgrade --all --raw`",
            });
          }

          if (packageNames.length === 1) {
            targetPackage = packageNames[0];
          } else {
            const selected = await p.select({
              message: "변경사항을 확인할 패키지를 선택해주세요",
              options: packageNames.map((name) => ({
                label: name,
                value: name,
                hint: seedPackages[name],
              })),
            });
            if (p.isCancel(selected)) throw new CliCancelError();
            targetPackage = selected;
          }
        }

        // single package
        if (raw) {
          const result = await upgradeOne({
            targetPackage,
            currentVersionSpec: seedPackages[targetPackage],
            baseUrl: options.baseUrl,
          });
          printResultRaw(result);
          await trackResults(options.cwd, [result], startTime);
          process.exit(0);
        }

        // single package interactive
        const { start, stop } = p.spinner();
        start("최신 버전을 확인하고 있어요...");
        let result: UpgradeOneResult;
        try {
          result = await upgradeOne({
            targetPackage,
            currentVersionSpec: seedPackages[targetPackage],
            baseUrl: options.baseUrl,
          });
          stop("변경사항을 가져왔어요.");
        } catch (error) {
          stop("변경사항을 가져오지 못했어요.");
          throw error;
        }

        printResultInteractive(result);
        p.outro("완료했어요.");
        await trackResults(options.cwd, [result], startTime);
      } catch (error) {
        if (isCliCancelError(error)) {
          if (!raw) p.outro(highlight(error.message));
          process.exit(0);
        }

        if (raw) {
          const msg = error instanceof Error ? error.message : String(error);
          console.error(msg);
          process.exit(1);
        }

        handleCliError(error, {
          defaultMessage: "업그레이드 확인에 실패했어요.",
          defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
          verbose,
        });
        process.exit(1);
      }
    });
};
