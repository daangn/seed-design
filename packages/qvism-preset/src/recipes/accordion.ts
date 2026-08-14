import { accordion as vars, accordionItem as itemVars } from "../vars/component";
import { defineSlotRecipe } from "../utils/define";
import {
  createFocusRingRestStyles,
  createFocusRingStyles,
  FOCUS_RING_TRANSITION,
} from "../utils/focus-ring";
import { onlyIcon, suffixIcon } from "../utils/icon";
import { disabled, engaged, focusVisible, not, open, pseudo } from "../utils/pseudo";
import { breakpoints } from "../utils/breakpoint";
import spec from "@seed-design/rootage-artifacts/components/accordion";

const accordion = defineSlotRecipe({
  name: "accordion",
  slots: [
    "root",
    "item",
    "header",
    "trigger",
    "prefix",
    "body",
    "title",
    "description",
    "suffixIcon",
    "content",
  ],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    item: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    header: {
      display: "flex",
      margin: 0,
      padding: 0,
      font: "inherit",
    },
    trigger: {
      position: "relative",
      isolation: "isolate",
      display: "flex",
      alignItems: "center",
      width: "100%",
      cursor: "pointer",
      background: "transparent",
      border: "none",
      padding: 0,
      fontFamily: "inherit",
      textAlign: "start",
      paddingInline: itemVars.base.rest.trigger.paddingX,

      transition: FOCUS_RING_TRANSITION,
      ...createFocusRingRestStyles(),
      [pseudo(focusVisible)]: createFocusRingStyles(),

      [pseudo(disabled)]: {
        cursor: "not-allowed",
      },
    },
    prefix: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,

      ...onlyIcon({
        color: itemVars.base.rest.prefixIcon.color,
      }),

      [pseudo(disabled)]: {
        ...onlyIcon({
          color: itemVars.base.disabled.prefixIcon.color,
        }),
      },
    },
    body: {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      gap: itemVars.base.rest.body.gap,
      minWidth: 0,
    },
    title: {
      color: itemVars.base.rest.title.color,
      fontWeight: itemVars.base.rest.title.fontWeight,

      [pseudo(disabled)]: {
        color: itemVars.base.disabled.title.color,
      },
    },
    description: {
      color: itemVars.base.rest.description.color,
      fontWeight: itemVars.base.rest.description.fontWeight,

      [pseudo(disabled)]: {
        color: itemVars.base.disabled.description.color,
      },
    },
    suffixIcon: {
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      marginLeft: "auto",
      color: itemVars.base.rest.suffixIcon.color,

      transform: "rotate(0deg)",
      transition: `transform ${itemVars.base.rest.suffixIcon.rotateDuration} ${itemVars.base.rest.suffixIcon.rotateTimingFunction}`,

      [pseudo(open)]: {
        transform: "rotate(180deg)",
      },

      [pseudo(disabled)]: {
        color: itemVars.base.disabled.suffixIcon.color,
      },
    },
    content: {
      overflow: "hidden",
      height: 0,
      opacity: 0,

      transition: `height ${itemVars.base.rest.content.collapseHeightDuration} ${itemVars.base.rest.content.collapseHeightTimingFunction}, opacity ${itemVars.base.rest.content.collapseHeightDuration} ${itemVars.base.rest.content.collapseHeightTimingFunction}`,

      [pseudo(open)]: {
        height: "var(--collapsible-content-height)",
        opacity: 1,
        transition: `height ${itemVars.base.rest.content.expandHeightDuration} ${itemVars.base.rest.content.expandHeightTimingFunction}, opacity ${itemVars.base.rest.content.expandHeightDuration} ${itemVars.base.rest.content.expandHeightTimingFunction}`,
      },
    },
  },
  variants: {
    variant: {
      inline: {
        item: {
          position: "relative",

          [pseudo(":not(:last-child)::after")]: {
            content: "''",
            position: "absolute",
            bottom: 0,
            insetInline: itemVars.variantInline.rest.root.dividerPaddingX,
            height: "1px",
            backgroundColor: itemVars.variantInline.rest.root.dividerColor,
          },
        },
        trigger: {
          [pseudo("::before")]: {
            content: "''",
            position: "absolute",
            inset: 0,
            zIndex: -1,
            transitionProperty: "background-color, inset-inline, border-radius",
            transitionDuration: itemVars.base.rest.root.colorDuration,
            transitionTimingFunction: itemVars.base.rest.root.colorTimingFunction,
          },
          [pseudo(not(disabled), engaged, "::before")]: {
            backgroundColor: itemVars.base.pressed.trigger.color,
            insetInline: itemVars.base.pressed.trigger.marginX,
            borderRadius: itemVars.base.pressed.trigger.cornerRadius,
          },
        },
      },
      separated: {
        item: {
          boxShadow: `inset 0 0 0 ${itemVars.variantSeparated.rest.root.strokeWidth} ${itemVars.variantSeparated.rest.root.strokeColor}`,
          borderRadius: itemVars.variantSeparated.rest.root.cornerRadius,
          overflow: "hidden",
        },
        trigger: {
          [pseudo("::before")]: {
            content: "''",
            position: "absolute",
            inset: 0,
            zIndex: -1,
            transitionProperty: "background-color",
            transitionDuration: itemVars.base.rest.root.colorDuration,
            transitionTimingFunction: itemVars.base.rest.root.colorTimingFunction,
          },
          [pseudo(not(disabled), engaged, "::before")]: {
            backgroundColor: itemVars.base.pressed.trigger.color,
          },
        },
      },
    },
    size: {
      medium: {
        trigger: {
          paddingBlock: itemVars.sizeMedium.rest.trigger.paddingY,
        },
        prefix: {
          marginRight: itemVars.sizeMedium.rest.prefix.paddingRight,
          ...onlyIcon({
            size: itemVars.sizeMedium.rest.prefixIcon.size,
          }),
        },
        title: {
          fontSize: itemVars.sizeMedium.rest.title.fontSize,
          lineHeight: itemVars.sizeMedium.rest.title.lineHeight,
        },
        description: {
          fontSize: itemVars.sizeMedium.rest.description.fontSize,
          lineHeight: itemVars.sizeMedium.rest.description.lineHeight,
        },
        suffixIcon: {
          ...suffixIcon({
            size: itemVars.sizeMedium.rest.suffixIcon.size,
            marginLeft: itemVars.sizeMedium.rest.suffixIcon.paddingLeft,
          }),
        },
      },
      large: {
        trigger: {
          paddingBlock: itemVars.sizeLarge.rest.trigger.paddingY,
        },
        prefix: {
          marginRight: itemVars.sizeLarge.rest.prefix.paddingRight,
          ...onlyIcon({
            size: itemVars.sizeLarge.rest.prefixIcon.size,
          }),
        },
        title: {
          fontSize: itemVars.sizeLarge.rest.title.fontSize,
          lineHeight: itemVars.sizeLarge.rest.title.lineHeight,
        },
        description: {
          fontSize: itemVars.sizeLarge.rest.description.fontSize,
          lineHeight: itemVars.sizeLarge.rest.description.lineHeight,
        },
        suffixIcon: {
          ...suffixIcon({
            size: itemVars.sizeLarge.rest.suffixIcon.size,
            marginLeft: itemVars.sizeLarge.rest.suffixIcon.paddingLeft,
          }),
        },
      },
      responsive: {
        trigger: {
          paddingBlock: itemVars.sizeMedium.rest.trigger.paddingY,

          [breakpoints.up("md")]: {
            paddingBlock: itemVars.sizeLarge.rest.trigger.paddingY,
          },
        },
        prefix: {
          marginRight: itemVars.sizeMedium.rest.prefix.paddingRight,
          ...onlyIcon({
            size: itemVars.sizeMedium.rest.prefixIcon.size,
          }),

          [breakpoints.up("md")]: {
            marginRight: itemVars.sizeLarge.rest.prefix.paddingRight,
            ...onlyIcon({
              size: itemVars.sizeLarge.rest.prefixIcon.size,
            }),
          },
        },
        title: {
          fontSize: itemVars.sizeMedium.rest.title.fontSize,
          lineHeight: itemVars.sizeMedium.rest.title.lineHeight,

          [breakpoints.up("md")]: {
            fontSize: itemVars.sizeLarge.rest.title.fontSize,
            lineHeight: itemVars.sizeLarge.rest.title.lineHeight,
          },
        },
        description: {
          fontSize: itemVars.sizeMedium.rest.description.fontSize,
          lineHeight: itemVars.sizeMedium.rest.description.lineHeight,

          [breakpoints.up("md")]: {
            fontSize: itemVars.sizeLarge.rest.description.fontSize,
            lineHeight: itemVars.sizeLarge.rest.description.lineHeight,
          },
        },
        suffixIcon: {
          ...suffixIcon({
            size: itemVars.sizeMedium.rest.suffixIcon.size,
            marginLeft: itemVars.sizeMedium.rest.suffixIcon.paddingLeft,
          }),

          [breakpoints.up("md")]: {
            ...suffixIcon({
              size: itemVars.sizeLarge.rest.suffixIcon.size,
              marginLeft: itemVars.sizeLarge.rest.suffixIcon.paddingLeft,
            }),
          },
        },
      },
    },
  },
  compoundVariants: [
    {
      variant: "separated",
      size: "medium",
      css: {
        root: {
          gap: vars.variantSeparatedSizeMedium.rest.root.gap,
        },
      },
    },
    {
      variant: "separated",
      size: "large",
      css: {
        root: {
          gap: vars.variantSeparatedSizeLarge.rest.root.gap,
        },
      },
    },
    {
      variant: "separated",
      size: "responsive",
      css: {
        root: {
          gap: vars.variantSeparatedSizeMedium.rest.root.gap,

          [breakpoints.up("md")]: {
            gap: vars.variantSeparatedSizeLarge.rest.root.gap,
          },
        },
      },
    },
  ],
  defaultVariants: {
    variant: "inline",
    size: "medium",
  },
  metadata: {
    variants: {
      ...spec.data.schema.variants,
      size: {
        ...spec.data.schema.variants.size,
        values: {
          ...spec.data.schema.variants.size.values,
          responsive: {
            description:
              "뷰포트 너비에 따라 적용되는 사이즈가 달라집니다. Breakpoint `md` 미만에서는 `medium`, `md` 이상에서는 `large`로 적용됩니다.",
          },
        },
      },
    },
  },
});

export default accordion;
