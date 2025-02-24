export const vars = {
  "base": {
    "enabled": {
      "control": {
        "color": "var(--seed-color-palette-gray-600)",
        "cornerRadius": "var(--seed-radius-full)"
      },
      "thumb": {
        "color": "var(--seed-color-palette-static-white)",
        "cornerRadius": "var(--seed-radius-full)"
      }
    },
    "enabledSelected": {
      "control": {
        "color": "var(--seed-color-bg-brand-solid)"
      }
    },
    "disabled": {
      "root": {
        "opacity": "0.38"
      }
    }
  },
  "sizeMedium": {
    "enabled": {
      "root": {
        "height": "32px"
      },
      "control": {
        "height": "32px",
        "width": "52px",
        "paddingX": "2px",
        "paddingY": "2px"
      },
      "thumb": {
        "height": "28px",
        "width": "28px",
        "shadow": "0px 3px 8px 0px #00000026, 0px 1px 3px 0px #0000000f"
      }
    }
  },
  "sizeSmall": {
    "enabled": {
      "root": {
        "height": "24px",
        "gap": "var(--seed-dimension-x2)"
      },
      "control": {
        "height": "16px",
        "width": "26px",
        "paddingX": "2px",
        "paddingY": "2px"
      },
      "thumb": {
        "height": "12px",
        "width": "12px"
      },
      "label": {
        "fontSize": "var(--seed-font-size-t4)",
        "lineHeight": "var(--seed-line-height-t4)",
        "fontWeight": "var(--seed-font-weight-regular)"
      }
    }
  }
}