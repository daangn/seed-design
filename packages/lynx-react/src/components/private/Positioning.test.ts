import { describe, expect, it } from "vitest";

import { computePosition, type PositioningOptions, type Rect } from "./Positioning";

const boundary: Rect = {
  left: 0,
  top: 0,
  right: 320,
  bottom: 600,
  width: 320,
  height: 600,
};

const menuOptions = {
  flip: { fallbackStrategy: "bestFit" },
  shift: { crossAxis: true },
  size: { order: "beforeFlip", minimumHeight: 200 },
} satisfies Partial<PositioningOptions>;

describe("computePosition", () => {
  it("keeps the requested placement when it fits", async () => {
    await expect(
      computePosition({
        ...menuOptions,
        reference: { left: 140, top: 100, right: 180, bottom: 140, width: 40, height: 40 },
        boundary,
        width: 120,
        height: 100,
        placement: "bottom",
        gutter: 8,
        overflowPadding: 8,
      }),
    ).resolves.toMatchObject({
      left: 100,
      top: 148,
      width: 120,
      height: 100,
      placement: "bottom",
      transformOrigin: "50% 0%",
    });
  });

  it("flips alignment and shifts the floating element away from a viewport edge", async () => {
    const position = await computePosition({
      ...menuOptions,
      reference: { left: 280, top: 100, right: 320, bottom: 140, width: 40, height: 40 },
      boundary,
      width: 120,
      height: 100,
      placement: "bottom-start",
      gutter: 8,
      overflowPadding: 8,
    });

    expect(position).toMatchObject({
      left: 192,
      top: 148,
      width: 120,
      height: 100,
      placement: "bottom-end",
      transformOrigin: "100% 0%",
    });
  });

  it("keeps the floating element visible when neither side has enough space", async () => {
    const position = await computePosition({
      ...menuOptions,
      reference: { left: 150, top: 200, right: 350, bottom: 240, width: 200, height: 40 },
      boundary: { ...boundary, right: 390, bottom: 844, width: 390, height: 844 },
      width: 240,
      height: 108,
      placement: "right",
      gutter: 8,
      overflowPadding: 8,
    });

    expect(position).toMatchObject({
      left: 8,
      top: 166,
      width: 240,
      height: 108,
      placement: "left",
      transformOrigin: "100% 50%",
    });
  });

  it("keeps the floating element inside an embedded Lynx root", async () => {
    const embeddedRoot = {
      left: 780,
      top: 0,
      right: 1560,
      bottom: 516,
      width: 780,
      height: 516,
    };
    const position = await computePosition({
      ...menuOptions,
      reference: { left: 1480, top: 80, right: 1520, bottom: 120, width: 40, height: 40 },
      boundary: embeddedRoot,
      width: 740,
      height: 280,
      placement: "bottom-start",
      gutter: 8,
      overflowPadding: 8,
    });

    expect(position.left).toBeGreaterThanOrEqual(embeddedRoot.left + 8);
    expect(position.left + position.width).toBeLessThanOrEqual(embeddedRoot.right - 8);
  });

  it("flips sides and limits a long floating element to the available height", async () => {
    const position = await computePosition({
      ...menuOptions,
      reference: { left: 140, top: 250, right: 180, bottom: 290, width: 40, height: 40 },
      boundary: { ...boundary, bottom: 400, height: 400 },
      width: 120,
      height: 480,
      placement: "bottom",
      gutter: 8,
      overflowPadding: 8,
    });

    expect(position).toMatchObject({
      left: 100,
      top: 8,
      width: 120,
      height: 234,
      placement: "top",
      transformOrigin: "50% 100%",
    });
  });

  it("lets Select flip before shrinking while Menu keeps its initial side", async () => {
    const options = {
      reference: { left: 140, top: 340, right: 180, bottom: 380, width: 40, height: 40 },
      boundary,
      width: 120,
      height: 220,
      placement: "bottom",
      gutter: 8,
      overflowPadding: 8,
    } as const;

    const menu = await computePosition({ ...options, ...menuOptions });
    const select = await computePosition({
      ...options,
      flip: { fallbackStrategy: "initialPlacement" },
      size: { order: "afterShift", minimumHeight: 200 },
    });

    expect(menu).toMatchObject({ placement: "bottom", top: 388, height: 204 });
    expect(select).toMatchObject({ placement: "top", top: 112, height: 220 });
  });

  it("preserves intrinsic size and supplies constraints for a remeasured bubble", async () => {
    const options = {
      reference: { left: 140, top: 100, right: 180, bottom: 140, width: 40, height: 40 },
      boundary,
      width: 400,
      height: 100,
      placement: "bottom",
      gutter: 8,
      overflowPadding: 16,
    } as const;
    const intrinsic = await computePosition(options);
    expect(intrinsic).toMatchObject({ width: 400, height: 100, availableWidth: 288 });

    // 너비 제한으로 줄바꿈된 후의 측정 높이를 전달합니다.
    const remeasured = await computePosition({
      ...options,
      width: intrinsic.availableWidth,
      height: 180,
    });
    expect(remeasured).toMatchObject({ left: 16, top: 148, width: 288, height: 180 });
    expect(remeasured.left + remeasured.width).toBe(boundary.right - 16);
  });

  it("keeps corner padding when a shifted bubble cannot point exactly at its anchor", async () => {
    const position = await computePosition({
      reference: { left: 4, top: 100, right: 28, bottom: 124, width: 24, height: 24 },
      boundary,
      width: 120,
      height: 80,
      placement: "bottom",
      gutter: 4,
      overflowPadding: 8,
      flip: false,
      arrow: { size: 16, tipHeight: 6, padding: 14 },
    });

    expect(position).toMatchObject({
      left: 8,
      top: 134,
      arrow: { left: 14, centerOffset: -14 },
    });
  });

  it("includes the arrow tip in the gap after flipping to the opposite side", async () => {
    const position = await computePosition({
      reference: { left: 140, top: 560, right: 180, bottom: 600, width: 40, height: 40 },
      boundary,
      width: 120,
      height: 80,
      placement: "bottom",
      gutter: 4,
      overflowPadding: 8,
      arrow: { size: 16, tipHeight: 6, padding: 14 },
    });

    expect(position).toMatchObject({
      placement: "top",
      top: 470,
      height: 80,
      arrow: { left: 52, centerOffset: 0 },
    });
    expect(position.arrow?.left).toBe(160 - position.left - 8);
  });

  it("allows an anchored overlay to opt out of collision movement and resizing", async () => {
    const position = await computePosition({
      reference: { left: 0, top: 0, right: 24, bottom: 24, width: 24, height: 24 },
      boundary,
      width: 120,
      height: 80,
      placement: "top",
      gutter: 8,
      overflowPadding: 8,
      flip: false,
      shift: false,
    });

    expect(position).toMatchObject({ left: -48, top: -88, height: 80, placement: "top" });
    expect(position.availableHeight).toBe(0);
  });
});
