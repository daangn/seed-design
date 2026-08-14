declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "radiomark";
    "name": "Radiomark";
  };
  "data": {
    "id": "radiomark";
    "name": "Radiomark";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "colorDuration": {
              "type": "duration";
            };
            "colorTimingFunction": {
              "type": "cubicBezier";
            };
            "size": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
            "strokeWidth": {
              "type": "dimension";
            };
            "strokeColor": {
              "type": "color";
            };
            "cornerRadius": {
              "type": "dimension";
            };
          };
        };
        "icon": {
          "properties": {
            "size": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
            "cornerRadius": {
              "type": "dimension";
            };
          };
        };
      };
      "variants": {
        "tone": {
          "values": {
            "brand": {};
            "neutral": {};
          };
        };
        "size": {
          "values": {
            "medium": {};
            "large": {};
          };
        };
      };
      "states": readonly [
        {
          "id": "pressed";
          "suppresses": readonly [];
        },
        {
          "id": "selected";
          "suppresses": readonly [];
        },
        {
          "id": "disabled";
          "suppresses": readonly [
            "pressed",
          ];
        },
      ];
    };
    "rules": readonly [
      {
        "variants": {};
        "states": readonly [];
        "slots": {
          "root": {
            "colorDuration": {
              "type": "duration";
              "value": "$duration.color-transition";
            };
            "colorTimingFunction": {
              "type": "cubicBezier";
              "value": "$timing-function.easing";
            };
            "strokeWidth": {
              "type": "dimension";
              "value": {
                "value": 1;
                "unit": "px";
              };
            };
            "strokeColor": {
              "type": "color";
              "value": "$color.stroke.neutral-weak";
            };
            "cornerRadius": {
              "type": "dimension";
              "value": "$radius.full";
            };
          };
          "icon": {
            "cornerRadius": {
              "type": "dimension";
              "value": "$radius.full";
            };
          };
        };
      },
      {
        "variants": {};
        "states": readonly [
          "pressed",
        ];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.bg.transparent-pressed";
            };
          };
        };
      },
      {
        "variants": {};
        "states": readonly [
          "selected",
        ];
        "slots": {
          "root": {
            "strokeWidth": {
              "type": "dimension";
              "value": {
                "value": 0;
                "unit": "px";
              };
            };
            "strokeColor": {
              "type": "color";
              "value": "#00000000";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "brand";
        };
        "states": readonly [
          "selected",
        ];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.bg.brand-solid";
            };
          };
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.palette.static-white";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "brand";
        };
        "states": readonly [
          "pressed",
          "selected",
        ];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.bg.brand-solid-pressed";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "brand";
        };
        "states": readonly [
          "disabled",
        ];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.palette.gray-300";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "brand";
        };
        "states": readonly [
          "selected",
          "disabled",
        ];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.bg.transparent";
            };
            "strokeWidth": {
              "type": "dimension";
              "value": {
                "value": 1;
                "unit": "px";
              };
            };
            "strokeColor": {
              "type": "color";
              "value": "$color.palette.gray-300";
            };
          };
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.palette.gray-300";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "neutral";
        };
        "states": readonly [
          "selected",
        ];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.bg.neutral-inverted";
            };
          };
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-inverted";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "neutral";
        };
        "states": readonly [
          "pressed",
          "selected",
        ];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.bg.neutral-inverted-pressed";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "neutral";
        };
        "states": readonly [
          "disabled",
        ];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.palette.gray-300";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "neutral";
        };
        "states": readonly [
          "selected",
          "disabled",
        ];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.bg.transparent";
            };
            "strokeWidth": {
              "type": "dimension";
              "value": {
                "value": 1;
                "unit": "px";
              };
            };
            "strokeColor": {
              "type": "color";
              "value": "$color.palette.gray-300";
            };
          };
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.palette.gray-300";
            };
          };
        };
      },
      {
        "variants": {
          "size": "medium";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x5";
            };
          };
          "icon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x2";
            };
          };
        };
      },
      {
        "variants": {
          "size": "medium";
        };
        "states": readonly [
          "disabled",
        ];
        "slots": {
          "icon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x2_5";
            };
          };
        };
      },
      {
        "variants": {
          "size": "large";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x6";
            };
          };
          "icon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x2_5";
            };
          };
        };
      },
      {
        "variants": {
          "size": "large";
        };
        "states": readonly [
          "disabled",
        ];
        "slots": {
          "icon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x3";
            };
          };
        };
      },
    ];
  };
};
export default artifact;
