declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "radiomark";
    "name": "Radiomark";
  };
  "data": {
    "id": "radiomark";
    "name": "Radiomark";
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
            "strokeWidth": {
              "type": "dimension";
            };
            "strokeColor": {
              "type": "color";
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
              "description": "감싸는 컴포넌트가 자체 pressed 피드백을 주는 경우(List Item, Select Box 등)에는 이 값이 적용되지 않습니다.";
            };
          };
        };
        "icon": {
          "properties": {
            "size": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
            };
            "cornerRadius": {
              "type": "dimension";
            };
          };
        };
      };
      "variants": {
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
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.full";
                };
              };
              "icon": {
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.full";
                };
              };
            };
          },
          {
            "states": readonly [
              "enabled",
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
              "enabled",
              "selected",
              "pressed",
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
          {
            "states": readonly [
              "disabled",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.gray-300";
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
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.transparent";
                };
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 1;
                    "unit": "px";
                  };
                };
                "strokeColor": {
                  "type": "color";
                  "value": "$color.palette.gray-300";
                };
              };
              "icon": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.gray-300";
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
              "selected",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-solid";
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
              "enabled",
              "selected",
              "pressed",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-solid-pressed";
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
                  "value": "$color.palette.gray-300";
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
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.transparent";
                };
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 1;
                    "unit": "px";
                  };
                };
                "strokeColor": {
                  "type": "color";
                  "value": "$color.palette.gray-300";
                };
              };
              "icon": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.gray-300";
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
              };
              "icon": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x2";
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
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x2_5";
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
              };
              "icon": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x2_5";
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
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x3";
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
