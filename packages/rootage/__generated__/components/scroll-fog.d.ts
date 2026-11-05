declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "scroll-fog";
    "name": "Scroll Fog";
  };
  "data": {
    "id": "scroll-fog";
    "name": "Scroll Fog";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "gradient": {
              "type": "gradient";
            };
            "size": {
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
                "gradient": {
                  "type": "gradient";
                  "value": "$gradient.fade-mask";
                };
                "size": {
                  "type": "dimension";
                  "value": {
                    "value": 20;
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
