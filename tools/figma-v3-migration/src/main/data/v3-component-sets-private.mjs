// info: "." prefix가 붙은 피그마 파일들은 extractor에 감지되지 않으므로 수동으로 작성해야 함

export const itemTabHug = {
  name: ".Item / Tab (Hug)",
  key: "c242492543b327ceb84fa9933841512fc62a898c",
  componentPropertyDefinitions: {
    "Label#4478:2": {
      type: "TEXT",
      defaultValue: "라벨",
    },
    Size: {
      type: "VARIANT",
      defaultValue: "Small",
      variantOptions: ["Small", "Medium"],
    },
    Notification: {
      type: "VARIANT",
      defaultValue: "False",
      variantOptions: ["True", "False"],
    },
    State: {
      type: "VARIANT",
      defaultValue: "Selected",
      variantOptions: ["Enabled", "Selected", "Disabled"],
    },
  },
};

export const itemTabFill = {
  name: ".Item / Tab (Fill)",
  key: "7275293344efb40ee9a3f5248ba2659b94a0b305",
  componentPropertyDefinitions: {
    "Label#4478:2": {
      type: "TEXT",
      defaultValue: "라벨",
    },
    Size: {
      type: "VARIANT",
      defaultValue: "Small",
      variantOptions: ["Small", "Medium"],
    },
    Notification: {
      type: "VARIANT",
      defaultValue: "False",
      variantOptions: ["True", "False"],
    },
    State: {
      type: "VARIANT",
      defaultValue: "Selected",
      variantOptions: ["Enabled", "Selected", "Disabled"],
    },
  },
};

export const itemTicks = {
  name: ".Item / Ticks",
  key: "ef3e7aa4493e786b0c5d1d433cfda3cce715abbe",
  componentPropertyDefinitions: {
    Count: {
      type: "VARIANT",
      defaultValue: "1",
      variantOptions: ["1", "2", "3", "4"],
    },
  },
};

export const itemRange = {
  name: ".Item / Range",
  key: "cc8d917d2a86952e7c317c1e3a2fa39d2a34a486",
  componentPropertyDefinitions: {
    State: {
      type: "VARIANT",
      defaultValue: "Default",
      variantOptions: ["Default", "Disabled"],
    },
  },
};

export const itemHandles = {
  name: ".Item / Handles",
  key: "f18ed8e8e07ddb0663aa5c3ea62931c51eecbc30",
  componentPropertyDefinitions: {
    Variant: {
      type: "VARIANT",
      defaultValue: "1",
      variantOptions: ["1", "2"],
    },
  },
};

export const itemMarkerGroup = {
  name: ".Item / Marker Group",
  key: "ccc8ec4e24779d28e8a94ebb40d7d7977dcb2466",
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

export const itemHandle = {
  name: ".Item / handle",
  key: "350f52f4f1535d73439f5008fd40506879cebd6d",
  componentPropertyDefinitions: {
    Label: {
      type: "VARIANT",
      defaultValue: "False",
      variantOptions: ["False"],
    },
  },
};
