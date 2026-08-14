declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "tag-group";
    "name": "Tag Group";
  };
  "data": {
    "id": "tag-group";
    "name": "Tag Group";
    "schema": {
      "slots": {
        "separator": {
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
      };
      "variants": {
        "size": {
          "values": {
            "t2": {};
            "t3": {};
            "t4": {};
          };
        };
      };
      "states": readonly [];
    };
    "rules": readonly [
      {
        "variants": {};
        "states": readonly [];
        "slots": {
          "separator": {
            "color": {
              "type": "color";
              "value": "$color.palette.gray-600";
            };
            "fontWeight": {
              "type": "number";
              "value": "$font-weight.regular";
            };
          };
        };
      },
      {
        "variants": {
          "size": "t2";
        };
        "states": readonly [];
        "slots": {
          "separator": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t2";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t2";
            };
          };
        };
      },
      {
        "variants": {
          "size": "t3";
        };
        "states": readonly [];
        "slots": {
          "separator": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t3";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t3";
            };
          };
        };
      },
      {
        "variants": {
          "size": "t4";
        };
        "states": readonly [];
        "slots": {
          "separator": {
            "fontSize": {
              "type": "dimension";
              "value": "$font-size.t4";
            };
            "lineHeight": {
              "type": "dimension";
              "value": "$line-height.t4";
            };
          };
        };
      },
    ];
  };
};
export default artifact;
