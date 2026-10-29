declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "segmented-text-input";
    "name": "Segmented Text Input";
  };
  "data": {
    "id": "segmented-text-input";
    "name": "Segmented Text Input";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "gap": {
              "type": "dimension";
            };
            "minHeight": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "paddingX": {
              "type": "dimension";
            };
            "strokeWidth": {
              "type": "dimension";
            };
            "strokeColor": {
              "type": "color";
            };
            "color": {
              "type": "color";
            };
            "strokeDuration": {
              "type": "duration";
              "description": "enabled 상태의 stroke 위에 focused/invalid 상태의 stroke가 fade in/out 되는 데에 걸리는 시간입니다. stroke 두께나 색상 자체를 transition하지 않습니다.";
            };
            "strokeTimingFunction": {
              "type": "cubicBezier";
            };
          };
        };
        "value": {
          "properties": {
            "color": {
              "type": "color";
            };
            "fontWeight": {
              "type": "number";
            };
            "fontSize": {
              "type": "dimension";
            };
            "lineHeight": {
              "type": "dimension";
            };
          };
        };
        "placeholder": {
          "properties": {
            "color": {
              "type": "color";
            };
            "fontWeight": {
              "type": "number";
            };
            "fontSize": {
              "type": "dimension";
            };
            "lineHeight": {
              "type": "dimension";
            };
          };
        };
        "maskedPlaceholder": {
          "properties": {
            "color": {
              "type": "color";
              "description": "빈 masked Segment에 표시하는 placeholder 불릿의 색상입니다.";
            };
          };
        };
        "separator": {
          "properties": {
            "color": {
              "type": "color";
            };
            "fontWeight": {
              "type": "number";
            };
            "fontSize": {
              "type": "dimension";
            };
            "lineHeight": {
              "type": "dimension";
            };
          };
        };
        "staticText": {
          "properties": {
            "color": {
              "type": "color";
              "description": "Segment 앞뒤나 Segment 자리에 고정으로 표시하는 정적 텍스트(불릿 등)의 색상입니다.";
            };
            "fontWeight": {
              "type": "number";
            };
            "fontSize": {
              "type": "dimension";
            };
            "lineHeight": {
              "type": "dimension";
            };
          };
        };
      };
      "variants": {
        "size": {
          "values": {
            "large": {
              "description": "뷰포트 너비와 관계없이 사용할 수 있습니다.";
            };
            "medium": {
              "description": "Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.";
            };
          };
          "defaultValue": "large";
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
                "strokeDuration": {
                  "type": "duration";
                  "value": {
                    "value": 0.1;
                    "unit": "s";
                  };
                };
                "strokeTimingFunction": {
                  "type": "cubicBezier";
                  "value": "$timing-function.easing";
                };
              };
              "value": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.regular";
                };
              };
              "placeholder": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.placeholder";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.regular";
                };
              };
              "maskedPlaceholder": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.placeholder";
                };
              };
              "separator": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.placeholder";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.regular";
                };
              };
              "staticText": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.regular";
                };
              };
            };
          },
          {
            "states": readonly [
              "focused",
            ];
            "slots": {
              "root": {
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 2;
                    "unit": "px";
                  };
                };
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.neutral-contrast";
                };
              };
            };
          },
          {
            "states": readonly [
              "invalid",
            ];
            "slots": {
              "root": {
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 2;
                    "unit": "px";
                  };
                };
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.critical-solid";
                };
              };
            };
          },
          {
            "states": readonly [
              "invalid",
              "focused",
            ];
            "slots": {
              "root": {
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.critical-solid";
                };
              };
            };
          },
          {
            "states": readonly [
              "readonly",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.disabled";
                };
              };
            };
          },
          {
            "states": readonly [
              "disabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.disabled";
                };
              };
              "value": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
              "placeholder": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
              "maskedPlaceholder": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
              "separator": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
              "staticText": {
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
          "size": "large";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x2_5";
                };
                "minHeight": {
                  "type": "dimension";
                  "value": "$dimension.x13";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r3";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x4";
                };
              };
              "value": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t5";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t5";
                };
              };
              "placeholder": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t5";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t5";
                };
              };
              "separator": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t5";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t5";
                };
              };
              "staticText": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t5";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t5";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "size": "medium";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x2";
                };
                "minHeight": {
                  "type": "dimension";
                  "value": "$dimension.x10";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r2";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x3_5";
                };
              };
              "value": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t4";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t4";
                };
              };
              "placeholder": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t4";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t4";
                };
              };
              "separator": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t4";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t4";
                };
              };
              "staticText": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t4";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t4";
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
