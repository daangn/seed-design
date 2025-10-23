import { tagGroup as vars, tagGroupItem as itemVars } from "../vars/component";
import { defineRecipe, defineSlotRecipe } from "../utils/define";
import { onlyIcon, prefixIcon, suffixIcon } from "../utils/icon";

export const tagGroup = defineSlotRecipe({
  name: "tag-group",
  slots: ["root", "separator"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",

      flexWrap: "wrap",
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
  },
  defaultVariants: {
    size: "t2",
  },
});

export const tagGroupItem = defineRecipe({
  name: "tag-group-item",
  base: {
    display: "flex",
    alignItems: "center",

    gap: itemVars.base.enabled.root.gap,

    // NOTE: might remove React.Children logic regarding separators from react package, once minimum required version satisfies Safari 17.4
    // currently this is unusable because VoiceOver reads the content of pseudo elements
    // https://caniuse.com/mdn-css_properties_content_alt_text

    // [pseudo(not(":last-child"), "::after")]: {
    //   content: ['"  ·  " / ""', "  ·  "], // prevents screen readers from reading the separator by setting the alt text to an empty string
    //   whiteSpace: "pre",
    //   color: some color,
    // },
  },
  variants: {
    size: {
      t2: {
        fontSize: itemVars.sizeT2.enabled.label.fontSize,
        lineHeight: itemVars.sizeT2.enabled.label.lineHeight,

        ...onlyIcon({
          size: itemVars.sizeT2.enabled.icon.size,
        }),
        ...prefixIcon({
          size: itemVars.sizeT2.enabled.prefixIcon.size,
        }),
        ...suffixIcon({
          size: itemVars.sizeT2.enabled.suffixIcon.size,
        }),
      },
      t3: {
        fontSize: itemVars.sizeT3.enabled.label.fontSize,
        lineHeight: itemVars.sizeT3.enabled.label.lineHeight,

        ...onlyIcon({
          size: itemVars.sizeT3.enabled.icon.size,
        }),
        ...prefixIcon({
          size: itemVars.sizeT3.enabled.prefixIcon.size,
        }),
        ...suffixIcon({
          size: itemVars.sizeT3.enabled.suffixIcon.size,
        }),
      },
      t4: {
        fontSize: itemVars.sizeT4.enabled.label.fontSize,
        lineHeight: itemVars.sizeT4.enabled.label.lineHeight,

        ...onlyIcon({
          size: itemVars.sizeT4.enabled.icon.size,
        }),
        ...prefixIcon({
          size: itemVars.sizeT4.enabled.prefixIcon.size,
        }),
        ...suffixIcon({
          size: itemVars.sizeT4.enabled.suffixIcon.size,
        }),
      },
    },
    weight: {
      regular: {
        fontWeight: itemVars.weightRegular.enabled.label.fontWeight,
      },
      bold: {
        fontWeight: itemVars.weightBold.enabled.label.fontWeight,
      },
    },
    tone: {
      neutralSubtle: {
        color: itemVars.toneNeutralSubtle.enabled.label.color,

        ...onlyIcon({
          color: itemVars.toneNeutralSubtle.enabled.icon.color,
        }),
        ...prefixIcon({
          color: itemVars.toneNeutralSubtle.enabled.prefixIcon.color,
        }),
        ...suffixIcon({
          color: itemVars.toneNeutralSubtle.enabled.suffixIcon.color,
        }),
      },
      neutral: {
        color: itemVars.toneNeutral.enabled.label.color,

        ...onlyIcon({
          color: itemVars.toneNeutral.enabled.icon.color,
        }),
        ...prefixIcon({
          color: itemVars.toneNeutral.enabled.prefixIcon.color,
        }),
        ...suffixIcon({
          color: itemVars.toneNeutral.enabled.suffixIcon.color,
        }),
      },
      brand: {
        color: itemVars.toneBrand.enabled.label.color,

        ...onlyIcon({
          color: itemVars.toneBrand.enabled.icon.color,
        }),
        ...prefixIcon({
          color: itemVars.toneBrand.enabled.prefixIcon.color,
        }),
        ...suffixIcon({
          color: itemVars.toneBrand.enabled.suffixIcon.color,
        }),
      },
    },
  },
  defaultVariants: {
    size: "t2",
    weight: "regular",
    tone: "neutralSubtle",
  },
});
