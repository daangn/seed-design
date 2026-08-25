import { HStack, Text, VStack } from "@seed-design/react";
import { textVariantMap } from "@seed-design/css/recipes/text";
import { vars, type FontWeight } from "@seed-design/css/vars";
import { vars as typographyVars } from "@seed-design/css/vars/component/typography";
import fontSizeArtifact from "@seed-design/rootage-artifacts/font-size";
import lineHeightArtifact from "@seed-design/rootage-artifacts/line-height";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import * as React from "react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { Callout } from "seed-design/ui/callout";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";

declare module "@stackflow/config" {
  interface Register {
    ActivityTypographyScale: {};
  }
}

const SAMPLE = "당근 Ag 12";

const WEIGHTS = [
  { suffix: "Regular", token: "regular" },
  { suffix: "Medium", token: "medium" },
  { suffix: "Bold", token: "bold" },
] as const satisfies ReadonlyArray<{ suffix: string; token: FontWeight }>;

type DimensionTokens = Record<
  string,
  { values: { default: { value: { value: number; unit: string } } } }
>;

const FONT_SIZE: DimensionTokens = fontSizeArtifact.data.tokens;
const LINE_HEIGHT: DimensionTokens = lineHeightArtifact.data.tokens;

/**
 * Rootage holds the value a token is *meant* to have, before the CSS pipeline
 * wraps it in clamp() or divides it by --seed-static-scale. That makes it the
 * right source for the raw px / raw rem baselines: they have to stay outside
 * whatever the pipeline does to the tokens they are being compared against.
 */
function cssLength(tokens: DimensionTokens, tokenKey: string) {
  const dimension = tokens[tokenKey]?.values.default.value;
  if (!dimension) return undefined;

  return `${dimension.value}${dimension.unit}`;
}

const STEPS = Object.keys(FONT_SIZE)
  .map((key) => key.slice("$font-size.".length))
  .filter((step) => !step.endsWith("-static"));

type TextStyle = (typeof textVariantMap.textStyle)[number];

const TEXT_STYLES: ReadonlySet<string> = new Set(textVariantMap.textStyle);

const isTextStyle = (name: string): name is TextStyle => TEXT_STYLES.has(name);

/**
 * `textStyle` names are assembled rather than looked up, so a change to the
 * naming convention leaves a row without a sample instead of failing the build.
 */
const textStyleFor = (step: string, weight: string, scaling: "dynamic" | "static") => {
  const name = scaling === "static" ? `${step}Static${weight}` : `${step}${weight}`;

  return isTextStyle(name) ? name : undefined;
};

const STEP_TEXT_STYLES: ReadonlySet<string> = new Set(
  STEPS.flatMap((step) =>
    WEIGHTS.flatMap((weight) => [`${step}${weight.suffix}`, `${step}Static${weight.suffix}`]),
  ),
);

const NAMED_STYLES = textVariantMap.textStyle.filter((style) => !STEP_TEXT_STYLES.has(style));

/** `textStyleArticleBody` -> `articleBody`, so a `textStyle` value indexes it directly. */
const NAMED_STYLE_TOKENS = new Map(
  Object.entries(typographyVars).map(([key, value]) => [
    key.replace(/^textStyle(.)/, (_, initial: string) => initial.toLowerCase()),
    value.enabled.root,
  ]),
);

const FONT_WEIGHTS: ReadonlySet<string> = new Set(Object.keys(vars.$fontWeight));

const isFontWeight = (name: string): name is FontWeight => FONT_WEIGHTS.has(name);

/** `var(--seed-font-weight-bold)` -> `bold`, the name the Text prop takes. */
function fontWeightFrom(cssVar: string) {
  const prefix = "var(--seed-font-weight-";
  if (!cssVar.startsWith(prefix) || !cssVar.endsWith(")")) return undefined;

  const name = cssVar.slice(prefix.length, -1);

  return isFontWeight(name) ? name : undefined;
}

/** `var(--seed-font-size-t10)` -> `$font-size.t10-static`, the nominal px twin. */
function staticTokenKey(cssVar: string, group: "font-size" | "line-height") {
  const prefix = `var(--seed-${group}-`;
  if (!cssVar.startsWith(prefix) || !cssVar.endsWith(")")) return undefined;

  const step = cssVar.slice(prefix.length, -1);

  return step.endsWith("-static") ? `$${group}.${step}` : `$${group}.${step}-static`;
}

function SpecimenRow({
  label,
  lineHeight,
  children,
}: {
  label: string;
  lineHeight: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <HStack gap="x1_5" alignItems="flex-start">
      <Text
        textStyle="t1Regular"
        color="fg.neutralMuted"
        whiteSpace="nowrap"
        style={{ display: "block", width: "60px", flexShrink: 0 }}
      >
        {label}
      </Text>
      <div
        aria-hidden
        style={{
          width: "3px",
          height: lineHeight,
          flexShrink: 0,
          borderRadius: vars.$radius.r1,
          background: vars.$color.fg.neutralMuted,
        }}
      />
      <div
        style={{
          flexGrow: 1,
          minWidth: 0,
          overflow: "hidden",
          borderRadius: vars.$radius.r1,
          background: vars.$color.bg.neutralWeak,
        }}
      >
        {children}
      </div>
    </HStack>
  );
}

function Sample({
  textStyle,
  fontSize,
  lineHeight,
  fontWeight,
}: {
  textStyle?: TextStyle;
  fontSize?: string;
  lineHeight?: string;
  fontWeight?: FontWeight;
}) {
  return (
    <Text
      textStyle={textStyle}
      fontSize={fontSize}
      lineHeight={lineHeight}
      fontWeight={fontWeight}
      whiteSpace="nowrap"
      style={{ display: "block" }}
    >
      {SAMPLE}
    </Text>
  );
}

const ActivityTypographyScale: StaticActivityComponentType<"ActivityTypographyScale"> = () => {
  const [weight, setWeight] = React.useState<(typeof WEIGHTS)[number]>(WEIGHTS[0]);

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Typography Scale" />
      </AppBar>
      <AppScreenContent>
        <VStack
          gap="spacingY.componentDefault"
          px="spacingX.globalGutter"
          pb="spacingY.screenBottom"
        >
          <Callout
            tone="informative"
            title="폰트 스케일링 검증"
            description="Android WebView는 시스템 글꼴 크기에 맞춰 textZoom을 겁니다. dynamic·raw px·raw rem은 함께 커지는 것이 정상이고, static 토큰만 왼쪽 기준 막대에 붙어 있어야 합니다. 현재 배율 값은 Font Multiplier Layout 화면에서 확인할 수 있습니다."
          />

          <SegmentedControl
            value={weight.suffix}
            onValueChange={(value) => {
              const next = WEIGHTS.find((candidate) => candidate.suffix === value);
              if (next) setWeight(next);
            }}
            aria-label="Font weight"
          >
            {WEIGHTS.map((candidate) => (
              <SegmentedControlItem key={candidate.suffix} value={candidate.suffix}>
                {candidate.suffix}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>

          <VStack gap="x1">
            <Text textStyle="t3Bold" color="fg.neutral">
              읽는 법
            </Text>
            <Text textStyle="t2Regular" color="fg.neutralMuted">
              세로 막대 = 그 단계의 기준 line-height를 px로 고정한 자
            </Text>
            <Text textStyle="t2Regular" color="fg.neutralMuted">
              dynamic = fontSize.t5 / static = fontSize.t5Static
            </Text>
            <Text textStyle="t2Regular" color="fg.neutralMuted">
              raw px, raw rem = SEED 토큰 없이 직접 지정한 값
            </Text>
          </VStack>

          {STEPS.map((step) => {
            const staticFontSize = cssLength(FONT_SIZE, `$font-size.${step}-static`);
            const staticLineHeight = cssLength(LINE_HEIGHT, `$line-height.${step}-static`);

            return (
              <VStack key={step} gap="x1">
                <HStack gap="x1_5" alignItems="flex-end">
                  <Text textStyle="t4Bold" color="fg.neutral">
                    {step}
                  </Text>
                  <Text textStyle="t2Regular" color="fg.neutralMuted">
                    {staticFontSize} / {staticLineHeight}
                  </Text>
                </HStack>

                <SpecimenRow label="dynamic" lineHeight={staticLineHeight}>
                  <Sample textStyle={textStyleFor(step, weight.suffix, "dynamic")} />
                </SpecimenRow>

                <SpecimenRow label="static" lineHeight={staticLineHeight}>
                  <Sample textStyle={textStyleFor(step, weight.suffix, "static")} />
                </SpecimenRow>

                <SpecimenRow label="raw px" lineHeight={staticLineHeight}>
                  <Sample
                    fontSize={staticFontSize}
                    lineHeight={staticLineHeight}
                    fontWeight={weight.token}
                  />
                </SpecimenRow>

                <SpecimenRow label="raw rem" lineHeight={staticLineHeight}>
                  <Sample
                    fontSize={cssLength(FONT_SIZE, `$font-size.${step}`)}
                    lineHeight={cssLength(LINE_HEIGHT, `$line-height.${step}`)}
                    fontWeight={weight.token}
                  />
                </SpecimenRow>
              </VStack>
            );
          })}

          <VStack gap="x1">
            <Text textStyle="t4Bold" color="fg.neutral">
              이름 있는 텍스트 스타일
            </Text>
            <Text textStyle="t2Regular" color="fg.neutralMuted">
              static 대응이 없어 항상 스케일링을 따라갑니다.
            </Text>
          </VStack>

          {NAMED_STYLES.map((style) => {
            const tokens = NAMED_STYLE_TOKENS.get(style);
            const fontSizeKey = tokens && staticTokenKey(tokens.fontSize, "font-size");
            const lineHeightKey = tokens && staticTokenKey(tokens.lineHeight, "line-height");
            const staticFontSize = fontSizeKey && cssLength(FONT_SIZE, fontSizeKey);
            const staticLineHeight = lineHeightKey && cssLength(LINE_HEIGHT, lineHeightKey);

            return (
              <VStack key={style} gap="x1">
                <HStack gap="x1_5" alignItems="flex-end">
                  <Text textStyle="t4Bold" color="fg.neutral">
                    {style}
                  </Text>
                  <Text textStyle="t2Regular" color="fg.neutralMuted">
                    {staticFontSize} / {staticLineHeight}
                  </Text>
                </HStack>

                <SpecimenRow label="dynamic" lineHeight={staticLineHeight}>
                  <Sample textStyle={style} />
                </SpecimenRow>

                <SpecimenRow label="raw px" lineHeight={staticLineHeight}>
                  <Sample
                    fontSize={staticFontSize}
                    lineHeight={staticLineHeight}
                    fontWeight={tokens && fontWeightFrom(tokens.fontWeight)}
                  />
                </SpecimenRow>
              </VStack>
            );
          })}
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityTypographyScale;
