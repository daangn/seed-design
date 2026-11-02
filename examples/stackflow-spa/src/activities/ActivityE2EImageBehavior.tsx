import { IconCarrotFill, IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import {
  Flex,
  Icon,
  ImageFrame,
  ImageFrameBadge,
  ImageFrameFloater,
  ImageFrameIcon,
  ImageFrameIndicator,
  ImageFrameReactionButton,
  VStack,
} from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useState } from "react";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityE2EImageBehavior: {};
  }
}

const HELD_IMAGE_URL = "http://e2e.invalid/held.png";
const LAZY_IMAGE_URL = "http://e2e.invalid/lazy.png";
const SAMPLE_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='#6ba6ff'/></svg>",
)}`;

type OverlayKind = "badge" | "icon" | "indicator" | "reaction";

function OverlayFrame({ kind }: { kind: OverlayKind }) {
  const [pressed, setPressed] = useState(false);
  const overlay = {
    badge: (
      <ImageFrameBadge data-testid="overlay-badge" tone="brand" variant="solid">
        NEW
      </ImageFrameBadge>
    ),
    icon: <ImageFrameIcon data-testid="overlay-icon" svg={<IconCarrotFill />} />,
    indicator: <ImageFrameIndicator data-testid="overlay-indicator">+9</ImageFrameIndicator>,
    reaction: (
      <ImageFrameReactionButton
        data-testid="overlay-reaction"
        pressed={pressed}
        onPressedChange={setPressed}
        aria-label="Like"
      />
    ),
  }[kind];

  return (
    <ImageFrame
      data-testid={`overlay-${kind}-frame`}
      ratio={1}
      src={SAMPLE_IMAGE}
      alt={`${kind} overlay fixture`}
      style={{ width: 120 }}
      stroke
    >
      <ImageFrameFloater placement="bottom-end">{overlay}</ImageFrameFloater>
    </ImageFrame>
  );
}

const ActivityE2EImageBehavior: StaticActivityComponentType<"ActivityE2EImageBehavior"> = () => {
  const { push } = useFlow();
  const [fallbackPressed, setFallbackPressed] = useState(false);

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain title="E2E Image Behavior" />
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <Icon svg={<IconHouseLine />} />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <VStack gap="x6" p="x5">
          <ImageFrame
            data-testid="held-image-frame"
            src={HELD_IMAGE_URL}
            alt="Held E2E fixture"
            ratio={4 / 3}
            style={{ width: 300 }}
            fallback={
              <button
                type="button"
                data-testid="held-image-fallback"
                aria-pressed={fallbackPressed}
                onClick={() => setFallbackPressed((value) => !value)}
                style={{ width: "100%", height: "100%", border: 0 }}
              >
                fallback
              </button>
            }
          />

          <Flex gap="x3" wrap="wrap">
            {(["badge", "icon", "indicator", "reaction"] as const).map((kind) => (
              <OverlayFrame key={kind} kind={kind} />
            ))}
          </Flex>

          <div style={{ height: 12000 }} />

          <ImageFrame
            data-testid="lazy-image-frame"
            src={LAZY_IMAGE_URL}
            alt="Lazy E2E fixture"
            loading="lazy"
            ratio={4 / 3}
            style={{ width: 300 }}
          />
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityE2EImageBehavior;
