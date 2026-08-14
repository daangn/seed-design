declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "top-navigation-icon-button";
    "name": "Top Navigation Icon Button";
  };
  "data": {
    "id": "top-navigation-icon-button";
    "name": "Top Navigation Icon Button";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "size": {
              "type": "dimension";
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
      };
      "variants": {
        "tone": {
          "values": {
            "layer": {};
            "transparent": {};
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
          "root": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 44;
                "unit": "px";
              };
            };
          };
          "icon": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 24;
                "unit": "px";
              };
            };
          };
        };
      },
      {
        "variants": {
          "tone": "layer";
        };
        "states": readonly [];
        "slots": {
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "layer";
        };
        "states": readonly [
          "disabled",
        ];
        "slots": {
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.disabled";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "transparent";
        };
        "states": readonly [];
        "slots": {
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.palette.static-white";
            };
          };
        };
      },
      {
        "variants": {
          "tone": "transparent";
        };
        "states": readonly [
          "disabled",
        ];
        "slots": {
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.disabled";
            };
          };
        };
      },
    ];
  };
};
export default artifact;
