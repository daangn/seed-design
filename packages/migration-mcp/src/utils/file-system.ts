import * as fs from "fs/promises";
import * as path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const PROJECT_DATA_DIR = path.join(DATA_DIR, "project-specific");

// 디렉토리 존재 확인 및 생성
async function ensureDirectory(dir: string) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// 토큰 사용 데이터 저장
export async function saveTokenUsageData(projectName: string, data: any) {
  await ensureDirectory(DATA_DIR);
  await ensureDirectory(PROJECT_DATA_DIR);

  // 전체 토큰 사용 패턴 데이터 업데이트
  const tokenUsagePath = path.join(DATA_DIR, "token-usage-patterns.json");
  let tokenUsageData: Record<string, any> = {};

  try {
    const existingData = await fs.readFile(tokenUsagePath, "utf-8");
    tokenUsageData = JSON.parse(existingData);
  } catch {
    // 파일이 없으면 새로 생성
  }

  // 프로젝트별 데이터 추가
  tokenUsageData[projectName] = {
    timestamp: new Date().toISOString(),
    data: {
      directTokenReferences: data.directTokenReferences.count,
      stitchesIntegration: data.stitchesIntegration.count,
      typeDependencies: data.typeDependencies.count,
      iconPackageDependencies: data.iconPackageDependencies.count,
      cssStylesheetDependencies: data.cssStylesheetDependencies.count,
    },
  };

  // 전체 데이터 저장
  await fs.writeFile(tokenUsagePath, JSON.stringify(tokenUsageData, null, 2), "utf-8");

  // 프로젝트별 상세 데이터 저장
  const projectDataPath = path.join(PROJECT_DATA_DIR, `${projectName}.json`);
  await fs.writeFile(
    projectDataPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        data,
      },
      null,
      2,
    ),
    "utf-8",
  );
}

// 마이그레이션 통계 데이터 저장
export async function saveMigrationStatistics(
  projectName: string,
  transformName: string,
  data: any,
) {
  await ensureDirectory(DATA_DIR);

  // 전체 마이그레이션 통계 데이터 업데이트
  const statsPath = path.join(DATA_DIR, "migration-statistics.json");
  let statsData: Record<string, any> = {};

  try {
    const existingData = await fs.readFile(statsPath, "utf-8");
    statsData = JSON.parse(existingData);
  } catch {
    // 파일이 없으면 새로 생성
  }

  // 프로젝트별 데이터 추가
  if (!statsData[projectName]) {
    statsData[projectName] = {};
  }

  // 트랜스폼별 데이터 추가
  statsData[projectName][transformName] = {
    timestamp: new Date().toISOString(),
    success: data.success,
    stats: data.stats,
  };

  // 전체 데이터 저장
  await fs.writeFile(statsPath, JSON.stringify(statsData, null, 2), "utf-8");

  // 프로젝트별 상세 로그 저장
  const projectDir = path.join(PROJECT_DATA_DIR, projectName);
  await ensureDirectory(projectDir);

  const logPath = path.join(projectDir, `${transformName}-${Date.now()}.log`);
  await fs.writeFile(
    logPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        transform: transformName,
        data,
      },
      null,
      2,
    ),
    "utf-8",
  );
}

// 마이그레이션 가이드 데이터 로드
export async function loadMigrationGuide() {
  const guidePath = path.join(DATA_DIR, "migration-guide.json");

  try {
    const guideData = await fs.readFile(guidePath, "utf-8");
    return JSON.parse(guideData);
  } catch {
    // 기본 가이드 데이터 반환
    return {
      title: "SEED 디자인 V2에서 V3로의 마이그레이션 가이드",
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      sections: [
        {
          title: "마이그레이션 개요",
          content:
            "SEED 디자인 V2에서 V3로의 마이그레이션은 색상 토큰, 타이포그래피 토큰, 아이콘 패키지 등의 변경을 포함합니다.",
        },
        {
          title: "주요 변경사항",
          content:
            "1. 색상 토큰 구조 변경\n2. 타이포그래피 토큰 구조 변경\n3. 아이콘 패키지 업데이트\n4. CSS 변수 이름 변경",
        },
        {
          title: "마이그레이션 단계",
          content: "1. 프로젝트 분석\n2. Codemod 실행\n3. 변경사항 검증\n4. 수동 수정 작업",
        },
      ],
    };
  }
}

// 토큰 매핑 데이터 로드
export async function loadTokenMappings() {
  const mappingsPath = path.join(DATA_DIR, "token-mappings.json");

  try {
    const mappingsData = await fs.readFile(mappingsPath, "utf-8");
    return JSON.parse(mappingsData);
  } catch {
    // 기본 매핑 데이터 반환
    return {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      colorMappings: {
        "vars.$semantic.color.primary": "color.bg.brand.solid",
        "vars.$scale.color.gray-900": "color.palette.gray-900",
        // 기본 매핑 예시
      },
      typographyMappings: {
        "vars.$semantic.typography.subtitle1Bold": "typography.subtitle1-bold",
        // 기본 매핑 예시
      },
    };
  }
}

// 일반적인 문제 및 해결책 데이터 로드
export async function loadCommonIssues() {
  const issuesPath = path.join(DATA_DIR, "common-issues.json");

  try {
    const issuesData = await fs.readFile(issuesPath, "utf-8");
    return JSON.parse(issuesData);
  } catch {
    // 기본 문제 및 해결책 데이터 반환
    return {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      issues: [
        {
          title: "알파값 관련 이슈",
          description: "V2에서 사용하던 알파값이 V3에 대응되는 값이 없는 경우가 있습니다.",
          solution: "직접 알파값을 적용해야 합니다. 예: rgba(var(--seed-color-fg-brand), 0.5)",
        },
        {
          title: "Stitches colorThemeAdapter 수정 필요",
          description: "Stitches의 colorThemeAdapter 함수가 V2 토큰 구조에 의존하고 있습니다.",
          solution: "convertToKebabCase 함수를 추가하고 매핑 테이블을 업데이트해야 합니다.",
        },
      ],
    };
  }
}
