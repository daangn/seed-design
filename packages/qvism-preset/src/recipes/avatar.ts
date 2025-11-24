import { defineSlotRecipe } from "../utils/define";
import { not, pseudo } from "../utils/pseudo";
import { avatar as vars } from "../vars/component";
import type { Properties } from "csstype";

const CIRCLE_SVG_MASK =
  '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="white"/></svg>';
const FLOWER_SVG_MASK =
  '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path shape-rendering="crispEdges" fill-rule="evenodd" clip-rule="evenodd" d="M29.9115 8C28.4089 5.42609 25.682 4.02087 22.8994 4.10435C21.5637 1.68348 19.0037 0 15.9985 0C12.9933 0 10.4333 1.65565 9.09762 4.10435C6.32893 4.03478 3.60197 5.42609 2.09936 8C0.596754 10.5739 0.76371 13.6348 2.19675 16C0.749797 18.3652 0.596754 21.4261 2.09936 24C3.60197 26.5739 6.32893 27.9791 9.11154 27.8957C10.4472 30.3165 13.0072 32 16.0124 32C19.0176 32 21.5776 30.3443 22.9133 27.8957C25.682 27.9652 28.4089 26.5739 29.9115 24C31.4141 21.4261 31.2472 18.3652 29.8141 16C31.2611 13.6348 31.4141 10.5739 29.9115 8Z" fill="white"/></svg>';
const SHIELD_SVG_MASK =
  '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.137 31.4527C18.1171 31.4616 18.0943 31.4721 18.0531 31.491C18.046 31.4943 18.0356 31.4994 18.0221 31.5059C17.8282 31.5996 16.9959 32.0019 16.0001 32C15.0096 32.002 14.1895 31.6075 13.986 31.5096L13.8629 31.4527C13.5452 31.3105 13.1039 31.1059 12.5795 30.8436C11.541 30.3242 10.1273 29.554 8.68691 28.5676C7.2706 27.5976 5.67543 26.3154 4.39746 24.7323C3.12739 23.159 1.92743 20.9794 1.92743 18.3179V7.77468C1.92743 6.02645 3.02031 4.4647 4.66276 3.86583L14.5747 0.25173C15.4953 -0.0839101 16.5047 -0.0839101 17.4252 0.25173L27.3372 3.86583C28.9796 4.4647 30.0725 6.02646 30.0725 7.77468V18.3179C30.0725 20.9794 28.8726 23.159 27.6025 24.7323C26.3245 26.3154 24.7294 27.5976 23.313 28.5676C21.8727 29.554 20.4589 30.3242 19.4205 30.8436C18.8961 31.1059 18.4547 31.3106 18.137 31.4527Z" fill="white"/></svg>';

function toDataUrl(svg: string) {
  return `url('data:image/svg+xml;utf8,${svg}')`;
}

const mask: Properties = {
  // NOTE: 얇은 선이 남는 현상을 방지하기 위해 borderRadius 대신 원형 SVG 마스크를 사용합니다.
  WebkitMaskImage: `${toDataUrl(CIRCLE_SVG_MASK)}, var(--svg-mask-uri)`,
  WebkitMaskSize:
    "100% 100%, var(--badge-mask-size) var(--badge-mask-size)" /* SVG 마스크 크기 제어 */,
  WebkitMaskPosition:
    "0 0, var(--badge-mask-offset) var(--badge-mask-offset)" /* SVG 마스크 위치/오프셋 제어 */,
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskComposite: "source-out" /* SVG 모양(source)을 제외(out) */,

  // 표준 브라우저 속성
  maskImage: `${toDataUrl(CIRCLE_SVG_MASK)}, var(--svg-mask-uri)`,
  maskSize: "100% 100%, var(--badge-mask-size) var(--badge-mask-size)",
  maskPosition: "0 0, var(--badge-mask-offset) var(--badge-mask-offset)",
  maskRepeat: "no-repeat",
  maskComposite: "subtract",

  transform: "translateZ(0)",
};

const avatar = defineSlotRecipe({
  name: "avatar",
  slots: ["root", "image", "fallback", "badge"],
  base: {
    root: {
      boxSizing: "border-box",
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      verticalAlign: "top",

      borderRadius: vars.base.enabled.root.cornerRadius,
      width: "var(--avatar-size)",
      height: "var(--avatar-size)",

      "&:after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        borderRadius: vars.base.enabled.root.cornerRadius,
        boxShadow: `inset 0 0 0 var(--avatar-stroke-width) ${vars.base.enabled.root.strokeColor}`,

        ...mask,
      },
    },
    image: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      overflow: "hidden",

      ...mask,

      [pseudo(not("[data-loading-state='loaded']"))]: {
        display: "none",
      },
    },
    fallback: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      overflow: "hidden",
      borderRadius: vars.base.enabled.root.cornerRadius,

      ...mask,

      [pseudo("[data-loading-state='loaded']")]: {
        display: "none",
      },
    },
    badge: {
      boxSizing: "border-box",
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1,

      top: "var(--badge-offset)",
      left: "var(--badge-offset)",
      width: "var(--badge-size)",
      height: "var(--badge-size)",
    },
  },
  variants: {
    size: {
      20: {
        root: {
          "--avatar-size": vars.size20.enabled.root.size,
          "--avatar-stroke-width": vars.size20.enabled.root.strokeWidth,
          "--badge-mask-size": "0px", // 20px에서 뱃지를 사용하지 않음
          "--badge-mask-offset": "0px", // 20px에서 뱃지를 사용하지 않음
        },
        badge: {
          display: "none",
        },
      },
      24: {
        root: {
          "--avatar-size": vars.size24.enabled.root.size,
          "--avatar-stroke-width": vars.size24.enabled.root.strokeWidth,
          "--badge-mask-size": vars.size24.enabled.badgeMask.size,
          "--badge-mask-offset": vars.size24.enabled.badgeMask.offset,
        },
        badge: {
          "--badge-size": vars.size24.enabled.badge.size,
          "--badge-offset": vars.size24.enabled.badge.offset,
        },
      },
      36: {
        root: {
          "--avatar-size": vars.size36.enabled.root.size,
          "--avatar-stroke-width": vars.size36.enabled.root.strokeWidth,
          "--badge-mask-size": vars.size36.enabled.badgeMask.size,
          "--badge-mask-offset": vars.size36.enabled.badgeMask.offset,
        },
        badge: {
          "--badge-size": vars.size36.enabled.badge.size,
          "--badge-offset": vars.size36.enabled.badge.offset,
        },
      },
      42: {
        root: {
          "--avatar-size": vars.size42.enabled.root.size,
          "--avatar-stroke-width": vars.size42.enabled.root.strokeWidth,
          "--badge-mask-size": vars.size42.enabled.badgeMask.size,
          "--badge-mask-offset": vars.size42.enabled.badgeMask.offset,
        },
        badge: {
          "--badge-size": vars.size42.enabled.badge.size,
          "--badge-offset": vars.size42.enabled.badge.offset,
        },
      },
      48: {
        root: {
          "--avatar-size": vars.size48.enabled.root.size,
          "--avatar-stroke-width": vars.size48.enabled.root.strokeWidth,
          "--badge-mask-size": vars.size48.enabled.badgeMask.size,
          "--badge-mask-offset": vars.size48.enabled.badgeMask.offset,
        },
        badge: {
          "--badge-size": vars.size48.enabled.badge.size,
          "--badge-offset": vars.size48.enabled.badge.offset,
        },
      },
      64: {
        root: {
          "--avatar-size": vars.size64.enabled.root.size,
          "--avatar-stroke-width": vars.size64.enabled.root.strokeWidth,
          "--badge-mask-size": vars.size64.enabled.badgeMask.size,
          "--badge-mask-offset": vars.size64.enabled.badgeMask.offset,
        },
        badge: {
          "--badge-size": vars.size64.enabled.badge.size,
          "--badge-offset": vars.size64.enabled.badge.offset,
        },
      },
      80: {
        root: {
          "--avatar-size": vars.size80.enabled.root.size,
          "--avatar-stroke-width": vars.size80.enabled.root.strokeWidth,
          "--badge-mask-size": vars.size80.enabled.badgeMask.size,
          "--badge-mask-offset": vars.size80.enabled.badgeMask.offset,
        },
        badge: {
          "--badge-size": vars.size80.enabled.badge.size,
          "--badge-offset": vars.size80.enabled.badge.offset,
        },
      },
      96: {
        root: {
          "--avatar-size": vars.size96.enabled.root.size,
          "--avatar-stroke-width": vars.size96.enabled.root.strokeWidth,
          "--badge-mask-size": vars.size96.enabled.badgeMask.size,
          "--badge-mask-offset": vars.size96.enabled.badgeMask.offset,
        },
        badge: {
          "--badge-size": vars.size96.enabled.badge.size,
          "--badge-offset": vars.size96.enabled.badge.offset,
        },
      },
      108: {
        root: {
          "--avatar-size": vars.size108.enabled.root.size,
          "--avatar-stroke-width": vars.size108.enabled.root.strokeWidth,
          "--badge-mask-size": vars.size108.enabled.badgeMask.size,
          "--badge-mask-offset": vars.size108.enabled.badgeMask.offset,
        },
        badge: {
          "--badge-size": vars.size108.enabled.badge.size,
          "--badge-offset": vars.size108.enabled.badge.offset,
        },
      },
    },
    badgeMask: {
      none: {
        root: {
          "--svg-mask-uri": toDataUrl("<svg />"),
        },
      },
      circle: {
        root: {
          "--svg-mask-uri": toDataUrl(CIRCLE_SVG_MASK),
        },
        badge: {
          borderRadius: "9999px",
        },
      },
      flower: {
        root: {
          "--svg-mask-uri": toDataUrl(FLOWER_SVG_MASK),
        },
      },
      shield: {
        root: {
          "--svg-mask-uri": toDataUrl(SHIELD_SVG_MASK),
        },
      },
    },
  },
  defaultVariants: {
    size: 48,
    badgeMask: "none",
  },
});

export default avatar;
