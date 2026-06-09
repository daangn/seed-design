import Image from "next/image";
import { InfiniteCarousel } from "../components/infinite-carousel";
import {
  REGIONS,
  SHOWCASE_ROW_BOTTOM,
  SHOWCASE_ROW_TOP,
  SHOWCASE_TITLE,
  type ShowcaseItem,
  Z,
} from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

function ShowcaseCard(item: ShowcaseItem) {
  return (
    <div
      key={item.title}
      className="relative aspect-video w-[300px] shrink-0 overflow-hidden rounded-2xl bg-palette-gray-300 md:w-[360px]"
    >
      <Image src={item.image} alt="" fill sizes="360px" className="object-cover" />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent"
      />
      <span className="absolute top-[19px] left-[31px] text-xl font-bold text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
        {item.title}
      </span>
    </div>
  );
}

/**
 * Section 5 — Showcase.
 * Light (gray-200) stage that covers the values section. Heading fades in first
 * (`data-showcase-heading`), then the two marquee rows (`data-showcase-rows`):
 * top drifts right, bottom drifts left.
 */
export function SectionShowcase() {
  return (
    <SectionLayer
      id="showcase"
      z={Z.showcase}
      regionVh={REGIONS.showcase}
      panelClassName="bg-palette-gray-200"
    >
      <div className="flex h-full w-full flex-col justify-center gap-10">
        <div data-showcase-heading className="mx-auto w-full max-w-[1200px] px-6">
          <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-tight text-[#262626]">
            {SHOWCASE_TITLE}
          </h2>
        </div>

        <div data-showcase-rows className="flex flex-col gap-5">
          <InfiniteCarousel
            items={SHOWCASE_ROW_TOP}
            direction="right"
            speed={48}
            renderItem={(item) => <ShowcaseCard {...item} />}
          />
          <InfiniteCarousel
            items={SHOWCASE_ROW_BOTTOM}
            direction="left"
            speed={48}
            renderItem={(item) => <ShowcaseCard {...item} />}
          />
        </div>
      </div>
    </SectionLayer>
  );
}
