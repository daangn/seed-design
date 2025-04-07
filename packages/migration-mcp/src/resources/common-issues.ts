import { loadCommonIssues } from "../utils/file-system.js";

// 일반적인 문제 및 해결책 리소스
export async function commonIssuesResource() {
  try {
    const issuesData = await loadCommonIssues();

    return {
      contents: [
        {
          uri: "seed-migration://common-issues",
          mimeType: "application/json",
          text: JSON.stringify(issuesData, null, 2),
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`일반적인 문제 및 해결책 로드 중 오류: ${error.message}`);
  }
}
