export const vars = {
  "base": {
    "enabled": {
      "root": {
        "minBlockSize": "var(--seed-unit-8)",
        "minInlineSize": "var(--seed-unit-13)"
      },
      "track": {
        "background": "var(--seed-color-palette-gray-500)",
        "cornerRadius": "var(--seed-radii-full)"
      },
      "handleContainer": {
        "minBlockSize": "var(--seed-unit-8)",
        "minInlineSize": "var(--seed-unit-8)",
        "padding": "var(--seed-unit-0\\.5)"
      },
      "handle": {
        "minBlockSize": "var(--seed-unit-7)",
        "minInlineSize": "var(--seed-unit-7)",
        "background": "var(--seed-color-fg-static-white)",
        "cornerRadius": "var(--seed-radii-full)",
        "shadow": "0px 3px 8px 0px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.06)"
      }
    },
    "enabledSelected": {
      "track": {
        "background": "var(--seed-color-bg-brand-emphasis)"
      }
    },
    "disabled": {
      "track": {
        "background": "var(--seed-color-bg-disabled)"
      }
    },
    "disabledSelected": {
      "root": {
        "opacity": 0.38
      }
    }
  }
}