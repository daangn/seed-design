declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "attachment-input";
    "name": "Attachment Input";
  };
  "data": {
    "id": "attachment-input";
    "name": "Attachment Input";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "gap": {
              "type": "dimension";
            };
          };
          "description": "Attachment Input Dropzone과 Items를 감싸는 컨테이너입니다.";
        };
        "items": {
          "properties": {
            "gap": {
              "type": "dimension";
            };
          };
          "description": "Attachment Input Trigger 및 Attachment Input Items를 감싸는 컨테이너입니다.";
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
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x2";
                };
              };
              "items": {
                "gap": {
                  "type": "dimension";
                  "value": "$dimension.x2";
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
