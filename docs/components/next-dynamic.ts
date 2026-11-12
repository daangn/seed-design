import type { ComponentType } from "react";
import { lazyComponent } from "./lazy-component";

/**
 * `next/dynamic` 대체. 문서 예제(`examples/react/**`)는 독자에게 그대로 보여 주는 코드라 Next.js 앱에서
 * 쓰는 import를 유지하고, `astro.config.ts`의 alias가 그 import를 이 모듈로 연결한다.
 */
export default function dynamic<Props extends object>(
  load: () => Promise<ComponentType<Props>>,
  options?: { ssr?: boolean },
) {
  return lazyComponent(load, options);
}
