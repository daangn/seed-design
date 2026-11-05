declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "alert-dialog";
    "name": "Alert Dialog";
  };
  "data": {
    "id": "alert-dialog";
    "name": "Alert Dialog";
    "schema": {
      "slots": {
        "backdrop": {
          "properties": {
            "color": {
              "type": "color";
            };
            "enterDuration": {
              "type": "duration";
            };
            "enterTimingFunction": {
              "type": "cubicBezier";
            };
            "enterOpacity": {
              "type": "number";
            };
            "exitDuration": {
              "type": "duration";
            };
            "exitTimingFunction": {
              "type": "cubicBezier";
            };
            "exitOpacity": {
              "type": "number";
            };
          };
        };
        "content": {
          "properties": {
            "color": {
              "type": "color";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "marginX": {
              "type": "dimension";
              "description": "content와 좌우 안전 영역 경계 사이의 최소 간격입니다. 화면 끝이 아니라 안전 영역 경계부터 잽니다.";
            };
            "marginY": {
              "type": "dimension";
            };
            "maxWidth": {
              "type": "dimension";
            };
            "enterDuration": {
              "type": "duration";
            };
            "enterTimingFunction": {
              "type": "cubicBezier";
            };
            "enterOpacity": {
              "type": "number";
            };
            "enterScale": {
              "type": "number";
            };
            "exitDuration": {
              "type": "duration";
            };
            "exitTimingFunction": {
              "type": "cubicBezier";
            };
            "exitOpacity": {
              "type": "number";
            };
          };
          "description": "content는 가로 기준으로 안전 영역의 가운데에 놓입니다. 세로 기준으로는 상단과 하단 inset 중 큰 값을 위아래에 똑같이 두어 화면 가운데에 놓이고, 높이는 그 사이 높이를 넘지 않습니다.";
        };
        "header": {
          "properties": {
            "gap": {
              "type": "dimension";
            };
            "paddingX": {
              "type": "dimension";
            };
            "paddingTop": {
              "type": "dimension";
            };
          };
        };
        "footer": {
          "properties": {
            "gap": {
              "type": "dimension";
            };
            "paddingX": {
              "type": "dimension";
            };
            "paddingTop": {
              "type": "dimension";
            };
            "paddingBottom": {
              "type": "dimension";
            };
          };
        };
        "title": {
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
        "description": {
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
      "variants": {};
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
              "backdrop": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.overlay";
                };
                "enterDuration": {
                  "type": "duration";
                  "value": "$duration.d2";
                };
                "enterTimingFunction": {
                  "type": "cubicBezier";
                  "value": "$timing-function.enter";
                };
                "enterOpacity": {
                  "type": "number";
                  "value": 0;
                };
                "exitDuration": {
                  "type": "duration";
                  "value": "$duration.d2";
                };
                "exitTimingFunction": {
                  "type": "cubicBezier";
                  "value": "$timing-function.exit";
                };
                "exitOpacity": {
                  "type": "number";
                  "value": 0;
                };
              };
              "content": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.layer-floating";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r5";
                };
                "marginX": {
                  "type": "dimension";
                  "value": "$dimension.x8";
                };
                "marginY": {
                  "type": "dimension";
                  "value": "$dimension.x16";
                };
                "maxWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 272;
                    "unit": "px";
                  };
                };
                "enterDuration": {
                  "type": "duration";
                  "value": "$duration.d4";
                };
                "enterTimingFunction": {
                  "type": "cubicBezier";
                  "value": "$timing-function.enter-expressive";
                };
                "enterOpacity": {
                  "type": "number";
                  "value": 0;
                };
                "enterScale": {
                  "type": "number";
                  "value": 1.3;
                };
                "exitDuration": {
                  "type": "duration";
                  "value": "$duration.d2";
                };
                "exitTimingFunction": {
                  "type": "cubicBezier";
                  "value": "$timing-function.exit";
                };
                "exitOpacity": {
                  "type": "number";
                  "value": 0;
                };
              };
              "header": {
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x1_5";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x5";
                };
                "paddingTop": {
                  "type": "dimension";
                  "value": "$dimension.x5";
                };
              };
              "footer": {
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x2";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x5";
                };
                "paddingTop": {
                  "type": "dimension";
                  "value": "$dimension.x4";
                };
                "paddingBottom": {
                  "type": "dimension";
                  "value": "$dimension.x5";
                };
              };
              "title": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t7";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t7";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.bold";
                };
              };
              "description": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t5";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t5";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.regular";
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
