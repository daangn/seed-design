declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "radio-group";
    "name": "Radio Group";
  };
  "data": {
    "id": "radio-group";
    "name": "Radio Group";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "gapY": {
              "type": "dimension";
            };
          };
        };
      };
      "variants": {};
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
                "gapY": {
                  "type": "dimension";
                  "value": "$dimension.x1";
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
