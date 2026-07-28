import path from "path";
import * as p from "@clack/prompts";
import color from "picocolors";
import { z } from "zod";

import {
  buildJsonReport,
  formatHumanReport,
  generateAgentHandoff,
  matchAgentRules,
  parseDoctorConfig,
  runStaticRules,
  type DoctorReport,
} from "@seed-design/doctor-core";
import { loadSeedRulePack } from "@seed-design/doctor-preset";
import type { CAC } from "cac";
import cliPackageJson from "../../package.json";
import { BASE_URL } from "../constants";
import { analytics } from "../utils/analytics";
import { highlight } from "../utils/color";
import { getRawDoctorConfig } from "../utils/doctor-config";
import { discoverSourceFiles } from "../utils/doctor-files";
import { handleCliError, isCliCancelError, isVerboseMode } from "../utils/error";
import { getRawConfig } from "../utils/get-config";

const doctorOptionsSchema = z.object({
  paths: z.array(z.string()).optional(),
  cwd: z.string(),
  baseUrl: z.string().default(BASE_URL),
  framework: z.enum(["react", "lynx"]).optional(),
  json: z.boolean().default(false),
  prompt: z.boolean().default(false),
  failOn: z.enum(["error", "warn", "info", "never"]).default("error"),
});

/** cwd 기준 posix 상대 경로. cwd 밖(../)이면 undefined — 스니펫 검사를 건너뛴다. */
function toSnippetRoot(cwd: string, configPath: string): string | undefined {
  const relative = path.relative(cwd, path.resolve(cwd, configPath));
  if (relative.startsWith("..")) return undefined;
  return relative.split(path.sep).join("/");
}

function isGateFailed(
  summary: DoctorReport["summary"],
  failOn: "error" | "warn" | "info" | "never",
): boolean {
  if (failOn === "never") return false;
  if (failOn === "error") return summary.error > 0;
  if (failOn === "warn") return summary.error + summary.warn > 0;
  return summary.error + summary.warn + summary.info > 0;
}

export const doctorCommand = (cli: CAC) => {
  cli
    .command("doctor [...paths]", "프로젝트의 SEED 사용 상태를 진단")
    .option("--cwd <cwd>", "the working directory. defaults to the current directory.", {
      default: process.cwd(),
    })
    .option(
      "-u, --baseUrl <baseUrl>",
      "the base url of the registry. defaults to the current directory.",
      { default: BASE_URL },
    )
    .option("-f, --framework <framework>", "프레임워크 (react 또는 lynx)")
    .option("--json", "결과를 JSON으로 출력 (스키마 버저닝, 억제된 finding 포함)", {
      default: false,
    })
    .option("--prompt", "에이전트에게 넘길 마크다운을 출력 (사실 + 검토 요청)", {
      default: false,
    })
    .option("--fail-on <level>", "exit 1 기준 severity (error|warn|info|never)", {
      default: "error",
    })
    .example("seed-design doctor")
    .example("seed-design doctor src/pages")
    .example("seed-design doctor --json")
    .example("seed-design doctor --prompt")
    .example("seed-design doctor --fail-on never")
    .action(async (paths, opts) => {
      const startTime = Date.now();
      const verbose = isVerboseMode(opts);
      const trackCwd = typeof opts?.cwd === "string" ? opts.cwd : process.cwd();
      // --json/--prompt는 stdout을 기계·에이전트가 그대로 소비하므로 clack 출력을 전부 억제한다.
      const jsonMode = opts?.json === true;
      const promptMode = opts?.prompt === true;
      const quiet = jsonMode || promptMode;

      if (!quiet) p.intro("seed-design doctor");

      try {
        const parsed = doctorOptionsSchema.safeParse({ paths, ...opts });
        if (!parsed.success) {
          throw parsed.error;
        }

        const { data: options } = parsed;
        const rawConfig = await getRawConfig(options.cwd);
        const framework = options.framework ?? rawConfig?.framework ?? "react";
        const snippetRoot = rawConfig ? toSnippetRoot(options.cwd, rawConfig.path) : undefined;

        const { config: doctorConfig, problems: doctorConfigProblems } = parseDoctorConfig(
          await getRawDoctorConfig(options.cwd),
        );
        if (!quiet) {
          for (const problem of doctorConfigProblems) {
            p.log.warn(`seed-doctor.json: ${problem}`);
          }
        }

        const spinner = quiet ? undefined : p.spinner();

        spinner?.start("SEED 지식을 불러오고 있어요...");
        const rulePack = await (async () => {
          try {
            const pack = await loadSeedRulePack({
              baseUrl: options.baseUrl,
              framework,
              snippetRoot,
            });
            spinner?.stop(`룰 ${pack.rules.length}개를 불러왔어요.`);
            return pack;
          } catch (error) {
            spinner?.stop("SEED 지식을 불러오지 못했어요.");
            throw error;
          }
        })();

        spinner?.start("소스 파일을 찾고 있어요...");
        const files = await discoverSourceFiles({
          cwd: options.cwd,
          paths: options.paths,
          ignore: doctorConfig.ignore,
        });
        spinner?.stop(`파일 ${files.length}개를 찾았어요.`);

        const result = runStaticRules({ files, rules: rulePack.rules, config: doctorConfig });
        result.diagnostics.push(
          ...doctorConfigProblems.map((problem) => ({ message: `seed-doctor.json: ${problem}` })),
        );

        const report = buildJsonReport(result, {
          tool: { name: cliPackageJson.name, version: cliPackageJson.version },
          cwd: options.cwd,
          fileCount: files.length,
          rulePacks: [{ name: rulePack.name, version: rulePack.version }],
        });

        if (jsonMode) {
          console.log(JSON.stringify(report, null, 2));
        } else if (promptMode) {
          // 결정론 룰이 알아낸 사실과 에이전트에게 위임할 검토를 한 문서로 넘긴다.
          console.log(
            generateAgentHandoff(
              {
                findings: report.findings,
                agentMatches: matchAgentRules(files, rulePack.rules),
              },
              {
                tool: { name: cliPackageJson.name, version: cliPackageJson.version },
                cwd: options.cwd,
              },
            ),
          );
        } else {
          p.log.message(
            formatHumanReport(report, {
              error: color.red,
              warn: color.yellow,
              info: color.blue,
              dim: color.dim,
              path: (text) => color.bold(color.underline(text)),
            }),
          );

          const agentRuleCount = matchAgentRules(files, rulePack.rules).length;
          if (agentRuleCount > 0) {
            p.log.info(
              `에이전트가 검토할 항목이 ${agentRuleCount}개 있어요. ${highlight("--prompt")}로 검토 요청 문서를 받을 수 있어요.`,
            );
          }
        }

        const gateFailed = isGateFailed(report.summary, options.failOn);
        const totalIssues = report.summary.error + report.summary.warn + report.summary.info;

        // --json에서는 텔레메트리를 건너뛴다 — analytics가 세션 첫 이벤트에서 안내 문구를
        // stdout에 출력해 JSON 파싱을 깨뜨리고, 기계 실행은 사용 통계도 왜곡한다.
        if (!quiet) {
          try {
            await analytics.trackCommandOutcome(options.cwd, {
              command: "doctor",
              status: "completed",
              result:
                files.length === 0
                  ? "empty"
                  : totalIssues === 0
                    ? "clean"
                    : gateFailed
                      ? "gate-failed"
                      : "issues",
              properties: {
                file_count: files.length,
                rule_count: rulePack.rules.length,
                error_count: report.summary.error,
                warn_count: report.summary.warn,
                info_count: report.summary.info,
                suppressed_count: report.summary.suppressed,
                fail_on: options.failOn,
                duration_ms: Date.now() - startTime,
              },
            });
          } catch (telemetryError) {
            if (verbose) {
              console.error("[Telemetry] doctor 이벤트 전송에 실패했어요:", telemetryError);
            }
          }
        }

        if (!quiet) {
          p.outro(gateFailed ? "문제가 발견됐어요." : "진단을 통과했어요.");
        }
        process.exit(gateFailed ? 1 : 0);
      } catch (error) {
        if (isCliCancelError(error)) {
          try {
            await analytics.trackCommandOutcome(trackCwd, {
              command: "doctor",
              status: "cancelled",
              properties: {
                duration_ms: Date.now() - startTime,
              },
            });
          } catch (telemetryError) {
            if (verbose) {
              console.error("[Telemetry] doctor 이벤트 전송에 실패했어요:", telemetryError);
            }
          }
          p.outro(highlight(error.message));
          process.exit(0);
        }

        try {
          await analytics.trackCommandFailure(trackCwd, {
            command: "doctor",
            error,
            properties: {
              duration_ms: Date.now() - startTime,
            },
          });
        } catch (telemetryError) {
          if (verbose) {
            console.error("[Telemetry] doctor 이벤트 전송에 실패했어요:", telemetryError);
          }
        }

        handleCliError(error, {
          defaultMessage: "진단에 실패했어요.",
          defaultHint: "`--verbose` 옵션으로 상세 오류를 확인해보세요.",
          verbose,
        });
        process.exit(1);
      }
    });
};
