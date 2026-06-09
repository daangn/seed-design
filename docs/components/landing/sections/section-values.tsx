import { ImageFrame } from "@seed-design/react";
import { DARK_BG, REGIONS, VALUE_CARDS, Z } from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

/**
 * Section 4 — Values.
 * Dark stage that covers the intro. Three value cards (`data-value-card`) fade in
 * with a small stagger.
 */
export function SectionValues() {
  return (
    <SectionLayer id="values" z={Z.values} regionVh={REGIONS.values}>
      <div className="flex h-full w-full items-center" style={{ backgroundColor: DARK_BG }}>
        <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 gap-x-8 gap-y-10 px-6 md:grid-cols-3">
          {VALUE_CARDS.map((card) => (
            <article key={card.title} data-value-card className="flex flex-col gap-5">
              <ImageFrame
                src={card.image}
                alt=""
                ratio={4 / 3}
                borderRadius="r2"
                className="w-full"
              />
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-white/60">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionLayer>
  );
}
