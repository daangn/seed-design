import { describe, expect, it } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { collectFigmaImageIdsFromMdx } from "./collect-figma-image-ids";
import {
  createFigmaImageManifest,
  getFigmaImageCacheKey,
  getFigmaImageUrlsFromManifest,
  writeFigmaImageManifest,
} from "./figma-image-manifest";
import { createBatchedFigmaImageUrlResolver, remarkFigmaImage } from "./remark-figma-image";
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

  it("내용이 같은 manifest는 다시 쓰지 않는다", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "figma-image-manifest-"));
    const manifestPath = path.join(directory, "manifest.json");
    const manifest = createFigmaImageManifest([["key", "https://example.com/image.png"]]);

    try {
      expect(await writeFigmaImageManifest(manifest, manifestPath)).toBe(true);
      expect(await writeFigmaImageManifest(manifest, manifestPath)).toBe(false);
    } finally {
      await rm(directory, { recursive: true });
    }
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

describe("createBatchedFigmaImageUrlResolver", () => {
  it("같은 시점의 중복 요청을 하나의 묶음으로 조회한다", async () => {
    const batches: string[][] = [];
    const resolveUrl = createBatchedFigmaImageUrlResolver(async (nodeIds) => {
      batches.push(nodeIds);
      return new Map(nodeIds.map((nodeId) => [nodeId, `https://example.com/${nodeId}.png`]));
    });

    const first = resolveUrl("1:2");
    const duplicate = resolveUrl("1:2");
    const second = resolveUrl("3:4");

    expect(await Promise.all([first, duplicate, second])).toEqual([
      "https://example.com/1:2.png",
      "https://example.com/1:2.png",
      "https://example.com/3:4.png",
    ]);
    expect(batches).toEqual([["1:2", "3:4"]]);
  });

  it("실패한 요청을 캐시하지 않고 다음 호출에서 다시 시도한다", async () => {
    let attempts = 0;
    const resolveUrl = createBatchedFigmaImageUrlResolver(async (nodeIds) => {
      attempts++;
      if (attempts === 1) throw new Error("temporary failure");
      return new Map(nodeIds.map((nodeId) => [nodeId, "https://example.com/retried.png"]));
    });

    await expect(resolveUrl("1:2")).rejects.toThrow("temporary failure");
    expect(await resolveUrl("1:2")).toBe("https://example.com/retried.png");
    expect(attempts).toBe(2);
  });
});
