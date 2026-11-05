declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "callout-close-button";
    "name": "Callout Close Button";
  };
  "data": {
    "id": "callout-close-button";
    "name": "Callout Close Button";
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
            "size": {
              "type": "dimension";
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
        "icon": {
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
                "color": {
                  "type": "color";
                  "value": "$color.bg.transparent";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r2";
                };
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x10";
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
              "icon": {
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
          "tone": "neutral";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "icon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
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
              "icon": {
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
          "tone": "positive";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "icon": {
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
          "tone": "warning";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "icon": {
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
          "tone": "critical";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "icon": {
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
          "tone": "magic";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "icon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
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
