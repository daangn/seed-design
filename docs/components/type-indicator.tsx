import { IconHashLine, IconTimerLine } from "@karrotmarket/react-monochrome-icon";
import { AST } from "@seed-design/rootage-core";
import { IconLayers, IconRuler, IconSpline } from "./icons";

// Gradient를 CSS linear-gradient로 변환하는 유틸리티 함수
function gradientToCss(gradient: AST.GradientLit): string {
  const stops = gradient.stops
    .map((stop) => `${stop.color.value} ${(stop.position.value * 100).toFixed(1)}%`)
    .join(", ");
  return `linear-gradient(to right, ${stops})`;
}

// Gradient 정보를 텍스트로 변환하는 함수
function gradientToText(gradient: AST.GradientLit): string {
  const stops = gradient.stops
    .map((stop) => `${stop.color.value} at ${(stop.position.value * 100).toFixed(1)}%`)
    .join(", ");
  return `Gradient: ${stops}`;
}

// GradientSwatch 컴포넌트
function GradientSwatch(props: { gradient: AST.GradientLit }) {
  const { gradient } = props;
  const gradientCss = gradientToCss(gradient);
  const gradientText = gradientToText(gradient);

  return (
    <div
      className="w-4 h-4 flex-none rounded-full"
      style={{ background: gradientCss }}
      title={gradientText}
      aria-label={gradientText}
    />
  );
}

export function TypeIndicator(props: { value: AST.ValueLit }) {
  const { value } = props;

  if (value.kind === "ColorHexLit") {
    return (
      <div
        className="w-4 h-4 flex-none rounded-full border"
        style={{ backgroundColor: value.value }}
      />
    );
  }

  if (value.kind === "DimensionLit") {
    return (
      <div>
        <IconRuler className="w-4 h-4 flex-none" />
      </div>
    );
  }

  if (value.kind === "DurationLit") {
    return (
      <div>
        <IconTimerLine className="w-4 h-4 flex-none" />
      </div>
    );
  }

  if (value.kind === "NumberLit") {
    return (
      <div>
        <IconHashLine className="w-4 h-4 flex-none" />
      </div>
    );
  }

  if (value.kind === "ShadowLit") {
    return (
      <div>
        <IconLayers className="w-4 h-4 flex-none" />
      </div>
    );
  }

  if (value.kind === "CubicBezierLit") {
    return (
      <div>
        <IconSpline className="w-4 h-4 flex-none" />
      </div>
    );
  }

  if (value.kind === "GradientLit") {
    return <GradientSwatch gradient={value} />;
  }

  return null;
}
