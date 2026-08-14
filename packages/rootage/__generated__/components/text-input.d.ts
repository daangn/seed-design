declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "text-input";
    "name": "Text Input";
  };
  "data": {
    "id": "text-input";
    "name": "Text Input";
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
            "paddingY": {
              "type": "dimension";
            };
            "strokeWidth": {
              "type": "dimension";
            };
            "strokeBottomWidth": {
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
        "prefixText": {
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
        "prefixIcon": {
          "properties": {
            "color": {
              "type": "color";
            };
            "size": {
              "type": "dimension";
            };
          };
        };
        "suffixText": {
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
        "suffixIcon": {
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
      "variants": {
        "variant": {
          "values": {
            "outline": {
              "description": "기본 스타일입니다.";
            };
            "underline": {
              "description": "화면에 하나의 Input만 있는 경우 사용을 권장합니다.";
            };
          };
        };
        "size": {
          "values": {
            "large": {
              "description": "뷰포트 너비와 관계없이 사용할 수 있습니다.";
            };
            "medium": {
              "description": "Breakpoint `lg` 이상(데스크톱)에서만 사용하고, 모바일에서는 사용하지 않습니다. 정밀한 선택이 가능한 마우스 입력 환경에서 사이즈를 더 작게 만들고자 할 때 사용합니다.";
            };
          };
        };
        "type": {
          "values": {
            "singleline": {
              "description": "한 줄 입력입니다.";
            };
            "multiline": {
              "description": "여러 줄 입력입니다. 같은 size의 singleline보다 높이가 큽니다.";
            };
          };
        };
      };
      "states": readonly [
        {
          "id": "focused";
          "suppresses": readonly [];
        },
        {
          "id": "invalid";
          "suppresses": readonly [];
        },
        {
          "id": "readonly";
          "suppresses": readonly [];
        },
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
          "prefixText": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-subtle";
            };
            "fontWeight": {
              "type": "number";
              "value": "$font-weight.regular";
            };
          };
          "prefixIcon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-muted";
            };
          };
          "suffixText": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-subtle";
            };
            "fontWeight": {
              "type": "number";
              "value": "$font-weight.regular";
            };
          };
          "suffixIcon": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-muted";
            };
          };
        };
      },
      {
        "variants": {};
        "states": readonly [
          "focused",
        ];
        "slots": {
          "root": {
            "strokeColor": {
              "type": "color";
              "value": "$color.stroke.neutral-contrast";
            };
          };
        };
      },
      {
        "variants": {};
        "states": readonly [
          "invalid",
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
        "variants": {};
        "states": readonly [
          "focused",
          "invalid",
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
        "variants": {};
        "states": readonly [
          "disabled",
        ];
        "slots": {
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
          "prefixText": {
            "color": {
              "type": "color";
              "value": "$color.fg.disabled";
            };
          };
          "prefixIcon": {
            "color": {
              "type": "color";
              "value": "$color.fg.disabled";
            };
          };
          "suffixText": {
            "color": {
              "type": "color";
              "value": "$color.fg.disabled";
            };
          };
          "suffixIcon": {
            "color": {
              "type": "color";
              "value": "$color.fg.disabled";
            };
          };
        };
      },
      {
        "variants": {
          "variant": "outline";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "strokeWidth": {
              "type": "dimension";
              "value": {
                "value": 1;
                "unit": "px";
              };
            };
          };
        };
      },
      {
        "variants": {
          "variant": "outline";
        };
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
          };
        };
      },
      {
        "variants": {
          "variant": "outline";
        };
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
          };
        };
      },
      {
        "variants": {
          "variant": "outline";
        };
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
        "variants": {
          "variant": "outline";
        };
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
        };
      },
      {
        "variants": {
          "variant": "outline";
          "size": "large";
          "type": "singleline";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "minHeight": {
              "type": "dimension";
              "value": "$dimension.x13";
            };
          };
        };
      },
      {
        "variants": {
          "variant": "outline";
          "size": "large";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "gap": {
              "type": "dimension";
              "value": "$dimension.x2_5";
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
          "prefixText": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t5";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t5";
            };
          };
          "prefixIcon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x5";
            };
          };
          "suffixText": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t5";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t5";
            };
          };
          "suffixIcon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x5";
            };
          };
        };
      },
      {
        "variants": {
          "variant": "outline";
          "size": "medium";
          "type": "singleline";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "minHeight": {
              "type": "dimension";
              "value": "$dimension.x10";
            };
          };
        };
      },
      {
        "variants": {
          "variant": "outline";
          "size": "medium";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "gap": {
              "type": "dimension";
              "value": "$dimension.x2";
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
          "prefixText": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t4";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t4";
            };
          };
          "prefixIcon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x4";
            };
          };
          "suffixText": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t4";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t4";
            };
          };
          "suffixIcon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x4";
            };
          };
        };
      },
      {
        "variants": {
          "variant": "underline";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "strokeBottomWidth": {
              "type": "dimension";
              "value": {
                "value": 1;
                "unit": "px";
              };
            };
          };
        };
      },
      {
        "variants": {
          "variant": "underline";
        };
        "states": readonly [
          "focused",
        ];
        "slots": {
          "root": {
            "strokeBottomWidth": {
              "type": "dimension";
              "value": {
                "value": 2;
                "unit": "px";
              };
            };
          };
        };
      },
      {
        "variants": {
          "variant": "underline";
        };
        "states": readonly [
          "invalid",
        ];
        "slots": {
          "root": {
            "strokeBottomWidth": {
              "type": "dimension";
              "value": {
                "value": 2;
                "unit": "px";
              };
            };
          };
        };
      },
      {
        "variants": {
          "variant": "underline";
        };
        "states": readonly [
          "readonly",
        ];
        "slots": {
          "value": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-muted";
            };
          };
          "placeholder": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-muted";
            };
          };
        };
      },
      {
        "variants": {
          "variant": "underline";
          "size": "large";
          "type": "singleline";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "minHeight": {
              "type": "dimension";
              "value": "$dimension.x10";
            };
            "paddingY": {
              "type": "dimension";
              "value": "$dimension.x2";
            };
          };
        };
      },
      {
        "variants": {
          "variant": "underline";
          "size": "large";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "gap": {
              "type": "dimension";
              "value": "$dimension.x2_5";
            };
          };
          "value": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t6";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t6";
            };
          };
          "placeholder": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t6";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t6";
            };
          };
          "prefixText": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t6";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t6";
            };
          };
          "prefixIcon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x6";
            };
          };
          "suffixText": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t6";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t6";
            };
          };
          "suffixIcon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x6";
            };
          };
        };
      },
      {
        "variants": {
          "variant": "underline";
          "size": "medium";
          "type": "singleline";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "minHeight": {
              "type": "dimension";
              "value": {
                "value": 34;
                "unit": "px";
              };
            };
            "paddingY": {
              "type": "dimension";
              "value": "$dimension.x1_5";
            };
          };
        };
      },
      {
        "variants": {
          "variant": "underline";
          "size": "medium";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "gap": {
              "type": "dimension";
              "value": "$dimension.x2";
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
          "prefixText": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t5";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t5";
            };
          };
          "prefixIcon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x5";
            };
          };
          "suffixText": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t5";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t5";
            };
          };
          "suffixIcon": {
            "size": {
              "type": "dimension";
              "value": "$dimension.x5";
            };
          };
        };
      },
      {
        "variants": {
          "size": "large";
          "type": "multiline";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "minHeight": {
              "type": "dimension";
              "value": {
                "value": 94;
                "unit": "px";
              };
            };
            "paddingY": {
              "type": "dimension";
              "value": "$dimension.x3_5";
            };
          };
        };
      },
      {
        "variants": {
          "size": "medium";
          "type": "multiline";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "minHeight": {
              "type": "dimension";
              "value": {
                "value": 82;
                "unit": "px";
              };
            };
            "paddingY": {
              "type": "dimension";
              "value": "$dimension.x3";
            };
          };
        };
      },
    ];
  };
};
export default artifact;
