declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "top-navigation-text-button";
    "name": "Top Navigation Text Button";
  };
  "data": {
    "id": "top-navigation-text-button";
    "name": "Top Navigation Text Button";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "maxWidth": {
              "type": "dimension";
              "description": "버튼 레이블이 길어졌을 때 ellipsis 말줄임을 시작할 최대 너비입니다. Top Navigation main slot이 충분한 공간을 차지할 수 있도록 하기 위해 폰트 스케일링의 영향을 받지 않는 px 값을 사용합니다.";
            };
            "height": {
              "type": "dimension";
            };
            "paddingX": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
            "colorDuration": {
              "type": "duration";
            };
            "colorTimingFunction": {
              "type": "cubicBezier";
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
            "maxFontSizeScale": {
              "type": "number";
            };
            "minFontSizeScale": {
              "type": "number";
            };
            "maxLineHeightScale": {
              "type": "number";
            };
            "minLineHeightScale": {
              "type": "number";
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
          "defaultValue": "layer";
        };
        "theme": {
          "values": {
            "ios": {};
            "android": {};
          };
          "defaultValue": "ios";
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
                "height": {
                  "type": "dimension";
                  "value": {
                    "value": 44;
                    "unit": "px";
                  };
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x2_5";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r2";
                };
                "color": {
                  "type": "color";
                  "value": "$color.bg.transparent";
                };
                "colorDuration": {
                  "type": "duration";
                  "value": "$duration.color-transition";
                };
                "colorTimingFunction": {
                  "type": "cubicBezier";
                  "value": "$timing-function.easing";
                };
              };
              "label": {
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
                  "value": "$font-weight.medium";
                };
                "maxFontSizeScale": {
                  "type": "number";
                  "value": 1.2;
                };
                "minFontSizeScale": {
                  "type": "number";
                  "value": 1;
                };
                "maxLineHeightScale": {
                  "type": "number";
                  "value": 1.2;
                };
                "minLineHeightScale": {
                  "type": "number";
                  "value": 1;
                };
              };
            };
          },
          {
            "states": readonly [
              "pressed",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.transparent-pressed";
                };
                "scaleScope": {
                  "type": "enum";
                  "value": "self";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "layer";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
            };
          },
          {
            "states": readonly [
              "disabled",
            ];
            "slots": {
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "transparent";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.static-white";
                };
              };
            };
          },
          {
            "states": readonly [
              "disabled",
            ];
            "slots": {
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "theme": "ios";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "maxWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 96;
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
          "theme": "android";
        };
        "definitions": readonly [];
      },
    ];
  };
};
export default artifact;
