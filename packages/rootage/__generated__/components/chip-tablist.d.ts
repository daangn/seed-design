declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "chip-tablist";
    "name": "Chip Tablist";
  };
  "data": {
    "id": "chip-tablist";
    "name": "Chip Tablist";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "paddingX": {
              "type": "dimension";
            };
            "gap": {
              "type": "dimension";
            };
          };
        };
      };
      "variants": {
        "variant": {
          "values": {
            "neutralSolid": {};
            "neutralOutline": {};
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
            "paddingX": {
              "type": "dimension";
              "value": "$dimension.x4";
            };
            "gap": {
              "type": "dimension";
              "value": {
                "value": 8;
                "unit": "px";
              };
            };
          };
        };
      },
      {
        "variants": {
          "variant": "neutralSolid";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "gap": {
              "type": "dimension";
              "value": {
                "value": 8;
                "unit": "px";
              };
            };
          };
        };
      },
      {
        "variants": {
          "variant": "neutralOutline";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "gap": {
              "type": "dimension";
              "value": {
                "value": 8;
                "unit": "px";
              };
            };
          };
        };
      },
    ];
  };
};
export default artifact;
