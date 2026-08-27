declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "page-banner-close-button";
    "name": "Page Banner Close Button";
  };
  "data": {
    "id": "page-banner-close-button";
    "name": "Page Banner Close Button";
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
            "marginLeft": {
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
            "neutral": {};
            "positive": {};
            "informative": {};
            "warning": {};
            "critical": {};
            "magic": {
              "description": "AI 기능을 나타냅니다. variant=solid와 조합하여 사용하지 않습니다.";
            };
          };
          "defaultValue": "neutral";
        };
        "variant": {
          "values": {
            "weak": {
              "description": "배경색이 연한 스타일입니다.";
            };
            "solid": {
              "description": "배경색이 진한 스타일입니다.";
            };
          };
          "defaultValue": "weak";
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
                "marginLeft": {
                  "type": "dimension";
                  "value": "$dimension.x2";
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
          "variant": "weak";
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
          "tone": "neutral";
          "variant": "solid";
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
                  "value": "$color.fg.on-neutral-solid";
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
          "tone": "positive";
          "variant": "solid";
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
                  "value": "$color.palette.static-white";
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
          "tone": "informative";
          "variant": "solid";
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
                  "value": "$color.palette.static-white";
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
          "tone": "warning";
          "variant": "solid";
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
                  "value": "$color.palette.static-black-alpha-900";
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
          "tone": "critical";
          "variant": "solid";
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
                  "value": "$color.palette.static-white";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "tone": "magic";
          "variant": "weak";
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
