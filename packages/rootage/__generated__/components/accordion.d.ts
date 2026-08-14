declare const artifact: {
  "kind": "ComponentSpec";
  "metadata": {
    "id": "accordion";
    "name": "Accordion";
  };
  "data": {
    "id": "accordion";
    "name": "Accordion";
    "schema": {
      "slots": {
        "root": {
          "properties": {
            "gap": {
              "type": "dimension";
            };
          };
        };
      };
      "variants": {
        "variant": {
          "values": {
            "inline": {
              "description": "Accordion Item들이 하나의 연속된 목록처럼 표현됩니다. 밀접하게 관련된 항목들을 컴팩트하게 나열할 때 사용합니다.";
            };
            "separated": {
              "description": "각 Accordion Item이 개별 카드 형태로 분리되어 표현됩니다. 항목 간 시각적 독립성이 필요하거나, 각 섹션의 중요도가 동등할 때 사용합니다.";
            };
          };
        };
        "size": {
          "values": {
            "medium": {};
            "large": {};
          };
        };
      };
      "states": readonly [];
    };
    "rules": readonly [
      {
        "variants": {
          "variant": "separated";
          "size": "medium";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "gap": {
              "type": "dimension";
              "value": "$dimension.x3";
            };
          };
        };
      },
      {
        "variants": {
          "variant": "separated";
          "size": "large";
        };
        "states": readonly [];
        "slots": {
          "root": {
            "gap": {
              "type": "dimension";
              "value": "$dimension.x4";
            };
          };
        };
      },
    ];
  };
};
export default artifact;
