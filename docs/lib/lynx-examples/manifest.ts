import {
  type LynxExampleManifest,
  type LynxExampleName,
  parseLynxExampleManifest,
} from "./manifest-schema";

export type { LynxExampleManifest, LynxExampleName } from "./manifest-schema";

// `build:lynx-examples`가 게시용 `public/__lynx__/manifest.json`과 같은 내용을 이 경로에도 쓴다.
// render 중 fs로 읽지 않고 module로 import해야 Astro incremental build가 manifest 변경을 module graph hash로
// 감지한다. 정적 JSON import 대신 glob을 쓰는 이유: 파일이 없는 checkout에서도 typecheck·테스트가 import 단계에서
// 실패하지 않고, 실제로 예제를 그릴 때만 아래 안내 오류를 낸다.
const files = import.meta.glob<unknown>("/.cache/build-data/lynx-manifest.json", {
  eager: true,
  import: "default",
});

let manifest: LynxExampleManifest | undefined;

function readManifest(name: LynxExampleName): LynxExampleManifest {
  if (manifest) return manifest;
  const value = Object.values(files)[0];
  if (value === undefined) {
    throw new Error(
      `${name}을 렌더링할 Lynx manifest가 없습니다. \`bun run build:lynx-examples\`를 실행하세요.`,
    );
  }
  manifest = parseLynxExampleManifest(value);
  return manifest;
}

/** 예제 이름의 web·lynx bundle 경로. 없는 이름이면 throw한다(빌드 실패). */
export function lynxExample(name: LynxExampleName) {
  const entry = readManifest(name).examples[name];
  if (!entry) {
    throw new Error(
      `${name}이 Lynx manifest에 없습니다. \`bun run build:lynx-examples\`를 실행하세요.`,
    );
  }
  return entry;
}
