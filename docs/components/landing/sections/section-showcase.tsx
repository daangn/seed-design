import { IconSeedArrow } from "@/components/icon-seed-arrow";
import Image from "next/image";
import Link from "next/link";
import { InfiniteCarousel } from "../components/infinite-carousel";
import { RevealText } from "../components/reveal-text";
import {
  REGIONS,
  SHOWCASE_ROW_BOTTOM,
  SHOWCASE_ROW_TOP,
  SHOWCASE_TITLE,
  type ShowcaseItem,
  Z,
} from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

function ShowcaseCard({ item, isDuplicate }: { item: ShowcaseItem; isDuplicate: boolean }) {
  return (
    <Link
      href={item.href}
      tabIndex={isDuplicate ? -1 : undefined}
      data-cursor="text"
      data-cursor-text="더보기"
      className="flex w-[250px] shrink-0 flex-col gap-[4px] rounded-r2_5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring lg:w-[430px] lg:gap-2.5 lg:rounded-r3"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-r2_5 md:rounded-r3">
        <Image src={item.image} alt="" fill sizes="430px" className="object-cover" />
      </div>
      {/* Title + internal-link chevron (→). Shown only on coarse pointers (touch),
          where the "더보기" cursor isn't available; hidden on desktop via pointer:fine. */}
      <span className="flex items-center gap-1 text-[16px] font-medium leading-[21.58px] text-white">
        {item.title}
        <IconSeedArrow className="size-4 [@media(pointer:fine)]:hidden" />
      </span>
    </Link>
  );
}

/**
 * Section 5 — Showcase.
 * Dark (#121212) stage that covers the values section. Heading reveals word-by-word
 * from behind masks (`data-showcase-heading`, same as the 04 Values / 06 Blog titles),
 * then the two marquee rows (`data-showcase-rows`): top drifts right, bottom drifts
 * left. Mobile stacks with top padding.
 */
export function SectionShowcase({ motionEnabled }: { motionEnabled: boolean }) {
  return (
    <SectionLayer
      id="showcase"
      z={Z.showcase}
      regionVh={REGIONS.showcase}
      panelClassName="bg-[#121212]"
      // Mobile flow: overlap the dark section above by 1px so Lenis sub-pixel scroll
      // offsets can't leave a hairline of the orange <main> bg between dark panels.
      // Desktop stacks via sticky z-index, so no seam there — reset with md:mt-0.
      sectionClassName="-mt-px md:mt-0"
      mobileStack
    >
      <div
        data-showcase-content
        className="flex h-full w-full flex-col justify-center gap-10 pt-[100px] lg:pt-0"
      >
        <div
          data-showcase-heading
          className="w-full pl-[30px] pr-[40px] lg:mx-auto lg:max-w-[1200px] lg:px-6"
        >
          <RevealText
            as="h2"
            text={SHOWCASE_TITLE}
            className="text-[28px] font-bold leading-[1.3] text-white lg:text-[52px]"
          />
        </div>

        <div data-showcase-rows className="flex flex-col gap-5">
          <div data-showcase-row>
            <InfiniteCarousel
              items={SHOWCASE_ROW_TOP}
              direction="right"
              speed={48}
              gapClassName="gap-[10px] lg:gap-5"
              motionEnabled={motionEnabled}
              renderItem={(item, _index, { isDuplicate }) => (
                <ShowcaseCard item={item} isDuplicate={isDuplicate} />
              )}
            />
          </div>
          <div data-showcase-row>
            <InfiniteCarousel
              items={SHOWCASE_ROW_BOTTOM}
              direction="left"
              speed={48}
              gapClassName="gap-[10px] lg:gap-5"
              motionEnabled={motionEnabled}
              renderItem={(item, _index, { isDuplicate }) => (
                <ShowcaseCard item={item} isDuplicate={isDuplicate} />
              )}
            />
          </div>
        </div>
      </div>
    </SectionLayer>
  );
}
