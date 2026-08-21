declare const artifact: {
  "kind": "TokenCollections";
  "metadata": {
    "id": "collections";
    "name": "collections";
  };
  "data": readonly [
    {
      "name": "global";
      "modes": readonly [
        {
          "id": "default";
        },
      ];
    },
    {
      "name": "color";
      "modes": readonly [
        {
          "id": "theme-light";
        },
        {
          "id": "theme-dark";
        },
      ];
    },
    {
      "name": "motion";
      "modes": readonly [
        {
          "id": "preferred";
        },
        {
          "id": "reduced";
        },
      ];
    },
    {
      "name": "viewport-width";
      "modes": readonly [
        {
          "id": "base";
          "description": "세로 모드 폰";
        },
        {
          "id": "sm";
          "description": "가로 모드 폰 또는 좁은 태블릿";
        },
        {
          "id": "md";
          "description": "태블릿";
        },
        {
          "id": "lg";
          "description": "데스크톱";
        },
        {
          "id": "xl";
          "description": "넓은 데스크톱";
        },
      ];
    },
  ];
};
export default artifact;
