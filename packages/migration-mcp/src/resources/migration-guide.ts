import { loadMigrationGuide } from "../utils/file-system.js";

// 마이그레이션 가이드 리소스
export async function migrationGuideResource() {
  try {
    const guideData = await loadMigrationGuide();

    return {
      contents: [
        {
          uri: "seed-migration://guide",
          mimeType: "application/json",
          text: JSON.stringify(guideData, null, 2),
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`마이그레이션 가이드 로드 중 오류: ${error.message}`);
  }
}
