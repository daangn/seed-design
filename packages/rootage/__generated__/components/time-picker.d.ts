declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "time-picker";
    "name": "Time Picker";
  };
  "data": {
    "id": "time-picker";
    "name": "Time Picker";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "height": {
              "type": "dimension";
            };
          };
        };
        "selectionIndicator": {
          "properties": {
            "height": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
          };
        };
        "item": {
          "properties": {
            "height": {
              "type": "dimension";
            };
            "paddingX": {
              "type": "dimension";
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
            "color": {
              "type": "color";
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
                "height": {
                  "type": "dimension";
                  "value": {
                    "value": 220;
                    "unit": "px";
                  };
                };
              };
              "selectionIndicator": {
                "height": {
                  "type": "dimension";
                  "value": {
                    "value": 44;
                    "unit": "px";
                  };
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r2";
                };
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-weak";
                };
              };
              "item": {
                "height": {
                  "type": "dimension";
                  "value": {
                    "value": 44;
                    "unit": "px";
                  };
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x4";
                };
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t10-static";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t10-static";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.medium";
                };
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
            ];
            "slots": {
              "item": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
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
