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
      "states": readonly [];
    };
    "rules": readonly [
      {
        "variants": {};
        "states": readonly [];
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
  };
};
export default artifact;
