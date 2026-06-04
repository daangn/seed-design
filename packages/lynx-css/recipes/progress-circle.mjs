/* TODO: Lynx SVG(stroke-dasharray) 지원 시 qvism recipe 자동 생성으로 전환하고 이 파일 삭제 */
import "./progress-circle.css";
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const progressCircleSlotNames = [
  ["root", "seed-progress-circle__root"],
  ["range", "seed-progress-circle__range"],
  ["cap", "seed-progress-circle__cap"],
];

const defaultVariant = {
  tone: "neutral",
  size: "40",
};

const compoundVariants = [];

export const progressCircleVariantMap = {
  tone: ["neutral", "brand", "staticWhite", "inherit"],
  size: ["14", "16", "18", "24", "40"],
};

export const progressCircleVariantKeys = Object.keys(progressCircleVariantMap);

export function progressCircle(props) {
  return Object.fromEntries(
    progressCircleSlotNames.map(([slot, className]) => {
      return [
        slot,
        createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
      ];
    }),
  );
}

Object.assign(progressCircle, {
  splitVariantProps: (props) => splitVariantProps(props, progressCircleVariantMap),
});

// @recipe(seed): progress-circle
