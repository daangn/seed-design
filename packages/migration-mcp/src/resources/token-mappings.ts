import { loadTokenMappings } from "../utils/file-system.js";

// 토큰 매핑 리소스
export async function tokenMappingsResource() {
  try {
    const mappingsData = await loadTokenMappings();

    return {
      contents: [
        {
          uri: "seed-migration://token-mappings",
          mimeType: "application/json",
          text: JSON.stringify(mappingsData, null, 2),
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`토큰 매핑 로드 중 오류: ${error.message}`);
  }
}
