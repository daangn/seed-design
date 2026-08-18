import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Box, useBreakpoint } from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import * as React from "react";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import { ActionButton } from "seed-design/ui/action-button";
import { BottomSheetBody, BottomSheetContent, BottomSheetRoot } from "seed-design/ui/bottom-sheet";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";
import { useElementVars, Verdict } from "../components/IacvtProbe";

declare module "@stackflow/config" {
  interface Register {
    ActivityIacvtOverlay: {};
  }
}

// A leak inducer: a plain ancestor that sets the reset part's `--seed-box-*` to a
// distinctive real value. On modern engines (and with the fix) the overlay part
// resets it, so the measured value is the default that part's recipe declares. On WebKit
// before the guaranteed-invalid fix (iOS 16.0.x — webkit.org/b/241433) the part's
// `--seed-box-*: var(--seed-box-*-base)` link goes IACVT and inherits this value
// instead — a visible LEAK.
const BOTTOM_SHEET_INDUCER: React.CSSProperties = {
  "--seed-box-height": "480px",
  "--seed-box-min-height": "400px",
  "--seed-box-max-height": "120px",
} as React.CSSProperties;

const HELP_BUBBLE_INDUCER: React.CSSProperties = {
  "--seed-box-max-width": "120px",
} as React.CSSProperties;

const mono: React.CSSProperties = { fontSize: 12, fontFamily: "monospace", lineHeight: 1.7 };

function VarRow({
  cssVar,
  value,
  expected,
}: {
  cssVar: string;
  value: string | undefined;
  expected: string;
}) {
  const pending = value === undefined || value === "";
  const leaked = !pending && value !== expected;

  return (
    <Box mb="x2">
      <Box color="palette.gray700" style={mono}>
        {cssVar}: <b>{pending ? "…" : value}</b> (기대 {expected})
      </Box>
      <Verdict leaked={leaked} pending={pending} />
    </Box>
  );
}

// Reads the bottom-sheet body part's reset vars from inside the body (via
// `closest`), so it works whether the sheet renders in place or moves in the tree.
function BottomSheetBodyReadout({ open }: { open: boolean }) {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const vars = useElementVars(
    () => anchorRef.current?.closest(".seed-bottom-sheet__body"),
    ["--seed-box-height", "--seed-box-min-height", "--seed-box-max-height"],
    [open],
  );

  return (
    <Box ref={anchorRef} p="x3" borderRadius="r1" bg="palette.gray50">
      <Box color="palette.gray900" mb="x2" style={{ fontSize: 13, fontWeight: 700 }}>
        .seed-bottom-sheet__body 리셋 검증
      </Box>
      <VarRow cssVar="--seed-box-height" value={vars["--seed-box-height"]} expected="auto" />
      <VarRow
        cssVar="--seed-box-min-height"
        value={vars["--seed-box-min-height"]}
        expected="auto"
      />
      <VarRow
        cssVar="--seed-box-max-height"
        value={vars["--seed-box-max-height"]}
        expected="none"
      />
    </Box>
  );
}

const ActivityIacvtOverlay: StaticActivityComponentType<"ActivityIacvtOverlay"> = () => {
  const { push } = useFlow();
  const breakpoint = useBreakpoint();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [bubbleOpen, setBubbleOpen] = React.useState(false);

  const bubbleVars = useElementVars(
    () => document.querySelector(".seed-help-bubble__content"),
    ["--seed-box-max-width"],
    [bubbleOpen],
  );

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>Overlay IACVT</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <Box p="x4" bg="palette.gray25">
          <Box
            mb="x6"
            p="x4"
            borderRadius="r2"
            bg="palette.gray50"
            color="palette.gray700"
            style={{ fontSize: 13, lineHeight: 1.6 }}
          >
            <Box mb="x2" color="palette.gray900" style={{ fontWeight: 700 }}>
              오버레이 리셋 누수 검증 (현재 breakpoint: {breakpoint})
            </Box>
            BottomSheet body(height/min/max-height)와 HelpBubble content(max-width)는 부모의 Box
            값을 상속하지 않도록 리셋한다. 각 오버레이를 조상이 그 값을 지정한 상태로 열고, 리셋
            part의 <b>--seed-* 커스텀 프로퍼티</b>를 직접 측정한다.
            <Box mt="x2">
              모던 브라우저에선 fix 유무와 무관하게 전부 <b>OK</b>. 구형 iOS(Safari &lt;16.4)에서
              fix가 없으면 조상 값을 상속해 <b style={{ color: "#b42318" }}>LEAK</b>.
            </Box>
          </Box>

          <Box mb="x8">
            <Box color="palette.gray900" mb="x3" style={{ fontSize: 18, fontWeight: 700 }}>
              BottomSheet — body height 리셋
            </Box>
            <Box mb="x3" color="palette.gray600" style={{ fontSize: 12, lineHeight: 1.5 }}>
              조상이 height=480px · min-height=400px · max-height=120px를 지정. 시트를 열면 body는
              auto/auto/none으로 리셋돼야 한다. 누수 시 body가 조상 값을 물려받아 높이가 붕괴된다.
            </Box>
            {/* Inducer must be a DOM ancestor of the inline-rendered sheet parts. */}
            <div style={BOTTOM_SHEET_INDUCER}>
              <ActionButton variant="neutralWeak" onClick={() => setSheetOpen(true)}>
                바텀시트 열기
              </ActionButton>
              <BottomSheetRoot open={sheetOpen} onOpenChange={setSheetOpen}>
                <BottomSheetContent title="BottomSheet IACVT">
                  <BottomSheetBody>
                    <BottomSheetBodyReadout open={sheetOpen} />
                  </BottomSheetBody>
                </BottomSheetContent>
              </BottomSheetRoot>
            </div>
          </Box>

          <Box mb="x8">
            <Box color="palette.gray900" mb="x3" style={{ fontSize: 18, fontWeight: 700 }}>
              HelpBubble — content max-width 리셋
            </Box>
            <Box mb="x3" color="palette.gray600" style={{ fontSize: 12, lineHeight: 1.5 }}>
              조상이 max-width=120px를 지정. 말풍선을 열면 content의 --seed-box-max-width는 recipe
              기본값인 280px이어야 한다. 누수 시 120px를 물려받아 말풍선이 좁게 잘린다.
            </Box>
            {/* Inducer wraps the inline HelpBubble so its content inherits the value. */}
            <div style={HELP_BUBBLE_INDUCER}>
              <HelpBubbleTrigger
                open={bubbleOpen}
                onOpenChange={setBubbleOpen}
                closeOnInteractOutside={false}
                title="HelpBubble IACVT"
                description="이 말풍선의 content는 부모가 지정한 max-width를 상속하지 않고 recipe 기본값인 280px로 리셋되어야 한다. 구형 WebKit에서 fix가 없으면 120px를 물려받아 이 문장이 좁게 잘린다."
              >
                <ActionButton variant="neutralWeak">말풍선 열기</ActionButton>
              </HelpBubbleTrigger>
            </div>
            <Box mt="x3" p="x3" borderRadius="r1" bg="palette.gray50">
              <Box color="palette.gray900" mb="x2" style={{ fontSize: 13, fontWeight: 700 }}>
                .seed-help-bubble__content 리셋 검증
              </Box>
              <VarRow
                cssVar="--seed-box-max-width"
                value={bubbleVars["--seed-box-max-width"]}
                expected="280px"
              />
            </Box>
          </Box>
        </Box>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityIacvtOverlay;
