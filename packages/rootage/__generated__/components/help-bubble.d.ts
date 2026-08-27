declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "help-bubble";
    "name": "Help Bubble";
  };
  "data": {
    "id": "help-bubble";
    "name": "Help Bubble";
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
            "paddingX": {
              "type": "dimension";
            };
            "paddingY": {
              "type": "dimension";
            };
            "gap": {
              "type": "dimension";
            };
            "maxWidth": {
              "type": "dimension";
            };
            "enterScale": {
              "type": "number";
            };
            "enterOpacity": {
              "type": "number";
            };
            "enterDuration": {
              "type": "duration";
            };
            "enterTimingFunction": {
              "type": "cubicBezier";
            };
            "exitScale": {
              "type": "number";
            };
            "exitOpacity": {
              "type": "number";
            };
            "exitDuration": {
              "type": "duration";
            };
            "exitTimingFunction": {
              "type": "cubicBezier";
            };
            "overflowPadding": {
              "type": "dimension";
              "description": "말풍선과 뷰포트 경계 사이의 최소 간격을 정의합니다.";
            };
          };
        };
        "arrow": {
          "properties": {
            "color": {
              "type": "color";
            };
            "width": {
              "type": "dimension";
            };
            "height": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "gutter": {
              "type": "dimension";
              "description": "arrow와 타겟 요소 사이의 거리를 정의합니다.";
            };
            "padding": {
              "type": "dimension";
              "description": "arrow와 root의 경계 사이의 최소 간격을 정의합니다.";
            };
          };
        };
        "body": {
          "properties": {
            "gap": {
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
            "fontWeight": {
              "type": "number";
            };
            "lineHeight": {
              "type": "dimension";
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
            "fontWeight": {
              "type": "number";
            };
            "lineHeight": {
              "type": "dimension";
            };
          };
        };
        "closeButton": {
          "properties": {
            "color": {
              "type": "color";
            };
            "size": {
              "type": "dimension";
            };
            "targetSize": {
              "type": "dimension";
            };
            "marginTop": {
              "type": "dimension";
            };
            "scaleScope": {
              "type": "enum";
              "values": readonly [
                "self",
                "content",
              ];
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
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-inverted";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r3";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x3";
                };
                "paddingY": {
                  "type": "dimension";
                  "value": "$dimension.x2_5";
                };
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x1";
                };
                "maxWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 280;
                    "unit": "px";
                  };
                };
                "enterScale": {
                  "type": "number";
                  "value": 0.9;
                };
                "enterOpacity": {
                  "type": "number";
                  "value": 0;
                };
                "enterDuration": {
                  "type": "duration";
                  "value": "$duration.d4";
                };
                "enterTimingFunction": {
                  "type": "cubicBezier";
                  "value": "$timing-function.enter";
                };
                "exitScale": {
                  "type": "number";
                  "value": 1;
                };
                "exitOpacity": {
                  "type": "number";
                  "value": 0;
                };
                "exitDuration": {
                  "type": "duration";
                  "value": "$duration.d4";
                };
                "exitTimingFunction": {
                  "type": "cubicBezier";
                  "value": "$timing-function.easing";
                };
                "overflowPadding": {
                  "type": "dimension";
                  "value": "$dimension.x4";
                };
              };
              "arrow": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-inverted";
                };
                "width": {
                  "type": "dimension";
                  "value": {
                    "value": 12;
                    "unit": "px";
                  };
                };
                "height": {
                  "type": "dimension";
                  "value": {
                    "value": 8;
                    "unit": "px";
                  };
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": {
                    "value": 2;
                    "unit": "px";
                  };
                };
                "gutter": {
                  "type": "dimension";
                  "value": {
                    "value": 4;
                    "unit": "px";
                  };
                };
                "padding": {
                  "type": "dimension";
                  "value": {
                    "value": 14;
                    "unit": "px";
                  };
                };
              };
              "body": {
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x0_5";
                };
              };
              "title": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-inverted";
                };
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t3";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.bold";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t3";
                };
              };
              "description": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-inverted";
                };
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t3";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.regular";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t3";
                };
              };
              "closeButton": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-inverted";
                };
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x3_5";
                };
                "targetSize": {
                  "type": "dimension";
                  "value": {
                    "value": 38;
                    "unit": "px";
                  };
                };
                "marginTop": {
                  "type": "dimension";
                  "value": "$dimension.x0_5";
                };
              };
            };
          },
          {
            "states": readonly [
              "pressed",
            ];
            "slots": {
              "closeButton": {
                "scaleScope": {
                  "type": "enum";
                  "value": "self";
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
