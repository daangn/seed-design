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

/**
 * Section 2 — Bento.
 * Full-bleed white stage with a 20px bottom radius (so the dark section behind
 * peeks through as this layer lifts away). The six slots (`data-bento-slot`)
 * hold real product videos / Lottie motions and assemble on scroll.
 */
export function SectionBento() {
  return (
    <SectionLayer
      id="bento"
      z={Z.bento}
      regionVh={REGIONS.bento}
      panelClassName="rounded-b-[20px] bg-white"
      behindClassName="bg-[#101216]"
    >
      <div className="flex h-full w-full flex-col px-5 pt-24 pb-8">
        <div className="grid h-full w-full grid-cols-12 grid-rows-6 gap-3">
          {/* 1 — manner (video) */}
          <div
            data-bento-slot
            className="col-span-3 col-start-1 row-span-4 row-start-1 overflow-hidden rounded-2xl bg-palette-gray-100"
          >
            <SlotVideo src={BENTO.mannerVideo} />
          </div>

          {/* 2 — seed (video) */}
          <div
            data-bento-slot
            className="col-span-3 col-start-1 row-span-2 row-start-5 overflow-hidden rounded-2xl bg-[#1f6f47]"
          >
            <SlotVideo src={BENTO.seedVideo} />
          </div>

          {/* 3 — tab (lottie) */}
          <div
            data-bento-slot
            className="col-span-5 col-start-4 row-span-3 row-start-1 overflow-hidden rounded-2xl bg-palette-gray-100"
          >
            <ScrubLottie src={BENTO.tabLottie} autoplay loop className="size-full" />
          </div>

          {/* 4 — pin (lottie) */}
          <div
            data-bento-slot
            className="col-span-2 col-start-4 row-span-3 row-start-4 flex items-center justify-center overflow-hidden rounded-2xl bg-[#17171a]"
          >
            <ScrubLottie src={BENTO.pinLottie} autoplay loop className="size-[70%]" />
          </div>

          {/* 5 — home service (video) */}
          <div
            data-bento-slot
            className="col-span-3 col-start-6 row-span-3 row-start-4 overflow-hidden rounded-2xl bg-[#2b2b2e]"
          >
            <SlotVideo src={BENTO.homeServiceVideo} />
          </div>

          {/* 6 — icon (video) */}
          <div
            data-bento-slot
            className="col-span-4 col-start-9 row-span-6 row-start-1 overflow-hidden rounded-2xl bg-palette-carrot-500"
          >
            <SlotVideo src={BENTO.iconVideo} />
          </div>
        </div>
      </div>
    </SectionLayer>
  );
}
