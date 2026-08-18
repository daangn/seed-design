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
import {
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelRoot,
} from "seed-design/ui/side-panel";

declare module "@stackflow/config" {
  interface Register {
    ActivityIacvtSidePanel: {};
  }
}

type Size = "small" | "medium" | "large";
type Direction = "left" | "right";

const SIZE_TOKEN: Record<Size, number> = { small: 480, medium: 720, large: 960 };
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
  size: Size;
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
      style={{ fontSize: 12, fontFamily: "monospace", lineHeight: 1.7 }}
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

const ActivityIacvtSidePanel: StaticActivityComponentType<"ActivityIacvtSidePanel"> = () => {
  const { push } = useFlow();
  const breakpoint = useBreakpoint();

  const [open, setOpen] = React.useState(false);
  const [size, setSize] = React.useState<Size>("medium");
  const [direction, setDirection] = React.useState<Direction>("right");
  const [widthOverride, setWidthOverride] = React.useState(false);
  const [maxWidthOverride, setMaxWidthOverride] = React.useState(false);

  const overrideStyle = {
    ...(widthOverride && { "--seed-box-width-base": `${WIDTH_OVERRIDE}px` }),
    ...(maxWidthOverride && { "--seed-box-max-width-base": `${MAX_WIDTH_OVERRIDE}px` }),
  } as React.CSSProperties;

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>SidePanel IACVT</NextAppBarMain>
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
              SidePanel 너비 검증 (현재 breakpoint: {breakpoint})
            </Box>
            기대 동작 — sm-: 뷰포트 80% · md+: size 토큰(480/720/960), 단 뷰포트 80%로 캡.
            width/maxWidth 지정 시 존중. 패널을 열고 <b>computed content width</b>가 <b>기대값</b>과
            맞는지 본다. 구형 iOS에서 fix가 없으면 조상 Box의 width를 상속해 값이 어긋난다.
          </Box>

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

          <Box mt="x4">
            <CtrlButton active onClick={() => setOpen(true)}>
              패널 열기
            </CtrlButton>
          </Box>
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
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityIacvtSidePanel;
