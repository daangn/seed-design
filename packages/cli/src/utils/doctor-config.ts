import { cosmiconfig } from "cosmiconfig";

// seed-design.json에 doctor 키를 넣으면 구버전 CLI가 strict 스키마 파싱에서
// 하드 실패하므로, doctor 설정은 별도 파일(seed-doctor.json)로 둔다.
const MODULE_NAME = "seed-doctor";

const explorer = cosmiconfig(MODULE_NAME, {
  searchPlaces: [`${MODULE_NAME}.json`],
});

/**
 * seed-doctor.json의 원본 내용을 반환한다. 파일이 없으면 null.
 * 검증·정규화는 doctor-core의 parseDoctorConfig가 담당한다 — 이 파일은
 * cli 테스트가 doctor 패키지 빌드 없이 돌 수 있도록 doctor-core를 import하지 않는다.
 */
export async function getRawDoctorConfig(cwd: string): Promise<unknown | null> {
  const result = await explorer.search(cwd);
  if (!result || result.isEmpty) return null;
  return result.config;
}
