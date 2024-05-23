import { expect, test } from "vitest";

import { selectVariantFrom } from "./helper";

test("selectVariantFrom 1", async () => {
  // given
  const component = {
    name: "component",
    slots: ["root", "content"],
    base: {
      root: { display: "flex" },
      content: { color: "black" },
    },
    variants: {
      variant: {
        primary: {
          root: { color: "red" },
          content: { color: "blue" },
        },
      },
      size: {
        small: {
          root: { fontSize: "12px" },
          content: { fontSize: "14px" },
        },
      },
    },
  };

  // when
  const style = selectVariantFrom(component, "root", {
    variant: "primary",
    size: "small",
  });

  // then
  expect(style).toEqual({
    display: "flex",
    color: "red",
    fontSize: "12px",
  });
});

test("selectVariantFrom 2", async () => {
  // given
  const component = {
    name: "component",
    slots: ["root", "content"],
    base: {
      root: { display: "flex" },
      content: { color: "black" },
    },
    variants: {
      variant: {
        primary: {
          root: { color: "red" },
          content: { color: "blue" },
        },
      },
      size: {
        small: {
          root: { fontSize: "12px" },
          content: { fontSize: "14px" },
        },
      },
    },
  };

  // when
  const style = selectVariantFrom(component, "root", {
    variant: "primary",
    size: "small",
  });

  // then
  expect(style).toEqual({
    display: "flex",
    color: "red",
    fontSize: "12px",
  });
});

test("selectVariantFrom: Boolean", async () => {
  // given
  const component = {
    name: "component",
    slots: ["root", "content"],
    base: {
      root: { display: "flex" },
      content: { color: "black" },
    },
    variants: {
      variant: {
        primary: {
          root: { color: "red" },
          content: { color: "blue" },
        },
      },
      size: {
        small: {
          root: { fontSize: "12px" },
          content: { fontSize: "14px" },
        },
      },
      bold: {
        true: {
          root: { fontWeight: "bold" },
          content: { fontWeight: "bold" },
        },
        false: {
          root: { fontWeight: "normal" },
          content: { fontWeight: "normal" },
        },
      },
    },
  };

  // when
  const style = selectVariantFrom(component, "content", {
    variant: "primary",
    bold: true,
    size: "small",
  });

  // then
  expect(style).toEqual({
    color: "blue",
    fontSize: "14px",
    fontWeight: "bold",
  });
});
