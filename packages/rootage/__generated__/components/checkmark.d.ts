declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "checkmark";
    "name": "Checkmark";
  };
  "data": {
    "id": "checkmark";
    "name": "Checkmark";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "colorDuration": {
              "type": "duration";
            };
            "colorTimingFunction": {
              "type": "cubicBezier";
            };
            "size": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
            "strokeColor": {
              "type": "color";
            };
            "strokeWidth": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "scaleScope": {
              "type": "enum";
              "values": readonly [
                "self",
                "content",
              ];
              "description": "감싸는 컴포넌트가 자체 pressed 피드백을 주는 경우(List Item 등)에는 이 값이 적용되지 않습니다.";
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
            "colorDuration": {
              "type": "duration";
            };
            "colorTimingFunction": {
              "type": "cubicBezier";
            };
          };
        };
      };
      "variants": {
        "variant": {
          "values": {
            "square": {
              "description": "필수 선택 항목이고 사용자가 해당 내용을 인지해야 하는 경우 사용합니다.";
            };
            "ghost": {
              "description": "필수 선택 항목이 아니고, 3개 이하 항목으로 구성되는 경우 사용하는 것을 권장합니다.";
            };
          };
          "defaultValue": "square";
        };
        "tone": {
          "values": {
            "brand": {};
            "neutral": {};
          };
          "defaultValue": "brand";
        };
        "size": {
          "values": {
            "medium": {};
            "large": {};
          };
          "defaultValue": "medium";
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
                "colorDuration": {
                  "type": "duration";
                  "value": "$duration.color-transition";
                };
                "colorTimingFunction": {
                  "type": "cubicBezier";
                  "value": "$timing-function.easing";
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
          "variant": "square";
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
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.neutral-weak";
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
              };
            };
          },
          {
            "states": readonly [
              "enabled",
              "selected",
            ];
            "slots": {
              "root": {
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 0;
                    "unit": "px";
                  };
                };
                "strokeColor": {
                  "type": "color";
                  "value": "#00000000";
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
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.neutral-muted";
                };
              };
              "icon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
            };
          },
          {
            "states": readonly [
              "disabled",
              "selected",
            ];
            "slots": {
              "icon": {
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
          "variant": "square";
          "tone": "brand";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
              "selected",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.brand-solid";
                };
              };
              "icon": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.static-white";
                };
              };
            };
          },
          {
            "states": readonly [
              "pressed",
              "selected",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.brand-solid-pressed";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "variant": "square";
          "tone": "neutral";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
              "selected",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-inverted";
                };
              };
              "icon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-inverted";
                };
              };
            };
          },
          {
            "states": readonly [
              "pressed",
              "selected",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-inverted-pressed";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "variant": "ghost";
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
                  "value": "$color.fg.placeholder";
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
              };
            };
          },
          {
            "states": readonly [
              "disabled",
            ];
            "slots": {
              "icon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
            };
          },
          {
            "states": readonly [
              "disabled",
              "selected",
            ];
            "slots": {
              "icon": {
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
          "variant": "ghost";
          "tone": "brand";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
              "selected",
            ];
            "slots": {
              "icon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.brand";
                };
              };
            };
          },
          {
            "states": readonly [
              "pressed",
              "selected",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.carrot-200";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "variant": "ghost";
          "tone": "neutral";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
              "selected",
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
          {
            "states": readonly [
              "pressed",
              "selected",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.gray-200";
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
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x5";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r1";
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
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x6";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r1";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "variant": "square";
          "size": "medium";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "icon": {
                "size": {
                  "type": "dimension";
                  "value": {
                    "value": 12;
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
          "variant": "square";
          "size": "large";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "icon": {
                "size": {
                  "type": "dimension";
                  "value": {
                    "value": 14;
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
          "variant": "ghost";
          "size": "medium";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "icon": {
                "size": {
                  "type": "dimension";
                  "value": {
                    "value": 14;
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
          "variant": "ghost";
          "size": "large";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "icon": {
                "size": {
                  "type": "dimension";
                  "value": {
                    "value": 18;
                    "unit": "px";
                  };
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
