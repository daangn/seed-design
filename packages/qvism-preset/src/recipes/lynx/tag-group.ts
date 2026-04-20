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
      // 이게 없으면 flex-wrap이 "컨테이너를 초과"하는 기준 자체가 없어
      // root가 content 크기로 늘어나버린다.
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
      // 기본은 shrink 금지: item이 content-size를 유지하고, 한 줄에 안
      // 들어가면 Root의 flex-wrap으로 다음 줄로 넘어간다. 웹의 inline
      // line-break 동작에 대응.
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
    truncate: {
      true: {
        root: {
          flexShrink: 1,
          minWidth: 0,
        },
        label: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      },
      false: {
        root: {},
        label: {},
      },
    },
  },
  defaultVariants: {
    size: "t2",
    weight: "regular",
    tone: "neutralSubtle",
    truncate: false,
  },
});
