import { HeroVideo } from "../components/hero-video";
import { ManagedVideo } from "../components/managed-video";
import { ScrubLottie } from "../components/scrub-lottie";
import {
  BENTO,
  BENTO_MOBILE,
  BENTO_MOBILE_DESCRIPTION,
  BENTO_MOBILE_TITLE,
  HERO_POSTER_MOBILE,
  HERO_VIDEO_MOBILE,
  REGIONS,
  type VideoSet,
  Z,
} from "../lib/landing-content";
import type { LandingMode } from "../lib/landing-environment";
import { SectionLayer } from "../section-layer";

interface SectionBentoProps {
  lottieEnabled: boolean;
  lottieMotionEnabled: boolean;
  mode: LandingMode;
  mp4PlaybackEnabled: boolean;
  prefersReducedMotion: boolean;
}

interface BentoLottieProps {
  enabled: boolean;
  motionEnabled: boolean;
  src: string;
}

function BentoLottie({ enabled, motionEnabled, src }: BentoLottieProps) {
  if (!enabled) return null;

  return (
    <ScrubLottie
      key={motionEnabled ? "animated" : "static"}
      src={src}
      autoplay={motionEnabled}
      loop={motionEnabled}
      fill
      className="size-full"
    />
  );
}

function SlotVideo({ enabled, set }: { enabled: boolean; set: VideoSet }) {
  return (
    <ManagedVideo
      playbackEnabled={enabled}
      poster={set.poster}
      wrapperClassName="size-full"
      className="size-full scale-[1.04] object-cover"
      sources={[
        { media: "(max-width: 767px)", src: set.low, type: "video/mp4" },
        ...(set.mid ? [{ media: "(max-width: 1439px)", src: set.mid, type: "video/mp4" }] : []),
        { src: set.high, type: "video/mp4" },
      ]}
      muted
      loop
      playsInline
      aria-hidden="true"
    />
  );
}

function CompactBento({
  lottieEnabled,
  lottieMotionEnabled,
  mp4PlaybackEnabled,
  prefersReducedMotion,
}: Omit<SectionBentoProps, "mode">) {
  return (
    <div className="mx-auto flex w-full flex-col pt-[74px]">
      <div className="relative mx-4 overflow-hidden rounded-r2_5">
        <HeroVideo
          prefersReducedMotion={prefersReducedMotion}
          resolved={lottieEnabled}
          src={HERO_VIDEO_MOBILE}
          poster={HERO_POSTER_MOBILE}
          wrapperClassName="aspect-[1074/1344] w-full"
          videoClassName="size-full scale-[1.002] object-cover"
          buttonClassName="bottom-3 right-3"
        />
      </div>

      <h1
        data-bento-mobile-reveal
        className="mt-5 whitespace-pre-line pl-[30px] pr-[44px] text-[32px] font-bold leading-[1.25] text-[#1B1B1B]"
      >
        {BENTO_MOBILE_TITLE}
      </h1>

      <p
        data-bento-mobile-reveal
        className="mt-[14px] t5-regular break-keep pl-[30px] pr-[36px] text-pretty text-palette-gray-700"
      >
        {BENTO_MOBILE_DESCRIPTION}
      </p>

      <div data-bento-mobile-grid className="mb-[30px] mt-20 flex gap-[10px] px-4">
        <div data-bento-mobile-tile className="h-[341px] flex-1 overflow-hidden rounded-r2_5">
          <ManagedVideo
            playbackEnabled={mp4PlaybackEnabled}
            src={BENTO_MOBILE.icon.src}
            poster={BENTO_MOBILE.icon.poster}
            wrapperClassName="size-full"
            className="size-full scale-[1.002] object-cover"
            muted
            loop
            playsInline
            aria-hidden="true"
          />
        </div>

        <div className="flex w-[142px] flex-col gap-[10px]">
          <div
            data-bento-mobile-tile
            className="h-[142px] overflow-hidden rounded-r2_5 bg-[#1a1c20]"
          >
            <BentoLottie
              enabled={lottieEnabled}
              motionEnabled={lottieMotionEnabled}
              src={BENTO_MOBILE.pinLottie}
            />
          </div>

          <div data-bento-mobile-tile className="h-[189px] overflow-hidden rounded-r2_5">
            <ManagedVideo
              playbackEnabled={mp4PlaybackEnabled}
              src={BENTO_MOBILE.manner.src}
              poster={BENTO_MOBILE.manner.poster}
              wrapperClassName="size-full"
              className="size-full scale-[1.002] object-cover"
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopBento({
  lottieEnabled,
  lottieMotionEnabled,
  mp4PlaybackEnabled,
}: Omit<SectionBentoProps, "mode" | "prefersReducedMotion">) {
  return (
    <div className="flex w-full flex-col p-1.5 px-6 pb-6 lg:h-full">
      <div className="grid aspect-[3/2] w-full grid-cols-[4fr_3fr_4fr_6fr] grid-rows-3 gap-3 lg:aspect-auto lg:h-full">
        <div
          data-bento-slot
          data-order={0}
          className="col-span-1 col-start-1 row-span-2 row-start-1 overflow-hidden rounded-r3"
        >
          <SlotVideo enabled={mp4PlaybackEnabled} set={BENTO.manner} />
        </div>

        <div
          data-bento-slot
          data-order={1}
          className="col-span-2 col-start-2 row-span-1 row-start-1 overflow-hidden rounded-r3 bg-palette-gray-100"
        >
          <BentoLottie
            enabled={lottieEnabled}
            motionEnabled={lottieMotionEnabled}
            src={BENTO.tabLottie}
          />
        </div>

        <div
          data-bento-slot
          data-order={1}
          className="col-span-1 col-start-2 row-span-1 row-start-2 overflow-hidden rounded-r3 bg-[#1a1c20]"
        >
          <BentoLottie
            enabled={lottieEnabled}
            motionEnabled={lottieMotionEnabled}
            src={BENTO.pinLottie}
          />
        </div>

        <div
          data-bento-slot
          data-order={0}
          className="col-span-2 col-start-1 row-span-1 row-start-3 overflow-hidden rounded-r3"
        >
          <BentoLottie
            enabled={lottieEnabled}
            motionEnabled={lottieMotionEnabled}
            src={BENTO.seedLottie}
          />
        </div>

        <div
          data-bento-slot
          data-order={2}
          className="col-span-1 col-start-3 row-span-2 row-start-2 overflow-hidden rounded-r3"
        >
          <SlotVideo enabled={mp4PlaybackEnabled} set={BENTO.homeService} />
        </div>

        <div
          data-bento-slot
          data-order={3}
          className="col-span-1 col-start-4 row-span-3 row-start-1 overflow-hidden rounded-r3"
        >
          <SlotVideo enabled={mp4PlaybackEnabled} set={BENTO.icon} />
        </div>
      </div>
    </div>
  );
}

export function SectionBento({
  lottieEnabled,
  lottieMotionEnabled,
  mode,
  mp4PlaybackEnabled,
  prefersReducedMotion,
}: SectionBentoProps) {
  return (
    <SectionLayer
      id="bento"
      z={Z.bento}
      regionVh={REGIONS.bento}
      sticky={false}
      mobileStack
      forceStacked={mode === "compact"}
      pinFrom="lg"
      panelClassName="flex flex-col justify-start rounded-b-[20px] bg-white"
      behindClassName="bg-[#121212]"
    >
      {mode === "compact" ? (
        <CompactBento
          lottieEnabled={lottieEnabled}
          lottieMotionEnabled={lottieMotionEnabled}
          mp4PlaybackEnabled={mp4PlaybackEnabled}
          prefersReducedMotion={prefersReducedMotion}
        />
      ) : (
        <DesktopBento
          lottieEnabled={lottieEnabled}
          lottieMotionEnabled={lottieMotionEnabled}
          mp4PlaybackEnabled={mp4PlaybackEnabled}
        />
      )}
    </SectionLayer>
  );
}
