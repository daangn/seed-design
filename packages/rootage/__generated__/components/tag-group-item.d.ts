declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "tag-group-item";
    "name": "Tag Group Item";
  };
  "data": {
    "id": "tag-group-item";
    "name": "Tag Group Item";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "gap": {
              "type": "dimension";
            };
          };
        };
        "label": {
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
        "icon": {
          "properties": {
            "size": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
          };
        };
        "prefixIcon": {
          "properties": {
            "size": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
          };
        };
        "suffixIcon": {
          "properties": {
            "size": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
          };
        };
      };
      "variants": {
        "size": {
          "values": {
            "t2": {};
            "t3": {};
            "t4": {};
          };
        };
        "weight": {
          "values": {
            "regular": {};
            "bold": {};
          };
        };
        "tone": {
          "values": {
            "neutralSubtle": {};
            "neutral": {};
            "brand": {};
          };
        };
      };
      "states": readonly [];
    };
    "rules": readonly [
      {
        "variants": {};
        "states": readonly [];
        "slots": {
          "root": {
            "gap": {
              "type": "dimension";
              "value": "$dimension.x0_5";
            };
          };
        };
      },
      {
        "variants": {
          "size": "t2";
        };
        "states": readonly [];
        "slots": {
          "label": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t2";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t2";
            };
          };
          "icon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x3";
            };
          };
          "prefixIcon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x3";
            };
          };
          "suffixIcon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x3";
            };
          };
        };
      },
      {
        "variants": {
          "size": "t3";
        };
        "states": readonly [];
        "slots": {
          "label": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t3";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t3";
            };
          };
          "icon": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 13;
                "unit": "px";
              };
            };
          };
          "prefixIcon": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 13;
                "unit": "px";
              };
            };
          };
          "suffixIcon": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 13;
                "unit": "px";
              };
            };
          };
        };
      },
      {
        "variants": {
          "size": "t4";
        };
        "states": readonly [];
        "slots": {
          "label": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t4";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t4";
            };
          };
          "icon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x3_5";
            };
          };
          "prefixIcon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x3_5";
            };
          };
          "suffixIcon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x3_5";
            };
          };
        };
      },
      {
        "variants": {
          "weight": "regular";
        };
        "states": readonly [];
        "slots": {
          "label": {
            "fontWeight": {
              "type": "number";
              "value": "$font-weight.regular";
            };
          };
        };
      },
      {
        "variants": {
          "weight": "bold";
        };
        "states": readonly [];
        "slots": {
          "label": {
            "fontWeight": {
              "type": "number";
              "value": "$font-weight.bold";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "neutralSubtle";
        };
        "states": readonly [];
        "slots": {
          "label": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-subtle";
            };
          };
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-subtle";
            };
          };
          "prefixIcon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-subtle";
            };
          };
          "suffixIcon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-subtle";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "neutral";
        };
        "states": readonly [];
        "slots": {
          "label": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral";
            };
          };
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral";
            };
          };
          "prefixIcon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral";
            };
          };
          "suffixIcon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "brand";
        };
        "states": readonly [];
        "slots": {
          "label": {
            "color": {
              "type": "color";
              "value": "$color.fg.brand";
            };
          };
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.brand";
            };
          };
          "prefixIcon": {
            "color": {
              "type": "color";
              "value": "$color.fg.brand";
            };
          };
          "suffixIcon": {
            "color": {
              "type": "color";
              "value": "$color.fg.brand";
            };
          };
        };
      },
    ];
  };
};
export default artifact;
