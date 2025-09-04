// @ts-nocheck

const SemanticColorTestComponent = styled("div", {
  // Semantic Color 테스트
  color: "$fg-brand",
  color: "$palette-static-white",
  color: "$palette-carrot-100",
  color: "$palette-gray-900",
  color: "$bg-neutral-weak",
  color: "$fg-positive",
  color: "$bg-positive-weak",
  color: "$bg-warning-solid",
  color: "$bg-warning-weak",
  color: "$fg-critical",
  color: "$bg-critical-weak",
  color: "$bg-overlay",
  color: "$bg-overlay-muted",
  color: "$bg-layer-floating",
  color: "$bg-layer-floating",
  color: "$bg-layer-floating",
  color: "$bg-layer-fill",
  color: "$bg-layer-default",
  color: "$bg-layer-basement",
  color: "$palette-carrot-100",
  color: "$bg-brand-solid-pressed",
  color: "$bg-brand-solid-pressed",
  color: "$palette-carrot-200",
  color: "$palette-carrot-100",
  color: "$palette-carrot-200",
  color: "$bg-neutral-weak-pressed",
  color: "$bg-neutral-weak-pressed",
  color: "$stroke-neutral-subtle",
  color: "$stroke-neutral-subtle",
  color: "$stroke-neutral-muted",
  color: "$palette-gray-400",
  color: "$fg-informative",
  color: "$fg-neutral",
  color: "$fg-neutral-subtle",
  color: "$fg-neutral-muted",
});

const ScaleColorTestComponent = styled("div", {
  // Scale Color Gray 테스트
  color: "$palette-gray-00",
  color: "$palette-gray-100",
  color: "$palette-gray-200",
  color: "$palette-gray-300",
  color: "$palette-gray-400",
  color: "$palette-gray-500",
  color: "$palette-gray-600",
  color: "$palette-gray-700",
  color: "$palette-gray-800",
  color: "$palette-gray-900",
  color: "$palette-gray-1000",
  color: "$palette-gray-200",
  color: "$palette-gray-300",
  color: "$palette-gray-500",
  color: "$palette-gray-700",

  // Scale Color Carrot 테스트
  color: "$palette-carrot-100",
  color: "$palette-carrot-200",
  color: "$palette-carrot-300",
  color: "$palette-carrot-400",
  color: "$palette-carrot-500",
  color: "$palette-carrot-600",
  color: "$palette-carrot-600",
  color: "$palette-carrot-700",
  color: "$palette-carrot-700",
  color: "$palette-carrot-800",
  color: "$palette-carrot-800",
  color: "$palette-carrot-100",
  color: "$palette-carrot-200",
  color: "$palette-carrot-200",
});

const StaticColorTestComponent = styled("div", {
  // Static Color 테스트
  color: "$palette-static-black",
  color: "$palette-static-white",
  color: "$palette-static-black",
  color: "$palette-carrot-100",
  color: "$palette-carrot-700",
  color: "$palette-green-100",
  color: "$palette-green-700",
  color: "$palette-yellow-100",
  color: "$palette-yellow-700",
  color: "$palette-red-100",
  color: "$palette-red-700",
  color: "$palette-blue-100",
  color: "$palette-blue-700",
  color: "$palette-static-black-alpha-500",
  color: "$palette-static-black-alpha-700",
  color: "$palette-static-white-alpha-300",

  css: {
    color: "$palette-static-black",
    color: "$palette-static-white",
  },
});

const StaticColorTestComponent2 = styled("div", {
  // Static Color 테스트
  color: "$palette-static-black",
  color: "$palette-static-white",
  color: "$palette-static-black",
  color: "$palette-carrot-100",
  color: "$palette-carrot-700",
  color: "$palette-green-100",
  color: "$palette-green-700",
  color: "$palette-yellow-100",
  color: "$palette-yellow-700",
  color: "$palette-red-100",
  color: "$palette-red-700",
  color: "$palette-blue-100",
  color: "$palette-blue-700",
  color: "$palette-static-black-alpha-500",
  color: "$palette-static-black-alpha-700",
  color: "$palette-static-white-alpha-300",

  css: {
    color: "$palette-static-black",
    color: "$palette-static-white",
  },
});

const CompoundVariantsTestComponent = styled("div", {
  compoundVariants: [
    {
      shape: "square",
      size: "large",
      css: {
        borderRadius: rem(3),
      },
    },
    {
      color: "basic",
      style: "filledLow",
      css: {
        backgroundColor: "$palette-gray-200",
        color: "$palette-gray-800",
      },
    },
    {
      color: "basic",
      style: "outlined",
      css: {
        color: "$palette-gray-1000",
      },
    },
    {
      color: "basic",
      style: "filled",
      css: {
        backgroundColor: "$palette-gray-800",
        color: "$palette-gray-00",
      },
    },
    {
      color: "primary",
      style: "filledLow",
      css: {
        backgroundColor: "$palette-carrot-200",
        color: "$fg-brand",
      },
    },
    {
      color: "primary",
      style: "outlined",
      css: {
        color: "$fg-brand",
      },
    },
    {
      color: "primary",
      style: "filled",
      css: {
        backgroundColor: "$bg-brand-solid",
        color: "$palette-static-white",
      },
    },
    {
      color: "success",
      style: "filledLow",
      css: {
        backgroundColor: "$bg-positive-weak",
        color: "$palette-green-800",
      },
    },
    {
      color: "success",
      style: "outlined",
      css: {
        color: "$fg-positive",
      },
    },
    {
      color: "success",
      style: "filled",
      css: {
        backgroundColor: "$bg-positive-solid",
        color: "$palette-static-white",
      },
    },
    {
      color: "error",
      style: "filledLow",
      css: {
        backgroundColor: "$bg-critical-weak",
        color: "$fg-critical",
      },
    },
    {
      color: "error",
      style: "outlined",
      css: {
        color: "$fg-critical",
      },
    },
    {
      color: "error",
      style: "filled",
      css: {
        backgroundColor: "$bg-critical-solid",
        color: "$palette-static-white",
      },
    },
    {
      color: "blue",
      style: "filledLow",
      css: {
        backgroundColor: "$palette-blue-100",
        color: "$palette-blue-900",
      },
    },
    {
      color: "blue",
      style: "outlined",
      css: {
        color: "$palette-blue-600",
      },
    },
    {
      color: "blue",
      style: "filled",
      css: {
        backgroundColor: "$palette-blue-600",
        color: "$palette-static-white",
      },
    },
  ],
});
