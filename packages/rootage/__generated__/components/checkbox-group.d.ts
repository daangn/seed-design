declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "checkbox-group";
    "name": "Checkbox Group";
  };
  "data": {
    "id": "checkbox-group";
    "name": "Checkbox Group";
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
