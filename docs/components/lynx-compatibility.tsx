import { getEffectiveLynxCompatibility, type LynxCompatibility } from "@/lib/lynx-compatibility";
import { Badge } from "./mdx-badge";

interface LynxCompatibilityBadgesProps {
  compatibility?: LynxCompatibility;
}

function LynxIcon() {
  return (
    <span
      aria-hidden="true"
      className="size-x4 shrink-0 bg-current"
      style={{
        WebkitMaskImage: "url('/lynx.svg')",
        maskImage: "url('/lynx.svg')",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

export function LynxCompatibilityBadges({ compatibility }: LynxCompatibilityBadgesProps) {
  if (!compatibility) return null;
  const effectiveCompatibility = getEffectiveLynxCompatibility(compatibility);
  const xElements = effectiveCompatibility["x-elements"];

  return (
    <section
      className="not-prose -mt-8 mb-3 flex flex-wrap items-center gap-x2 gap-y2"
      aria-label="Lynx 호환 정보"
    >
      <Badge tone="positive" className="inline-flex items-center gap-x1">
        <LynxIcon />
        <span>Engine ≥ {effectiveCompatibility.engine}</span>
      </Badge>

      {!!xElements &&
        xElements.map(({ name }) => (
          <Badge key={name}>
            <code>{`<${name}>`}</code>
          </Badge>
        ))}
    </section>
  );
}

// <span
//   key={name}
//   className="inline-flex items-center rounded-full bg-bg-transparent-selected px-x2 py-x1 text-xs font-medium text-fg-neutral"
// >
//   XElement · {name} ≥ {version}
// </span>
