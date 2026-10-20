// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: internalized and adapted to the SEED workspace.

import { createElement, Fragment, runOnMainThread } from "@lynx-js/react";
import { render, waitSchedule } from "@lynx-js/react/testing-library";
import { beforeEach, describe, expect, it } from "vitest";

beforeEach(async () => {
  render(createElement(Fragment, null), { enableMainThread: true, enableBackgroundThread: true });
  await waitSchedule();
});

import {
  getDefaultClaimedGestureAngles,
  getDefaultRubberBand,
  getMainAxisLayoutSize,
  getMainAxisSize,
  getMaxSnapSize,
  getNextMainAxisOffset,
  getSheetTransform,
  resolveSheetSide,
  toPxJS,
} from "./direction";

describe("sheet side utils", () => {
  it("resolves logical sides from enableRTL", () => {
    expect(resolveSheetSide("start", false)).toBe("left");
    expect(resolveSheetSide("end", false)).toBe("right");
    expect(resolveSheetSide("start", true)).toBe("right");
    expect(resolveSheetSide("end", true)).toBe("left");
    expect(resolveSheetSide("top", true)).toBe("top");
    expect(resolveSheetSide("bottom", true)).toBe("bottom");
    expect(resolveSheetSide("left", true)).toBe("left");
    expect(resolveSheetSide("right", true)).toBe("right");
  });

  it("resolves percent snap points against height for bottom sheets", () => {
    expect(toPxJS("50%", 800)).toBe(400);
  });

  it("resolves percent snap points against width for drawers", () => {
    expect(toPxJS("75%", 360)).toBe(270);
  });

  it("reads the correct viewport basis for each resolved side", () => {
    expect(getMainAxisSize("top", { screenHeight: 800, screenWidth: 360 })).toBe(800);
    expect(getMainAxisSize("bottom", { screenHeight: 800, screenWidth: 360 })).toBe(800);
    expect(getMainAxisSize("left", { screenHeight: 800, screenWidth: 360 })).toBe(360);
    expect(getMainAxisSize("right", { screenHeight: 800, screenWidth: 360 })).toBe(360);
  });

  it("reads fit layout from height for vertical sheets", async () => {
    expect(
      await runOnMainThread(getMainAxisLayoutSize)("top", {
        detail: { height: 420, width: 260 },
      }),
    ).toBe(420);
    expect(
      await runOnMainThread(getMainAxisLayoutSize)("bottom", {
        detail: { height: 420, width: 260 },
      }),
    ).toBe(420);
  });

  it("reads fit layout from width for drawers", async () => {
    expect(
      await runOnMainThread(getMainAxisLayoutSize)("left", {
        detail: { height: 420, width: 260 },
      }),
    ).toBe(260);
  });

  it("uses the highest resolved snap point as the stable layout size", () => {
    expect(getMaxSnapSize([400, 800])).toBe(800);
    expect(getMaxSnapSize([400, -1, 800], 520)).toBe(800);
    expect(getMaxSnapSize([400, -1, 800], 920)).toBe(920);
  });

  it("uses vertical gesture angles for vertical sheets", () => {
    expect(getDefaultClaimedGestureAngles("top")).toEqual([
      [-134, -46],
      [46, 134],
    ]);
    expect(getDefaultClaimedGestureAngles("bottom")).toEqual([
      [-134, -46],
      [46, 134],
    ]);
  });

  it("uses horizontal gesture angles for drawers", () => {
    expect(getDefaultClaimedGestureAngles("right")).toEqual([
      [-45, 45],
      [135, -135],
    ]);
  });

  it("enables rubber band by default only for vertical sheets", () => {
    expect(getDefaultRubberBand("top")).toBe(true);
    expect(getDefaultRubberBand("bottom")).toBe(true);
    expect(getDefaultRubberBand("left")).toBe(false);
    expect(getDefaultRubberBand("right")).toBe(false);
  });

  it("applies drag deltas with the correct sign", async () => {
    expect(await runOnMainThread(getNextMainAxisOffset)("top", 120, 30)).toBe(150);
    expect(await runOnMainThread(getNextMainAxisOffset)("left", 120, 30)).toBe(150);
    expect(await runOnMainThread(getNextMainAxisOffset)("right", 120, 30)).toBe(90);
    expect(await runOnMainThread(getNextMainAxisOffset)("bottom", 120, 30)).toBe(90);
  });

  it("computes the expected transforms for each resolved side", async () => {
    expect(await runOnMainThread(getSheetTransform)("top", 120)).toBe("translate(0px, 120px)");
    expect(await runOnMainThread(getSheetTransform)("bottom", 120)).toBe("translate(0px, -120px)");
    expect(await runOnMainThread(getSheetTransform)("left", 120)).toBe("translate(120px, 0px)");
    expect(await runOnMainThread(getSheetTransform)("right", 120)).toBe("translate(-120px, 0px)");
  });
});
