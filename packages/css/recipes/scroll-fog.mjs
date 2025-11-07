import './scroll-fog.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {
  "hideScrollBar": false
};

const compoundVariants = [];

export const scrollFogVariantMap = {
  "hideScrollBar": [
    true
  ]
};

export const scrollFogVariantKeys = Object.keys(scrollFogVariantMap);

export function scrollFog(props) {
  return createClassName(
    "seed-scroll-fog",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(scrollFog, { splitVariantProps: (props) => splitVariantProps(props, scrollFogVariantMap) });

// @recipe(seed): scroll-fog