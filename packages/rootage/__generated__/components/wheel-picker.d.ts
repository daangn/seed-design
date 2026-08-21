declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "wheel-picker";
    "name": "Wheel Picker";
  };
  "data": {
    "id": "wheel-picker";
    "name": "Wheel Picker";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "height": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
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
        "scrollFog": {
          "properties": {
            "height": {
              "type": "dimension";
            };
          };
        };
        "item": {
          "properties": {
            "height": {
              "type": "dimension";
            };
          };
        };
        "itemLabel": {
          "properties": {
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
                "color": {
                  "type": "color";
                  "value": "$color.bg.layer-floating";
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
              "scrollFog": {
                "height": {
                  "type": "dimension";
                  "value": {
                    "value": 88;
                    "unit": "px";
                  };
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
              };
              "itemLabel": {
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
              "itemLabel": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
            };
          },
          {
            "states": readonly [
              "disabled",
            ];
            "slots": {
              "itemLabel": {
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
