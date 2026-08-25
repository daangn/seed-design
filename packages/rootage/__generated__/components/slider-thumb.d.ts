declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "slider-thumb";
    "name": "Slider Thumb";
  };
  "data": {
    "id": "slider-thumb";
    "name": "Slider Thumb";
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
            "scaleDuration": {
              "type": "duration";
            };
            "scaleTimingFunction": {
              "type": "cubicBezier";
            };
            "translateDuration": {
              "type": "duration";
            };
            "translateTimingFunction": {
              "type": "cubicBezier";
            };
            "scale": {
              "type": "number";
            };
          };
        };
      };
      "variants": {};
    };
    "definitions": readonly [
      {
        "variants": {};
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x5";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.full";
                };
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-solid";
                };
                "scaleDuration": {
                  "type": "duration";
                  "value": "$duration.d3";
                };
                "scaleTimingFunction": {
                  "type": "cubicBezier";
                  "value": "$timing-function.easing";
                };
                "translateDuration": {
                  "type": "duration";
                  "value": "$duration.d3";
                };
                "translateTimingFunction": {
                  "type": "cubicBezier";
                  "value": "$timing-function.easing";
                };
              };
            };
          },
          {
            "states": readonly [
              "disabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
            };
          },
          {
            "states": readonly [
              "pressed",
            ];
            "slots": {
              "root": {
                "scale": {
                  "type": "number";
                  "value": 1.2;
                };
              };
            };
          },
        ];
      },
    ];
  };
};
export default artifact;
