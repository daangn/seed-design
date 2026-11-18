import { describe, expect, it } from "bun:test";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import avatar from "./src/recipes/avatar";
import { avatarBadgeClipPaths } from "./src/utils/avatar-badge-clip-paths";

const sharp = createRequire(new URL("../rsbuild-plugin-lynx-icon/package.json", import.meta.url))(
  "sharp",
);
const root = new URL("../../", import.meta.url);

describe("Lynx Avatar clipping", () => {
  it("keeps an Android background drawable and the full clip path across none transitions", () => {
    for (const slot of ["imageContainer", "fallback", "stroke"] as const) {
      const base = avatar.base[slot];
      expect(base.backgroundImage).toBe("linear-gradient(transparent, transparent)");
      expect(base.clipPath).toBe("var(--avatar-badge-clip-none)");
      expect(base.overflow).toBe("hidden");
      expect(base).not.toHaveProperty("maskImage");
      for (const shape of ["circle", "flower", "shield"] as const) {
        expect(avatar.variants.badgeMask[shape][slot].clipPath).toBe(
          `var(--avatar-badge-clip-${shape})`,
        );
      }
    }
    for (const [size, variant] of Object.entries(avatar.variants.size)) {
      const paths = avatarBadgeClipPaths[Number(size) as keyof typeof avatarBadgeClipPaths];
      for (const shape of ["none", "circle", "flower", "shield"] as const) {
        expect(variant.root[`--avatar-badge-clip-${shape}`]).toBe(paths[shape]);
      }
      expect(paths.none).toBe(`path('M0 0H${size}V${size}H0Z')`);
    }
    expect(new Set(Object.values(avatarBadgeClipPaths[20])).size).toBe(1);
    expect(avatar.variants.size[20].badge.display).toBe("none");
    expect(avatar.base.badge).not.toHaveProperty("clipPath");
  });

  it("matches React mask subtraction for all 27 shape and size combinations", async () => {
    const recipe = await readFile(
      new URL("packages/qvism-preset/src/recipes/avatar.ts", root),
      "utf8",
    );
    const spec = parse(
      await readFile(new URL("packages/rootage/components/avatar.yaml", root), "utf8"),
    );
    for (const [key, paths] of Object.entries(avatarBadgeClipPaths)) {
      const size = Number(key);
      if (size === 20) continue;
      const { badgeMask } = spec.data.definitions[`size=${size}`].enabled;
      const offset = Number.parseFloat(badgeMask.offset);
      const scale = Number.parseFloat(badgeMask.size) / 32;
      const svg = (body: string) =>
        Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${size * 3}" height="${size * 3}" viewBox="0 0 ${size} ${size}">${body}</svg>`,
        );
      for (const shape of ["circle", "flower", "shield"] as const) {
        const source = recipe.match(
          new RegExp(`const ${shape.toUpperCase()}_SVG_MASK =\\n  '(.*?)';`),
        )?.[1];
        if (!source) throw new Error(`Missing source: ${shape}`);
        const silhouette = source
          .replace(/^<svg[^>]*>/, "")
          .replace(/<\/svg>$/, "")
          .replaceAll('fill="white"', 'fill="black"')
          .replace('shape-rendering="crispEdges"', "");
        const expected = await sharp(
          svg(
            `<defs><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="white"/><g transform="translate(${offset} ${offset}) scale(${scale})">${silhouette}</g></mask></defs><rect width="${size}" height="${size}" fill="white" mask="url(#m)"/>`,
          ),
        )
          .ensureAlpha()
          .raw()
          .toBuffer();
        const actual = await sharp(
          svg(`<path d="${paths[shape].slice(6, -2)}" fill="white" fill-rule="nonzero"/>`),
        )
          .ensureAlpha()
          .raw()
          .toBuffer();
        let different = 0;
        let transparent = 0;
        for (let i = 3; i < actual.length; i += 4) {
          if (actual[i] === 0) transparent++;
          if (Math.abs(actual[i] - expected[i]) > 32) different++;
        }
        expect(transparent, `${size}/${shape}: missing cutout`).toBeGreaterThan(0);
        expect(
          different / (actual.length / 4),
          `${size}/${shape}: incorrect winding or geometry`,
        ).toBeLessThan(0.005);
      }
    }
  });
});
