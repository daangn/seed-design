declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "tab";
    "name": "Tab";
  };
  "data": {
    "id": "tab";
    "name": "Tab";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "minHeight": {
              "type": "dimension";
            };
            "paddingX": {
              "type": "dimension";
            };
            "paddingY": {
              "type": "dimension";
            };
            "scaleScope": {
              "type": "enum";
              "values": readonly [
                "self",
                "content",
              ];
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
      "variants": {
        "size": {
          "values": {
            "medium": {};
            "small": {};
          };
          "defaultValue": "medium";
        };
      };
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
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-subtle";
                };
              };
            };
          },
          {
            "states": readonly [
              "selected",
            ];
            "slots": {
              "label": {
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
              "pressed",
            ];
            "slots": {
              "root": {
                "scaleScope": {
                  "type": "enum";
                  "value": "self";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "size": "medium";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "minHeight": {
                  "type": "dimension";
                  "value": {
                    "value": 44;
                    "unit": "px";
                  };
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x2_5";
                };
                "paddingY": {
                  "type": "dimension";
                  "value": "$dimension.x2_5";
                };
              };
              "label": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t5";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t5";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.bold";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "size": "small";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "minHeight": {
                  "type": "dimension";
                  "value": {
                    "value": 40;
                    "unit": "px";
                  };
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x2_5";
                };
                "paddingY": {
                  "type": "dimension";
                  "value": "$dimension.x2_5";
                };
              };
              "label": {
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
        ];
      },
    ];
  };
};
export default artifact;
