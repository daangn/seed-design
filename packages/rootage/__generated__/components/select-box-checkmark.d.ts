declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "select-box-checkmark";
    "name": "Select Box Checkmark";
  };
  "data": {
    "id": "select-box-checkmark";
    "name": "Select Box Checkmark";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "size": {
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
            "colorDuration": {
              "type": "duration";
            };
            "colorTimingFunction": {
              "type": "cubicBezier";
            };
          };
        };
      };
      "variants": {};
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
            "size": {
              "type": "dimension";
              "value": "$dimension.x5";
            };
          };
          "icon": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 15;
                "unit": "px";
              };
            };
            "color": {
              "type": "color";
              "value": "$color.fg.placeholder";
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
        };
      },
      {
        "variants": {};
        "states": readonly [
          "pressed",
        ];
        "slots": {
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-subtle";
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
          "icon": {
            "color": {
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
          "selected",
        ];
        "slots": {
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral";
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
          "selected",
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
    ];
  };
};
export default artifact;
