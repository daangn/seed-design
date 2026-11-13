/**
 * `public/og/**`(커버·OG 이미지)에 어떤 파일이 있는지. render 중 `existsSync` 대신 이 목록을 본다.
 *
 * 목록은 `astro.config.ts`의 virtual module이 빌드 때 한 번 만든다. module graph에 들어가므로 파일을 더하거나
 * 지우면 이 모듈을 쓰는 route가 incremental build에서 다시 렌더링된다(DESIGN 핵심 결정 9).
 */
import files from "virtual:seed-docs/public-og-files";

const existing = new Set(files);

/** `/og/react.png` 같은 public 경로가 빌드에 있는가. */
export function publicFileExists(publicPath: string): boolean {
  return existing.has(publicPath);
}
