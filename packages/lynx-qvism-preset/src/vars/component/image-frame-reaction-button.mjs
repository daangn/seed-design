export const vars = {
  "base": {
    "enabled": {
      "root": {
        "size": "var(--seed-dimension-x6)",
        "targetSize": "var(--seed-dimension-x10)"
      },
      "fillIcon": {
        "gradient": {
          "serialized": "var(--seed-color-palette-static-black-alpha-600) 0%, var(--seed-color-palette-static-black-alpha-600) 100%",
          "stops": [
            {
              "color": "var(--seed-color-palette-static-black-alpha-600)",
              "position": 0
            },
            {
              "color": "var(--seed-color-palette-static-black-alpha-600)",
              "position": 1
            }
          ]
        },
        "size": "var(--seed-dimension-x6)",
        "shadow": "0px 2px 4px 0px #00000026"
      },
      "lineIcon": {
        "color": "var(--seed-color-palette-static-white)",
        "size": "var(--seed-dimension-x6)"
      }
    },
    "selected": {
      "fillIcon": {
        "gradient": {
          "serialized": "#FF9A56 0%, #FF6600 100%",
          "stops": [
            {
              "color": "#FF9A56",
              "position": 0
            },
            {
              "color": "#FF6600",
              "position": 1
            }
          ]
        }
      },
      "lineIcon": {
        "color": "var(--seed-color-bg-transparent)"
      }
    }
  }
}