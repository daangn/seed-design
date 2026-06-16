import { ScrubLottie } from "../components/scrub-lottie";
import { BENTO, REGIONS, Z } from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

function SlotVideo({ src }: { src: string }) {
  return (
    <video
      className="size-full object-cover"
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}

/** Shared slot classes: full-width 44vh card on mobile, grid cell from lg up. */
const SLOT = "h-[44vh] overflow-hidden rounded-2xl lg:h-auto";

/**
 * Section 2 — Bento.
 * Full-bleed white stage with a 20px bottom radius (so the dark section behind
 * peeks through as this layer lifts away). Revealed right after the hero video has
 * framed itself into a card; the six slots (`data-bento-slot`) then assemble on
 * scroll, top row first (`data-order`: 0 = top, 1 = row 4, 2 = row 5). Mobile: the
 * grid collapses to a 1-column stack (DOM order = top→bottom).
 */
export function SectionBento() {
  return (
    <SectionLayer
      id="bento"
      z={Z.bento}
      regionVh={REGIONS.bento}
      sticky={false}
      mobileStack
      panelClassName="flex flex-col justify-start rounded-b-[20px] bg-white"
      behindClassName="bg-[#101216]"
    >
      <div className="flex w-full flex-col px-5 pt-20 pb-5 lg:h-[84dvh]">
        <div className="flex w-full flex-col gap-3 lg:grid lg:h-full lg:grid-cols-12 lg:grid-rows-6">
          {/* 1 — manner (video, top row) */}
          <div
            data-bento-slot
            data-order={0}
            className={`${SLOT} bg-palette-gray-100 lg:col-span-3 lg:col-start-1 lg:row-span-4 lg:row-start-1`}
          >
            <SlotVideo src={BENTO.mannerVideo} />
          </div>

          {/* 2 — seed (video, bottom row) */}
          <div
            data-bento-slot
            data-order={2}
            className={`${SLOT} bg-[#1f6f47] lg:col-span-3 lg:col-start-1 lg:row-span-2 lg:row-start-5`}
          >
            <SlotVideo src={BENTO.seedVideo} />
          </div>

          {/* 3 — tab (lottie, top row) */}
          <div
            data-bento-slot
            data-order={0}
            className={`${SLOT} bg-palette-gray-100 lg:col-span-5 lg:col-start-4 lg:row-span-3 lg:row-start-1`}
          >
            <ScrubLottie src={BENTO.tabLottie} autoplay loop className="size-full" />
          </div>

          {/* 4 — pin (lottie, mid row) */}
          <div
            data-bento-slot
            data-order={1}
            className={`${SLOT} flex items-center justify-center bg-[#17171a] lg:col-span-2 lg:col-start-4 lg:row-span-3 lg:row-start-4`}
          >
            <ScrubLottie src={BENTO.pinLottie} autoplay loop className="size-[70%]" />
          </div>

          {/* 5 — home service (video, mid row) */}
          <div
            data-bento-slot
            data-order={1}
            className={`${SLOT} bg-[#2b2b2e] lg:col-span-3 lg:col-start-6 lg:row-span-3 lg:row-start-4`}
          >
            <SlotVideo src={BENTO.homeServiceVideo} />
          </div>

          {/* 6 — icon (video, full-height right column) */}
          <div
            data-bento-slot
            data-order={0}
            className={`${SLOT} bg-palette-carrot-500 lg:col-span-4 lg:col-start-9 lg:row-span-6 lg:row-start-1`}
          >
            <SlotVideo src={BENTO.iconVideo} />
          </div>
        </div>
      </div>
    </SectionLayer>
  );
}
