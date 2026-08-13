declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "callout";
    "name": "Callout";
  };
  "data": {
    "id": "callout";
    "name": "Callout";
    "schema": {
      "slots": {
        "root": {
          "properties": {
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
            "minHeight": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
            "gradient": {
              "type": "gradient";
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
        "prefixIcon": {
          "properties": {
            "size": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
          };
          "description": "아이콘은 Fill 타입 사용을 권장합니다.";
        };
        "title": {
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
        "description": {
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
        "link": {
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
          "description": "root가 클릭 영역인 Actionable Callout에서는 표시를 권장하지 않습니다.";
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
      "variants": {
        "tone": {
          "values": {
            "neutral": {
              "description": "일반적인 정보를 전달합니다.";
            };
            "informative": {
              "description": "유용한 정보를 제공합니다.";
            };
            "positive": {
              "description": "긍정적인 상태를 나타냅니다.";
            };
            "warning": {
              "description": "주의가 필요한 상태를 나타냅니다.";
            };
            "critical": {
              "description": "중요한 문제를 나타냅니다.";
            };
            "magic": {
              "description": "AI 기능을 나타냅니다.";
            };
          };
          "defaultValue": "neutral";
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
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x3_5";
                };
                "paddingY": {
                  "type": "dimension";
                  "value": "$dimension.x3_5";
                };
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x3";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r2_5";
                };
                "minHeight": {
                  "type": "dimension";
                  "value": {
                    "value": 50;
                    "unit": "px";
                  };
                };
              };
              "prefixIcon": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x4";
                };
              };
              "title": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t4";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t4";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.bold";
                };
              };
              "description": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t4";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t4";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.regular";
                };
              };
              "link": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t4";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t4";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.regular";
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
            "states": readonly [
              "pressed",
            ];
            "slots": {
              "root": {
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
          "tone": "neutral";
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
              "prefixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "title": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "description": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "link": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "suffixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
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
                  "value": "$color.bg.neutral-weak-pressed";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "informative";
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
              "prefixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.informative-contrast";
                };
              };
              "title": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.informative-contrast";
                };
              };
              "description": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.informative-contrast";
                };
              };
              "link": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.informative-contrast";
                };
              };
              "suffixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.informative-contrast";
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
                  "value": "$color.bg.informative-weak-pressed";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "positive";
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
              "prefixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.positive-contrast";
                };
              };
              "title": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.positive-contrast";
                };
              };
              "description": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.positive-contrast";
                };
              };
              "link": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.positive-contrast";
                };
              };
              "suffixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.positive-contrast";
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
                  "value": "$color.bg.positive-weak-pressed";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "warning";
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
              "prefixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.warning-contrast";
                };
              };
              "title": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.warning-contrast";
                };
              };
              "description": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.warning-contrast";
                };
              };
              "link": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.warning-contrast";
                };
              };
              "suffixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.warning-contrast";
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
                  "value": "$color.bg.warning-weak-pressed";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "critical";
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
              "prefixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.critical-contrast";
                };
              };
              "title": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.critical-contrast";
                };
              };
              "description": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.critical-contrast";
                };
              };
              "link": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.critical-contrast";
                };
              };
              "suffixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.critical-contrast";
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
                  "value": "$color.bg.critical-weak-pressed";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "magic";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gradient": {
                  "type": "gradient";
                  "value": "$gradient.glow-magic";
                };
              };
              "prefixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "title": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "description": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "link": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "suffixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
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
                "gradient": {
                  "type": "gradient";
                  "value": "$gradient.glow-magic-pressed";
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
