declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "search-input";
    "name": "Search Input";
  };
  "data": {
    "id": "search-input";
    "name": "Search Input";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "height": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "paddingLeft": {
              "type": "dimension";
            };
            "paddingRight": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
          };
        };
        "value": {
          "properties": {
            "color": {
              "type": "color";
            };
            "fontWeight": {
              "type": "number";
            };
            "fontSize": {
              "type": "dimension";
            };
            "lineHeight": {
              "type": "dimension";
            };
          };
        };
        "placeholder": {
          "properties": {
            "color": {
              "type": "color";
            };
            "fontWeight": {
              "type": "number";
            };
            "fontSize": {
              "type": "dimension";
            };
            "lineHeight": {
              "type": "dimension";
            };
          };
        };
        "clearButton": {
          "properties": {
            "paddingX": {
              "type": "dimension";
            };
            "paddingY": {
              "type": "dimension";
            };
          };
        };
        "clearButtonIcon": {
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
                "height": {
                  "type": "dimension";
                  "value": {
                    "value": 44;
                    "unit": "px";
                  };
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r2_5";
                };
                "paddingLeft": {
                  "type": "dimension";
                  "value": "$dimension.x4";
                };
                "paddingRight": {
                  "type": "dimension";
                  "value": "$dimension.x1";
                };
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-weak";
                };
              };
              "value": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.regular";
                };
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t6";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t6";
                };
              };
              "placeholder": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.placeholder";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.regular";
                };
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t6";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t6";
                };
              };
              "clearButton": {
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x3";
                };
                "paddingY": {
                  "type": "dimension";
                  "value": "$dimension.x3";
                };
              };
              "clearButtonIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-subtle";
                };
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x5";
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
