import { execa } from "execa";
import * as path from "path";
import * as fs from "fs";
import { glob } from "glob";
import { saveMigrationStatistics } from "../utils/file-system.js";
import { Transformers, isValidTransformer } from "@seed-design/codemod/transformers";

interface RunCodemodArgs {
  projectPath: string;
  transformName: string;
  targetPath: string;
  options?: {
    log?: boolean;
    ignoreConfig?: string;
  };
}

interface CodemodResult {
  transform: string;
  targetPath: string;
  startTime: string;
  endTime: string;
  success: boolean;
  output: string;
  error: string;
  stats: {
    filesProcessed: number;
    filesChanged: number;
    tokensTransformed: number;
    warnings: number;
    errors: number;
  };
}

// Codemod 실행 도구
export async function runCodemod(args: RunCodemodArgs) {
  const { projectPath, transformName, targetPath, options = {} } = args;

  try {
    // transformName 유효성 검사
    if (transformName !== "all" && !isValidTransformer(transformName)) {
      return {
        content: [
          {
            type: "text",
            text: `유효하지 않은 transformer 이름입니다: ${transformName}`,
          },
        ],
        isError: true,
      };
    }

    // 결과 저장을 위한 객체
    const result: CodemodResult = {
      transform: transformName,
      targetPath,
      startTime: new Date().toISOString(),
      endTime: "",
      success: false,
      output: "",
      error: "",
      stats: {
        filesProcessed: 0,
        filesChanged: 0,
        tokensTransformed: 0,
        warnings: 0,
        errors: 0,
      },
    };

    // Codemod 명령 구성
    const command = "npx";
    const commandArgs = ["@seed-design/codemod", transformName, targetPath];

    // 옵션 추가
    if (options.log) {
      commandArgs.push("--log");
    }

    if (options.ignoreConfig) {
      commandArgs.push("--ignore-config", options.ignoreConfig);
    }

    // 단일 transform 실행
    try {
      const { stdout, stderr } = await execa(command, commandArgs, {
        cwd: projectPath,
        env: { ...process.env, LOG: options.log ? "true" : "false" },
      });

      result.success = true;
      result.output = stdout;
      if (stderr) {
        result.error = stderr;
      }
    } catch (error: any) {
      result.success = false;
      result.error = error.message;
      if (error.stderr) {
        result.error += `\n${error.stder}`;
      }
    }

    // 로그 파일이 생성되었는지 확인하고 통계 추출
    if (options.log) {
      try {
        const logFiles = await glob("replace-*.log", { cwd: projectPath });
        if (logFiles.length > 0) {
          // 가장 최근 로그 파일 찾기
          const latestLog = logFiles.sort().pop();
          if (latestLog) {
            const logContent = fs.readFileSync(path.join(projectPath, latestLog), "utf-8");

            // 통계 추출
            const filesProcessed = (logContent.match(/Processing file/g) || []).length;
            const filesChanged = (logContent.match(/Successfully transformed/g) || []).length;
            const tokensTransformed = (logContent.match(/Transformed token/g) || []).length;
            const warnings = (logContent.match(/WARNING/g) || []).length;
            const errors = (logContent.match(/ERROR|FAILURE/g) || []).length;

            result.stats = {
              filesProcessed,
              filesChanged,
              tokensTransformed,
              warnings,
              errors,
            };
          }
        }
      } catch (error) {
        console.error("로그 파일 처리 중 오류:", error);
      }
    }

    result.endTime = new Date().toISOString();

    // 마이그레이션 통계 저장
    const projectName = path.basename(projectPath);
    await saveMigrationStatistics(projectName, transformName, result);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Codemod 실행 중 오류가 발생했습니다: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}
