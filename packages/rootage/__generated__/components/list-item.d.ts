declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "list-item";
    "name": "List Item";
  };
  "data": {
    "id": "list-item";
    "name": "List Item";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "paddingY": {
              "type": "dimension";
            };
            "paddingX": {
              "type": "dimension";
            };
            "colorDuration": {
              "type": "duration";
            };
            "colorTimingFunction": {
              "type": "cubicBezier";
            };
            "color": {
              "type": "color";
            };
            "marginX": {
              "type": "dimension";
              "description": "pressed 시 배경 레이어는 좌우 폭이 marginX만큼 줄어들고, 배경 레이어 위 요소들이 위치하는 레이아웃 레이어는 scale로 인해 전체적으로 줄어드는 형태로 두 레이어가 별개로 작동합니다. 이 값은 OS 동작 줄이기 설정의 영향을 받지 않습니다.";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "marginDuration": {
              "type": "duration";
            };
            "marginTimingFunction": {
              "type": "cubicBezier";
            };
            "borderRadiusDuration": {
              "type": "duration";
            };
            "borderRadiusTimingFunction": {
              "type": "cubicBezier";
            };
            "contentScale": {
              "type": "number";
              "description": "pressed 시 배경 레이어는 좌우 폭이 marginX만큼 줄어들고, 배경 레이어 위 요소들이 위치하는 레이아웃 레이어는 scale로 인해 전체적으로 줄어드는 형태로 두 레이어가 별개로 작동합니다.";
            };
            "contentScaleDuration": {
              "type": "duration";
            };
            "contentScaleTimingFunction": {
              "type": "cubicBezier";
            };
          };
        };
        "body": {
          "properties": {
            "gap": {
              "type": "dimension";
            };
            "paddingRight": {
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
        "detail": {
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
        "prefix": {
          "properties": {
            "paddingRight": {
              "type": "dimension";
            };
          };
        };
        "prefixIcon": {
          "properties": {
            "size": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
          };
        };
        "suffix": {
          "properties": {
            "gap": {
              "type": "dimension";
            };
          };
        };
        "suffixText": {
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
        "suffixIcon": {
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
          "id": "highlighted";
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
            "paddingY": {
              "type": "dimension";
              "value": "$dimension.x3";
            };
            "paddingX": {
              "type": "dimension";
              "value": "$dimension.spacing-x.global-gutter";
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
            "marginDuration": {
              "type": "duration";
              "value": "$duration.d3";
            };
            "marginTimingFunction": {
              "type": "cubicBezier";
              "value": "$timing-function.easing";
            };
            "borderRadiusDuration": {
              "type": "duration";
              "value": "$duration.d3";
            };
            "borderRadiusTimingFunction": {
              "type": "cubicBezier";
              "value": "$timing-function.easing";
            };
            "contentScaleDuration": {
              "type": "duration";
              "value": "$duration.pressed-scale";
            };
            "contentScaleTimingFunction": {
              "type": "cubicBezier";
              "value": "$timing-function.pressed-scale";
            };
          };
          "body": {
            "gap": {
              "type": "dimension";
              "value": "$dimension.x0_5";
            };
            "paddingRight": {
              "type": "dimension";
              "value": "$dimension.x2_5";
            };
          };
          "title": {
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
          "detail": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-subtle";
            };
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t3";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t3";
            };
            "fontWeight": {
              "type": "number";
              "value": "$font-weight.regular";
            };
          };
          "prefix": {
            "paddingRight": {
              "type": "dimension";
              "value": "$dimension.x3";
            };
          };
          "prefixIcon": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 22;
                "unit": "px";
              };
            };
            "color": {
              "type": "color";
              "value": "$color.fg.neutral";
            };
          };
          "suffix": {
            "gap": {
              "type": "dimension";
              "value": "$dimension.x1";
            };
          };
          "suffixText": {
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-subtle";
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
          "suffixIcon": {
            "size": {
              "type": "dimension";
              "value": {
                "value": 18;
                "unit": "px";
              };
            };
            "color": {
              "type": "color";
              "value": "$color.fg.neutral-subtle";
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
              "value": "$color.bg.transparent-pressed";
            };
            "marginX": {
              "type": "dimension";
              "value": "$dimension.x1_5";
            };
            "cornerRadius": {
              "type": "dimension";
              "value": "$dimension.x2_5";
            };
            "contentScale": {
              "type": "number";
              "value": "$scale.s97";
            };
          };
        };
      },
      {
        "variants": {};
        "states": readonly [
          "highlighted",
        ];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.bg.brand-weak";
            };
          };
        };
      },
      {
        "variants": {};
        "states": readonly [
          "pressed",
          "highlighted",
        ];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.bg.brand-weak-pressed";
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
          "title": {
            "color": {
              "type": "color";
              "value": "$color.fg.disabled";
            };
          };
          "detail": {
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
          "suffixIcon": {
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
