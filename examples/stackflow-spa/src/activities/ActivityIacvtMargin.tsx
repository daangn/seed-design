import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Box, useBreakpoint } from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import type * as React from "react";
import {
  NextAppBar,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import { LeakCase } from "../components/IacvtProbe";

declare module "@stackflow/config" {
  interface Register {
    ActivityIacvtMargin: {};
  }
}

const childBase = {
  bg: "palette.blue600",
  color: "palette.staticWhite",
  px: "x2",
  py: "x1",
  borderRadius: "r1",
} as const;

const mono: React.CSSProperties = {
  fontSize: 12,
  fontFamily: "monospace",
  display: "inline-block",
};
// Ancestor `.seed-box` that sets a margin — the leak source on old WebKit.
const ancestorBox: React.CSSProperties = { background: "#fff7d6", border: "1px solid #d9a400" };

const ActivityIacvtMargin: StaticActivityComponentType<"ActivityIacvtMargin"> = () => {
  const { push } = useFlow();
  const breakpoint = useBreakpoint();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>Margin/Bleed IACVT</NextAppBarMain>
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
              margin / bleed 누수 (현재 breakpoint: {breakpoint})
            </Box>
            margin은 <b>미지정 시 guaranteed-invalid를 유지</b>해야 소비자 fallback{" "}
            <code>var(--seed-box-margin-top, calc(-bleed))</code>이 bleed로 떨어진다. 그래서 이
            <b> initial은 실 키워드로 못 바꾼다</b>(바꾸면 bleed가 죽음) — Box 사이즈(Tier 1)와 다른
            지점이고, <b>아직 fix되지 않은 마지막 케이스</b>다.
            <Box mt="x2">
              부모 <code>.seed-box</code>가 margin을 지정하면, 구형 WebKit(iOS 16.0.x)에서 자식의{" "}
              <code>--seed-box-margin-top</code>이 그 값을 상속한다. 이중 실패 → <b>(1)</b> 자식에
              양수 margin이 새고, <b>(2)</b> 유효값이 돼서 bleed fallback이 죽는다.
            </Box>
            <Box mt="x2" color="palette.gray900" style={{ fontWeight: 700 }}>
              주의: 이 케이스는 아직 fix가 없어, 현재 HEAD에서도 구형 iOS면 LEAK다. margin/bleed
              fix가 들어오면 같은 화면이 OK로 뒤집힌다.
            </Box>
          </Box>

          <Box mb="x8">
            <Box color="palette.gray900" mb="x3" style={{ fontSize: 18, fontWeight: 700 }}>
              1. 부모 margin 상속 (plain 자식)
            </Box>
            <LeakCase
              title="margin-top 상속"
              note="부모 m=24px · 자식은 margin 미지정 → 0px 여야 함. 누수 시 자식이 부모의 24px를 물려받는다."
              cssProp="margin-top"
              expected="0px"
              isLeak={(c) => c !== "0px"}
            >
              {(ref) => (
                <Box m="24px" p="x2" style={ancestorBox}>
                  <Box color="palette.gray700" mb="x1" style={mono}>
                    부모(m=24px)
                  </Box>
                  <Box ref={ref} {...childBase} style={mono}>
                    자식(margin 미지정)
                  </Box>
                </Box>
              )}
            </LeakCase>
          </Box>

          <Box mb="x8">
            <Box color="palette.gray900" mb="x3" style={{ fontSize: 18, fontWeight: 700 }}>
              2. bleed 무력화 (fallback 미발동)
            </Box>
            <LeakCase
              title="bleedTop=16px → margin-top -16px"
              note="부모 m=20px · 자식 bleedTop=16px → -16px(위로 삐져나감)여야 함. 누수 시 --seed-box-margin-top이 부모 20px를 물려받아 유효값이 되고, bleed fallback이 안 떠서 +20px가 된다."
              cssProp="margin-top"
              expected="-16px"
              isLeak={(c) => c !== "-16px"}
            >
              {(ref) => (
                <Box m="20px" p="x4" style={ancestorBox}>
                  <Box color="palette.gray700" mb="x1" style={mono}>
                    부모(m=20px)
                  </Box>
                  <Box ref={ref} bleedTop="16px" {...childBase} style={mono}>
                    자식(bleedTop=16px)
                  </Box>
                </Box>
              )}
            </LeakCase>
          </Box>

          <Box mb="x8">
            <Box color="palette.gray900" mb="x3" style={{ fontSize: 18, fontWeight: 700 }}>
              3. 조상 margin 없음 (control — 항상 OK)
            </Box>
            <LeakCase
              title="bleedTop=16px, 조상 margin 없음"
              note="부모가 margin을 지정하지 않으면 상속할 값이 없어, 구형 WebKit에서도 fallback이 정상 발동 → -16px. bleed 자체가 깨진 게 아니라 '조상 margin + 구형 WebKit' 조합에서만 깨진다는 대조군."
              cssProp="margin-top"
              expected="-16px"
              isLeak={(c) => c !== "-16px"}
            >
              {(ref) => (
                <Box p="x4" style={ancestorBox}>
                  <Box color="palette.gray700" mb="x1" style={mono}>
                    부모(margin 없음)
                  </Box>
                  <Box ref={ref} bleedTop="16px" {...childBase} style={mono}>
                    자식(bleedTop=16px)
                  </Box>
                </Box>
              )}
            </LeakCase>
          </Box>

          <Box mb="x8">
            <Box color="palette.gray900" mb="x3" style={{ fontSize: 18, fontWeight: 700 }}>
              4. bleed Box의 plain 자식 (Part 1이 Part 2를 가두는지)
            </Box>
            <LeakCase
              title="부모 bleed=16px · 자식 margin 미지정"
              note="부모 bleed는 런타임(Part 2)이 --seed-box-margin-*-base에 calc(-16px) 실값으로 심는다. 자식은 그걸 상속하면 안 되고 0이어야 한다. Part 1(var(x, initial))이 그 leaf-level 실값을 자식에 안 새게 가두는지 직접 확인 — 버전 스큐에서 'react만 올리면 새는' 바로 그 지점."
              cssProp="margin-top"
              expected="0px"
              isLeak={(c) => c !== "0px"}
            >
              {(ref) => (
                <Box bleed="16px" p="x4" style={ancestorBox}>
                  <Box color="palette.gray700" mb="x1" style={mono}>
                    부모(bleed=16px → 자식 방향 -16px 실 margin)
                  </Box>
                  <Box ref={ref} {...childBase} style={mono}>
                    자식(margin 미지정)
                  </Box>
                </Box>
              )}
            </LeakCase>
          </Box>
        </Box>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityIacvtMargin;
