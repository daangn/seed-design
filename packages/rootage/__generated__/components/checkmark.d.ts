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
        };
        "tone": {
          "values": {
            "brand": {};
            "neutral": {};
          };
        };
        "size": {
          "values": {
            "medium": {};
            "large": {};
          };
        };
      };
      "states": readonly [
        {
          "id": "pressed";
          "suppresses": readonly [];
        },
        {
          "id": "selected";
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
        "variants": {
          "variant": "square";
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
            "strokeColor": {
              "type": "color";
              "value": "$color.stroke.neutral-weak";
            };
          };
        };
      },
      {
        "variants": {
          "variant": "square";
        };
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
        "variants": {
          "variant": "square";
        };
        "states": readonly [
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
        "variants": {
          "variant": "square";
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
        "variants": {
          "variant": "square";
        };
        "states": readonly [
          "selected",
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
        "variants": {
          "variant": "square";
          "tone": "brand";
        };
        "states": readonly [
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
        "variants": {
          "variant": "square";
          "tone": "brand";
        };
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
      {
        "variants": {
          "variant": "square";
          "tone": "neutral";
        };
        "states": readonly [
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
        "variants": {
          "variant": "square";
          "tone": "neutral";
        };
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
      {
        "variants": {
          "variant": "ghost";
        };
        "states": readonly [];
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
        "variants": {
          "variant": "ghost";
        };
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
        "variants": {
          "variant": "ghost";
        };
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
        "variants": {
          "variant": "ghost";
        };
        "states": readonly [
          "selected",
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
        "variants": {
          "variant": "ghost";
          "tone": "brand";
        };
        "states": readonly [
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
        "variants": {
          "variant": "ghost";
          "tone": "brand";
        };
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
      {
        "variants": {
          "variant": "ghost";
          "tone": "neutral";
        };
        "states": readonly [
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
        "variants": {
          "variant": "ghost";
          "tone": "neutral";
        };
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
      {
        "variants": {
          "size": "medium";
        };
        "states": readonly [];
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
      {
        "variants": {
          "size": "large";
        };
        "states": readonly [];
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
      {
        "variants": {
          "variant": "square";
          "size": "medium";
        };
        "states": readonly [];
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
      {
        "variants": {
          "variant": "square";
          "size": "large";
        };
        "states": readonly [];
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
      {
        "variants": {
          "variant": "ghost";
          "size": "medium";
        };
        "states": readonly [];
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
      {
        "variants": {
          "variant": "ghost";
          "size": "large";
        };
        "states": readonly [];
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
  };
};
export default artifact;
