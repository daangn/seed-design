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

export const upgradeCommand = (cli: CAC) => {
  cli
    .command(
      "upgrade [package-name]",
      "패키지의 현재 버전과 최신 버전 사이의 변경사항을 확인합니다",
    )
    .option("--cwd <cwd>", "the working directory. defaults to the current directory.", {
      default: process.cwd(),
    })
    .option("-u, --baseUrl <baseUrl>", "the base url for changelog lookup.", { default: BASE_URL })
    .option("--raw", "UI 없이 순수 마크다운만 출력합니다. LLM 파이프에 유용합니다.", {
      default: false,
    })
    .example("seed-design upgrade react")
    .example("seed-design upgrade react --raw")
    .example("seed-design upgrade css")
    .example("seed-design upgrade @seed-design/react")
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
      const raw = options.raw;

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
          if (raw) {
            throw new CliError({
              message: "--raw 모드에서는 패키지명을 직접 지정해야 해요.",
              hint: "예: `seed-design upgrade react --raw`",
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

        const currentVersionSpec = seedPackages[targetPackage];
        const currentVersion = resolveExactVersion(currentVersionSpec);

        if (!currentVersion) {
          throw new CliError({
            message: `${highlight(targetPackage)}의 버전을 파싱할 수 없어요: ${highlight(currentVersionSpec)}`,
            hint: "package.json에서 버전 형식을 확인해주세요.",
          });
        }

        let latestVersion: string;
        if (raw) {
          latestVersion = await fetchLatestVersion(targetPackage);
        } else {
          const { start, stop } = p.spinner();
          start("최신 버전을 확인하고 있어요...");
          try {
            latestVersion = await fetchLatestVersion(targetPackage);
            stop("최신 버전을 확인했어요.");
          } catch (error) {
            stop("최신 버전을 확인하지 못했어요.");
            throw error;
          }

          p.log.info(
            `${highlight(targetPackage)}: ${highlight(currentVersion)} → ${highlight(latestVersion)}`,
          );
        }

        if (currentVersion === latestVersion) {
          if (raw) {
            console.log(`${targetPackage}@${currentVersion} is already up to date.`);
          } else {
            p.outro("이미 최신 버전이에요.");
          }

          try {
            await analytics.track(options.cwd, {
              event: "upgrade",
              properties: {
                package: targetPackage,
                current_version: currentVersion,
                latest_version: latestVersion,
                up_to_date: true,
                duration_ms: Date.now() - startTime,
              },
            });
          } catch {}

          process.exit(0);
        }

        const slug = toSlug(targetPackage);

        let changelog: string;
        if (raw) {
          changelog = await fetchChangelog({
            baseUrl: options.baseUrl,
            packageSlug: slug,
            version: currentVersion,
          });
        } else {
          const { start, stop } = p.spinner();
          start("변경사항을 가져오고 있어요...");
          try {
            changelog = await fetchChangelog({
              baseUrl: options.baseUrl,
              packageSlug: slug,
              version: currentVersion,
            });
            stop("변경사항을 가져왔어요.");
          } catch (error) {
            stop("변경사항을 가져오지 못했어요.");
            throw error;
          }
        }

        if (raw) {
          console.log(changelog);
        } else {
          p.log.message(changelog);
          p.log.info(`업그레이드하려면: ${highlight(`bun add ${targetPackage}@${latestVersion}`)}`);
          p.outro("완료했어요.");
        }

        try {
          await analytics.track(options.cwd, {
            event: "upgrade",
            properties: {
              package: targetPackage,
              current_version: currentVersion,
              latest_version: latestVersion,
              up_to_date: false,
              duration_ms: Date.now() - startTime,
            },
          });
        } catch {}
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
