import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Box, Flex, Grid, ResponsivePair, Skeleton, useBreakpoint } from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import * as React from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { BottomSheetBody, BottomSheetContent, BottomSheetRoot } from "seed-design/ui/bottom-sheet";
import { HelpBubbleTrigger } from "seed-design/ui/help-bubble";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
} from "seed-design/ui/side-panel";
import { LeakCase, useElementVars, Verdict } from "../components/IacvtProbe";

declare module "@stackflow/config" {
  interface Register {
    ActivityIacvt: {};
  }
}

// Shared styling for the measured child box. Kept as a spread (not a wrapper
// component) so the probe `ref` attaches directly to a real forwardRef Box.
const childBase = {
  bg: "palette.blue600",
  color: "palette.staticWhite",
  px: "x2",
  py: "x1",
  borderRadius: "r1",
} as const;

const mono: React.CSSProperties = { fontSize: 12, fontFamily: "monospace" };
const inlineMono: React.CSSProperties = { ...mono, display: "inline-block" };
const parentBox: React.CSSProperties = { background: "#fff7d6", border: "1px solid #d9a400" };

const Item = ({ label }: { label: string }) => (
  <Box {...childBase} style={mono}>
    {label}
  </Box>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box mb="x8">
    <Box color="palette.gray900" mb="x3" style={{ fontSize: 18, fontWeight: 700 }}>
      {title}
    </Box>
    {children}
  </Box>
);

const Note = ({ children }: { children: React.ReactNode }) => (
  <Box mb="x3" color="palette.gray600" style={{ fontSize: 12, lineHeight: 1.5 }}>
    {children}
  </Box>
);

/* ---------------------------------- 오버레이 --------------------------------- */

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
      <Box color="palette.gray700" style={{ ...mono, lineHeight: 1.7 }}>
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

function OverlaySection() {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [bubbleOpen, setBubbleOpen] = React.useState(false);

  const bubbleVars = useElementVars(
    () => document.querySelector(".seed-help-bubble__content"),
    ["--seed-box-max-width"],
    [bubbleOpen],
  );

  return (
    <>
      <Section title="오버레이 — BottomSheet body height 리셋">
        <Note>
          조상이 height=480px · min-height=400px · max-height=120px를 지정. 시트를 열면 body는
          auto/auto/none으로 리셋돼야 한다. 누수 시 body가 조상 값을 물려받아 높이가 붕괴된다.
        </Note>
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
      </Section>

      <Section title="오버레이 — HelpBubble content max-width 리셋">
        <Note>
          조상이 max-width=120px를 지정. 말풍선을 열면 content의 --seed-box-max-width는 recipe
          기본값인 280px이어야 한다. 누수 시 120px를 물려받아 말풍선이 좁게 잘린다.
        </Note>
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
      </Section>
    </>
  );
}

/* --------------------------------- margin --------------------------------- */

const MarginSection = () => (
  <Section title="margin · bleed">
    <Note>
      margin은 <b>미지정 시 guaranteed-invalid를 유지</b>해야 소비자 fallback{" "}
      <code>var(--seed-box-margin-top, calc(-bleed))</code>이 bleed로 떨어진다. 그래서 이 initial 은
      실 키워드로 못 바꾼다(바꾸면 bleed가 죽음) — Tier 1이 <code>auto</code>/<code>none</code>을
      base에 심는 것과 다른 지점이다. base를 바꾸는 대신 체인 hop마다{" "}
      <code>var(--prev, initial)</code> fallback을 달아 "없음"을 상속하지 않는 명시값으로 만들었고,
      네 방향 margin 체인 전부에 적용돼 있다. 따라서 아래 네 케이스도 구형 iOS에서 OK가 기대값이다.
    </Note>

    <LeakCase
      title="1. 부모 margin 상속 (plain 자식)"
      note="부모 m=24px · 자식은 margin 미지정 → 0px 여야 함. 누수 시 자식이 부모의 24px를 물려받는다."
      cssProp="margin-top"
      expected="0px"
      isLeak={(c) => c !== "0px"}
    >
      {(ref) => (
        <Box m="24px" p="x2" style={parentBox}>
          <Box color="palette.gray700" mb="x1" style={inlineMono}>
            부모(m=24px)
          </Box>
          <Box ref={ref} {...childBase} style={inlineMono}>
            자식(margin 미지정)
          </Box>
        </Box>
      )}
    </LeakCase>

    <LeakCase
      title="2. bleed 무력화 (fallback 미발동)"
      note="부모 m=20px · 자식 bleedTop=16px → -16px(위로 삐져나감)여야 함. 누수 시 --seed-box-margin-top이 부모 20px를 물려받아 유효값이 되고, bleed fallback이 안 떠서 +20px가 된다."
      cssProp="margin-top"
      expected="-16px"
      isLeak={(c) => c !== "-16px"}
    >
      {(ref) => (
        <Box m="20px" p="x4" style={parentBox}>
          <Box color="palette.gray700" mb="x1" style={inlineMono}>
            부모(m=20px)
          </Box>
          <Box ref={ref} bleedTop="16px" {...childBase} style={inlineMono}>
            자식(bleedTop=16px)
          </Box>
        </Box>
      )}
    </LeakCase>

    <LeakCase
      title="3. 조상 margin 없음 (control — 항상 OK)"
      note="부모가 margin을 지정하지 않으면 상속할 값이 없어, 구형 WebKit에서도 fallback이 정상 발동 → -16px. bleed 자체가 깨진 게 아니라 '조상 margin + 구형 WebKit' 조합에서만 깨진다는 대조군."
      cssProp="margin-top"
      expected="-16px"
      isLeak={(c) => c !== "-16px"}
    >
      {(ref) => (
        <Box p="x4" style={parentBox}>
          <Box color="palette.gray700" mb="x1" style={inlineMono}>
            부모(margin 없음)
          </Box>
          <Box ref={ref} bleedTop="16px" {...childBase} style={inlineMono}>
            자식(bleedTop=16px)
          </Box>
        </Box>
      )}
    </LeakCase>

    <LeakCase
      title="4. bleed Box의 plain 자식 (Part 1이 Part 2를 가두는지)"
      note="부모 bleed는 런타임(Part 2)이 --seed-box-margin-*-base에 calc(-16px) 실값으로 심는다. 자식은 그걸 상속하면 안 되고 0이어야 한다. Part 1(var(x, initial))이 그 leaf-level 실값을 자식에 안 새게 가두는지 직접 확인 — 버전 스큐에서 'react만 올리면 새는' 바로 그 지점."
      cssProp="margin-top"
      expected="0px"
      isLeak={(c) => c !== "0px"}
    >
      {(ref) => (
        <Box bleed="16px" p="x4" style={parentBox}>
          <Box color="palette.gray700" mb="x1" style={inlineMono}>
            부모(bleed=16px → 자식 방향 -16px 실 margin)
          </Box>
          <Box ref={ref} {...childBase} style={inlineMono}>
            자식(margin 미지정)
          </Box>
        </Box>
      )}
    </LeakCase>
  </Section>
);

/* -------------------------------- SidePanel ------------------------------- */

type SidePanelSize = "small" | "medium" | "large";

const SIZE_TOKEN: Record<SidePanelSize, number> = { small: 480, medium: 720, large: 960 };
const WIDTH_OVERRIDE = 500;
const MAX_WIDTH_OVERRIDE = 200;
const WIDTH_FRACTION = 0.8;

// Reads the panel content's used width by walking up to `.seed-side-panel__content`
// from inside the body, and computes the expected value from viewport + config.
// On old WebKit without the side-panel fix, `--seed-box-width` is inherited from a
// Box ancestor, so `computed` diverges from `expected`.
function ContentWidthReadout({
  size,
  widthOverride,
  maxWidthOverride,
}: {
  size: SidePanelSize;
  widthOverride: boolean;
  maxWidthOverride: boolean;
}) {
  const anchorRef = React.useRef<HTMLDivElement>(null);
  const [computed, setComputed] = React.useState<string>();
  const [vw, setVw] = React.useState(() => (typeof window === "undefined" ? 0 : window.innerWidth));

  React.useLayoutEffect(() => {
    const measure = () => {
      setVw(window.innerWidth);
      const content = anchorRef.current?.closest(".seed-side-panel__content");
      if (content) setComputed(getComputedStyle(content).width);
    };

    measure();
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [size, widthOverride, maxWidthOverride]);

  const isMd = vw >= 768;
  const cap = maxWidthOverride ? MAX_WIDTH_OVERRIDE : WIDTH_FRACTION * vw;
  const desired = widthOverride ? WIDTH_OVERRIDE : isMd ? SIZE_TOKEN[size] : WIDTH_FRACTION * vw;
  const expected = Math.round(Math.min(desired, cap));

  return (
    <Box
      ref={anchorRef}
      p="x3"
      mt="x3"
      borderRadius="r1"
      bg="palette.gray50"
      style={{ ...mono, lineHeight: 1.7 }}
    >
      <Box>
        viewport: {vw}px ({isMd ? "md+" : "sm-"})
      </Box>
      <Box>
        size: {size} (token {SIZE_TOKEN[size]}px)
      </Box>
      <Box>
        override — width: {widthOverride ? `${WIDTH_OVERRIDE}px` : "없음"} · maxWidth:{" "}
        {maxWidthOverride ? `${MAX_WIDTH_OVERRIDE}px` : "없음"}
      </Box>
      <Box style={{ fontWeight: 700 }}>computed content width: {computed ?? "…"}</Box>
      <Box color="palette.gray600">기대값(fix 적용): ≈ {expected}px</Box>
    </Box>
  );
}

function CtrlButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        appearance: "none",
        border: active ? "1px solid #1f6feb" : "1px solid #cdd2d9",
        background: active ? "#1f6feb" : "#fff",
        color: active ? "#fff" : "#3a424c",
        borderRadius: 8,
        padding: "8px 12px",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Box mb="x4">
    <Box color="palette.gray700" mb="x2" style={{ fontSize: 13, fontWeight: 600 }}>
      {label}
    </Box>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{children}</div>
  </Box>
);

function SidePanelSection() {
  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState<SidePanelSize>("medium");
  const [direction, setDirection] = React.useState<"left" | "right">("right");
  const [widthOverride, setWidthOverride] = React.useState(false);
  const [maxWidthOverride, setMaxWidthOverride] = React.useState(false);

  const overrideStyle = {
    ...(widthOverride && { "--seed-box-width-base": `${WIDTH_OVERRIDE}px` }),
    ...(maxWidthOverride && { "--seed-box-max-width-base": `${MAX_WIDTH_OVERRIDE}px` }),
  } as React.CSSProperties;

  return (
    <>
      <Box px="x4" pb="x4" bg="palette.gray25">
        <Section title="SidePanel — 너비">
          <Note>
            기대 동작 — sm-: 뷰포트 80% · md+: size 토큰(480/720/960), 단 뷰포트 80%로 캡.
            width/maxWidth 지정 시 존중. 패널을 열고 <b>computed content width</b>가 <b>기대값</b>과
            맞는지 본다. 구형 iOS에서 fix가 없으면 조상 Box의 width를 상속해 값이 어긋난다.
          </Note>

          <Row label="Size">
            {(["small", "medium", "large"] as const).map((s) => (
              <CtrlButton key={s} active={size === s} onClick={() => setSize(s)}>
                {s}
              </CtrlButton>
            ))}
          </Row>
          <Row label="Direction">
            {(["left", "right"] as const).map((d) => (
              <CtrlButton key={d} active={direction === d} onClick={() => setDirection(d)}>
                {d}
              </CtrlButton>
            ))}
          </Row>
          <Row label="Override">
            <CtrlButton active={widthOverride} onClick={() => setWidthOverride((v) => !v)}>
              width={WIDTH_OVERRIDE}px
            </CtrlButton>
            <CtrlButton active={maxWidthOverride} onClick={() => setMaxWidthOverride((v) => !v)}>
              maxWidth={MAX_WIDTH_OVERRIDE}px
            </CtrlButton>
          </Row>

          <CtrlButton active onClick={() => setOpen(true)}>
            패널 열기
          </CtrlButton>
        </Section>
      </Box>

      <SidePanelRoot open={open} onOpenChange={setOpen} direction={direction} size={size}>
        <SidePanelContent title="SidePanel IACVT" style={overrideStyle}>
          <SidePanelBody>
            <ContentWidthReadout
              size={size}
              widthOverride={widthOverride}
              maxWidthOverride={maxWidthOverride}
            />
          </SidePanelBody>
          <SidePanelFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                width: "100%",
                appearance: "none",
                border: "1px solid #cdd2d9",
                background: "#fff",
                borderRadius: 8,
                padding: "12px",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              닫기
            </button>
          </SidePanelFooter>
        </SidePanelContent>
      </SidePanelRoot>
    </>
  );
}

/* ---------------------------------- screen --------------------------------- */

const ActivityIacvt: StaticActivityComponentType<"ActivityIacvt"> = () => {
  const { push } = useFlow();
  const breakpoint = useBreakpoint();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>IACVT</NextAppBarMain>
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
              WebKit 241433 상속 누수 검증 (현재 breakpoint: {breakpoint})
            </Box>
            각 케이스는 부모가 어떤 값을 지정하고, 자식은 그 값을 지정하지 않는다. 판정은 자식에
            상속되는 <b>--seed-* 커스텀 프로퍼티</b>를 직접 측정한다(그게 누수의 원천). 자식은
            기본값으로 리셋되어야 하지만, 구형 WebKit(Safari &lt;16.4, iOS 16.0.x)은 부모 값을
            상속해버린다.
            <Box mt="x2">
              모던 브라우저에선 fix 유무와 무관하게 전부 <b>OK</b>다. 차이는 구형 iOS에서만 드러난다
              — fix 없으면 <b style={{ color: "#b42318" }}>LEAK</b>, fix 있으면{" "}
              <b style={{ color: "#137333" }}>OK</b>. 이 화면을 구형 iOS Safari에서 열어 검증한다.
            </Box>
          </Box>

          <Section title="Box — 크기">
            <LeakCase
              title="width"
              note="부모 width=320px · 자식은 width 미지정 → auto 여야 함. 누수 시 자식 폭이 320px로."
              cssProp="--seed-box-width"
              expected="auto"
              isLeak={(c) => c !== "auto"}
            >
              {(ref) => (
                <Box width="320px" p="x2" style={parentBox}>
                  <Box ref={ref} {...childBase} style={inlineMono}>
                    자식
                  </Box>
                </Box>
              )}
            </LeakCase>

            <LeakCase
              title="height"
              note="부모 height=160px · 자식은 height 미지정 → auto 여야 함."
              cssProp="--seed-box-height"
              expected="auto"
              isLeak={(c) => c !== "auto"}
            >
              {(ref) => (
                <Box height="160px" p="x2" style={parentBox}>
                  <Box ref={ref} {...childBase} style={inlineMono}>
                    자식
                  </Box>
                </Box>
              )}
            </LeakCase>

            <LeakCase
              title="min-width"
              note="부모 minWidth=260px · 자식은 미지정 → auto 여야 함."
              cssProp="--seed-box-min-width"
              expected="auto"
              isLeak={(c) => c !== "auto"}
            >
              {(ref) => (
                <Box minWidth="260px" p="x2" style={parentBox}>
                  <Box ref={ref} {...childBase} style={inlineMono}>
                    자식
                  </Box>
                </Box>
              )}
            </LeakCase>

            <LeakCase
              title="max-width"
              note="부모 maxWidth=120px · 자식은 미지정 → none 여야 함."
              cssProp="--seed-box-max-width"
              expected="none"
              isLeak={(c) => c !== "none"}
            >
              {(ref) => (
                <Box maxWidth="120px" p="x2" style={parentBox}>
                  <Box ref={ref} {...childBase} style={mono}>
                    자식의 max-width는 none이어야 한다
                  </Box>
                </Box>
              )}
            </LeakCase>

            <LeakCase
              title="min-height"
              note="부모 minHeight=140px · 자식은 미지정 → auto 여야 함."
              cssProp="--seed-box-min-height"
              expected="auto"
              isLeak={(c) => c !== "auto"}
            >
              {(ref) => (
                <Box minHeight="140px" p="x2" style={parentBox}>
                  <Box ref={ref} {...childBase} style={inlineMono}>
                    자식
                  </Box>
                </Box>
              )}
            </LeakCase>

            <LeakCase
              title="max-height"
              note="부모 maxHeight=40px · 자식은 미지정 → none 여야 함."
              cssProp="--seed-box-max-height"
              expected="none"
              isLeak={(c) => c !== "none"}
            >
              {(ref) => (
                <Box maxHeight="40px" p="x2" style={parentBox}>
                  <Box ref={ref} {...childBase} style={{ ...mono, overflow: "hidden" }}>
                    한 줄
                    <br />두 줄
                    <br />세 줄
                  </Box>
                </Box>
              )}
            </LeakCase>
          </Section>

          <Section title="Flex — gap · flex-direction">
            <LeakCase
              title="gap"
              note="부모 Flex gap=48px · 자식 Flex는 gap 미지정 → 0px(붙어있음)여야 함."
              cssProp="--seed-box-gap"
              expected="0px"
              isLeak={(c) => c !== "0px"}
            >
              {(ref) => (
                <Flex gap="48px" p="x2" style={parentBox}>
                  <Flex ref={ref}>
                    <Item label="A" />
                    <Item label="B" />
                  </Flex>
                </Flex>
              )}
            </LeakCase>

            <LeakCase
              title="flex-direction"
              note="부모 Flex flexDirection=column · 자식 Flex는 미지정 → row(가로 배치)여야 함."
              cssProp="--seed-box-flex-direction"
              expected="row"
              isLeak={(c) => c !== "row"}
            >
              {(ref) => (
                <Flex flexDirection="column" p="x2" style={parentBox}>
                  <Flex ref={ref} gap="8px">
                    <Item label="1" />
                    <Item label="2" />
                  </Flex>
                </Flex>
              )}
            </LeakCase>
          </Section>

          <Section title="Grid — columns · rows">
            <LeakCase
              title="grid columns"
              note="부모 Grid columns=3 · 자식 Grid는 미지정 → none(1열)이어야 함."
              cssProp="--seed-grid-columns"
              expected="none"
              isLeak={(c) => c !== "none"}
            >
              {(ref) => (
                <Grid columns={3} gap="8px" p="x2" style={parentBox}>
                  <Grid ref={ref} gap="6px">
                    <Item label="a" />
                    <Item label="b" />
                    <Item label="c" />
                  </Grid>
                </Grid>
              )}
            </LeakCase>

            <LeakCase
              title="grid rows"
              note="부모 Grid rows=2 · 자식 Grid는 미지정 → none 이어야 함."
              cssProp="--seed-grid-rows"
              expected="none"
              isLeak={(c) => c !== "none"}
            >
              {(ref) => (
                <Grid rows={2} gap="8px" p="x2" style={parentBox}>
                  <Grid ref={ref} gap="6px">
                    <Item label="a" />
                    <Item label="b" />
                  </Grid>
                </Grid>
              )}
            </LeakCase>
          </Section>

          <Section title="Tier 1 컴포넌트 — Skeleton · ResponsivePair">
            <LeakCase
              title="Skeleton (width 리셋)"
              note="부모 Box width=320px · Skeleton은 height만 지정(width 미지정) → auto 여야 함. 누수 시 320px 막대가 나타남."
              cssProp="--seed-box-width"
              expected="auto"
              isLeak={(c) => c !== "auto"}
            >
              {(ref) => (
                <Box width="320px" p="x2" style={parentBox}>
                  <Skeleton ref={ref} height="24px" />
                </Box>
              )}
            </LeakCase>

            <LeakCase
              title="ResponsivePair (gap 상속)"
              note="부모 Flex gap=80px 안의 ResponsivePair는 gap 미지정 → 0px여야 함. 누수 시 80px가 2단 min-width 계산에 섞여 레이아웃이 깨짐."
              cssProp="--seed-box-gap"
              expected="0px"
              isLeak={(c) => c !== "0px"}
            >
              {(ref) => (
                <Flex gap="80px" p="x2" style={parentBox}>
                  <ResponsivePair ref={ref}>
                    <Item label="left" />
                    <Item label="right" />
                  </ResponsivePair>
                </Flex>
              )}
            </LeakCase>
          </Section>

          <OverlaySection />
          <MarginSection />
        </Box>

        {/*
          SidePanel content is `position: absolute` with `max-width: calc(.8 * 100%)`,
          so its containing block decides the measured width. Keeping the panel a
          direct child of the screen content — not nested in the padded Box above —
          is what makes the readout comparable to the viewport-based expectation.
        */}
        <SidePanelSection />
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityIacvt;
