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
import { useComputedStyle } from "../components/IacvtProbe";

declare module "@stackflow/config" {
  interface Register {
    ActivityIacvtExperiment: {};
  }
}

// Isolated repro of the margin IACVT-inheritance, with hand-authored chains that
// do NOT touch `.seed-box`. The ancestor sets `--mv: 24px`; each child tries to
// reset it. `var(--undef)` goes IACVT → inherits 24px on old WebKit (the bug).
// `var(--undef, initial)` substitutes the `initial` keyword → explicit
// guaranteed-invalid → non-inheriting even on old WebKit (the hypothesis).
// margin-top: var(--mv, 0px) makes the leak visible: leaked → 24px shift, reset → 0px.
const PROBE_CSS = `
.iacvt-anc { --mv: 24px; padding: 12px; background: #fff7d6; border: 1px solid #d9a400; border-radius: 8px; }
.iacvt-probe { padding: 8px 12px; border-radius: 6px; background: #1f6feb; color: #fff; font: 12px/1.4 monospace; }
.iacvt-ctl  { --mv: var(--iacvt-undef);          margin-top: var(--mv, 0px); }
.iacvt-fix1 { --mv: var(--iacvt-undef, initial);  margin-top: var(--mv, 0px); }
.iacvt-fix2 { --mv-a: initial; --mv-b: var(--mv-a, initial); --mv: var(--mv-b, initial); margin-top: var(--mv, 0px); }
.iacvt-bleed { --bleed: 16px; --mv: var(--iacvt-undef, initial); margin-top: var(--mv, calc(var(--bleed) * -1)); }
`;

const mono: React.CSSProperties = { fontSize: 12, fontFamily: "monospace", lineHeight: 1.7 };

function Probe({
  className,
  label,
  expectOld,
}: {
  className: string;
  label: string;
  expectOld: string;
}) {
  const [ref, values] = useComputedStyle(["--mv", "margin-top"]);
  const mv = values["--mv"];
  const marginTop = values["margin-top"];

  return (
    <Box mb="x3" p="x3" borderRadius="r2" bg="palette.gray50">
      <Box color="palette.gray900" mb="x2" style={{ fontSize: 14, fontWeight: 700 }}>
        {label}
      </Box>
      <div ref={ref} className={`iacvt-probe ${className}`}>
        probe
      </div>
      <Box mt="x2" color="palette.gray700" style={mono}>
        --mv: <b>{mv === undefined ? "…" : mv === "" ? "(guaranteed-invalid / 빈값)" : mv}</b>
      </Box>
      <Box color="palette.gray700" style={mono}>
        resolved margin-top: <b>{marginTop ?? "…"}</b>
      </Box>
      <Box mt="x1" color="palette.gray500" style={mono}>
        구형 WebKit 기대: {expectOld}
      </Box>
    </Box>
  );
}

const ActivityIacvtExperiment: StaticActivityComponentType<"ActivityIacvtExperiment"> = () => {
  const { push } = useFlow();
  const breakpoint = useBreakpoint();

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>IACVT initial-fallback 실험</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: throwaway experiment CSS, no user input */}
        <style dangerouslySetInnerHTML={{ __html: PROBE_CSS }} />
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
              가설 검증 (현재 breakpoint: {breakpoint})
            </Box>
            `.seed-box`와 격리된 손수 짠 체인. 조상이 <code>--mv: 24px</code>를 지정하고, 각 자식이
            리셋을 시도한다. <code>var(--mv, 0px)</code>로 margin-top을 만들어 눈으로도 보이게 했다.
            <Box mt="x2">
              <b>모던에선 셋 다 --mv 빈값 · margin-top 0px</b> (모던은 이미 IACVT를 비상속으로
              처리). 차이는 구형 WebKit에서만 — <b>대조군은 반드시 LEAK</b>(재현 확인), fix1/fix2가
              구형에서도 <b>빈값/0px</b>이면 <code>var(x, initial)</code> 가설 성립.
            </Box>
          </Box>

          <div className="iacvt-anc">
            <Box mb="x2" color="palette.gray700" style={mono}>
              조상: --mv = 24px
            </Box>

            <Probe
              className="iacvt-ctl"
              label="대조군 — var(--undef)"
              expectOld="LEAK: --mv=24px, margin-top=24px (재현 확인용)"
            />
            <Probe
              className="iacvt-fix1"
              label="가설 1 — var(--undef, initial) (1-hop)"
              expectOld="성립 시: --mv 빈값, margin-top=0px"
            />
            <Probe
              className="iacvt-fix2"
              label="가설 2 — 다단 체인, 각 hop에 , initial (multi-hop)"
              expectOld="성립 시: --mv 빈값, margin-top=0px (fallback 합성 확인)"
            />
            <Probe
              className="iacvt-bleed"
              label="판별 — 소비자 fallback을 calc(-16px)로 (bleed 흉내)"
              expectOld="margin-top -16px → bleed 생존(최선) · 0px → bleed 죽음(fallback 건너뜀) · 24px → leak"
            />
          </div>

          <Box
            mt="x4"
            p="x3"
            borderRadius="r2"
            bg="palette.gray50"
            color="palette.gray700"
            style={{ fontSize: 12, lineHeight: 1.6 }}
          >
            판정 (시뮬레이터): <b>대조군 24px</b>(재현) · <b>fix1/fix2 0px</b>(상속 멈춤)까진
            확인됨. 관건은 <b>판별 probe</b> —{" "}
            <b>-16px면 fallback 생존 = bleed 안전 → 실 수정 진행</b>(postcss가 `var(x)`→`var(x,
            initial)`). <b>0px면 `initial` 치환이 fallback을 건너뛴 것 = bleed 죽음</b> → 이 방식은
            margin은 고쳐도 bleed를 깨므로 재설계/런타임(A) 필요.
          </Box>
        </Box>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityIacvtExperiment;
