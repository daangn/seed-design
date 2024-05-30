export const vars = {
  base: {
    enabled: {
      label: {
        fontWeight: "var(--seed-font-weight-bold)",
      },
    },
  },
  variantBrand: {
    enabled: {
      root: {
        color: "var(--seed-color-bg-brand-emphasis)",
      },
      label: {
        color: "var(--seed-color-fg-static-white)",
      },
      prefixIcon: {
        color: "var(--seed-color-fg-static-white)",
      },
    },
    pressed: {
      root: {
        color: "var(--seed-color-bg-brand-emphasis-pressed)",
      },
    },
    disabled: {
      root: {
        color: "var(--seed-color-bg-disabled)",
      },
    },
  },
  variantNeutral: {
    enabled: {
      root: {
        color: "var(--seed-color-bg-neutral)",
      },
      label: {
        color: "var(--seed-color-fg-neutral)",
      },
      prefixIcon: {
        color: "var(--seed-color-fg-neutral)",
      },
    },
    pressed: {
      root: {
        color: "var(--seed-color-bg-neutral-pressed)",
      },
    },
    disabled: {
      root: {
        color: "var(--seed-color-bg-disabled)",
      },
    },
  },
  sizeXsmall: {
    enabled: {
      root: {
        minHeight: "var(--seed-unit-8)",
        cornerRadius: "var(--seed-radii-1)",
        paddingX: "var(--seed-unit-2\\.5)",
        paddingY: "var(--seed-unit-2)",
        gap: "var(--seed-unit-1)",
      },
      prefixIcon: {
        size: "var(--seed-unit-3)",
      },
      label: {
        fontSize: "var(--seed-font-size-50)",
      },
    },
  },
  sizeMedium: {
    enabled: {
      root: {
        minHeight: "var(--seed-unit-10)",
        cornerRadius: "var(--seed-radii-1\\.5)",
        paddingX: "var(--seed-unit-3)",
        paddingY: "var(--seed-unit-2\\.5)",
        gap: "var(--seed-unit-1)",
      },
      prefixIcon: {
        size: "var(--seed-unit-4)",
      },
      label: {
        fontSize: "var(--seed-font-size-100)",
      },
    },
  },
};
