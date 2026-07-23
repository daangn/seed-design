import gradientTokens from "@seed-design/rootage-artifacts/gradient.json" with { type: "json" };
import spec from "@seed-design/rootage-artifacts/components/scroll-fog.json" with { type: "json" };
import { defineRecipe } from "../utils/define";

// fog 마스크는 stop별 원본 position(0~1)이 있어야 만들 수 있어서, 평탄한 CSS 문자열로 내려오는
// vars 대신 rootage 산출물 JSON에서 토큰을 직접 읽는다. 어떤 토큰을 쓰는지는 spec이 단일 출처이므로
// 토큰 이름을 여기 하드코딩하지 않고 spec의 참조를 따라간다.
const gradientRef = spec.data.definitions
  .find((definition) => Object.keys(definition.variants).length === 0)
  ?.definitions.find((definition) => definition.states.includes("enabled"))?.slots.root
  .gradient.value;

const gradientTokenTable: Record<
  string,
  { values: Record<"theme-light" | "theme-dark", { value: { color: string; position: number }[] }> }
> = gradientTokens.data.tokens;

const fadeMask = gradientRef ? gradientTokenTable[gradientRef]?.values : undefined;

if (!fadeMask) {
  throw new Error(`scroll-fog: gradient token "${gradientRef}" not found in rootage artifacts.`);
}

// 해석된 리터럴 색이 CSS에 그대로 구워지므로 테마 시스템(var 간접 참조)을 우회한다.
// 테마 불변(alpha만 있는) 토큰에만 허용되는 패턴이며, 이 가드가 전제를 빌드 타임에 강제한다.
if (JSON.stringify(fadeMask["theme-light"]) !== JSON.stringify(fadeMask["theme-dark"])) {
  throw new Error(
    `scroll-fog: gradient token "${gradientRef}" must be theme-invariant — its stops are baked into CSS as literal colors.`,
  );
}

const fogStops = fadeMask["theme-light"].value;

const buildMask = (direction: string, scrollableVar: string, sizeVar: string) =>
  `linear-gradient(${direction}, ${fogStops
    .map(({ color, position }) =>
      position === 0
        ? `${color} 0`
        : `${color} calc(var(${scrollableVar}) * var(${sizeVar}) * ${position})`,
    )
    .join(", ")})`;

// 4-directional gradients for fog effect
const maskImage = [
  buildMask("to bottom", "--scrollable-top", "--scroll-fog-size-top"),
  buildMask("to top", "--scrollable-bottom", "--scroll-fog-size-bottom"),
  buildMask("to right", "--scrollable-left", "--scroll-fog-size-left"),
  buildMask("to left", "--scrollable-right", "--scroll-fog-size-right"),
].join(", ");

const scrollFog = defineRecipe({
  name: "scroll-fog",
  base: {
    position: "relative",
    overflow: "auto",
    height: "100%",
    width: "100%",

    maskImage,
    WebkitMaskImage: maskImage,
    maskSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%",
    WebkitMaskSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskComposite: "intersect",
    WebkitMaskComposite: "source-in",
  },
  variants: {
    hideScrollBar: {
      true: {
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      },
    },
  },
  defaultVariants: {
    hideScrollBar: false,
  },
});

export default scrollFog;
