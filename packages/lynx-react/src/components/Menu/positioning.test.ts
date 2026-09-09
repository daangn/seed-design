import { describe, expect, it } from "vitest";

import { positionMenu, type MenuRect } from "./positioning";

const boundary: MenuRect = {
  left: 0,
  top: 0,
  right: 320,
  bottom: 600,
  width: 320,
  height: 600,
};

describe("positionMenu", () => {
  it("keeps the requested placement when it fits", async () => {
    await expect(
      positionMenu({
        reference: { left: 140, top: 100, right: 180, bottom: 140, width: 40, height: 40 },
        boundary,
        width: 120,
        height: 100,
        placement: "bottom",
        gutter: 8,
        overflowPadding: 8,
      }),
    ).resolves.toEqual({
      left: 100,
      top: 148,
      width: 120,
      height: 100,
      placement: "bottom",
      transformOrigin: "50% 0%",
    });
  });

  it("flips alignment and shifts the menu away from a viewport edge", async () => {
    const position = await positionMenu({
      reference: { left: 280, top: 100, right: 320, bottom: 140, width: 40, height: 40 },
      boundary,
      width: 120,
      height: 100,
      placement: "bottom-start",
      gutter: 8,
      overflowPadding: 8,
    });

    expect(position).toEqual({
      left: 192,
      top: 148,
      width: 120,
      height: 100,
      placement: "bottom-end",
      transformOrigin: "100% 0%",
    });
  });

  it("keeps the menu visible when neither side has enough space", async () => {
    const position = await positionMenu({
      reference: { left: 150, top: 200, right: 350, bottom: 240, width: 200, height: 40 },
      boundary: { ...boundary, right: 390, bottom: 844, width: 390, height: 844 },
      width: 240,
      height: 108,
      placement: "right",
      gutter: 8,
      overflowPadding: 8,
    });

    expect(position).toEqual({
      left: 8,
      top: 166,
      width: 240,
      height: 108,
      placement: "left",
      transformOrigin: "100% 50%",
    });
  });

  it("flips sides and limits a long menu to the available height", async () => {
    const position = await positionMenu({
      reference: { left: 140, top: 250, right: 180, bottom: 290, width: 40, height: 40 },
      boundary: { ...boundary, bottom: 400, height: 400 },
      width: 120,
      height: 480,
      placement: "bottom",
      gutter: 8,
      overflowPadding: 8,
    });

    expect(position).toEqual({
      left: 100,
      top: 8,
      width: 120,
      height: 234,
      placement: "top",
      transformOrigin: "50% 100%",
    });
  });
});
