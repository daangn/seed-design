import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import { saveTokenUsageData } from "../utils/file-system.js";

interface AnalyzeTokensArgs {
  projectPath: string;
  includePatterns?: string[];
}

interface TokenUsageExample {
  file: string;
  token: string;
}

interface StitchesUsageExample {
  file: string;
  usage: string;
}

interface AnalysisResult {
  directTokenReferences: {
    count: number;
    files: string[];
    examples: TokenUsageExample[];
  };
  stitchesIntegration: {
    count: number;
    files: string[];
    examples: StitchesUsageExample[];
  };
  typeDependencies: {
    count: number;
    files: string[];
  };
  iconPackageDependencies: {
    count: number;
    files: string[];
  };
  cssStylesheetDependencies: {
    count: number;
    files: string[];
  };
  recommendedTransforms: string[];
}

// .gitignore 파일에서 제외 패턴 읽기
function readGitignorePatterns(projectPath: string): string[] {
  try {
    const gitignorePath = path.join(projectPath, ".gitignore");
    if (fs.existsSync(gitignorePath)) {
      const content = fs.readFileSync(gitignorePath, "utf-8");
      return content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((pattern) => {
          // glob 패턴 형식으로 변환
          if (!pattern.includes("*")) {
            return `**/${pattern}/**`;
          }
          return pattern;
        });
    }
  } catch (error) {
    console.warn(`Cannot read .gitignore file: ${error}`);
  }
  return [];
}

// package.json에서 의존성 확인
function detectDependencies(projectPath: string): { hasTailwind: boolean; hasStitches: boolean } {
  try {
    const packageJsonPath = path.join(projectPath, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

      const allDependencies = {
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
      };

      const hasTailwind = "tailwindcss" in allDependencies;
      const hasStitches = "@stitches/react" in allDependencies;

      return { hasTailwind, hasStitches };
    }
  } catch (error) {
    console.warn(`Cannot read package.json file: ${error}`);
  }

  return { hasTailwind: false, hasStitches: false };
}

// 토큰 사용 패턴 분석 도구
export async function analyzeTokens(args: AnalyzeTokensArgs) {
  const { projectPath, includePatterns = ["**/*.tsx", "**/*.ts"] } = args;

  try {
    // 결과 저장을 위한 객체
    const result: AnalysisResult = {
      directTokenReferences: {
        count: 0,
        files: [],
        examples: [],
      },
      stitchesIntegration: {
        count: 0,
        files: [],
        examples: [],
      },
      typeDependencies: {
        count: 0,
        files: [],
      },
      iconPackageDependencies: {
        count: 0,
        files: [],
      },
      cssStylesheetDependencies: {
        count: 0,
        files: [],
      },
      recommendedTransforms: [],
    };

    // 기본 제외 패턴
    const defaultIgnorePatterns = ["**/node_modules/**", "**/dist/**", "**/build/**"];

    // .gitignore 파일에서 제외 패턴 읽기
    const gitignorePatterns = readGitignorePatterns(projectPath);

    // 모든 제외 패턴 합치기
    const ignorePatterns = [...defaultIgnorePatterns, ...gitignorePatterns];

    // 파일 패턴에 맞는 모든 파일 찾기
    const files = await glob(includePatterns, {
      cwd: projectPath,
      ignore: ignorePatterns,
    });

    // 각 파일 분석
    for (const file of files) {
      const filePath = path.join(projectPath, file);
      const content = fs.readFileSync(filePath, "utf-8");

      // 직접 토큰 참조 확인
      const semanticColorRegex = /vars\.\$semantic\.color\./;
      const scaleColorRegex = /vars\.\$scale\.color\./;
      const staticColorRegex = /vars\.\$static\.color\./;
      const semanticTypographyRegex = /vars\.\$semantic\.typography\./;

      if (
        semanticColorRegex.test(content) ||
        scaleColorRegex.test(content) ||
        staticColorRegex.test(content) ||
        semanticTypographyRegex.test(content)
      ) {
        result.directTokenReferences.count++;
        result.directTokenReferences.files.push(file);

        // 예시 추출 (최대 3개)
        if (result.directTokenReferences.examples.length < 3) {
          const match = content.match(
            /(vars\.\$(?:semantic|scale|static)\.(?:color|typography)\.[a-zA-Z0-9._-]+)/,
          );
          if (match) {
            result.directTokenReferences.examples.push({
              file,
              token: match[1],
            });
          }
        }
      }

      // Stitches 통합 확인
      if (content.match(/import.*from.*stitches|theme\.colors\./)) {
        result.stitchesIntegration.count++;
        result.stitchesIntegration.files.push(file);

        // 예시 추출
        if (result.stitchesIntegration.examples.length < 3) {
          const match = content.match(/(theme\.colors\.[a-zA-Z0-9._-]+)/);
          if (match) {
            result.stitchesIntegration.examples.push({
              file,
              usage: match[1],
            });
          }
        }
      }

      // 타입 의존성 확인
      if (content.match(/TokenObject|SemanticColor|ScaleColor/)) {
        result.typeDependencies.count++;
        result.typeDependencies.files.push(file);
      }

      // 아이콘 패키지 의존성 확인
      if (content.match(/from ['"]@seed-design\/react-icon['"]/)) {
        result.iconPackageDependencies.count++;
        result.iconPackageDependencies.files.push(file);
      }

      // CSS 스타일시트 의존성 확인
      if (content.match(/import.*@seed-design\/stylesheet/)) {
        result.cssStylesheetDependencies.count++;
        result.cssStylesheetDependencies.files.push(file);
      }
    }

    // package.json에서 의존성 감지
    const { hasTailwind, hasStitches } = detectDependencies(projectPath);

    // 추천 transform 결정
    try {
      // @seed-design/codemod 패키지의 transformers를 동적으로 가져옵니다 (해당 패키지가 설치되어 있을 경우)
      // 로컬 개발 환경에서는 직접 참조하고, 빌드환경에서는 직접 상수를 사용합니다.
      let Transformers;
      try {
        // 동적 import 시도
        const transformersPath = require.resolve("@seed-design/codemod/transformers");
        const transformersModule = require(transformersPath);
        Transformers = transformersModule.Transformers;
      } catch (e) {
        // fallback - 기본 transformers 정의
        Transformers = {
          REPLACE_STITCHES_STYLED_COLOR: "replace-stitches-styled-color",
          REPLACE_STITCHES_THEME_COLOR: "replace-stitches-theme-color",
          REPLACE_STITCHES_STYLED_TYPOGRAPHY: "replace-stitches-styled-typography",
          REPLACE_SEED_DESIGN_TOKEN_VARS: "replace-seed-design-token-vars",
          REPLACE_SEED_DESIGN_TOKEN_TYPOGRAPHY_CLASSNAME:
            "replace-seed-design-token-typography-classname",
          REPLACE_TAILWIND_COLOR: "replace-tailwind-color",
          REPLACE_TAILWIND_TYPOGRAPHY: "replace-tailwind-typography",
          REPLACE_REACT_ICON: "replace-react-icon",
          REPLACE_CUSTOM_TEXT_COMPONENT_COLOR_PROP: "replace-custom-text-component-color-prop",
          REPLACE_CUSTOM_SEED_DESIGN_TEXT_COMPONENT: "replace-custom-seed-design-text-component",
          REPLACE_CSS_SEED_DESIGN_COLOR_VARIABLE: "replace-css-seed-design-color-variable",
          REPLACE_CSS_SEED_DESIGN_TYPOGRAPHY_VARIABLE:
            "replace-css-seed-design-typography-variable",
        };
      }

      // 직접 토큰 참조가 있는 경우
      if (result.directTokenReferences.count > 0) {
        result.recommendedTransforms.push(Transformers.REPLACE_SEED_DESIGN_TOKEN_VARS);
      }

      // Stitches 사용 감지
      if (result.stitchesIntegration.count > 0 || hasStitches) {
        result.recommendedTransforms.push(Transformers.REPLACE_STITCHES_STYLED_COLOR);
        result.recommendedTransforms.push(Transformers.REPLACE_STITCHES_THEME_COLOR);
        result.recommendedTransforms.push(Transformers.REPLACE_STITCHES_STYLED_TYPOGRAPHY);
      }

      // Tailwind 사용 감지
      if (hasTailwind) {
        result.recommendedTransforms.push(Transformers.REPLACE_TAILWIND_COLOR);
        result.recommendedTransforms.push(Transformers.REPLACE_TAILWIND_TYPOGRAPHY);
      }

      // 아이콘 패키지 의존성이 있는 경우
      if (result.iconPackageDependencies.count > 0) {
        result.recommendedTransforms.push(Transformers.REPLACE_REACT_ICON);
      }

      // CSS 스타일시트 의존성이 있는 경우
      if (result.cssStylesheetDependencies.count > 0) {
        result.recommendedTransforms.push(Transformers.REPLACE_CSS_SEED_DESIGN_COLOR_VARIABLE);
        result.recommendedTransforms.push(Transformers.REPLACE_CSS_SEED_DESIGN_TYPOGRAPHY_VARIABLE);
      }
    } catch (error) {
      console.warn("Transform 추천 생성 중 오류 발생:", error);
    }

    // 분석 결과 저장
    const projectName = path.basename(projectPath);
    await saveTokenUsageData(projectName, result);

    // 결과 반환
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              projectName,
              analysisResult: result,
              summary: {
                totalFilesAnalyzed: files.length,
                directTokenReferences: result.directTokenReferences.count,
                stitchesIntegration: result.stitchesIntegration.count,
                typeDependencies: result.typeDependencies.count,
                iconPackageDependencies: result.iconPackageDependencies.count,
                cssStylesheetDependencies: result.cssStylesheetDependencies.count,
                hasTailwind,
                hasStitches,
                recommendedTransforms: result.recommendedTransforms,
              },
            },
            null,
            2,
          ),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `토큰 분석 중 오류가 발생했습니다: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}
