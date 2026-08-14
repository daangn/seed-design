declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "bottom-sheet-close-button";
    "name": "Bottom Sheet Close Button";
  };
  "data": {
    "id": "bottom-sheet-close-button";
    "name": "Bottom Sheet Close Button";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "color": {
              "type": "color";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "targetSize": {
              "type": "dimension";
            };
            "size": {
              "type": "dimension";
            };
          };
        };
        "icon": {
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
      "states": readonly [
        {
          "id": "pressed";
          "suppresses": readonly [];
        },
      ];
    };
    "rules": readonly [
      {
        "variants": {};
        "states": readonly [];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.bg.neutral-weak";
            };
            "cornerRadius": {
              "type": "dimension";
              "value": "$radius.full";
            };
            "targetSize": {
              "type": "dimension";
              "value": {
                "value": 44;
                "unit": "px";
              };
            };
            "size": {
              "type": "dimension";
              "value": {
                "value": 28;
                "unit": "px";
              };
            };
          };
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral";
            };
            "size": {
              "type": "dimension";
              "value": {
                "value": 14;
                "unit": "px";
              };
            };
          };
        };
      },
      {
        "variants": {};
        "states": readonly [
          "pressed",
        ];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.bg.neutral-weak-pressed";
            };
          };
        };
      },
    ];
  };
};
export default artifact;
