declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "date-picker";
    "name": "Date Picker";
  };
  "data": {
    "id": "date-picker";
    "name": "Date Picker";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "color": {
              "type": "color";
            };
          };
        };
        "header": {
          "properties": {
            "height": {
              "type": "dimension";
            };
          };
        };
        "headerLabel": {
          "properties": {
            "paddingX": {
              "type": "dimension";
            };
            "gap": {
              "type": "dimension";
            };
            "iconSize": {
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
        "months": {
          "properties": {
            "gap": {
              "type": "dimension";
            };
          };
        };
        "continuousScroll": {
          "properties": {
            "fogHeight": {
              "type": "dimension";
            };
          };
        };
        "weekday": {
          "properties": {
            "height": {
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
        "monthLabel": {
          "properties": {
            "height": {
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
        "dateCell": {
          "properties": {
            "minHeight": {
              "type": "dimension";
            };
          };
        };
        "dateVisual": {
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
          };
        };
        "dateContent": {
          "properties": {
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
        "rangeBackground": {
          "properties": {
            "color": {
              "type": "color";
            };
          };
        };
        "wheelSelectionIndicator": {
          "properties": {
            "cornerRadius": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
          };
        };
        "wheelContainer": {
          "properties": {
            "height": {
              "type": "dimension";
            };
          };
        };
        "wheelItem": {
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
                "color": {
                  "type": "color";
                  "value": "$color.bg.layer-floating";
                };
              };
              "header": {
                "height": {
                  "type": "dimension";
                  "value": "$dimension.x12";
                };
              };
              "headerLabel": {
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x1";
                };
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x1";
                };
                "iconSize": {
                  "type": "dimension";
                  "value": "$dimension.x5";
                };
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
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "months": {
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x6";
                };
              };
              "continuousScroll": {
                "fogHeight": {
                  "type": "dimension";
                  "value": {
                    "value": 96;
                    "unit": "px";
                  };
                };
              };
              "weekday": {
                "height": {
                  "type": "dimension";
                  "value": "$dimension.x12";
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
                  "value": "$font-weight.medium";
                };
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-subtle";
                };
              };
              "monthLabel": {
                "height": {
                  "type": "dimension";
                  "value": "$dimension.x12";
                };
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
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "dateCell": {
                "minHeight": {
                  "type": "dimension";
                  "value": "$dimension.x12";
                };
              };
              "dateVisual": {
                "size": {
                  "type": "dimension";
                  "value": {
                    "value": 42;
                    "unit": "px";
                  };
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.full";
                };
                "color": {
                  "type": "color";
                  "value": "$color.bg.transparent";
                };
              };
              "dateContent": {
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
                  "value": "$font-weight.medium";
                };
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-muted";
                };
              };
              "rangeBackground": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-weak";
                };
              };
              "wheelSelectionIndicator": {
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r2";
                };
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-weak";
                };
              };
              "wheelContainer": {
                "height": {
                  "type": "dimension";
                  "value": {
                    "value": 336;
                    "unit": "px";
                  };
                };
              };
              "wheelItem": {
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
              "pressed",
            ];
            "slots": {
              "dateVisual": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.transparent-pressed";
                };
              };
            };
          },
          {
            "states": readonly [
              "today",
            ];
            "slots": {
              "dateVisual": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-weak";
                };
              };
            };
          },
          {
            "states": readonly [
              "selected",
            ];
            "slots": {
              "dateVisual": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-inverted";
                };
              };
              "dateContent": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-inverted";
                };
              };
              "wheelItem": {
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
              "dateContent": {
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
