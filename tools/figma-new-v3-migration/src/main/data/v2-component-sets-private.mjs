// info: "." prefix가 붙은 피그마 파일들은 extractor에 감지되지 않으므로 수동으로 작성해야 함

export const handle = {
  name: ".handle",
  key: "8a3150b9878119a0b73c0ffb52380741eb13d085",
  componentPropertyDefinitions: {
    label: {
      type: "VARIANT",
      defaultValue: "false",
      variantOptions: ["false"],
    },
  },
};

export const ticks = {
  name: ".Ticks",
  key: "3c6f9f3445dcddf25e71a52568902f3179f92d7d",
  componentPropertyDefinitions: {
    Count: {
      type: "VARIANT",
      defaultValue: "1",
      variantOptions: ["1", "2", "3", "4"],
    },
  },
};

export const range = {
  name: ".Range",
  key: "85e9834224769dfce4888fbf7df0fa52dca43998",
  componentPropertyDefinitions: {
    State: {
      type: "VARIANT",
      defaultValue: "Default",
      variantOptions: ["Default", "Disabled"],
    },
  },
};

export const handles = {
  name: ".Handles",
  key: "f82c49b5ecbac06593c95ac5961416493b5828a7",
  componentPropertyDefinitions: {
    Variant: {
      type: "VARIANT",
      defaultValue: "1",
      variantOptions: ["2", "1"],
    },
  },
};

export const markerGroup = {
  name: ".Marker Group",
  key: "47d9cda7f121bc35084f330284a88825d941160c",
  componentPropertyDefinitions: {
    "6#65932:30": {
      type: "TEXT",
      defaultValue: "value",
    },
    "5#65932:24": {
      type: "TEXT",
      defaultValue: "value",
    },
    "3#65932:12": {
      type: "TEXT",
      defaultValue: "value",
    },
    "2#65932:6": {
      type: "TEXT",
      defaultValue: "value",
    },
    "4#65932:18": {
      type: "TEXT",
      defaultValue: "value",
    },
    "1#65932:0": {
      type: "TEXT",
      defaultValue: "value",
    },
    Markers: {
      type: "VARIANT",
      defaultValue: "2",
      variantOptions: ["2", "3", "4", "5", "6"],
    },
  },
};
