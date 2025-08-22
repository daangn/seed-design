import { AST } from "@seed-design/rootage-core";
import { HourglassIcon, LayersIcon, RulerIcon, SigmaIcon, SplineIcon } from "lucide-react";

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
      className="w-4 h-4 rounded-full"
      style={{ background: gradientCss }}
      title={gradientText}
      aria-label={gradientText}
    />
  );
}

export function TypeIndicator(props: { value: AST.ValueLit }) {
  const { value } = props;

  if (value.kind === "ColorHexLit") {
    return <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: value.value }} />;
  }

  if (value.kind === "DimensionLit") {
    return (
      <div>
        <RulerIcon className="w-4 h-4" />
      </div>
    );
  }

  if (value.kind === "DurationLit") {
    return (
      <div>
        <HourglassIcon className="w-4 h-4" />
      </div>
    );
  }

  if (value.kind === "NumberLit") {
    return (
      <div>
        <SigmaIcon className="w-4 h-4" />
      </div>
    );
  }

  if (value.kind === "ShadowLit") {
    return (
      <div>
        <LayersIcon className="w-4 h-4" />
      </div>
    );
  }

  if (value.kind === "CubicBezierLit") {
    return (
      <div>
        <SplineIcon className="w-4 h-4" />
      </div>
    );
  }

  if (value.kind === "GradientLit") {
    return <GradientSwatch gradient={value} />;
  }

  return null;
}
