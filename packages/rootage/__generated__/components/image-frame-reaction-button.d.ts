declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "image-frame-reaction-button";
    "name": "Image Frame Reaction Button";
  };
  "data": {
    "id": "image-frame-reaction-button";
    "name": "Image Frame Reaction Button";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "size": {
              "type": "dimension";
              "description": "보이는 버튼 크기입니다.";
            };
            "targetSize": {
              "type": "dimension";
              "description": "터치 영역 크기입니다.";
            };
          };
          "description": "하트 아이콘 토글 버튼입니다. 이미지 위에서 좋아요 기능에 사용됩니다.";
        };
        "fillIcon": {
          "properties": {
            "gradient": {
              "type": "gradient";
            };
            "size": {
              "type": "dimension";
            };
            "shadow": {
              "type": "shadow";
            };
          };
          "description": "lineIcon 아래에 내려가는 하트 아이콘입니다.";
        };
        "lineIcon": {
          "properties": {
            "color": {
              "type": "color";
            };
            "size": {
              "type": "dimension";
            };
          };
          "description": "fillIcon 위로 올라가는 하트 아이콘입니다.";
        };
      };
      "variants": {};
      "states": readonly [
        {
          "id": "selected";
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
              "value": "$dimension.x6";
            };
            "targetSize": {
              "type": "dimension";
              "value": "$dimension.x10";
            };
          };
          "fillIcon": {
            "gradient": {
              "type": "gradient";
              "value": readonly [
                {
                  "color": "$color.palette.static-black-alpha-600";
                  "position": 0;
                },
                {
                  "color": "$color.palette.static-black-alpha-600";
                  "position": 1;
                },
              ];
            };
            "size": {
              "type": "dimension";
              "value": "$dimension.x6";
            };
            "shadow": {
              "type": "shadow";
              "value": readonly [
                {
                  "color": "#00000026";
                  "offsetX": {
                    "value": 0;
                    "unit": "px";
                  };
                  "offsetY": {
                    "value": 2;
                    "unit": "px";
                  };
                  "blur": {
                    "value": 4;
                    "unit": "px";
                  };
                  "spread": {
                    "value": 0;
                    "unit": "px";
                  };
                },
              ];
            };
          };
          "lineIcon": {
            "color": {
              "type": "color";
              "value": "$color.palette.static-white";
            };
            "size": {
              "type": "dimension";
              "value": "$dimension.x6";
            };
          };
        };
      },
      {
        "variants": {};
        "states": readonly [
          "selected",
        ];
        "slots": {
          "fillIcon": {
            "gradient": {
              "type": "gradient";
              "value": readonly [
                {
                  "color": "#FF9A56";
                  "position": 0;
                },
                {
                  "color": "#FF6600";
                  "position": 1;
                },
              ];
            };
          };
          "lineIcon": {
            "color": {
              "type": "color";
              "value": "$color.bg.transparent";
            };
          };
        };
      },
    ];
  };
};
export default artifact;
