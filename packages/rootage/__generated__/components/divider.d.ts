declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "divider";
    "name": "Divider";
  };
  "data": {
    "id": "divider";
    "name": "Divider";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "thickness": {
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
                "thickness": {
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
    ];
  };
};
export default artifact;
