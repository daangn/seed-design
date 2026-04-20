import { tagGroup as vars, tagGroupItem as itemVars } from "../../vars/component";
import { defineLynxSlotRecipe } from "../../utils/define-lynx";

export const tagGroup = defineLynxSlotRecipe({
  name: "tag-group",
  slots: ["root", "separator"],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
    },
    separator: {
      color: vars.base.enabled.separator.color,
      fontWeight: vars.base.enabled.separator.fontWeight,
      marginLeft: itemVars.base.enabled.root.gap,
      marginRight: itemVars.base.enabled.root.gap,
    },
  },
  variants: {
    size: {
      t2: {
        separator: {
          fontSize: vars.sizeT2.enabled.separator.fontSize,
          lineHeight: vars.sizeT2.enabled.separator.lineHeight,
        },
      },
      t3: {
        separator: {
          fontSize: vars.sizeT3.enabled.separator.fontSize,
          lineHeight: vars.sizeT3.enabled.separator.lineHeight,
        },
      },
      t4: {
        separator: {
          fontSize: vars.sizeT4.enabled.separator.fontSize,
          lineHeight: vars.sizeT4.enabled.separator.lineHeight,
        },
      },
    },
    truncate: {
      true: {
        root: {
          flexWrap: "nowrap",
          maxWidth: "100%",
          overflow: "hidden",
        },
      },
      false: {
        root: {},
      },
    },
  },
  defaultVariants: {
    size: "t2",
    truncate: false,
  },
});

export const tagGroupItem = defineLynxSlotRecipe({
  name: "tag-group-item",
  slots: ["root", "label"],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      // Lynx에서는 item 자체는 shrink되지 않게 두고, 전체가 넘치면 root의
      // flex-wrap으로 다음 줄에 배치되도록 한다. shrink을 허용하면 긴 item이
      // 자체적으로 text-wrap되어 레이아웃이 어색해진다.
      flexShrink: 0,
    },
    label: {},
  },
  variants: {
    size: {
      t2: {
        label: {
          fontSize: itemVars.sizeT2.enabled.label.fontSize,
          lineHeight: itemVars.sizeT2.enabled.label.lineHeight,
        },
      },
      t3: {
        label: {
          fontSize: itemVars.sizeT3.enabled.label.fontSize,
          lineHeight: itemVars.sizeT3.enabled.label.lineHeight,
        },
      },
      t4: {
        label: {
          fontSize: itemVars.sizeT4.enabled.label.fontSize,
          lineHeight: itemVars.sizeT4.enabled.label.lineHeight,
        },
      },
    },
    weight: {
      regular: {
        label: {
          fontWeight: itemVars.weightRegular.enabled.label.fontWeight,
        },
      },
      bold: {
        label: {
          fontWeight: itemVars.weightBold.enabled.label.fontWeight,
        },
      },
    },
    tone: {
      neutralSubtle: {
        label: { color: itemVars.toneNeutralSubtle.enabled.label.color },
      },
      neutral: {
        label: { color: itemVars.toneNeutral.enabled.label.color },
      },
      brand: {
        label: { color: itemVars.toneBrand.enabled.label.color },
      },
    },
  },
  defaultVariants: {
    size: "t2",
    weight: "regular",
    tone: "neutralSubtle",
  },
});
