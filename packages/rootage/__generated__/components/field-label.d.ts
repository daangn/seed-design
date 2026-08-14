declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "field-label";
    "name": "Field Label";
  };
  "data": {
    "id": "field-label";
    "name": "Field Label";
    "schema": {
      "slots": {
        "root": {
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
        "weight": {
          "values": {
            "medium": {};
            "bold": {};
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
            "color": {
              "type": "color";
              "value": "$color.fg.neutral";
            };
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
      {
        "variants": {
          "weight": "medium";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "fontWeight": {
              "type": "number";
              "value": "$font-weight.medium";
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
          "root": {
            "fontWeight": {
              "type": "number";
              "value": "$font-weight.bold";
            };
          };
        };
      },
    ];
  };
};
export default artifact;
