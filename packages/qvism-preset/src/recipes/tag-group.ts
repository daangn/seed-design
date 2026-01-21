import { tagGroup as vars, tagGroupItem as itemVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { onlyIcon, prefixIcon, suffixIcon } from "../utils/icon";
import { not, pseudo } from "../utils/pseudo";

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

      alignItems: "center", // for centering icon+label when inline-flex
      verticalAlign: "middle", // for centering item itself when root display: inline

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
      verticalAlign: "middle", // for centering label when item display: inline

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
        root: {
          ...prefixIcon({
            size: itemVars.sizeT2.enabled.prefixIcon.size,
          }),
          ...suffixIcon({
            size: itemVars.sizeT2.enabled.suffixIcon.size,
          }),
          ...onlyIcon({
            size: itemVars.sizeT2.enabled.prefixIcon.size,
          }),
        },
        label: {
          fontSize: itemVars.sizeT2.enabled.label.fontSize,
          lineHeight: itemVars.sizeT2.enabled.label.lineHeight,
        },
      },
      t3: {
        root: {
          ...prefixIcon({
            size: itemVars.sizeT3.enabled.prefixIcon.size,
          }),
          ...suffixIcon({
            size: itemVars.sizeT3.enabled.suffixIcon.size,
          }),
          ...onlyIcon({
            size: itemVars.sizeT3.enabled.prefixIcon.size,
          }),
        },
        label: {
          fontSize: itemVars.sizeT3.enabled.label.fontSize,
          lineHeight: itemVars.sizeT3.enabled.label.lineHeight,
        },
      },
      t4: {
        root: {
          ...prefixIcon({
            size: itemVars.sizeT4.enabled.prefixIcon.size,
          }),
          ...suffixIcon({
            size: itemVars.sizeT4.enabled.suffixIcon.size,
          }),
          ...onlyIcon({
            size: itemVars.sizeT4.enabled.prefixIcon.size,
          }),
        },
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
