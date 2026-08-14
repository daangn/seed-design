declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "attachment-input-item-remove-button";
    "name": "Attachment Input Item Remove Button";
  };
  "data": {
    "id": "attachment-input-item-remove-button";
    "name": "Attachment Input Item Remove Button";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "size": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
            "strokeWidth": {
              "type": "dimension";
            };
            "strokeColor": {
              "type": "color";
            };
            "offset": {
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
      "variants": {};
      "states": readonly [
        {
          "id": "pressed";
          "suppresses": readonly [];
        },
        {
          "id": "disabled";
          "suppresses": readonly [
            "pressed",
          ];
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
              "value": "$dimension.x5";
            };
            "cornerRadius": {
              "type": "dimension";
              "value": "$radius.full";
            };
            "color": {
              "type": "color";
              "value": "$color.bg.layer-default";
            };
            "strokeWidth": {
              "type": "dimension";
              "value": {
                "value": 1;
                "unit": "px";
              };
            };
            "strokeColor": {
              "type": "color";
              "value": "$color.stroke.neutral-weak";
            };
            "offset": {
              "type": "dimension";
              "value": "$dimension.x1";
            };
          };
          "icon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x2_5";
            };
            "color": {
              "type": "color";
              "value": "$color.fg.neutral";
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
              "value": "$color.bg.layer-default-pressed";
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
