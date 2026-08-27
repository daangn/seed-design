declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "slider-tick";
    "name": "Slider Tick";
  };
  "data": {
    "id": "slider-tick";
    "name": "Slider Tick";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "width": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
          };
        };
      };
      "variants": {
        "weight": {
          "values": {
            "thin": {};
            "thick": {};
          };
          "defaultValue": "thin";
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
                "color": {
                  "type": "color";
                  "value": "$color.fg.on-neutral-solid";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "weight": "thin";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "width": {
                  "type": "dimension";
                  "value": {
                    "value": 1;
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
          "weight": "thick";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "width": {
                  "type": "dimension";
                  "value": "$dimension.x1";
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
