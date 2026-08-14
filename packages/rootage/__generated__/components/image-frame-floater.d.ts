declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "image-frame-floater";
    "name": "Image Frame Floater";
  };
  "data": {
    "id": "image-frame-floater";
    "name": "Image Frame Floater";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "offset": {
              "type": "dimension";
              "description": "image-frame root slot의 padding property로 대체되었습니다.";
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
            "offset": {
              "type": "dimension";
              "value": {
                "value": 6;
                "unit": "px";
              };
            };
          };
        };
      },
    ];
  };
};
export default artifact;
