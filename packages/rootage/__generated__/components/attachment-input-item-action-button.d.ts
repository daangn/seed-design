declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "attachment-input-item-action-button";
    "name": "Attachment Input Item Action Button";
  };
  "data": {
    "id": "attachment-input-item-action-button";
    "name": "Attachment Input Item Action Button";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "gap": {
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
        "label": {
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
        "type": {
          "values": {
            "file": {};
            "image": {};
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
              "value": "$dimension.x1";
            };
          };
          "icon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x6";
            };
          };
          "label": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t2";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t2";
            };
            "fontWeight": {
              "type": "number";
              "value": "$font-weight.medium";
            };
          };
        };
      },
      {
        "variants": {
          "type": "file";
        };
        "states": readonly [];
        "slots": {
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-subtle";
            };
          };
          "label": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-subtle";
            };
          };
        };
      },
      {
        "variants": {
          "type": "image";
        };
        "states": readonly [];
        "slots": {
          "icon": {
            "color": {
              "type": "color";
              "value": "$color.palette.static-white";
            };
          };
          "label": {
            "color": {
              "type": "color";
              "value": "$color.palette.static-white";
            };
          };
        };
      },
    ];
  };
};
export default artifact;
