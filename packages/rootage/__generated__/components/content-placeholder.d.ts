declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "content-placeholder";
    "name": "Content Placeholder";
  };
  "data": {
    "id": "content-placeholder";
    "name": "Content Placeholder";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "color": {
              "type": "color";
            };
          };
        };
        "asset": {
          "properties": {
            "minWidth": {
              "type": "dimension";
            };
            "maxWidth": {
              "type": "dimension";
            };
            "heightFraction": {
              "type": "number";
              "description": "root slot 대한 asset slot의 높이 비율입니다.";
            };
            "color": {
              "type": "color";
            };
          };
        };
      };
      "variants": {
        "type": {
          "values": {
            "default": {};
            "buySell": {};
            "car": {};
            "commerce": {};
            "coupon": {};
            "food": {};
            "group": {};
            "image": {};
            "jobs": {};
            "business": {};
            "post": {};
            "realty": {};
          };
          "defaultValue": "default";
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
                  "value": "$color.palette.gray-200";
                };
              };
              "asset": {
                "minWidth": {
                  "type": "dimension";
                  "value": "$dimension.x4";
                };
                "maxWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 160;
                    "unit": "px";
                  };
                };
                "heightFraction": {
                  "type": "number";
                  "value": 0.5;
                };
                "color": {
                  "type": "color";
                  "value": "$color.palette.gray-400";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "type": "default";
        };
        "definitions": readonly [];
      },
      {
        "variants": {
          "type": "buySell";
        };
        "definitions": readonly [];
      },
      {
        "variants": {
          "type": "car";
        };
        "definitions": readonly [];
      },
      {
        "variants": {
          "type": "commerce";
        };
        "definitions": readonly [];
      },
      {
        "variants": {
          "type": "coupon";
        };
        "definitions": readonly [];
      },
      {
        "variants": {
          "type": "food";
        };
        "definitions": readonly [];
      },
      {
        "variants": {
          "type": "group";
        };
        "definitions": readonly [];
      },
      {
        "variants": {
          "type": "image";
        };
        "definitions": readonly [];
      },
      {
        "variants": {
          "type": "jobs";
        };
        "definitions": readonly [];
      },
      {
        "variants": {
          "type": "business";
        };
        "definitions": readonly [];
      },
      {
        "variants": {
          "type": "post";
        };
        "definitions": readonly [];
      },
      {
        "variants": {
          "type": "realty";
        };
        "definitions": readonly [];
      },
    ];
  };
};
export default artifact;
