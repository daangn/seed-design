declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "chip";
    "name": "Chip";
    "lastUpdated": "25-07-17";
  };
  "data": {
    "id": "chip";
    "name": "Chip";
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
            "strokeColor": {
              "type": "color";
            };
            "strokeWidth": {
              "type": "dimension";
            };
            "height": {
              "type": "dimension";
            };
            "paddingX": {
              "type": "dimension";
            };
            "minWidth": {
              "type": "dimension";
            };
            "colorDuration": {
              "type": "duration";
            };
            "colorTimingFunction": {
              "type": "cubicBezier";
            };
            "opacity": {
              "type": "number";
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
            "paddingX": {
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
            "paddingLeft": {
              "type": "dimension";
            };
          };
          "description": "Icon, Avatar, Image를 넣을 수 있습니다. 들어오는 요소에 따라 좌측 여백이 달라집니다.";
        };
        "prefixAvatar": {
          "properties": {
            "size": {
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
            "paddingRight": {
              "type": "dimension";
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
        "variant": {
          "values": {
            "solid": {
              "description": "기본 스타일입니다.";
            };
            "outlineStrong": {
              "description": "명확한 구분이 필요한 경우 사용합니다.";
            };
            "outlineWeak": {
              "description": "Selection 사용 시 주목도가 낮은 스타일로 권장됩니다.";
            };
          };
          "defaultValue": "solid";
        };
        "size": {
          "values": {
            "small": {};
            "medium": {};
            "large": {};
          };
          "defaultValue": "small";
        };
        "layout": {
          "values": {
            "withText": {};
            "iconOnly": {};
          };
          "defaultValue": "withText";
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
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.full";
                };
              };
              "prefixIcon": {
                "paddingLeft": {
                  "type": "dimension";
                  "value": "$dimension.x1_5";
                };
              };
              "prefixAvatar": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x6";
                };
              };
              "suffixIcon": {
                "paddingRight": {
                  "type": "dimension";
                  "value": "$dimension.x1_5";
                };
              };
              "label": {
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.medium";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x1_5";
                };
              };
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
                  "value": "$color.bg.neutral-weak-alpha";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "prefixIcon": {
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
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-weak-alpha-pressed";
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
                "opacity": {
                  "type": "number";
                  "value": 0.5;
                };
              };
            };
          },
          {
            "states": readonly [
              "selected",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-solid";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-inverted";
                };
              };
              "prefixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-inverted";
                };
              };
              "suffixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-inverted";
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
              "selected",
              " pressed",
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
              "selected",
              " disabled",
            ];
            "slots": {
              "root": {
                "opacity": {
                  "type": "number";
                  "value": 0.5;
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "variant": "outlineStrong";
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
                  "value": "$color.bg.transparent";
                };
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.neutral-muted";
                };
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 1;
                    "unit": "px";
                  };
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "prefixIcon": {
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
              "root": {
                "opacity": {
                  "type": "number";
                  "value": 0.5;
                };
              };
            };
          },
          {
            "states": readonly [
              "selected",
            ];
            "slots": {
              "root": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-solid";
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-inverted";
                };
              };
              "prefixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-inverted";
                };
              };
              "suffixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-inverted";
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
              "selected",
              " pressed",
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
              "selected",
              " disabled",
            ];
            "slots": {
              "root": {
                "opacity": {
                  "type": "number";
                  "value": 0.5;
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "variant": "outlineWeak";
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
                  "value": "$color.bg.transparent";
                };
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.neutral-muted";
                };
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 1;
                    "unit": "px";
                  };
                };
              };
              "label": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
              "prefixIcon": {
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
              "root": {
                "opacity": {
                  "type": "number";
                  "value": 0.5;
                };
              };
            };
          },
          {
            "states": readonly [
              "selected",
            ];
            "slots": {
              "root": {
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.neutral-contrast";
                };
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-weak";
                };
              };
            };
          },
          {
            "states": readonly [
              "selected",
              " pressed",
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
          {
            "states": readonly [
              "selected",
              " disabled",
            ];
            "slots": {
              "root": {
                "opacity": {
                  "type": "number";
                  "value": 0.5;
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "size": "small";
        };
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
                    "value": 32;
                    "unit": "px";
                  };
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x1_5";
                };
              };
              "label": {
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
                  "value": "$dimension.x3_5";
                };
              };
              "suffixIcon": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x3_5";
                };
              };
              "prefixAvatar": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x5";
                };
              };
              "icon": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x3_5";
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
                "height": {
                  "type": "dimension";
                  "value": {
                    "value": 36;
                    "unit": "px";
                  };
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x2";
                };
              };
              "label": {
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
              "suffixIcon": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x3_5";
                };
              };
              "prefixAvatar": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x6";
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
                "height": {
                  "type": "dimension";
                  "value": {
                    "value": 40;
                    "unit": "px";
                  };
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x2_5";
                };
              };
              "label": {
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
                "paddingLeft": {
                  "type": "dimension";
                  "value": "$dimension.x1_5";
                };
              };
              "suffixIcon": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x4";
                };
              };
              "prefixAvatar": {
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x7";
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
        ];
      },
      {
        "variants": {
          "size": "small";
          "layout": "withText";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "minWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 44;
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
          "size": "medium";
          "layout": "withText";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "minWidth": {
                  "type": "dimension";
                  "value": "$dimension.x12";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "size": "large";
          "layout": "withText";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "minWidth": {
                  "type": "dimension";
                  "value": "$dimension.x13";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "size": "small";
          "layout": "iconOnly";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "minWidth": {
                  "type": "dimension";
                  "value": "$dimension.x8";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "size": "medium";
          "layout": "iconOnly";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "minWidth": {
                  "type": "dimension";
                  "value": "$dimension.x9";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "size": "large";
          "layout": "iconOnly";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "minWidth": {
                  "type": "dimension";
                  "value": "$dimension.x10";
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
