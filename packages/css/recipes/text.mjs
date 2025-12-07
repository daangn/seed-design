import './text.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "textStyle": "t5Regular",
  "maxLines": "none",
  "textDecorationLine": "none"
};

const compoundVariants = [];

export const textVariantMap = {
  "textStyle": [
    "screenTitle",
    "articleBody",
    "t1Regular",
    "t1Medium",
    "t1Bold",
    "t2Regular",
    "t2Medium",
    "t2Bold",
    "t3Regular",
    "t3Medium",
    "t3Bold",
    "t4Regular",
    "t4Medium",
    "t4Bold",
    "t5Regular",
    "t5Medium",
    "t5Bold",
    "t6Regular",
    "t6Medium",
    "t6Bold",
    "t7Regular",
    "t7Medium",
    "t7Bold",
    "t8Bold",
    "t9Bold",
    "t10Bold",
    "t1RegularStatic",
    "t1MediumStatic",
    "t1BoldStatic",
    "t2RegularStatic",
    "t2MediumStatic",
    "t2BoldStatic",
    "t3RegularStatic",
    "t3MediumStatic",
    "t3BoldStatic",
    "t4RegularStatic",
    "t4MediumStatic",
    "t4BoldStatic",
    "t5RegularStatic",
    "t5MediumStatic",
    "t5BoldStatic",
    "t6RegularStatic",
    "t6MediumStatic",
    "t6BoldStatic",
    "t7RegularStatic",
    "t7MediumStatic",
    "t7BoldStatic",
    "t8BoldStatic",
    "t9BoldStatic",
    "t10BoldStatic"
  ],
  "maxLines": [
    "none",
    "single",
    "multi"
  ],
  "textDecorationLine": [
    "none",
    "line-through",
    "underline"
  ]
};

export const textVariantKeys = Object.keys(textVariantMap);

export function text(props) {
  return createClassName(
    "seed-text",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(text, { splitVariantProps: (props) => splitVariantProps(props, textVariantMap) });

// @recipe(seed): text