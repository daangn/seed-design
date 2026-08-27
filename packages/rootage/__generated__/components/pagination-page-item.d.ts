declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "pagination-page-item";
    "name": "Pagination Page Item";
  };
  "data": {
    "id": "pagination-page-item";
    "name": "Pagination Page Item";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "color": {
              "type": "color";
            };
            "scale": {
              "type": "number";
            };
            "scaleDuration": {
              "type": "duration";
            };
            "scaleTimingFunction": {
              "type": "cubicBezier";
            };
            "size": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
          };
        };
        "label": {
          "properties": {
            "color": {
              "type": "color";
            };
            "fontSize": {
              "type": "dimension";
            };
            "lineHeight": {
              "type": "dimension";
            };
            "fontWeight": {
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
                "color": {
                  "type": "color";
                  "value": "$color.bg.transparent";
                };
                "scaleDuration": {
                  "type": "duration";
                  "value": "$duration.pressed-scale";
                };
                "scaleTimingFunction": {
                  "type": "cubicBezier";
                  "value": "$timing-function.pressed-scale";
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
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t4";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t4";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.bold";
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
                "scale": {
                  "type": "number";
                  "value": "$scale.s97";
                };
              };
            };
          },
          {
            "states": readonly [
              "selected",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-solid";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.on-neutral-solid";
                };
              };
            };
          },
          {
            "states": readonly [
              "selected",
              " pressed",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-solid-pressed";
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
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
            };
          },
          {
            "states": readonly [
              "selected",
              " disabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.disabled";
                };
              };
              "label": {
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
