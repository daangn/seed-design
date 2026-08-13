import { describe, expect, it } from "vitest";

import {
  calculateSafeArea,
  calculateSignedScrollDelta,
  clampScrollOffset,
  createFieldBodyRect,
  hasMeaningfulGeometryChange,
  selectLargestFittingTarget,
  type VerticalRect,
} from "./geometry";

function rect(top: number, height: number): VerticalRect {
  return { top, bottom: top + height };
}

describe("calculateSafeArea", () => {
  it("calculates the safe area and spacer in screen coordinates", () => {
    expect(
      calculateSafeArea({
        viewport: { top: 120, bottom: 720 },
        keyboardOcclusionTop: 640,
        toolbarHeight: 48,
        keyboardGap: 24,
      }),
    ).toEqual({
      safeTop: 120,
      safeBottom: 568,
      spacerHeight: 152,
    });
  });

  it("does not add a spacer when the occlusion is below the viewport", () => {
    expect(
      calculateSafeArea({
        viewport: { top: 120, bottom: 720 },
        keyboardOcclusionTop: 900,
        toolbarHeight: 48,
        keyboardGap: 24,
      }),
    ).toEqual({
      safeTop: 120,
      safeBottom: 720,
      spacerHeight: 0,
    });
  });

  it("normalizes negative toolbar height and keyboard gap to zero", () => {
    expect(
      calculateSafeArea({
        viewport: { top: 120, bottom: 720 },
        keyboardOcclusionTop: 640,
        toolbarHeight: -48,
        keyboardGap: -24,
      }),
    ).toEqual({
      safeTop: 120,
      safeBottom: 640,
      spacerHeight: 80,
    });
  });

  it("normalizes non-finite toolbar height and keyboard gap to zero", () => {
    expect(
      calculateSafeArea({
        viewport: { top: 120, bottom: 720 },
        keyboardOcclusionTop: 640,
        toolbarHeight: Number.POSITIVE_INFINITY,
        keyboardGap: Number.NaN,
      }),
    ).toEqual({
      safeTop: 120,
      safeBottom: 640,
      spacerHeight: 80,
    });
  });

  it("clamps the safe bottom to the viewport top when the viewport is fully occluded", () => {
    expect(
      calculateSafeArea({
        viewport: { top: 120, bottom: 720 },
        keyboardOcclusionTop: 100,
        toolbarHeight: 48,
        keyboardGap: 24,
      }),
    ).toEqual({
      safeTop: 120,
      safeBottom: 120,
      spacerHeight: 600,
    });
  });

  it("normalizes an invalid viewport bottom to its top", () => {
    expect(
      calculateSafeArea({
        viewport: { top: 720, bottom: 120 },
        keyboardOcclusionTop: 640,
        toolbarHeight: 48,
        keyboardGap: 24,
      }),
    ).toEqual({
      safeTop: 720,
      safeBottom: 720,
      spacerHeight: 0,
    });
  });
});

describe("selectLargestFittingTarget", () => {
  const safeArea = { safeTop: 100, safeBottom: 500 };

  it("selects the Field when it fits", () => {
    const field = rect(0, 350);

    expect(
      selectLargestFittingTarget(
        {
          field,
          control: rect(0, 100),
          native: rect(0, 80),
          anchor: rect(0, 20),
        },
        safeArea,
      ),
    ).toEqual({ kind: "field", rect: field });
  });

  it.each([
    {
      name: "Field body",
      candidates: {
        field: rect(0, 402),
        fieldBody: rect(100, 350),
        control: rect(0, 200),
        native: rect(0, 80),
        anchor: rect(0, 20),
      },
      expectedKind: "fieldBody",
    },
    {
      name: "control",
      candidates: {
        field: rect(0, 402),
        control: rect(0, 200),
        native: rect(0, 80),
        anchor: rect(0, 20),
      },
      expectedKind: "control",
    },
    {
      name: "native control",
      candidates: {
        field: rect(0, 402),
        control: rect(0, 402),
        native: rect(0, 80),
        anchor: rect(0, 20),
      },
      expectedKind: "native",
    },
    {
      name: "anchor",
      candidates: {
        field: rect(0, 402),
        control: rect(0, 402),
        native: rect(0, 402),
        anchor: rect(0, 20),
      },
      expectedKind: "anchor",
    },
  ])("falls back to the $name when larger targets do not fit", ({ candidates, expectedKind }) => {
    expect(selectLargestFittingTarget(candidates, safeArea)?.kind).toBe(expectedKind);
  });

  it("allows a target to exceed the safe height by the 1px epsilon", () => {
    expect(
      selectLargestFittingTarget(
        {
          field: rect(0, 401),
          control: rect(0, 200),
        },
        safeArea,
      )?.kind,
    ).toBe("field");
  });

  it("returns null when every target is oversized", () => {
    expect(
      selectLargestFittingTarget(
        {
          field: rect(0, 404),
          control: rect(0, 403),
          native: rect(0, 402),
          anchor: rect(0, 401.01),
        },
        safeArea,
      ),
    ).toBeNull();
  });

  it("falls back to the Field bottom when every semantic target is oversized", () => {
    expect(
      selectLargestFittingTarget(
        {
          field: rect(-206, 789),
          fieldBody: rect(-176, 759),
          control: rect(-176, 732),
          native: rect(-176, 732),
        },
        { safeTop: 124, safeBottom: 491 },
      ),
    ).toEqual({
      kind: "fieldBottom",
      rect: { top: 583, bottom: 583 },
    });
  });

  it("prioritizes the Field bottom over a fitting control when the Field body is oversized", () => {
    expect(
      selectLargestFittingTarget(
        {
          field: rect(100, 407),
          fieldBody: rect(130, 377),
          control: rect(130, 350),
          native: rect(130, 350),
        },
        { safeTop: 124, safeBottom: 491 },
      ),
    ).toEqual({
      kind: "fieldBottom",
      rect: { top: 507, bottom: 507 },
    });
  });
});

describe("createFieldBodyRect", () => {
  it("creates a target from the control top through the Field footer", () => {
    expect(createFieldBodyRect({ top: 100, bottom: 500 }, { top: 180, bottom: 460 })).toEqual({
      top: 180,
      bottom: 500,
    });
  });

  it("allows native measurement differences within the 1px containment epsilon", () => {
    expect(createFieldBodyRect({ top: 100, bottom: 500 }, { top: 99, bottom: 501 })).toEqual({
      top: 99,
      bottom: 501,
    });
  });

  it.each([
    {
      name: "control starts outside the Field",
      field: { top: 100, bottom: 500 },
      control: { top: 98.99, bottom: 460 },
    },
    {
      name: "control ends outside the Field",
      field: { top: 100, bottom: 500 },
      control: { top: 180, bottom: 501.01 },
    },
    {
      name: "Field has an invalid height",
      field: { top: 500, bottom: 100 },
      control: { top: 180, bottom: 460 },
    },
  ])("returns null when $name", ({ field, control }) => {
    expect(createFieldBodyRect(field, control)).toBeNull();
  });
});

describe("calculateSignedScrollDelta", () => {
  const safeArea = { safeTop: 100, safeBottom: 500 };

  it("returns a negative delta for a target above the safe area", () => {
    expect(calculateSignedScrollDelta({ top: 70, bottom: 90 }, safeArea)).toBe(-30);
  });

  it("returns a positive delta for a target below the safe area", () => {
    expect(calculateSignedScrollDelta({ top: 510, bottom: 530 }, safeArea)).toBe(30);
  });

  it("returns zero for a visible target", () => {
    expect(calculateSignedScrollDelta({ top: 200, bottom: 300 }, safeArea)).toBe(0);
  });

  it.each([
    { target: { top: 99, bottom: 300 }, edge: "top" },
    { target: { top: 200, bottom: 501 }, edge: "bottom" },
  ])("treats a target within 1px of the $edge edge as visible", ({ target }) => {
    expect(calculateSignedScrollDelta(target, safeArea)).toBe(0);
  });
});

describe("clampScrollOffset", () => {
  it.each([
    { offset: -20, maxOffset: 300, expected: 0 },
    { offset: 120, maxOffset: 300, expected: 120 },
    { offset: 420, maxOffset: 300, expected: 300 },
    { offset: 20, maxOffset: -1, expected: 0 },
  ])("clamps $offset to $expected for max offset $maxOffset", ({ offset, maxOffset, expected }) => {
    expect(clampScrollOffset(offset, maxOffset)).toBe(expected);
  });
});

describe("hasMeaningfulGeometryChange", () => {
  it("ignores changes within the 1px epsilon", () => {
    expect(hasMeaningfulGeometryChange(100, 101)).toBe(false);
    expect(hasMeaningfulGeometryChange(100, 99)).toBe(false);
  });

  it("detects changes beyond the 1px epsilon", () => {
    expect(hasMeaningfulGeometryChange(100, 101.01)).toBe(true);
    expect(hasMeaningfulGeometryChange(100, 98.99)).toBe(true);
  });
});
