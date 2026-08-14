declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "content-placeholder";
    "name": "Content Placeholder";
  };
  "data": {
    "id": "content-placeholder";
    "name": "Content Placeholder";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "color": {
              "type": "color";
            };
          };
        };
        "asset": {
          "properties": {
            "minWidth": {
              "type": "dimension";
            };
            "maxWidth": {
              "type": "dimension";
            };
            "heightFraction": {
              "type": "number";
              "description": "root slot 대한 asset slot의 높이 비율입니다.";
            };
            "color": {
              "type": "color";
            };
          };
        };
      };
      "variants": {};
      "states": readonly [];
    };
    "rules": readonly [
      {
        "variants": {};
        "states": readonly [];
        "slots": {
          "root": {
            "color": {
              "type": "color";
              "value": "$color.palette.gray-200";
            };
          };
          "asset": {
            "minWidth": {
              "type": "dimension";
              "value": "$dimension.x4";
            };
            "maxWidth": {
              "type": "dimension";
              "value": {
                "value": 160;
                "unit": "px";
              };
            };
            "heightFraction": {
              "type": "number";
              "value": 0.5;
            };
            "color": {
              "type": "color";
              "value": "$color.palette.gray-400";
            };
          };
        };
      },
    ];
  };
};
export default artifact;
