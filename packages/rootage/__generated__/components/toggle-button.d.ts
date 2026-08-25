declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "toggle-button";
    "name": "Toggle Button";
  };
  "data": {
    "id": "toggle-button";
    "name": "Toggle Button";
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
            "color": {
              "type": "color";
            };
            "minHeight": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "gap": {
              "type": "dimension";
            };
            "paddingX": {
              "type": "dimension";
            };
            "paddingY": {
              "type": "dimension";
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
        "label": {
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
        "progressCircle": {
          "properties": {
            "trackColor": {
              "type": "color";
            };
            "rangeColor": {
              "type": "color";
            };
            "size": {
              "type": "dimension";
            };
            "thickness": {
              "type": "dimension";
            };
          };
        };
      };
      "variants": {
        "variant": {
          "values": {
            "brandSolid": {
              "description": "브랜드 컬러로 강조된 스타일입니다.";
            };
            "neutralWeak": {
              "description": "기본적인 토글 스타일입니다.";
            };
          };
          "defaultValue": "brandSolid";
        };
        "size": {
          "values": {
            "xsmall": {};
            "small": {};
          };
          "defaultValue": "xsmall";
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
              "label": {
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.bold";
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
          "variant": "brandSolid";
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
                  "value": "$color.palette.static-white";
                };
              };
              "prefixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.static-white";
                };
              };
              "suffixIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.static-white";
                };
              };
              "progressCircle": {
                "trackColor": {
                  "type": "color";
                  "value": "$color.palette.static-white-alpha-300";
                };
                "rangeColor": {
                  "type": "color";
                  "value": "$color.palette.static-white";
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
                  "value": "$color.bg.brand-solid-pressed";
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
                  "value": "$color.bg.neutral-weak";
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
              "progressCircle": {
                "trackColor": {
                  "type": "color";
                  "value": "$color.palette.gray-500";
                };
                "rangeColor": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
            };
          },
          {
            "states": readonly [
              "selected",
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
              "label": {
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
          {
            "states": readonly [
              "loading",
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
              "selected",
              "loading",
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
          "variant": "neutralWeak";
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
              "progressCircle": {
                "trackColor": {
                  "type": "color";
                  "value": "$color.palette.gray-500";
                };
                "rangeColor": {
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
          {
            "states": readonly [
              "selected",
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
              "progressCircle": {
                "trackColor": {
                  "type": "color";
                  "value": "$color.palette.gray-500";
                };
                "rangeColor": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
              };
            };
          },
          {
            "states": readonly [
              "selected",
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
              "label": {
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
          {
            "states": readonly [
              "loading",
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
              "loading",
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
          "size": "xsmall";
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
                  "value": "$dimension.x8";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.full";
                };
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x1";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x3_5";
                };
                "paddingY": {
                  "type": "dimension";
                  "value": "$dimension.x1_5";
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
              "label": {
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t3";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t3";
                };
              };
              "progressCircle": {
                "size": {
                  "type": "dimension";
                  "value": {
                    "value": 14;
                    "unit": "px";
                  };
                };
                "thickness": {
                  "type": "dimension";
                  "value": {
                    "value": 2;
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
          "size": "small";
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
                  "value": "$dimension.x9";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.full";
                };
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x1";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x4";
                };
                "paddingY": {
                  "type": "dimension";
                  "value": "$dimension.x2";
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
              "progressCircle": {
                "size": {
                  "type": "dimension";
                  "value": {
                    "value": 14;
                    "unit": "px";
                  };
                };
                "thickness": {
                  "type": "dimension";
                  "value": {
                    "value": 2;
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
