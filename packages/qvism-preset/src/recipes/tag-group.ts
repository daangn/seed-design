import { tagGroup as vars, tagGroupItem as itemVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { onlyIcon, prefixIcon, suffixIcon } from "../utils/icon";
import { not, pseudo } from "../utils/pseudo";

const GLYPH_CENTER_CAP_RATIO = 0.5;
const GLYPH_CENTER_EM_RATIO_FALLBACK = 0.35;

function createItemIconAlignmentStyles({
  iconSize,
  prefixIconSize,
  suffixIconSize,
  fontSize,
  lineHeight,
}: {
  iconSize: string;
  prefixIconSize: string;
  suffixIconSize: string;
  fontSize: string;
  lineHeight: string;
}) {
  return {
    "--tag-group-item-inline-icon-offset": `calc(${
      1 - GLYPH_CENTER_EM_RATIO_FALLBACK
    }em - ${lineHeight} / 2)`,
    "--tag-group-item-icon-flex-offset": `calc(${iconSize} / 2 - ${GLYPH_CENTER_EM_RATIO_FALLBACK}em)`,
    "--tag-group-item-prefix-icon-flex-offset": `calc(${prefixIconSize} / 2 - ${GLYPH_CENTER_EM_RATIO_FALLBACK}em)`,
    "--tag-group-item-suffix-icon-flex-offset": `calc(${suffixIconSize} / 2 - ${GLYPH_CENTER_EM_RATIO_FALLBACK}em)`,
    ...onlyIcon({
      size: iconSize,
      fontSize,
    }),
    ...prefixIcon({
      size: prefixIconSize,
      fontSize,
    }),
    ...suffixIcon({
      size: suffixIconSize,
      fontSize,
    }),
    "@supports (top: 1cap)": {
      "--tag-group-item-inline-icon-offset": `calc(1em - ${lineHeight} / 2 - ${GLYPH_CENTER_CAP_RATIO}cap)`,
      "--tag-group-item-icon-flex-offset": `calc(${iconSize} / 2 - ${GLYPH_CENTER_CAP_RATIO}cap)`,
      "--tag-group-item-prefix-icon-flex-offset": `calc(${prefixIconSize} / 2 - ${GLYPH_CENTER_CAP_RATIO}cap)`,
      "--tag-group-item-suffix-icon-flex-offset": `calc(${suffixIconSize} / 2 - ${GLYPH_CENTER_CAP_RATIO}cap)`,
    },
  };
}

export const tagGroup = defineSlotRecipe({
  name: "tag-group",
  slots: ["root", "separator"],
  base: {
    separator: {
      color: vars.base.enabled.separator.color,
      fontWeight: vars.base.enabled.separator.fontWeight,

      whiteSpace: "pre",

      userSelect: "none",
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
          display: "inline-flex",
          alignItems: "center",
          maxWidth: "100%",

          "--tag-group-item-display": "inline-flex",

          "--tag-group-item-overflow": "hidden",
          "--tag-group-item-text-overflow": "ellipsis",
          "--tag-group-item-white-space": "nowrap",

          "--tag-group-item-align-items": "baseline",
          "& .seed-icon": {
            position: "relative",
            top: "var(--tag-group-item-icon-flex-offset, 0px)",
          },
          "& .seed-prefix-icon": {
            position: "relative",
            top: "var(--tag-group-item-prefix-icon-flex-offset, 0px)",
          },
          "& .seed-suffix-icon": {
            position: "relative",
            top: "var(--tag-group-item-suffix-icon-flex-offset, 0px)",
          },
        },
      },
      false: {
        root: {
          display: "inline-block",
          fontSize: 0,

          "--tag-group-item-display": "inline",

          "--tag-group-item-overflow": "visible",
          "--tag-group-item-text-overflow": "clip",
          "--tag-group-item-white-space": "normal",

          "--tag-group-item-align-items": "center",
          "& .seed-icon, & .seed-prefix-icon, & .seed-suffix-icon": {
            position: "relative",
            top: "var(--tag-group-item-inline-icon-offset, 0px)",
          },
        },
        separator: {
          verticalAlign: "middle",
        },
      },
    },
  },
  compoundVariants: [
    {
      size: "t2",
      truncate: false,
      css: {
        root: {
          lineHeight: itemVars.sizeT2.enabled.label.lineHeight,
        },
      },
    },
    {
      size: "t3",
      truncate: false,
      css: {
        root: {
          lineHeight: itemVars.sizeT3.enabled.label.lineHeight,
        },
      },
    },
    {
      size: "t4",
      truncate: false,
      css: {
        root: {
          lineHeight: itemVars.sizeT4.enabled.label.lineHeight,
        },
      },
    },
  ],
  defaultVariants: {
    size: "t2",
    truncate: false,
  },
});

export const tagGroupItem = defineSlotRecipe({
  name: "tag-group-item",
  slots: ["root", "label"],
  base: {
    root: {
      display: "var(--tag-group-item-display)",

      alignItems: "var(--tag-group-item-align-items, center)",
      verticalAlign: "middle",

      flexShrink: "var(--seed-box-flex-shrink, 1)",
      minWidth: 0,

      // NOTE: might remove React.Children logic regarding separators from react package, once minimum required version satisfies Safari 17.4
      // currently this is unusable because VoiceOver reads the content of pseudo elements
      // https://caniuse.com/mdn-css_properties_content_alt_text

      // [pseudo(not(":last-child"), "::after")]: {
      //   content: ['" · " / ""', " · "], // prevents screen readers from reading the separator by setting the alt text to an empty string
      //   whiteSpace: "pre",
      //   color: some color,
      // },}
    },
    label: {
      display: "inline",
      verticalAlign: "middle",

      minWidth: 0,

      overflow: "var(--tag-group-item-overflow)",
      textOverflow: "var(--tag-group-item-text-overflow)",
      whiteSpace: "var(--tag-group-item-white-space)",

      // keep-all in latin, break-all in cjk
      // this is here because some people want to define word-break in their resets
      wordBreak: "normal",

      [pseudo(not(":first-child"))]: {
        marginLeft: itemVars.base.enabled.root.gap,
      },

      [pseudo(not(":last-child"))]: {
        marginRight: itemVars.base.enabled.root.gap,
      },
    },
  },
  variants: {
    size: {
      t2: {
        root: createItemIconAlignmentStyles({
          iconSize: itemVars.sizeT2.enabled.icon.size,
          prefixIconSize: itemVars.sizeT2.enabled.prefixIcon.size,
          suffixIconSize: itemVars.sizeT2.enabled.suffixIcon.size,
          fontSize: itemVars.sizeT2.enabled.label.fontSize,
          lineHeight: itemVars.sizeT2.enabled.label.lineHeight,
        }),
        label: {
          fontSize: itemVars.sizeT2.enabled.label.fontSize,
          lineHeight: itemVars.sizeT2.enabled.label.lineHeight,
        },
      },
      t3: {
        root: createItemIconAlignmentStyles({
          iconSize: itemVars.sizeT3.enabled.icon.size,
          prefixIconSize: itemVars.sizeT3.enabled.prefixIcon.size,
          suffixIconSize: itemVars.sizeT3.enabled.suffixIcon.size,
          fontSize: itemVars.sizeT3.enabled.label.fontSize,
          lineHeight: itemVars.sizeT3.enabled.label.lineHeight,
        }),
        label: {
          fontSize: itemVars.sizeT3.enabled.label.fontSize,
          lineHeight: itemVars.sizeT3.enabled.label.lineHeight,
        },
      },
      t4: {
        root: createItemIconAlignmentStyles({
          iconSize: itemVars.sizeT4.enabled.icon.size,
          prefixIconSize: itemVars.sizeT4.enabled.prefixIcon.size,
          suffixIconSize: itemVars.sizeT4.enabled.suffixIcon.size,
          fontSize: itemVars.sizeT4.enabled.label.fontSize,
          lineHeight: itemVars.sizeT4.enabled.label.lineHeight,
        }),
        label: {
          fontSize: itemVars.sizeT4.enabled.label.fontSize,
          lineHeight: itemVars.sizeT4.enabled.label.lineHeight,
        },
      },
    },
    weight: {
      regular: {
        root: {
          ...onlyIcon({ fontWeight: itemVars.weightRegular.enabled.label.fontWeight }),
          ...prefixIcon({ fontWeight: itemVars.weightRegular.enabled.label.fontWeight }),
          ...suffixIcon({ fontWeight: itemVars.weightRegular.enabled.label.fontWeight }),
        },
        label: {
          fontWeight: itemVars.weightRegular.enabled.label.fontWeight,
        },
      },
      bold: {
        root: {
          ...onlyIcon({ fontWeight: itemVars.weightBold.enabled.label.fontWeight }),
          ...prefixIcon({ fontWeight: itemVars.weightBold.enabled.label.fontWeight }),
          ...suffixIcon({ fontWeight: itemVars.weightBold.enabled.label.fontWeight }),
        },
        label: {
          fontWeight: itemVars.weightBold.enabled.label.fontWeight,
        },
      },
    },
    tone: {
      neutralSubtle: {
        root: {
          ...prefixIcon({
            color: itemVars.toneNeutralSubtle.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: itemVars.toneNeutralSubtle.enabled.suffixIcon.color,
          }),
          ...onlyIcon({
            color: itemVars.toneNeutralSubtle.enabled.prefixIcon.color,
          }),
        },
        label: {
          color: itemVars.toneNeutralSubtle.enabled.label.color,
        },
      },
      neutral: {
        root: {
          ...prefixIcon({
            color: itemVars.toneNeutral.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: itemVars.toneNeutral.enabled.suffixIcon.color,
          }),
          ...onlyIcon({
            color: itemVars.toneNeutral.enabled.prefixIcon.color,
          }),
        },
        label: {
          color: itemVars.toneNeutral.enabled.label.color,
        },
      },
      brand: {
        root: {
          ...prefixIcon({
            color: itemVars.toneBrand.enabled.prefixIcon.color,
          }),
          ...suffixIcon({
            color: itemVars.toneBrand.enabled.suffixIcon.color,
          }),
          ...onlyIcon({
            color: itemVars.toneBrand.enabled.prefixIcon.color,
          }),
        },
        label: {
          color: itemVars.toneBrand.enabled.label.color,
        },
      },
    },
  },
  defaultVariants: {
    size: "t2",
    weight: "regular",
    tone: "neutralSubtle",
  },
});
