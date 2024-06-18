export const vars = {
  base: {
    enabled: {
      label: {
        color: "var(--seed-color-fg-neutral)",
      },
      control: {
        strokeColor: "var(--seed-color-stroke-control)",
        strokeWidth: "1px",
        cornerRadius: "var(--seed-radii-full)",
      },
    },
    enabledSelected: {
      control: {
        color: "var(--seed-color-bg-brand-emphasis)",
      },
      icon: {
        color: "var(--seed-color-fg-static-white)",
      },
    },
    pressed: {
      control: {
        color: "var(--seed-color-bg-layer-1-pressed)",
      },
    },
    pressedSelected: {
      control: {
        color: "var(--seed-color-bg-brand-emphasis-pressed)",
      },
      icon: {
        color: "var(--seed-color-fg-static-white)",
      },
    },
    disabled: {
      label: {
        color: "var(--seed-color-fg-disabled)",
      },
      control: {
        color: "var(--seed-color-bg-disabled)",
      },
    },
    disabledSelected: {
      label: {
        color: "var(--seed-color-fg-disabled)",
      },
      icon: {
        color: "var(--seed-color-bg-disabled)",
      },
    },
  },
  sizeSmall: {
    enabled: {
      root: {
        gap: "var(--seed-unit-2)",
        minHeight: "var(--seed-unit-7)",
      },
      label: {
        fontSize: "var(--seed-font-size-75)",
      },
      control: {
        size: "var(--seed-unit-4)",
      },
      icon: {
        size: "var(--seed-unit-2)",
      },
    },
    disabled: {
      icon: {
        size: "var(--seed-unit-2)",
      },
    },
  },
  sizeMedium: {
    enabled: {
      root: {
        gap: "var(--seed-unit-2\\.5)",
        minHeight: "var(--seed-unit-8)",
      },
      label: {
        fontSize: "var(--seed-font-size-100)",
      },
      control: {
        size: "var(--seed-unit-5)",
      },
      icon: {
        size: "var(--seed-unit-2)",
      },
    },
    disabled: {
      icon: {
        size: "var(--seed-unit-2\\.5)",
      },
    },
  },
  sizeLarge: {
    enabled: {
      root: {
        gap: "var(--seed-unit-3)",
        minHeight: "var(--seed-unit-9)",
      },
      label: {
        fontSize: "var(--seed-font-size-200)",
      },
      control: {
        size: "var(--seed-unit-6)",
      },
      icon: {
        size: "var(--seed-unit-2\\.5)",
      },
    },
    disabled: {
      icon: {
        size: "var(--seed-unit-3)",
      },
    },
  },
};
