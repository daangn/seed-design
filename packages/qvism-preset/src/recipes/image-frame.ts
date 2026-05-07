import { defineSlotRecipe } from "../utils/define";
import { pseudo } from "../utils/pseudo";
import { imageFrame as vars } from "../vars/component";

const imageFrame = defineSlotRecipe({
  name: "image-frame",
  slots: ["root", "content", "fallback"],
  base: {
    // content는 항상 layout box를 유지해야 native loading="lazy"가 viewport intersection을 측정할 수 있다.
    // fallback이 DOM 순서로 위에 stack되어 시각 처리를 담당한다.
    root: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "inherit",
    },
    content: {
      position: "absolute",
      inset: 0,
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "inherit",
      // error 상태에서 브라우저 기본 broken icon이 노출되는 것을 방지.
      // visibility:hidden은 layout box를 유지하므로 lazy 발화에는 영향이 없다.
      [pseudo("[data-loading-state='error']")]: {
        visibility: "hidden",
      },
    },
    fallback: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      [pseudo("[data-loading-state='loaded']")]: {
        display: "none",
      },
    },
  },
  variants: {
    stroke: {
      true: {
        root: {
          "&::after": {
            content: "''",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            borderRadius: "inherit",
            boxShadow: `inset 0 0 0 ${vars.strokeTrue.enabled.root.strokeWidth} ${vars.strokeTrue.enabled.root.strokeColor}`,
          },
        },
      },
      false: {},
    },
    rounded: {
      true: {
        root: {
          borderRadius: vars.roundedTrue.enabled.root.cornerRadius,
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    stroke: false,
    rounded: false,
  },
});

export default imageFrame;
