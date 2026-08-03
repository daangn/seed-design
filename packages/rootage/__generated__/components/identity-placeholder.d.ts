declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "identity-placeholder";
    "name": "Identity Placeholder";
  };
  "data": {
    "id": "identity-placeholder";
    "name": "Identity Placeholder";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "color": {
              "type": "color";
            };
          };
        };
        "image": {
          "properties": {
            "color": {
              "type": "color";
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
                "color": {
                  "type": "color";
                  "value": "$color.palette.gray-500";
                };
              };
              "image": {
                "color": {
                  "type": "color";
                  "value": "$color.palette.static-white-alpha-800";
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
