declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "checkbox";
    "name": "Checkbox";
  };
  "data": {
    "id": "checkbox";
    "name": "Checkbox";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "gap": {
              "type": "dimension";
            };
            "minHeight": {
              "type": "dimension";
            };
          };
        };
        "label": {
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
      };
      "variants": {
        "weight": {
          "values": {
            "regular": {};
            "bold": {};
          };
        };
        "size": {
          "values": {
            "medium": {};
            "large": {};
          };
        };
      };
      "states": readonly [
        {
          "id": "disabled";
          "suppresses": readonly [];
        },
      ];
    };
    "rules": readonly [
      {
        "variants": {};
        "states": readonly [];
        "slots": {
          "label": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral";
            };
          };
          "root": {
            "gap": {
              "type": "dimension";
              "value": "$dimension.x2";
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
          "label": {
            "color": {
              "type": "color";
              "value": "$color.fg.disabled";
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
          "size": "medium";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "minHeight": {
              "type": "dimension";
              "value": "$dimension.x8";
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
          };
        };
      },
      {
        "variants": {
          "size": "large";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "minHeight": {
              "type": "dimension";
              "value": "$dimension.x9";
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
          };
        };
      },
    ];
  };
};
export default artifact;
