import * as path from "path";

interface MigrationPlanArgs {
  projectPath: string;
  analysisResult?: any;
}

interface MigrationStep {
  name: string;
  description: string;
  command?: string;
  manualSteps?: string[];
  priority: "high" | "medium" | "low";
}

interface MigrationPlan {
  projectName: string;
  timestamp: string;
  overview: string;
  steps: MigrationStep[];
  estimatedTime: string;
  potentialIssues: string[];
}

// codemod transformer 자체 정의
const Transformers = {
  REPLACE_STITCHES_STYLED_COLOR: "replace-stitches-styled-color",
  REPLACE_STITCHES_THEME_COLOR: "replace-stitches-theme-color",
  REPLACE_STITCHES_STYLED_TYPOGRAPHY: "replace-stitches-styled-typography",
  REPLACE_SEED_DESIGN_TOKEN_VARS: "replace-seed-design-token-vars",
  REPLACE_SEED_DESIGN_TOKEN_TYPOGRAPHY_CLASSNAME: "replace-seed-design-token-typography-classname",
  REPLACE_TAILWIND_COLOR: "replace-tailwind-color",
  REPLACE_TAILWIND_TYPOGRAPHY: "replace-tailwind-typography",
  REPLACE_REACT_ICON: "replace-react-icon",
  REPLACE_CUSTOM_TEXT_COMPONENT_COLOR_PROP: "replace-custom-text-component-color-prop",
  REPLACE_CUSTOM_SEED_DESIGN_TEXT_COMPONENT: "replace-custom-seed-design-text-component",
  REPLACE_CSS_SEED_DESIGN_COLOR_VARIABLE: "replace-css-seed-design-color-variable",
  REPLACE_CSS_SEED_DESIGN_TYPOGRAPHY_VARIABLE: "replace-css-seed-design-typography-variable",
};

// transformer 설명
const transformerDescriptions: Record<string, string> = {
  [Transformers.REPLACE_STITCHES_STYLED_COLOR]:
    "Stitches styled 함수에서 사용하는 색상 토큰을 V3 형식으로 변환합니다.",
  [Transformers.REPLACE_STITCHES_THEME_COLOR]:
    "theme.colors 객체를 통해 접근하는 색상 토큰을 V3 형식으로 변환합니다.",
  [Transformers.REPLACE_STITCHES_STYLED_TYPOGRAPHY]:
    "Stitches styled 함수에서 $text 속성으로 사용하는 typography 토큰을 V3 형식으로 변환합니다.",
  [Transformers.REPLACE_SEED_DESIGN_TOKEN_VARS]:
    "vars.$scale.color, vars.$semantic.color, vars.$static.color, vars.$semantic.typography와 같은 직접 토큰 참조를 V3 형식으로 변환합니다.",
  [Transformers.REPLACE_SEED_DESIGN_TOKEN_TYPOGRAPHY_CLASSNAME]:
    "seed-design/design-token의 typography 클래스명 (ex: ts-text-01-m)을 V3 형식으로 변환합니다.",
  [Transformers.REPLACE_TAILWIND_COLOR]: "Tailwind CSS의 컬러 클래스를 V3 형식으로 변환합니다.",
  [Transformers.REPLACE_TAILWIND_TYPOGRAPHY]:
    "Tailwind CSS의 타이포그래피 클래스를 V3 형식으로 변환합니다.",
  [Transformers.REPLACE_REACT_ICON]: "React Icon 패키지를 V3 형식으로 변환합니다.",
  [Transformers.REPLACE_CUSTOM_TEXT_COMPONENT_COLOR_PROP]:
    "커스텀 텍스트 컴포넌트의 color prop을 V3 형식으로 변환합니다.",
  [Transformers.REPLACE_CUSTOM_SEED_DESIGN_TEXT_COMPONENT]:
    "커스텀 seed-design 텍스트 컴포넌트를 V3 형식으로 변환합니다.",
  [Transformers.REPLACE_CSS_SEED_DESIGN_COLOR_VARIABLE]:
    "CSS의 seed-design color 변수를 V3 형식으로 변환합니다.",
  [Transformers.REPLACE_CSS_SEED_DESIGN_TYPOGRAPHY_VARIABLE]:
    "CSS의 seed-design typography 변수를 V3 형식으로 변환합니다.",
};

// 마이그레이션 계획 생성 도구
export async function generateMigrationPlan(args: MigrationPlanArgs) {
  const { projectPath, analysisResult } = args;

  try {
    const projectName = path.basename(projectPath);

    // 프로젝트 분석 결과가 없는 경우 기본 계획 생성
    if (!analysisResult) {
      // 기본 마이그레이션 계획
      const defaultPlan: MigrationPlan = {
        projectName,
        timestamp: new Date().toISOString(),
        overview:
          "SEED 디자인 V2에서 V3로의 마이그레이션 계획입니다. 이 계획은 색상 토큰, 타이포그래피 토큰, 아이콘 패키지 등의 변경을 포함합니다.",
        steps: [
          {
            name: "프로젝트 분석",
            description: "프로젝트에서 SEED 디자인 토큰 사용 패턴을 분석합니다.",
            command: `npx @seed-design/migration-mcp analyze_tokens --projectPath="${projectPath}"`,
            priority: "high",
          },
          {
            name: "색상 토큰 마이그레이션",
            description: transformerDescriptions[Transformers.REPLACE_STITCHES_STYLED_COLOR],
            command: `npx @seed-design/codemod ${Transformers.REPLACE_STITCHES_STYLED_COLOR} src --log --ignore-config=".gitignore"`,
            priority: "high",
          },
          {
            name: "Stitches theme.color 마이그레이션",
            description: transformerDescriptions[Transformers.REPLACE_STITCHES_THEME_COLOR],
            command: `npx @seed-design/codemod ${Transformers.REPLACE_STITCHES_THEME_COLOR} src --log`,
            priority: "high",
          },
          {
            name: "타이포그래피 토큰 마이그레이션",
            description: transformerDescriptions[Transformers.REPLACE_STITCHES_STYLED_TYPOGRAPHY],
            command: `npx @seed-design/codemod ${Transformers.REPLACE_STITCHES_STYLED_TYPOGRAPHY} src --log`,
            priority: "high",
          },
          {
            name: "직접 토큰 참조 마이그레이션",
            description: transformerDescriptions[Transformers.REPLACE_SEED_DESIGN_TOKEN_VARS],
            command: `npx @seed-design/codemod ${Transformers.REPLACE_SEED_DESIGN_TOKEN_VARS} src --log`,
            priority: "medium",
          },
          {
            name: "colorThemeAdapter 수정",
            description:
              "Stitches의 colorThemeAdapter 함수가 V2 토큰 구조에 의존하고 있어 수동으로 수정이 필요합니다.",
            manualSteps: [
              "src/stitches/colors.ts 파일의 colorThemeAdapter 함수 수정",
              "convertToKebabCase 함수 추가",
              "매핑 테이블 업데이트",
            ],
            priority: "medium",
          },
          {
            name: "다크모드 스크립트 추가",
            description: "다크모드 지원을 위한 theming 스크립트를 추가합니다.",
            manualSteps: [
              "적절한 위치에 다음 코드 추가:",
              "import { generateThemingScript } from '@seed-design/css/theming'",
              "export default generateThemingScript({ mode: 'system' })",
            ],
            priority: "medium",
          },
          {
            name: "패키지 업데이트",
            description: "V2 패키지를 제거하고 V3 패키지를 설치합니다.",
            manualSteps: [
              "npm uninstall @seed-design/design-token",
              "npm install @seed-design/css @seed-design/react",
              "필요시 npm install @seed-design/v3-compat",
            ],
            priority: "high",
          },
        ],
        estimatedTime: "4-8시간 (프로젝트 크기에 따라 다름)",
        potentialIssues: [
          "알파값 관련 이슈: V2에서 사용하던 알파값이 V3에 대응되는 값이 없는 경우가 있습니다. 직접 알파값을 적용해야 합니다. 예: rgba(var(--seed-color-fg-brand), 0.5)",
          "Stitches colorThemeAdapter 수정 필요: Stitches의 colorThemeAdapter 함수가 V2 토큰 구조에 의존하고 있습니다. convertToKebabCase 함수를 추가하고 매핑 테이블을 업데이트해야 합니다.",
          "디자인 시스템 혼용 주의: @karrotmarket/design-token과 @seed-design/design-token이 함께 사용되는 경우 일관성 유지가 필요합니다.",
        ],
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(defaultPlan, null, 2),
          },
        ],
      };
    }

    // 분석 결과를 기반으로 맞춤형 마이그레이션 계획 생성
    const plan: MigrationPlan = {
      projectName,
      timestamp: new Date().toISOString(),
      overview: `SEED 디자인 V2에서 V3로의 마이그레이션 계획입니다. 분석 결과, 이 프로젝트에는 ${analysisResult.directTokenReferences?.count || 0}개의 직접 토큰 참조, ${analysisResult.stitchesIntegration?.count || 0}개의 Stitches 통합, ${analysisResult.typeDependencies?.count || 0}개의 타입 의존성이 있습니다.`,
      steps: [],
      estimatedTime: "",
      potentialIssues: [],
    };

    // 기본 분석 단계 추가
    plan.steps.push({
      name: "프로젝트 분석",
      description: "프로젝트에서 SEED 디자인 토큰 사용 패턴을 분석합니다.",
      command: `npx @seed-design/migration-mcp analyze_tokens --projectPath="${projectPath}"`,
      priority: "high",
    });

    // 추천된 transform 기반으로 단계 생성
    if (
      analysisResult.recommendedTransforms &&
      Array.isArray(analysisResult.recommendedTransforms)
    ) {
      // 추천 transform 기반으로 단계 추가
      for (const transformer of analysisResult.recommendedTransforms) {
        const description =
          transformerDescriptions[transformer] || `${transformer} 변환을 적용합니다.`;

        plan.steps.push({
          name: `${transformer} 마이그레이션`,
          description,
          command: `npx @seed-design/codemod ${transformer} src --log --ignore-config=".gitignore"`,
          priority: "high",
        });
      }
    } else {
      // 분석 결과에 따라 단계 추가
      if (analysisResult.stitchesIntegration?.count > 0 || analysisResult.summary?.hasStitches) {
        plan.steps.push({
          name: "색상 토큰 마이그레이션",
          description: transformerDescriptions[Transformers.REPLACE_STITCHES_STYLED_COLOR],
          command: `npx @seed-design/codemod ${Transformers.REPLACE_STITCHES_STYLED_COLOR} src --log --ignore-config=".gitignore"`,
          priority: "high",
        });

        plan.steps.push({
          name: "Stitches theme.color 마이그레이션",
          description: transformerDescriptions[Transformers.REPLACE_STITCHES_THEME_COLOR],
          command: `npx @seed-design/codemod ${Transformers.REPLACE_STITCHES_THEME_COLOR} src --log --ignore-config=".gitignore"`,
          priority: "high",
        });

        plan.steps.push({
          name: "타이포그래피 토큰 마이그레이션",
          description: transformerDescriptions[Transformers.REPLACE_STITCHES_STYLED_TYPOGRAPHY],
          command: `npx @seed-design/codemod ${Transformers.REPLACE_STITCHES_STYLED_TYPOGRAPHY} src --log --ignore-config=".gitignore"`,
          priority: "high",
        });

        plan.steps.push({
          name: "colorThemeAdapter 수정",
          description:
            "Stitches의 colorThemeAdapter 함수가 V2 토큰 구조에 의존하고 있어 수동으로 수정이 필요합니다.",
          manualSteps: [
            "src/stitches/colors.ts 파일의 colorThemeAdapter 함수 수정",
            "convertToKebabCase 함수 추가",
            "매핑 테이블 업데이트",
          ],
          priority: "medium",
        });
      }

      if (analysisResult.summary?.hasTailwind) {
        plan.steps.push({
          name: "Tailwind 색상 마이그레이션",
          description: transformerDescriptions[Transformers.REPLACE_TAILWIND_COLOR],
          command: `npx @seed-design/codemod ${Transformers.REPLACE_TAILWIND_COLOR} src --log --ignore-config=".gitignore"`,
          priority: "high",
        });

        plan.steps.push({
          name: "Tailwind 타이포그래피 마이그레이션",
          description: transformerDescriptions[Transformers.REPLACE_TAILWIND_TYPOGRAPHY],
          command: `npx @seed-design/codemod ${Transformers.REPLACE_TAILWIND_TYPOGRAPHY} src --log --ignore-config=".gitignore"`,
          priority: "high",
        });
      }

      if (analysisResult.directTokenReferences?.count > 0) {
        plan.steps.push({
          name: "직접 토큰 참조 마이그레이션",
          description: transformerDescriptions[Transformers.REPLACE_SEED_DESIGN_TOKEN_VARS],
          command: `npx @seed-design/codemod ${Transformers.REPLACE_SEED_DESIGN_TOKEN_VARS} src --log --ignore-config=".gitignore"`,
          priority: "medium",
        });
      }

      if (analysisResult.iconPackageDependencies?.count > 0) {
        plan.steps.push({
          name: "React Icon 마이그레이션",
          description: transformerDescriptions[Transformers.REPLACE_REACT_ICON],
          command: `npx @seed-design/codemod ${Transformers.REPLACE_REACT_ICON} src --log --ignore-config=".gitignore"`,
          priority: "medium",
        });
      }

      if (analysisResult.cssStylesheetDependencies?.count > 0) {
        plan.steps.push({
          name: "CSS 변수 마이그레이션",
          description: "CSS의 seed-design 변수들을 V3 형식으로 변환합니다.",
          command: `npx @seed-design/codemod ${Transformers.REPLACE_CSS_SEED_DESIGN_COLOR_VARIABLE} src --log --ignore-config=".gitignore"`,
          priority: "medium",
        });

        plan.steps.push({
          name: "CSS 임포트 변경",
          description:
            "@seed-design/stylesheet/global.css를 @seed-design/css/global.css로 변경합니다.",
          manualSteps: [
            "import '@seed-design/stylesheet/global.css'를 import '@seed-design/css/global.css'로 변경",
          ],
          priority: "medium",
        });
      }
    }

    // 공통 단계 추가
    plan.steps.push({
      name: "다크모드 스크립트 추가",
      description: "다크모드 지원을 위한 theming 스크립트를 추가합니다.",
      manualSteps: [
        "적절한 위치에 다음 코드 추가:",
        "import { generateThemingScript } from '@seed-design/css/theming'",
        "export default generateThemingScript({ mode: 'system' })",
      ],
      priority: "medium",
    });

    plan.steps.push({
      name: "패키지 업데이트",
      description: "V2 패키지를 제거하고 V3 패키지를 설치합니다.",
      manualSteps: [
        "npm uninstall @seed-design/design-token",
        "npm install @seed-design/css @seed-design/react",
        "필요시 npm install @seed-design/v3-compat",
      ],
      priority: "high",
    });

    // 예상 시간 계산
    const totalFiles =
      (analysisResult.directTokenReferences?.files?.length || 0) +
      (analysisResult.stitchesIntegration?.files?.length || 0);

    if (totalFiles < 50) {
      plan.estimatedTime = "2-4시간";
    } else if (totalFiles < 200) {
      plan.estimatedTime = "4-8시간";
    } else {
      plan.estimatedTime = "8시간 이상";
    }

    // 잠재적 이슈 추가
    plan.potentialIssues = [
      "알파값 관련 이슈: V2에서 사용하던 알파값이 V3에 대응되는 값이 없는 경우가 있습니다. 직접 알파값을 적용해야 합니다. 예: rgba(var(--seed-color-fg-brand), 0.5)",
      "Stitches colorThemeAdapter 수정 필요: Stitches의 colorThemeAdapter 함수가 V2 토큰 구조에 의존하고 있습니다. convertToKebabCase 함수를 추가하고 매핑 테이블을 업데이트해야 합니다.",
      "디자인 시스템 혼용 주의: @karrotmarket/design-token과 @seed-design/design-token이 함께 사용되는 경우 일관성 유지가 필요합니다.",
    ];

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(plan, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `마이그레이션 계획 생성 중 오류가 발생했습니다: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}
