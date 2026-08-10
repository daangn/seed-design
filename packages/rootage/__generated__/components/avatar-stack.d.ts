declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "avatar-stack";
    "name": "Avatar Stack";
  };
  "data": {
    "id": "avatar-stack";
    "name": "Avatar Stack";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "gap": {
              "type": "dimension";
            };
          };
        };
        "item": {
          "properties": {
            "cornerRadius": {
              "type": "dimension";
            };
            "strokeColor": {
              "type": "color";
            };
            "strokeWidth": {
              "type": "dimension";
            };
          };
        };
      };
      "variants": {
        "size": {
          "values": {
            "20": {};
            "24": {};
            "36": {};
            "42": {};
            "48": {};
            "56": {};
            "64": {};
            "80": {};
            "96": {};
            "108": {};
          };
          "defaultValue": "20";
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
              "item": {
                "cornerRadius": {
                  "type": "dimension";
                  "value": "$radius.full";
                };
                "strokeColor": {
                  "type": "color";
                  "value": "$color.bg.layer-default";
                };
              };
            };
          },
        ];
      },
      {
        "variants": {
          "size": "20";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gap": {
                  "type": "dimension";
                  "value": {
                    "value": -5;
                    "unit": "px";
                  };
                };
              };
              "item": {
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 1;
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
          "size": "24";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gap": {
                  "type": "dimension";
                  "value": {
                    "value": -6;
                    "unit": "px";
                  };
                };
              };
              "item": {
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 1;
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
          "size": "36";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gap": {
                  "type": "dimension";
                  "value": {
                    "value": -8;
                    "unit": "px";
                  };
                };
              };
              "item": {
                "strokeWidth": {
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
          "size": "42";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gap": {
                  "type": "dimension";
                  "value": {
                    "value": -10;
                    "unit": "px";
                  };
                };
              };
              "item": {
                "strokeWidth": {
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
          "size": "48";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gap": {
                  "type": "dimension";
                  "value": {
                    "value": -12;
                    "unit": "px";
                  };
                };
              };
              "item": {
                "strokeWidth": {
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
          "size": "56";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gap": {
                  "type": "dimension";
                  "value": {
                    "value": -13;
                    "unit": "px";
                  };
                };
              };
              "item": {
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 3;
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
          "size": "64";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gap": {
                  "type": "dimension";
                  "value": {
                    "value": -16;
                    "unit": "px";
                  };
                };
              };
              "item": {
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 3;
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
          "size": "80";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gap": {
                  "type": "dimension";
                  "value": {
                    "value": -20;
                    "unit": "px";
                  };
                };
              };
              "item": {
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 4;
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
          "size": "96";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gap": {
                  "type": "dimension";
                  "value": {
                    "value": -24;
                    "unit": "px";
                  };
                };
              };
              "item": {
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 5;
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
          "size": "108";
        };
        "definitions": readonly [
          {
            "states": readonly [
              "enabled",
            ];
            "slots": {
              "root": {
                "gap": {
                  "type": "dimension";
                  "value": {
                    "value": -27;
                    "unit": "px";
                  };
                };
              };
              "item": {
                "strokeWidth": {
                  "type": "dimension";
                  "value": {
                    "value": 5;
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
