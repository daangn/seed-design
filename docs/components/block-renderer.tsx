import { type ComponentType, use } from "react";
import { BlockThemeListener } from "./block-theme-listener";

type BlockModule = { default: ComponentType };

/**
 * block 이름 → 모듈. 예제 미리보기(`src/mdx/islands/example-modules.ts`)와 같은 방식이다: lazy glob 하나 + 모듈 수준
 * promise cache + React 19 `use()`. 서버는 suspend를 기다려 완성 HTML을 내고, 브라우저는 그 block chunk만 받아
 * hydrate하는 동안 서버 HTML을 그대로 둔다(boundary 없음).
 */
const LOADERS: Record<string, () => Promise<BlockModule>> = Object.fromEntries(
  Object.entries(import.meta.glob<BlockModule>("/registry/react/block/*.tsx")).map(
    ([path, load]) => [path.slice("/registry/react/block/".length, -".tsx".length), load],
  ),
);

const cache = new Map<string, Promise<BlockModule>>();

export function hasBlock(name: string): boolean {
  return name in LOADERS;
}

/**
 * `/blocks/[name]` island(`src/pages/blocks/[name].astro`, `client:load`). MDX `BlockPreview`가 iframe으로 띄우는 문서라
 * 부모 문서의 테마를 따른다(`BlockThemeListener`).
 */
export function BlockRenderer({ name }: { name: string }) {
  let promise = cache.get(name);
  if (!promise) {
    const loader = LOADERS[name];
    if (!loader) throw new Error(`registry/react/block/${name}.tsx가 없습니다.`);
    promise = loader();
    cache.set(name, promise);
  }
  const Block = use(promise).default;
  return (
    <>
      <BlockThemeListener />
      <Block />
    </>
  );
}
