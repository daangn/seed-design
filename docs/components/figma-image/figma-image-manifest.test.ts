import { describe, expect, it } from "bun:test";
import { collectFigmaImageIdsFromMdx } from "./collect-figma-image-ids";
import {
  createFigmaImageManifest,
  getFigmaImageCacheKey,
  getFigmaImageUrlsFromManifest,
} from "./figma-image-manifest";
import { remarkFigmaImage } from "./remark-figma-image";
import { remark } from "remark";
import remarkMdx from "remark-mdx";

const options = { format: "png", scale: 2 } as const;

describe("collectFigmaImageIdsFromMdx", () => {
  it("지원하는 MDX 컴포넌트의 ID를 중복 없이 수집한다", () => {
    const ids = collectFigmaImageIdsFromMdx(`---
title: Test
---

<FigmaImage id="1:2" alt="test" />
<DoImage figmaId="3:4" />
<DontImage figmaId="1:2" />
`);

    expect(ids).toEqual(["1:2", "3:4"]);
  });
});

describe("Figma image manifest", () => {
  it("옵션 순서와 무관하게 같은 이미지 키를 사용한다", () => {
    expect(getFigmaImageCacheKey("1:2", { scale: 2, format: "png" })).toBe(
      getFigmaImageCacheKey("1:2", { format: "png", scale: 2 }),
    );
  });

  it("remark 변환에서 manifest를 동기적으로 사용한다", () => {
    const manifest = createFigmaImageManifest([
      [getFigmaImageCacheKey("1:2", options), "https://example.com/image.png"],
    ]);
    const processor = remark().use(remarkMdx).use(remarkFigmaImage, {
      accessToken: "test-token",
      fileKey: "test-file",
      fetchUrlsOptions: options,
      manifest,
    });
    const tree = processor.parse('<FigmaImage id="1:2" alt="example" />');

    expect(processor.runSync(tree)).toBe(tree);
    expect(tree.children[0]).toMatchObject({
      type: "paragraph",
      children: [{ type: "image", url: "https://example.com/image.png", alt: "example" }],
    });
    expect(getFigmaImageUrlsFromManifest(manifest, ["1:2"], options)).toEqual(
      new Map([["1:2", "https://example.com/image.png"]]),
    );
  });
});
