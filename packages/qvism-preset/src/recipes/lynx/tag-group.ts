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
      // Lynx <view>는 기본 content-width라 parent 너비를 차지하도록 명시.
      // 이게 없으면 flex-wrap이 "컨테이너 초과" 기준 자체가 없어 root가
      // content 크기로 늘어나버린다.
      width: "100%",
    },
    separator: {
      color: vars.base.enabled.separator.color,
      fontWeight: vars.base.enabled.separator.fontWeight,
      marginLeft: itemVars.base.enabled.root.gap,
      marginRight: itemVars.base.enabled.root.gap,
      flexShrink: 0,
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
  },
  defaultVariants: {
    size: "t2",
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
      // Lynx는 웹 inline flow가 없어 item 단위로만 wrap된다. content-size를
      // 유지하면서 Root의 flex-wrap으로 다음 줄에 배치되도록 shrink를 막는다.
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
