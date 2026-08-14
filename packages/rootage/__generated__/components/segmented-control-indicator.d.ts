declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "segmented-control-indicator";
    "name": "Segmented Control Indicator";
  };
  "data": {
    "id": "segmented-control-indicator";
    "name": "Segmented Control Indicator";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "color": {
              "type": "color";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "strokeWidth": {
              "type": "dimension";
            };
            "strokeColor": {
              "type": "color";
            };
            "transformDuration": {
              "type": "duration";
            };
            "transformTimingFunction": {
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
              "value": "$color.palette.gray-00";
            };
            "strokeColor": {
              "type": "color";
              "value": "$color.stroke.neutral-muted";
            };
            "strokeWidth": {
              "type": "dimension";
              "value": {
                "value": 1;
                "unit": "px";
              };
            };
            "cornerRadius": {
              "type": "dimension";
              "value": "$radius.full";
            };
            "transformDuration": {
              "type": "duration";
              "value": "$duration.d4";
            };
            "transformTimingFunction": {
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
          "root": {
            "color": {
              "type": "color";
              "value": "$color.palette.gray-100";
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
          "root": {
            "color": {
              "type": "color";
              "value": "$color.bg.disabled";
            };
          };
        };
      },
    ];
  };
};
export default artifact;
