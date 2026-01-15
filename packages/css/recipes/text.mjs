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
    "articleNote",
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
    "t1StaticRegular",
    "t1StaticMedium",
    "t1StaticBold",
    "t2StaticRegular",
    "t2StaticMedium",
    "t2StaticBold",
    "t3StaticRegular",
    "t3StaticMedium",
    "t3StaticBold",
    "t4StaticRegular",
    "t4StaticMedium",
    "t4StaticBold",
    "t5StaticRegular",
    "t5StaticMedium",
    "t5StaticBold",
    "t6StaticRegular",
    "t6StaticMedium",
    "t6StaticBold",
    "t7StaticRegular",
    "t7StaticMedium",
    "t7StaticBold",
    "t8StaticBold",
    "t9StaticBold",
    "t10StaticBold"
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