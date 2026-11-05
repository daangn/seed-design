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
          "defaultValue": "neutralSolid";
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
        ];
      },
      {
        "variants": {
          "variant": "neutralSolid";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
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
      },
      {
        "variants": {
          "variant": "neutralOutline";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
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
      },
    ];
  };
};
export default artifact;
