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
              "value": "$color.fg.neutral-inverted";
            };
          };
        };
      },
      {
        "variants": {
          "weight": "thin";
        };
        "states": readonly [];
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
      {
        "variants": {
          "weight": "thick";
        };
        "states": readonly [];
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
  };
};
export default artifact;
