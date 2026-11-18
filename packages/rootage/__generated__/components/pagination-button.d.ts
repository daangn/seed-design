declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "pagination-button";
    "name": "Pagination Button";
  };
  "data": {
    "id": "pagination-button";
    "name": "Pagination Button";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "color": {
              "type": "color";
            };
            "colorDuration": {
              "type": "duration";
            };
            "colorTimingFunction": {
              "type": "cubicBezier";
            };
            "scaleScope": {
              "type": "enum";
              "values": readonly [
                "self",
                "content",
              ];
            };
            "size": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
          };
        };
        "icon": {
          "properties": {
            "color": {
              "type": "color";
            };
            "size": {
              "type": "dimension";
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
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x4";
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
                "color": {
                  "type": "color";
                  "value": "$color.bg.transparent-pressed";
                };
                "scaleScope": {
                  "type": "enum";
                  "value": "self";
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
                  "value": "$color.bg.transparent";
                };
              };
              "icon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
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
