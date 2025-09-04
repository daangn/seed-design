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
  color: "$onPrimaryOverlay50-semantic",
  color: "$onPrimaryOverlay200-semantic",
  color: "$onPrimaryLowOverlay50-semantic",
  color: "$onPrimaryLowOverlay100-semantic",
  color: "$onPrimaryLowOverlay200-semantic",
  color: "$stroke-neutral-subtle",
  color: "$onGrayOverlay100-semantic",
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

  // Scale Color Blue 테스트
  color: "$palette-blue-100",
  color: "$palette-blue-200",
  color: "$palette-blue-300",
  color: "$palette-blue-400",
  color: "$palette-blue-400",
  color: "$palette-blue-600",
  color: "$palette-blue-600",
  color: "$palette-blue-800",
  color: "$palette-blue-900",
  color: "$palette-blue-900",
  color: "$palette-blue-1000",
  color: "$palette-blue-100",
  color: "$palette-blue-100",
  color: "$palette-blue-200",

  // Scale Color Red 테스트
  color: "$palette-red-100",
  color: "$palette-red-200",
  color: "$palette-red-300",
  color: "$palette-red-400",
  color: "$palette-red-600",
  color: "$palette-red-700",
  color: "$palette-red-700",
  color: "$palette-red-800",
  color: "$palette-red-900",
  color: "$palette-red-900",
  color: "$palette-red-900",
  color: "$palette-red-100",
  color: "$palette-red-200",
  color: "$palette-red-300",

  // Scale Color Green 테스트
  color: "$palette-green-100",
  color: "$palette-green-200",
  color: "$palette-green-300",
  color: "$palette-green-400",
  color: "$palette-green-500",
  color: "$palette-green-600",
  color: "$palette-green-700",
  color: "$palette-green-800",
  color: "$palette-green-900",
  color: "$palette-green-900",
  color: "$palette-green-900",
  color: "$palette-green-100",
  color: "$palette-green-200",
  color: "$palette-green-200",

  // Scale Color Yellow 테스트
  color: "$palette-yellow-100",
  color: "$palette-yellow-200",
  color: "$palette-yellow-300",
  color: "$palette-yellow-400",
  color: "$palette-yellow-500",
  color: "$palette-yellow-700",
  color: "$palette-yellow-700",
  color: "$palette-yellow-800",
  color: "$palette-yellow-800",
  color: "$palette-yellow-900",
  color: "$palette-yellow-900",
  color: "$palette-yellow-100",
  color: "$palette-yellow-100",
  color: "$palette-yellow-100",

  // Scale Color Purple 테스트
  color: "$palette-purple-100",
  color: "$palette-purple-300",
  color: "$palette-purple-400",
  color: "$palette-purple-400",
  color: "$palette-purple-500",
  color: "$palette-purple-600",
  color: "$palette-purple-700",
  color: "$palette-purple-800",
  color: "$palette-purple-900",
  color: "$palette-purple-900",
  color: "$palette-purple-1000",
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
  color: "$palette-static-white-alpha-50",
  color: "$palette-static-white-alpha-300",
});

// 복합 속성 테스트
const ComplexPropertyTestComponent = styled("div", {
  border: "1px solid $palette-gray-800",
  boxShadow: "0 0 10px $bg-overlay",
  outline: "2px solid $fg-informative",
  textDecoration: "underline $fg-critical",

  // 네스팅된 속성 테스트
  "&:before": {
    borderBottom: "1px solid $stroke-neutral-subtle",
    background: "$bg-layer-fill",
  },

  // 변형 테스트
  variants: {
    theme: {
      primary: {
        background: "$bg-brand-solid",
        color: "$palette-static-white",
      },
      secondary: {
        background: "$bg-neutral-weak",
        color: "$fg-neutral",
      },
      danger: {
        background: "$bg-critical-solid",
        color: "$palette-static-white",
      },
    },
  },
});

// 복합 속성 (색상 토큰이 앞에 있는 경우) 테스트
const BorderAndColorTestComponent = styled("div", {
  color: "$palette-red-700 solid 1px",
  color: "$palette-red-700 dashed 2px",
  color: "$palette-blue-400 dotted 3px",
  color: "$palette-green-700 double 4px",
  color: "$palette-yellow-700 groove 2px",
  outlineColor: "$palette-purple-600",
});

const ImportantTest = styled("div", {
  color: "$fg-brand !important",
  color: "$palette-static-white !important",
  color: "$palette-carrot-100 !important",
  color: "$palette-gray-00 !important",
  color: "$palette-gray-100 !important",
  color: "$palette-gray-200 !important",
  css: {
    color: "$palette-gray-700 !important",
    borderColor: "$palette-gray-500 !important",
    backgroundColor: "$palette-gray-200 !important",
  },
});

const Li_FieldItem = styled("li", {
  borderBottom: `${rem(1)} solid $stroke-neutral-subtle`,
  borderBottom: `0.5rem solid $bg-layer-basement`,
  border: check ? "1px solid $stroke-neutral-subtle" : "0.5rem solid $bg-layer-basement",
});
