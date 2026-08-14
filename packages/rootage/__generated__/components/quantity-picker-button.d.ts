declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "quantity-picker-button";
    "name": "Quantity Picker Button";
  };
  "data": {
    "id": "quantity-picker-button";
    "name": "Quantity Picker Button";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "size": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
            "colorDuration": {
              "type": "duration";
            };
            "colorTimingFunction": {
              "type": "cubicBezier";
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
          };
        };
        "progressCircle": {
          "properties": {
            "trackColor": {
              "type": "color";
            };
            "rangeColor": {
              "type": "color";
            };
            "size": {
              "type": "dimension";
            };
            "thickness": {
              "type": "dimension";
            };
          };
        };
      };
      "variants": {
        "size": {
          "values": {
            "small": {};
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
          "id": "loading";
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
            "color": {
              "type": "color";
              "value": "$color.bg.transparent";
            };
            "colorDuration": {
              "type": "duration";
              "value": "$duration.color-transition";
            };
            "colorTimingFunction": {
              "type": "cubicBezier";
              "value": "$timing-function.easing";
            };
          };
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral";
            };
          };
          "progressCircle": {
            "trackColor": {
              "type": "color";
              "value": "$color.palette.gray-500";
            };
            "rangeColor": {
              "type": "color";
              "value": "$color.fg.neutral";
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
          "disabled",
        ];
        "slots": {
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.disabled";
            };
          };
        };
      },
      {
        "variants": {};
        "states": readonly [
          "loading",
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
        "variants": {
          "size": "small";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x9";
            };
            "cornerRadius": {
              "type": "dimension";
              "value": "$radius.r2";
            };
          };
          "icon": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 16;
                "unit": "px";
              };
            };
          };
          "progressCircle": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 16;
                "unit": "px";
              };
            };
            "thickness": {
              "type": "dimension";
              "value": {
                "value": 2;
                "unit": "px";
              };
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
              "value": "$dimension.x10";
            };
            "cornerRadius": {
              "type": "dimension";
              "value": "$radius.r2";
            };
          };
          "icon": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 18;
                "unit": "px";
              };
            };
          };
          "progressCircle": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 18;
                "unit": "px";
              };
            };
            "thickness": {
              "type": "dimension";
              "value": {
                "value": 2;
                "unit": "px";
              };
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
              "value": "$dimension.x13";
            };
            "cornerRadius": {
              "type": "dimension";
              "value": "$radius.r3";
            };
          };
          "icon": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 22;
                "unit": "px";
              };
            };
          };
          "progressCircle": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 22;
                "unit": "px";
              };
            };
            "thickness": {
              "type": "dimension";
              "value": {
                "value": 2;
                "unit": "px";
              };
            };
          };
        };
      },
    ];
  };
};
export default artifact;
