import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { useState } from "react";

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
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverRoot,
  PopoverTrigger,
} from "seed-design/ui/popover";

declare module "@stackflow/config" {
  interface Register {
    ActivityPopover: {};
  }
}

const ActivityPopover: StaticActivityComponentType<"ActivityPopover"> = () => {
  const { push } = useFlow();
  const [anchorOpen, setAnchorOpen] = useState(false);

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Popover</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <PopoverRoot>
            <PopoverTrigger asChild>
              <ActionButton>기본</ActionButton>
            </PopoverTrigger>
            <PopoverContent title="제목" description="설명을 작성할 수 있어요">
              <PopoverBody>Header / Body / Footer 구조를 가진 기본 Popover입니다.</PopoverBody>
              <PopoverFooter>
                <ActionButton>확인</ActionButton>
              </PopoverFooter>
            </PopoverContent>
          </PopoverRoot>
        </div>

        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "flex-start" }}>
          <PopoverRoot placement="right-start">
            <PopoverTrigger asChild>
              <ActionButton>placement=right-start</ActionButton>
            </PopoverTrigger>
            <PopoverContent title="Flip / Shift">
              <PopoverBody>
                좌우 공간이 없으면 flip/shift가 배치를 조정하고, safe-area 안쪽으로 유지됩니다.
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
        </div>

        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "flex-end" }}>
          <PopoverRoot placement="left-end">
            <PopoverTrigger asChild>
              <ActionButton>placement=left-end</ActionButton>
            </PopoverTrigger>
            <PopoverContent title="placement=left-end">
              <PopoverBody>
                화면 가장자리 근처에서 배치가 어떻게 조정되는지 확인해보세요.
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
        </div>

        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <PopoverRoot>
            <PopoverTrigger asChild>
              <ActionButton>긴 콘텐츠 (스크롤)</ActionButton>
            </PopoverTrigger>
            <PopoverContent title="약관 동의" description="아래 내용을 확인해주세요">
              <PopoverBody>
                {Array.from({ length: 24 }, (_, index) => (
                  <p key={index} style={{ margin: 0 }}>
                    {index + 1}. 본문이 max-height(600px)를 넘으면 Body가 스크롤되고, 스크롤 시 상단
                    divider와 하단 scroll fog가 나타납니다.
                  </p>
                ))}
              </PopoverBody>
              <PopoverFooter>
                <ActionButton>동의</ActionButton>
              </PopoverFooter>
            </PopoverContent>
          </PopoverRoot>
        </div>

        <div style={{ display: "flex", paddingTop: "20vh", justifyContent: "center" }}>
          <PopoverRoot>
            <PopoverTrigger asChild>
              <ActionButton>닫기 버튼 없음</ActionButton>
            </PopoverTrigger>
            <PopoverContent title="showCloseButton=false" showCloseButton={false}>
              <PopoverBody>Escape 키나 바깥 클릭으로 닫을 수 있습니다.</PopoverBody>
            </PopoverContent>
          </PopoverRoot>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: "20vh" }}>
          <PopoverRoot open={anchorOpen} onOpenChange={setAnchorOpen}>
            <PopoverAnchor asChild>
              <div
                style={{
                  padding: 16,
                  borderRadius: 8,
                  border: "1px dashed var(--seed-color-stroke-neutral-muted)",
                }}
              >
                이 영역을 기준으로 배치됩니다 (Anchor)
              </div>
            </PopoverAnchor>
            <ActionButton onClick={() => setAnchorOpen((prev) => !prev)}>
              {anchorOpen ? "닫기" : "열기"}
            </ActionButton>
            <PopoverContent title="Anchor">
              <PopoverBody>트리거와 분리된 요소를 기준으로 위치를 잡습니다.</PopoverBody>
            </PopoverContent>
          </PopoverRoot>
        </div>

        <div style={{ height: "40vh" }} />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityPopover;
