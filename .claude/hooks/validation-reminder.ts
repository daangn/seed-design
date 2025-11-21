import { readFileSync } from "fs";

// ===== 타입 정의 =====
interface StopInput {
  session_id: string;
  cwd: string;
  modified_files?: string[];
}

interface RiskPattern {
  patterns: RegExp[];
  risks: string[];
}

// ===== 리스크 패턴 정의 =====
const riskPatterns: Record<string, RiskPattern> = {
  react_docs: {
    patterns: [/docs\/content\/react\/components\/.*\.mdx$/, /examples\/react\/.*\.tsx$/],
    risks: [
      "ComponentExample 래퍼가 누락되지 않았나요?",
      "Import 경로가 올바른가요? (@/components/ui vs @seed-design/react)",
      "한국어 설명이 포함되어 있나요?",
      "doc-gen:file 경로가 정확한가요?",
    ],
  },
  headless: {
    patterns: [
      /packages\/react-headless\/.*\/src\/.*\.ts$/,
      /packages\/react-headless\/.*\/src\/.*\.tsx$/,
    ],
    risks: [
      "Headless 컴포넌트에 스타일 로직이 포함되지 않았나요?",
      "data-attributes가 올바르게 정의되었나요? (data-checked, data-disabled 등)",
      "forwardRef가 필요한 곳에 적용되었나요?",
      "Custom hook의 return 구조가 올바른가요?",
    ],
  },
  guidelines: {
    patterns: [
      /docs\/content\/docs\/components\/.*\.mdx$/,
      /packages\/rootage\/components\/.*\.yaml$/,
    ],
    risks: [
      "ComponentSpecBlock의 id가 Rootage metadata.id와 일치하나요?",
      "Props 테이블이 누락되지 않았나요?",
      "이미지 경로가 .webp 형식인가요?",
      "Props가 Rootage YAML 정의와 일치하나요?",
    ],
  },
};

// ===== 메인 로직 =====
try {
  // 1. stdin에서 입력 읽기
  const input: StopInput = JSON.parse(readFileSync(0, "utf-8"));

  // 2. 수정된 파일이 없으면 종료
  const modifiedFiles = input.modified_files || [];
  if (modifiedFiles.length === 0) {
    process.exit(0);
  }

  // 3. 수정된 파일에서 리스크 감지
  const detectedRisks: Set<string> = new Set();

  for (const file of modifiedFiles) {
    for (const [, config] of Object.entries(riskPatterns)) {
      // 파일 경로가 패턴과 매칭되는지 확인
      const isMatch = config.patterns.some((pattern) => pattern.test(file));

      if (isMatch) {
        // 해당 도메인의 모든 리스크 추가
        config.risks.forEach((risk) => {
          detectedRisks.add(risk);
        });
      }
    }
  }

  // 4. 감지된 리스크가 있으면 출력
  if (detectedRisks.size > 0) {
    let message = "\n";
    message += "╔════════════════════════════════════════════╗\n";
    message += "║  ⚠️  문서 품질 체크리스트                  ║\n";
    message += "╚════════════════════════════════════════════╝\n\n";

    message += "다음 사항들을 확인해주세요:\n\n";

    Array.from(detectedRisks).forEach((risk, index) => {
      message += `  ${index + 1}. ${risk}\n`;
    });

    message += "\n✅ 완료 전에 위 항목들을 검토하는 것을 권장합니다.\n";

    // systemMessage로 출력 (non-blocking)
    console.log(
      JSON.stringify({
        systemMessage: message,
      }),
    );
  }
} catch {
  // 에러가 나도 hook이 실행을 방해하지 않도록 조용히 처리
  // console.error('Validation reminder error:', error)
}
