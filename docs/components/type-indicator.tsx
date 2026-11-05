import type { AST } from "@seed-design/rootage-core";
import { gradientToCss } from "./rootage";
import { TOKEN_KIND_ICON } from "./token-kind-icon";

// Gradient 정보를 텍스트로 변환하는 함수
function gradientToText(gradient: AST.GradientLit): string {
  const stops = gradient.stops
    .map((stop) => {
      const color = stop.color.kind === "ColorHexLit" ? stop.color.value : stop.color.identifier;
      return `${color} at ${(stop.position.value * 100).toFixed(1)}%`;
    })
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

  if (value.kind === "GradientLit") {
    return <GradientSwatch gradient={value} />;
  }

  const Icon = TOKEN_KIND_ICON[value.kind];
  if (!Icon) return null;

  return (
    <div>
      <Icon className="w-4 h-4 flex-none" />
    </div>
  );
}
