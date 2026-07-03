import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Box, Flex, Grid, ResponsivePair, Skeleton, useBreakpoint } from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import type * as React from "react";
import { LeakCase } from "../components/IacvtProbe";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

declare module "@stackflow/config" {
  interface Register {
    ActivityIacvtLeak: {};
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

const ActivityIacvtLeak: StaticActivityComponentType<"ActivityIacvtLeak"> = () => {
  const { push } = useFlow();
  const breakpoint = useBreakpoint();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>IACVT Leak Check</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
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
            각 케이스는 부모 Box가 어떤 값을 지정하고, 자식은 그 값을 지정하지 않는다. 판정은 자식에
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
        </Box>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityIacvtLeak;
