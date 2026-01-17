import { tagGroup as vars, tagGroupItem as itemVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import { onlyIcon, prefixIcon, suffixIcon } from "../utils/icon";

export const tagGroup = defineSlotRecipe({
  name: "tag-group",
  slots: ["root", "separator"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
    },
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
    inline: {
      true: {
        root: {
          maxWidth: "100%",

          "--tag-group-item-overflow": "hidden",
          "--tag-group-item-text-overflow": "ellipsis",
          "--tag-group-item-white-space": "nowrap",
        },
      },
      false: {
        root: {
          flexWrap: "wrap",
        },
      },
    },
  },
  defaultVariants: {
    size: "t2",
    inline: false,
  },
});

export const tagGroupItem = defineSlotRecipe({
  name: "tag-group-item",
  slots: ["root", "label"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",

      flexShrink: "var(--seed-box-flex-shrink, 1)",
      minWidth: 0,

      gap: itemVars.base.enabled.root.gap,

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
      display: "inline-block",
      minWidth: 0,

      overflow: "var(--tag-group-item-overflow, visible)",
      textOverflow: "var(--tag-group-item-text-overflow, clip)",
      whiteSpace: "var(--tag-group-item-white-space, normal)",
    },
  },
  variants: {
    size: {
      t2: {
        root: {
          fontSize: itemVars.sizeT2.enabled.label.fontSize,
          lineHeight: itemVars.sizeT2.enabled.label.lineHeight,

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
      },
      t3: {
        root: {
          fontSize: itemVars.sizeT3.enabled.label.fontSize,
          lineHeight: itemVars.sizeT3.enabled.label.lineHeight,

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
      },
      t4: {
        root: {
          fontSize: itemVars.sizeT4.enabled.label.fontSize,
          lineHeight: itemVars.sizeT4.enabled.label.lineHeight,

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
      },
    },
    weight: {
      regular: {
        root: {
          fontWeight: itemVars.weightRegular.enabled.label.fontWeight,
        },
      },
      bold: {
        root: {
          fontWeight: itemVars.weightBold.enabled.label.fontWeight,
        },
      },
    },
    tone: {
      neutralSubtle: {
        root: {
          color: itemVars.toneNeutralSubtle.enabled.label.color,

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
      },
      neutral: {
        root: {
          color: itemVars.toneNeutral.enabled.label.color,

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
      },
      brand: {
        root: {
          color: itemVars.toneBrand.enabled.label.color,

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
      },
    },
  },
  defaultVariants: {
    size: "t2",
    weight: "regular",
    tone: "neutralSubtle",
  },
});
