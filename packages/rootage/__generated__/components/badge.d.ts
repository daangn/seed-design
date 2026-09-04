declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "badge";
    "name": "Badge";
  };
  "data": {
    "id": "badge";
    "name": "Badge";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "minHeight": {
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
            "cornerRadius": {
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
          };
        };
        "prefix": {
          "properties": {
            "size": {
              "type": "dimension";
            };
          };
        };
        "label": {
          "properties": {
            "fontSize": {
              "type": "dimension";
            };
            "lineHeight": {
              "type": "dimension";
            };
            "fontWeight": {
              "type": "number";
            };
            "color": {
              "type": "color";
            };
          };
        };
        "action": {
          "properties": {
            "size": {
              "type": "dimension";
            };
          };
        };
      };
      "variants": {
        "size": {
          "values": {
            "large": {};
            "medium": {};
          };
          "defaultValue": "large";
        };
        "variant": {
          "values": {
            "weak": {
              "description": "반복적인 구조를 가진 환경에서 사용합니다. 배경색이 있는 경우에는 권장하지 않습니다.";
            };
            "solid": {
              "description": "배경이 복잡하거나 이미지 위에 Badge가 겹치는 경우 사용합니다.";
            };
            "outline": {
              "description": "중간 정도의 주목도가 필요한 본문 또는 상세 화면에서 사용합니다.";
            };
          };
          "defaultValue": "weak";
        };
        "tone": {
          "values": {
            "neutral": {
              "description": "상태가 특별히 없거나, 상태값이 명확하지 않은 초기 상태";
            };
            "brand": {};
            "informative": {
              "description": "베타 기능 안내, 사용자 권한 제한, 정보 기반 메시지";
            };
            "positive": {
              "description": "완료, 적용됨, 승인됨, 발행됨, 저장 성공, 검토 통과";
            };
            "warning": {
              "description": "만료 임박, 제출 누락, 필수 정보 부족 등 잠재적 문제 상태";
            };
            "critical": {
              "description": "검수 거절, 제재 상태, 편집 불가, 유효성 검증 실패";
            };
          };
          "defaultValue": "neutral";
        };
      };
    };
    "definitions": readonly [
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
                "minHeight": {
                  "type": "dimension";
                  "value": "$dimension.x6";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x2";
                };
                "paddingY": {
                  "type": "dimension";
                  "value": "$dimension.x1";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r1_5";
                };
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x0_5";
                };
              };
              "prefix": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x3_5";
                };
              };
              "action": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x3_5";
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
                "minHeight": {
                  "type": "dimension";
                  "value": "$dimension.x5";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x1_5";
                };
                "paddingY": {
                  "type": "dimension";
                  "value": "$dimension.x0_5";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r1";
                };
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x0_5";
                };
              };
              "prefix": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x3";
                };
              };
              "action": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x3";
                };
              };
              "label": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t1";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t1";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "variant": "weak";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "label": {
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.medium";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "variant": "solid";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "label": {
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.bold";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "variant": "outline";
        };
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
              };
              "label": {
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.bold";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "neutral";
          "variant": "weak";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-weak";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-muted";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "neutral";
          "variant": "solid";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.gray-800";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.on-neutral-solid";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "neutral";
          "variant": "outline";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.neutral-muted";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-muted";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "brand";
          "variant": "weak";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.brand-weak";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.brand-contrast";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "brand";
          "variant": "solid";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.brand-solid";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.on-brand-solid";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "brand";
          "variant": "outline";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.brand-weak";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.brand";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "informative";
          "variant": "weak";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.informative-weak";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.informative-contrast";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "informative";
          "variant": "solid";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.informative-solid";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.on-informative-solid";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "informative";
          "variant": "outline";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.informative-weak";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.informative";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "positive";
          "variant": "weak";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.positive-weak";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.positive-contrast";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "positive";
          "variant": "solid";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.positive-solid";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.on-positive-solid";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "positive";
          "variant": "outline";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.positive-weak";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.positive";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "warning";
          "variant": "weak";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.warning-weak";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.warning-contrast";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "warning";
          "variant": "solid";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.warning-solid";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.on-warning-solid";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "warning";
          "variant": "outline";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.warning-weak";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.warning";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "critical";
          "variant": "weak";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.critical-weak";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.critical-contrast";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "critical";
          "variant": "solid";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.critical-solid";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.on-critical-solid";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "critical";
          "variant": "outline";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.critical-weak";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.critical";
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
