import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";

import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverRoot,
  PopoverTrigger,
} from "seed-design/ui/popover";

declare module "@stackflow/config" {
  interface Register {
    ActivityPopoverPlayground: {};
  }
}

/**
 * a11y 검증용 playground.
 *
 * 확인 포인트 (chrome-devtools / 키보드):
 * - 열 때 focus가 content 컨테이너(role="dialog", tabIndex=-1)로 진입
 * - Tab이 content 안 focusable(닫기 X / Footer 버튼)을 순회
 * - Escape / 바깥 클릭으로 닫히고 focus가 trigger로 복귀
 * - content의 aria-labelledby → Title id, aria-describedby → Description id
 * - trigger의 aria-controls → content id
 * - title 없는 케이스: aria-labelledby 미설정(dangling 없음), aria-label 사용
 */
const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "24px 0" }}>
    <span style={{ fontSize: 13, color: "var(--seed-color-fg-neutral-subtle)" }}>{label}</span>
    <div style={{ display: "flex", justifyContent: "center" }}>{children}</div>
  </div>
);

const ActivityPopoverPlayground: StaticActivityComponentType<"ActivityPopoverPlayground"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Popover Playground (a11y)</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <div style={{ paddingInline: 20 }}>
          {/* title + description + footer: focus 진입 / Tab 순회 / aria 이름·설명 연결 */}
          <Section label="title + description + footer button">
            <PopoverRoot>
              <PopoverTrigger asChild>
                <ActionButton>기본 (title/description)</ActionButton>
              </PopoverTrigger>
              <PopoverContent title="제목" description="설명을 작성할 수 있어요">
                <PopoverBody>
                  열면 focus가 dialog로 들어오고, Tab으로 닫기 버튼과 아래 확인 버튼을 순회할 수
                  있어야 합니다.
                </PopoverBody>
                <PopoverFooter>
                  <ActionButton>확인</ActionButton>
                </PopoverFooter>
              </PopoverContent>
            </PopoverRoot>
          </Section>

          {/* description만: aria-describedby 설정, aria-labelledby 미설정 확인 */}
          <Section label="description only (no title, aria-label 제공)">
            <PopoverRoot>
              <PopoverTrigger asChild>
                <ActionButton>설명만</ActionButton>
              </PopoverTrigger>
              <PopoverContent aria-label="설명 전용" description="이 popover는 title이 없습니다.">
                <PopoverBody>
                  aria-labelledby는 붙지 않고(dangling 없음), aria-describedby만 Description을
                  가리켜야 합니다.
                </PopoverBody>
              </PopoverContent>
            </PopoverRoot>
          </Section>

          {/* title 없음 + 닫기 버튼 없음 + aria-label: aria-label이 이름으로 쓰이는지 */}
          <Section label="no title, no close button, aria-label">
            <PopoverRoot>
              <PopoverTrigger asChild>
                <ActionButton>title 없음 (aria-label)</ActionButton>
              </PopoverTrigger>
              <PopoverContent aria-label="필터" showCloseButton={false}>
                <PopoverBody>
                  Escape / 바깥 클릭으로 닫고, focus가 trigger로 복귀하는지 확인합니다.
                </PopoverBody>
                <PopoverFooter>
                  <ActionButton>적용</ActionButton>
                </PopoverFooter>
              </PopoverContent>
            </PopoverRoot>
          </Section>

          {/* trigger 앞뒤에 focusable을 둬서 Tab 이동/복귀 경계를 관찰 */}
          <Section label="focus 경계 관찰용 (앞뒤 버튼)">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <ActionButton variant="neutralWeak">이전 버튼</ActionButton>
              <PopoverRoot>
                <PopoverTrigger asChild>
                  <ActionButton>가운데 trigger</ActionButton>
                </PopoverTrigger>
                <PopoverContent title="경계 테스트">
                  <PopoverBody>
                    Tab / Shift+Tab이 dialog 안에서 어떻게 도는지 확인합니다.
                  </PopoverBody>
                  <PopoverFooter>
                    <ActionButton>확인</ActionButton>
                  </PopoverFooter>
                </PopoverContent>
              </PopoverRoot>
              <ActionButton variant="neutralWeak">다음 버튼</ActionButton>
            </div>
          </Section>
        </div>

        <div style={{ height: "40vh" }} />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityPopoverPlayground;
