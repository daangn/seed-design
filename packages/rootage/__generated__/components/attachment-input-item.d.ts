declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "attachment-input-item";
    "name": "Attachment Input Item";
  };
  "data": {
    "id": "attachment-input-item";
    "name": "Attachment Input Item";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "width": {
              "type": "dimension";
            };
            "height": {
              "type": "dimension";
            };
            "paddingX": {
              "type": "dimension";
            };
            "gap": {
              "type": "dimension";
            };
            "color": {
              "type": "color";
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
            "opacity": {
              "type": "number";
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
        "thumbnail": {
          "properties": {
            "color": {
              "type": "color";
            };
            "size": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
          };
        };
        "thumbnailIcon": {
          "properties": {
            "color": {
              "type": "color";
            };
            "size": {
              "type": "dimension";
            };
          };
        };
        "name": {
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
        "size": {
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
        "backdrop": {
          "properties": {
            "color": {
              "type": "color";
            };
          };
        };
        "removeButtonMask": {
          "properties": {
            "offset": {
              "type": "dimension";
            };
            "size": {
              "type": "dimension";
            };
          };
          "description": "dragging 상태에서는 표시되지 않습니다.";
        };
        "badge": {
          "properties": {
            "color": {
              "type": "color";
            };
            "height": {
              "type": "dimension";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "paddingX": {
              "type": "dimension";
            };
          };
        };
        "badgeLabel": {
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
        "durationBadge": {
          "properties": {
            "color": {
              "type": "color";
            };
            "cornerRadius": {
              "type": "dimension";
            };
            "paddingX": {
              "type": "dimension";
            };
            "paddingY": {
              "type": "dimension";
            };
            "offset": {
              "type": "dimension";
              "description": "항목의 왼쪽 끝과 위 끝에서 떨어진 거리입니다.";
            };
            "backdropBlur": {
              "type": "dimension";
              "description": "백드롭 블러의 Gaussian 표준편차입니다. CSS `blur()`와 같은 기준이며, Figma Background blur 값의 절반에 해당합니다.";
            };
          };
        };
        "durationBadgeLabel": {
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
          "description": "Unicode CLDR의 `en` 로케일에 정의된 `durationUnit` 패턴을 기준으로, 1시간 미만은 `ms`, 1시간 이상은 `hms`를 사용합니다. 초 미만은 버림 처리하며, 24시간을 초과하더라도 일 단위로 분리하지 않고 시간 단위로 누적하여 표시합니다.";
        };
      };
      "variants": {
        "type": {
          "values": {
            "file": {};
            "image": {};
          };
          "defaultValue": "file";
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
                "height": {
                  "type": "dimension";
                  "value": {
                    "value": 80;
                    "unit": "px";
                  };
                };
                "color": {
                  "type": "color";
                  "value": "$color.bg.transparent";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r3";
                };
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 1;
                    "unit": "px";
                  };
                };
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x2_5";
                };
              };
              "thumbnail": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.neutral-weak";
                };
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x12";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r2";
                };
              };
              "thumbnailIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-subtle";
                };
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x6";
                };
              };
              "name": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral";
                };
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t2";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t2";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.medium";
                };
              };
              "size": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.neutral-subtle";
                };
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t1";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t1";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.regular";
                };
              };
              "removeButtonMask": {
                "offset": {
                  "type": "dimension";
                  "value": "$dimension.x1_5";
                };
                "size": {
                  "type": "dimension";
                  "value": "$dimension.x6";
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
          "type": "file";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "width": {
                  "type": "dimension";
                  "value": {
                    "value": 160;
                    "unit": "px";
                  };
                };
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.neutral-weak";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x4";
                };
              };
            };
          },
          {
            "states": readonly [
              "readonly",
            ];
            "slots": {
              "thumbnailIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
              "name": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
              "size": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
            };
          },
          {
            "states": readonly [
              "dragging",
            ];
            "slots": {
              "thumbnailIcon": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
              "name": {
                "color": {
                  "type": "color";
                  "value": "$color.fg.disabled";
                };
              };
              "size": {
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
          "type": "image";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "width": {
                  "type": "dimension";
                  "value": {
                    "value": 80;
                    "unit": "px";
                  };
                };
                "strokeColor": {
                  "type": "color";
                  "value": "$color.stroke.neutral-subtle";
                };
              };
              "backdrop": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.overlay";
                };
              };
              "badge": {
                "color": {
                  "type": "color";
                  "value": "$color.bg.overlay";
                };
                "height": {
                  "type": "dimension";
                  "value": "$dimension.x6";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.r3";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x1";
                };
              };
              "badgeLabel": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.static-white";
                };
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t2";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t2";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.medium";
                };
              };
              "durationBadge": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.static-black-alpha-800";
                };
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.full";
                };
                "paddingX": {
                  "type": "dimension";
                  "value": "$dimension.x1_5";
                };
                "paddingY": {
                  "type": "dimension";
                  "value": "$dimension.x0_5";
                };
                "offset": {
                  "type": "dimension";
                  "value": "$dimension.x1_5";
                };
                "backdropBlur": {
                  "type": "dimension";
                  "value": {
                    "value": 2;
                    "unit": "px";
                  };
                };
              };
              "durationBadgeLabel": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.static-white";
                };
                "fontSize": {
                  "type": "dimension";
                  "value": "$font-size.t1";
                };
                "lineHeight": {
                  "type": "dimension";
                  "value": "$line-height.t1";
                };
                "fontWeight": {
                  "type": "number";
                  "value": "$font-weight.medium";
                };
              };
            };
          },
          {
            "states": readonly [
              "readonly",
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
              "dragging",
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
    ];
  };
};
export default artifact;
