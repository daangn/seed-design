"use client";

import dynamic from "next/dynamic";

import type {
  V2Icon as V2IconImpl,
  V2IconColor as V2IconColorImpl,
  V3Icon as V3IconImpl,
} from "./icon";
import type { IconographyMigrationIndex as IconographyMigrationIndexImpl } from "./iconography-migration-index";

/**
 * 마이그레이션용 아이콘 컴포넌트들을 온디맨드 청크로 분리한다.
 *
 * `./icon`과 `./iconography-migration-index`는 아이콘 패키지를 네임스페이스로 통째 import한다
 * (`import * as V3Icons from "@karrotmarket/react-monochrome-icon"` 등). 이름으로 조회해야 해서
 * 네임스페이스가 필요하고, 그래서 tree shaking이 안 된다 — 합쳐서 파싱 2.2MB다.
 *
 * 이걸 `components/mdx-components.tsx`에서 직접 import하면 그 맵을 공유하는 10개 `[[...slug]]`
 * 라우트 전부의 번들에 들어간다. 실제 사용처는 `content/react/migration/migrating-icons.mdx`와
 * `content/docs/migration/migration-reference.mdx` 두 파일뿐이다.
 *
 * `ssr`은 기본값(true)을 쓴다 — 마이그레이션 표는 본문 콘텐츠라 서버 HTML을 남기는 게 낫다.
 * 청크 분리는 `ssr` 값과 무관하게 일어난다.
 *
 * 위 타입 import는 `import type`이라 빌드 시 완전히 지워지므로 번들에 영향이 없다.
 * `mdx-components.tsx`는 서버 모듈이라 이 파일이 클라이언트 경계 역할을 한다.
 */

const LazyV3Icon = dynamic(() => import("./icon").then((mod) => mod.V3Icon));
const LazyV2Icon = dynamic(() => import("./icon").then((mod) => mod.V2Icon));
const LazyV2IconColor = dynamic(() => import("./icon").then((mod) => mod.V2IconColor));
const LazyIconographyMigrationIndex = dynamic(() =>
  import("./iconography-migration-index").then((mod) => mod.IconographyMigrationIndex),
);

export function V3Icon(props: React.ComponentProps<typeof V3IconImpl>) {
  return <LazyV3Icon {...props} />;
}

export function V2Icon(props: React.ComponentProps<typeof V2IconImpl>) {
  return <LazyV2Icon {...props} />;
}

export function V2IconColor(props: React.ComponentProps<typeof V2IconColorImpl>) {
  return <LazyV2IconColor {...props} />;
}

export function IconographyMigrationIndex(
  props: React.ComponentProps<typeof IconographyMigrationIndexImpl>,
) {
  return <LazyIconographyMigrationIndex {...props} />;
}
