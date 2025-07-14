export const vars = {
  base: {
    enabled: {
      label: {
        color: "var(--seed-color-fg-neutral)",
      },
      root: {
        gap: "var(--seed-dimension-x2)",
      },
    },
    disabled: {
      label: {
        color: "var(--seed-color-fg-disabled)",
      },
    },
  },
  weightDefault: {
    enabled: {
      label: {
        fontWeight: "var(--seed-font-weight-regular)",
      },
    },
  },
  weightStronger: {
    enabled: {
      label: {
        fontWeight: "var(--seed-font-weight-bold)",
      },
    },
  },
  sizeMedium: {
    enabled: {
      root: {
        minHeight: "var(--seed-dimension-x8)",
        size: "var(--seed-dimension-x5)",
      },
      label: {
        fontSize: "var(--seed-font-size-t4)",
        lineHeight: "var(--seed-line-height-t4)",
      },
    },
  },
  sizeLarge: {
    enabled: {
      root: {
        minHeight: "var(--seed-dimension-x9)",
        size: "var(--seed-dimension-x6)",
      },
      label: {
        fontSize: "var(--seed-font-size-t5)",
        lineHeight: "var(--seed-line-height-t5)",
      },
    },
  },
};
