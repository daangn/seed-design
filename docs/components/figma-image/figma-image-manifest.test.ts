import { describe, expect, it } from "bun:test";
import { collectFigmaImageIdsFromMdx } from "./collect-figma-image-ids";
import {
  createFigmaImageManifest,
  getFigmaImageCacheKey,
  getFigmaImageUrlsFromManifest,
} from "./figma-image-manifest";
import { remarkFigmaImage } from "./remark-figma-image";
import { mdxToJs } from "satteri";

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

  it("FigmaImage의 ID가 빈 문자열이면 오류를 발생시킨다", () => {
    expect(() => collectFigmaImageIdsFromMdx('<FigmaImage id="" alt="test" />')).toThrow(
      "FigmaImage requires a static non-empty 'id' prop",
    );
  });

  it("FigmaImage의 ID가 동적 표현식이면 오류를 발생시킨다", () => {
    expect(() => collectFigmaImageIdsFromMdx('<FigmaImage id={imageId} alt="test" />')).toThrow(
      "FigmaImage requires a static non-empty 'id' prop",
    );
  });
});

describe("Figma image manifest", () => {
  it("옵션 순서와 무관하게 같은 이미지 키를 사용한다", () => {
    expect(getFigmaImageCacheKey("1:2", { scale: 2, format: "png" })).toBe(
      getFigmaImageCacheKey("1:2", { format: "png", scale: 2 }),
    );
  });

  it("Satteri 변환에서 manifest를 사용한다", async () => {
    const manifest = createFigmaImageManifest([
      [getFigmaImageCacheKey("1:2", options), "https://example.com/image.png"],
    ]);
    const result = await mdxToJs('<FigmaImage id="1:2" alt="example" />', {
      mdastPlugins: [
        remarkFigmaImage({
          accessToken: "test-token",
          fileKey: "test-file",
          fetchUrlsOptions: options,
          manifest,
        }),
      ],
    });

    expect(result.code).toContain("https://example.com/image.png");
    expect(result.code).toContain('alt: "example"');
    expect(getFigmaImageUrlsFromManifest(manifest, ["1:2"], options)).toEqual(
      new Map([["1:2", "https://example.com/image.png"]]),
    );
  });

  it("인증 정보가 없어도 manifest의 이미지 URL을 사용한다", async () => {
    const manifest = createFigmaImageManifest([
      [getFigmaImageCacheKey("1:2", options), "https://example.com/image.png"],
    ]);
    const result = await mdxToJs('<FigmaImage id="1:2" alt="example" />', {
      mdastPlugins: [
        remarkFigmaImage({
          fetchUrlsOptions: options,
          manifest,
        }),
      ],
    });

    expect(result.code).toContain("https://example.com/image.png");
    expect(result.code).toContain('alt: "example"');
  });

  it("DoImage의 figmaId를 Satteri에서 src로 바꾼다", async () => {
    const manifest = createFigmaImageManifest([
      [getFigmaImageCacheKey("1:2", options), "https://example.com/image.png"],
    ]);
    const result = await mdxToJs('<DoImage figmaId="1:2" />', {
      mdastPlugins: [remarkFigmaImage({ fetchUrlsOptions: options, manifest })],
    });

    expect(result.code).toContain('src: "https://example.com/image.png"');
    expect(result.code).not.toContain("figmaId");
  });
});
