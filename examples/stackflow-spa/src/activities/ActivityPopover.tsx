import { IconHouseLine, IconQuestionmarkCircleLine } from "@karrotmarket/react-monochrome-icon";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";

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
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
} from "seed-design/ui/dialog";
import { Portal } from "@seed-design/react";
import { useActivityZIndexBase } from "@seed-design/stackflow";
import {
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverRoot,
  PopoverTrigger,
} from "seed-design/ui/popover";
import { Switch } from "seed-design/ui/switch";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

declare module "@stackflow/config" {
  interface Register {
    ActivityPopover: {};
  }
}

/**
 * Popover 수동 검증 화면. 기기에서만 드러나는 것들(safe-area, 실제 터치 dismiss, 다른 레이어 위에
 * 얹힌 popover)이 있어 단위 테스트로 대체되지 않는다.
 *
 * a11y 확인 포인트 (키보드 / chrome-devtools):
 * - 열 때 focus가 content 컨테이너(role="dialog", tabIndex=-1)로 진입
 * - Tab이 content 안 focusable(닫기 버튼 / Footer 버튼)을 순회
 * - Escape / 바깥 클릭으로 닫히고 focus가 trigger로 복귀
 * - content의 aria-labelledby -> Title id, aria-describedby -> Description id
 * - trigger의 aria-controls -> content id, aria-expanded가 열림 상태를 따라감
 * - title 없는 케이스: aria-labelledby 미설정(dangling 없음), aria-label이 이름으로 쓰임
 */
const PLACEMENTS = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end",
] as const;

const hintStyle = {
  fontSize: 13,
  lineHeight: 1.5,
  color: "var(--seed-color-fg-neutral-subtle)",
} satisfies CSSProperties;

function GroupHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        margin: "40px 0 0",
        paddingTop: 24,
        borderTop: "1px solid var(--seed-color-stroke-neutral-muted)",
        fontSize: 15,
        color: "var(--seed-color-fg-brand)",
      }}
    >
      {children}
    </h2>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 12, padding: "24px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <strong style={{ fontSize: 14 }}>{title}</strong>
        {hint && <span style={hintStyle}>{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}

function PlacementSection() {
  const [placement, setPlacement] = useState<(typeof PLACEMENTS)[number]>("bottom");

  return (
    <Section
      title="placement 12종"
      hint="열어둔 채로 placement를 바꿔보세요. 요청한 배치와 실제 배치는 다를 수 있고, 적용된 값은 content의 data-side / data-alignment에 찍힙니다."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {PLACEMENTS.map((value) => (
          <ActionButton
            key={value}
            size="xsmall"
            variant={value === placement ? "neutralSolid" : "neutralWeak"}
            onClick={() => setPlacement(value)}
          >
            {value}
          </ActionButton>
        ))}
      </div>

      <Row>
        <PopoverRoot placement={placement} closeOnInteractOutside={false}>
          <PopoverTrigger asChild>
            <ActionButton variant="neutralSolid">placement={placement}</ActionButton>
          </PopoverTrigger>
          <PopoverContent title={placement} showCloseButton={false}>
            <PopoverBody>요청 placement: {placement}</PopoverBody>
          </PopoverContent>
        </PopoverRoot>
      </Row>
    </Section>
  );
}

function PositioningOptionsSection() {
  const [flip, setFlip] = useState(true);
  const [slide, setSlide] = useState(true);
  const [safeAreaAware, setSafeAreaAware] = useState(true);

  return (
    <Section
      title="positioning 옵션"
      hint="popover를 열어둔 채 값을 바꾸면 재배치가 실시간으로 보입니다. safeAreaAware를 끄면 노치 / 홈 인디케이터 영역까지 침범합니다."
    >
      <Switch label="flip" checked={flip} onCheckedChange={setFlip} />
      <Switch label="slide" checked={slide} onCheckedChange={setSlide} />
      <Switch label="safeAreaAware" checked={safeAreaAware} onCheckedChange={setSafeAreaAware} />

      <Row>
        <PopoverRoot
          placement="top"
          flip={flip}
          slide={slide}
          safeAreaAware={safeAreaAware}
          closeOnInteractOutside={false}
        >
          <PopoverTrigger asChild>
            <ActionButton variant="neutralSolid">옵션 적용 popover</ActionButton>
          </PopoverTrigger>
          <PopoverContent title="positioning">
            <PopoverBody>
              flip {String(flip)} / slide {String(slide)} / safeAreaAware {String(safeAreaAware)}
            </PopoverBody>
          </PopoverContent>
        </PopoverRoot>
      </Row>
    </Section>
  );
}

function OpenChangeSection() {
  const [log, setLog] = useState<{ id: number; text: string }[]>([]);
  const [outerOpen, setOuterOpen] = useState(false);
  const nextId = useRef(0);

  function append(scope: string, open: boolean, reason?: string) {
    const entry = {
      id: nextId.current++,
      text: `${scope} ${open ? "open" : "close"} · ${reason ?? "-"}`,
    };

    setLog((prev) => [entry, ...prev].slice(0, 8));
  }

  return (
    <Section
      title="onOpenChange reason + 중첩 dismiss"
      hint="trigger / closeButton / escapeKeyDown / interactOutside 네 가지를 모두 찍어보세요. Escape와 바깥 누르기는 항상 최상위 레이어부터 처리하므로, cascadeDismiss는 안쪽 popover를 열어둔 채 아래 버튼으로 바깥을 직접 닫아야 나옵니다."
    >
      <Row>
        <PopoverRoot
          open={outerOpen}
          onOpenChange={(open, details) => {
            setOuterOpen(open);
            append("outer", open, details?.reason);
          }}
        >
          <PopoverTrigger asChild>
            <ActionButton variant="neutralSolid">바깥 popover</ActionButton>
          </PopoverTrigger>
          <PopoverContent title="바깥 레이어" description="여기서 안쪽 popover를 열 수 있어요">
            <PopoverBody>Escape / 바깥 클릭 / 닫기 버튼으로 각각 닫아보세요.</PopoverBody>
            <PopoverFooter>
              <PopoverRoot
                placement="bottom-end"
                onOpenChange={(open, details) => append("nested", open, details?.reason)}
              >
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">안쪽 popover</ActionButton>
                </PopoverTrigger>
                <PopoverContent title="안쪽 레이어">
                  <PopoverBody>
                    아래 버튼으로 부모 레이어를 먼저 닫으면, 남아 있던 이 popover가 cascadeDismiss로
                    닫힙니다.
                  </PopoverBody>
                  <PopoverFooter>
                    <ActionButton
                      variant="neutralSolid"
                      onClick={() => {
                        // 제어된 상태를 직접 내리는 경로라 바깥 popover의 onOpenChange는 호출되지
                        // 않는다. 로그에 남기려면 여기서 같이 찍어야 한다.
                        setOuterOpen(false);
                        append("outer", false);
                      }}
                    >
                      바깥 popover 닫기
                    </ActionButton>
                  </PopoverFooter>
                </PopoverContent>
              </PopoverRoot>
            </PopoverFooter>
          </PopoverContent>
        </PopoverRoot>
      </Row>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          minHeight: 120,
          padding: 12,
          borderRadius: 8,
          backgroundColor: "var(--seed-color-bg-neutral-weak)",
          fontFamily: "monospace",
          fontSize: 12,
        }}
      >
        {log.length === 0 && <span style={hintStyle}>아직 이벤트가 없습니다.</span>}
        {log.map((entry) => (
          <span key={entry.id}>{entry.text}</span>
        ))}
      </div>
    </Section>
  );
}

function LayerSection() {
  const [raised, setRaised] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const layerIndex = useActivityZIndexBase({ activityOffset: 1 });

  return (
    <Section
      title="다른 레이어 위의 popover"
      hint="BottomSheet / Dialog 안에서 열고, 스크림 위로 올라오는지와 닫을 때 focus가 어디로 돌아가는지 확인하세요. zIndexOffset은 popover만 한 단계 더 끌어올립니다."
    >
      <Switch label="zIndexOffset 100 적용" checked={raised} onCheckedChange={setRaised} />

      <Row>
        <ActionButton variant="neutralSolid" onClick={() => setSheetOpen(true)}>
          BottomSheet 안에서
        </ActionButton>
        <BottomSheetRoot open={sheetOpen} onOpenChange={setSheetOpen}>
          <Portal>
            <BottomSheetContent title="BottomSheet" showHandle layerIndex={layerIndex}>
              <BottomSheetBody>시트 안에서 popover를 열어보세요.</BottomSheetBody>
              <BottomSheetFooter>
                <PopoverRoot placement="top">
                  <PopoverTrigger asChild>
                    <ActionButton variant="neutralSolid">popover 열기</ActionButton>
                  </PopoverTrigger>
                  <PopoverContent title="sheet 위의 popover" {...(raised && { zIndexOffset: 100 })}>
                    <PopoverBody>시트 스크림 위로 올라와야 합니다.</PopoverBody>
                  </PopoverContent>
                </PopoverRoot>
              </BottomSheetFooter>
            </BottomSheetContent>
          </Portal>
        </BottomSheetRoot>

        <DialogRoot>
          <DialogTrigger asChild>
            <ActionButton variant="neutralSolid">Dialog 안에서</ActionButton>
          </DialogTrigger>
          <Portal>
            <DialogContent title="Dialog" layerIndex={layerIndex}>
              <DialogBody>다이얼로그 안에서 popover를 열어보세요.</DialogBody>
              <DialogFooter>
                <PopoverRoot placement="bottom">
                  <PopoverTrigger asChild>
                    <ActionButton variant="neutralSolid">popover 열기</ActionButton>
                  </PopoverTrigger>
                  <PopoverContent
                    title="dialog 위의 popover"
                    {...(raised && { zIndexOffset: 100 })}
                  >
                    <PopoverBody>
                      Escape 한 번에 popover만 닫히고 dialog는 남아 있어야 합니다.
                    </PopoverBody>
                  </PopoverContent>
                </PopoverRoot>
              </DialogFooter>
            </DialogContent>
          </Portal>
        </DialogRoot>
      </Row>
    </Section>
  );
}

const ActivityPopover: StaticActivityComponentType<"ActivityPopover"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Popover</AppBarMain>
        <AppBarRight>
          <PopoverRoot placement="bottom-end">
            <PopoverTrigger asChild>
              <AppBarIconButton aria-label="도움말">
                <IconQuestionmarkCircleLine />
              </AppBarIconButton>
            </PopoverTrigger>
            <PopoverContent title="AppBar 트리거">
              <PopoverBody>
                상단 safe-area 바로 아래에서 열립니다. 노치가 있는 기기에서 잘리지 않는지
                확인하세요.
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <div style={{ paddingInline: 20, paddingBottom: "40vh" }}>
          <GroupHeading>기본</GroupHeading>

          <Section
            title="Header / Body / Footer"
            hint="title, description, 닫기 버튼이 모두 있는 기본 구성입니다."
          >
            <Row>
              <PopoverRoot>
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">기본</ActionButton>
                </PopoverTrigger>
                <PopoverContent title="제목" description="설명을 작성할 수 있어요">
                  <PopoverBody>Header / Body / Footer 구조를 가진 기본 Popover입니다.</PopoverBody>
                  <PopoverFooter>
                    <ActionButton variant="neutralSolid">확인</ActionButton>
                  </PopoverFooter>
                </PopoverContent>
              </PopoverRoot>
            </Row>
          </Section>

          <Section
            title="헤더 구성과 접근 가능한 이름"
            hint="title이 없으면 aria-labelledby를 붙이지 않고 aria-label을 이름으로 씁니다. description만 있으면 aria-describedby만 연결됩니다."
          >
            <Row>
              <PopoverRoot>
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">닫기 버튼 없음</ActionButton>
                </PopoverTrigger>
                <PopoverContent title="showCloseButton=false" showCloseButton={false}>
                  <PopoverBody>Escape 키나 바깥 클릭으로 닫을 수 있습니다.</PopoverBody>
                </PopoverContent>
              </PopoverRoot>

              <PopoverRoot>
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">설명만</ActionButton>
                </PopoverTrigger>
                <PopoverContent aria-label="설명 전용" description="이 popover는 title이 없습니다.">
                  <PopoverBody>aria-describedby만 Description을 가리켜야 합니다.</PopoverBody>
                </PopoverContent>
              </PopoverRoot>

              <PopoverRoot>
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">헤더 없음</ActionButton>
                </PopoverTrigger>
                <PopoverContent aria-label="필터" showCloseButton={false}>
                  <PopoverBody>Header 슬롯 자체가 렌더되지 않습니다.</PopoverBody>
                  <PopoverFooter>
                    <ActionButton variant="neutralSolid">적용</ActionButton>
                  </PopoverFooter>
                </PopoverContent>
              </PopoverRoot>
            </Row>
          </Section>

          <GroupHeading>배치</GroupHeading>

          <PlacementSection />
          <PositioningOptionsSection />

          <GroupHeading>콘텐츠</GroupHeading>

          <Section
            title="긴 콘텐츠 스크롤"
            hint="Body가 max-height를 넘으면 스크롤되고, 스크롤 시 상단 divider와 하단 scroll fog가 나타납니다."
          >
            <Row>
              <PopoverRoot>
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">약관 동의</ActionButton>
                </PopoverTrigger>
                <PopoverContent title="약관 동의" description="아래 내용을 확인해주세요">
                  <PopoverBody>
                    {Array.from({ length: 24 }, (_, index) => (
                      <p key={index} style={{ margin: 0 }}>
                        {index + 1}. 본문이 길어지면 Body만 스크롤되고 Header / Footer는 고정됩니다.
                      </p>
                    ))}
                  </PopoverBody>
                  <PopoverFooter>
                    <ActionButton variant="neutralSolid">동의</ActionButton>
                  </PopoverFooter>
                </PopoverContent>
              </PopoverRoot>
            </Row>
          </Section>

          <Section
            title="크기 style props"
            hint="Content는 width / minWidth / maxWidth를, Body는 maxHeight / paddingX를 받습니다."
          >
            <Row>
              <PopoverRoot>
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">width 고정</ActionButton>
                </PopoverTrigger>
                <PopoverContent title="width=280px" width="280px">
                  <PopoverBody>콘텐츠 길이와 무관하게 너비가 고정됩니다.</PopoverBody>
                </PopoverContent>
              </PopoverRoot>

              <PopoverRoot>
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">Body 높이 제한</ActionButton>
                </PopoverTrigger>
                <PopoverContent title="maxHeight=120px" maxWidth="240px">
                  <PopoverBody maxHeight="120px" paddingX="24px">
                    {Array.from({ length: 12 }, (_, index) => (
                      <p key={index} style={{ margin: 0 }}>
                        {index + 1}. 좌우 padding과 최대 높이를 직접 지정한 Body입니다.
                      </p>
                    ))}
                  </PopoverBody>
                </PopoverContent>
              </PopoverRoot>
            </Row>
          </Section>

          <GroupHeading>상태</GroupHeading>

          <OpenChangeSection />

          <Section
            title="closeOnInteractOutside=false"
            hint="바깥을 눌러도 닫히지 않습니다. Escape와 닫기 버튼은 그대로 동작합니다."
          >
            <Row>
              <PopoverRoot closeOnInteractOutside={false}>
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">바깥 클릭 무시</ActionButton>
                </PopoverTrigger>
                <PopoverContent title="closeOnInteractOutside=false">
                  <PopoverBody>바깥 아무 데나 눌러보세요.</PopoverBody>
                </PopoverContent>
              </PopoverRoot>
            </Row>
          </Section>

          <Section
            title="lazyMount / unmountOnExit"
            hint="입력값을 적고 닫았다 다시 열어보세요. 기본값은 content를 남겨 입력과 스크롤 위치를 유지하고, unmountOnExit은 닫을 때 버립니다."
          >
            <Row>
              <PopoverRoot>
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">기본 (유지)</ActionButton>
                </PopoverTrigger>
                <PopoverContent title="상태 유지">
                  <PopoverBody>
                    <TextField name="keep" label="메모">
                      <TextFieldInput placeholder="적고 닫아보세요" />
                    </TextField>
                  </PopoverBody>
                </PopoverContent>
              </PopoverRoot>

              <PopoverRoot unmountOnExit>
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">unmountOnExit</ActionButton>
                </PopoverTrigger>
                <PopoverContent title="상태 초기화">
                  <PopoverBody>
                    <TextField name="discard" label="메모">
                      <TextFieldInput placeholder="닫으면 사라집니다" />
                    </TextField>
                  </PopoverBody>
                </PopoverContent>
              </PopoverRoot>

              <PopoverRoot lazyMount={false}>
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">lazyMount=false</ActionButton>
                </PopoverTrigger>
                <PopoverContent title="선마운트">
                  <PopoverBody>열기 전에도 content가 DOM에 있습니다.</PopoverBody>
                </PopoverContent>
              </PopoverRoot>
            </Row>
          </Section>

          <GroupHeading>레이어</GroupHeading>

          <LayerSection />

          <GroupHeading>포커스</GroupHeading>

          <Section
            title="focus 경계"
            hint="trigger 앞뒤에 focusable을 둬서 Tab / Shift+Tab 순회와 닫은 뒤 focus 복귀를 관찰합니다."
          >
            <Row>
              <ActionButton variant="neutralSolid">이전 버튼</ActionButton>
              <PopoverRoot>
                <PopoverTrigger asChild>
                  <ActionButton variant="neutralSolid">가운데 trigger</ActionButton>
                </PopoverTrigger>
                <PopoverContent title="경계 테스트">
                  <PopoverBody>Tab / Shift+Tab이 dialog 안에서 어떻게 도는지 봅니다.</PopoverBody>
                  <PopoverFooter>
                    <ActionButton variant="neutralSolid">확인</ActionButton>
                  </PopoverFooter>
                </PopoverContent>
              </PopoverRoot>
              <ActionButton variant="neutralSolid">다음 버튼</ActionButton>
            </Row>
          </Section>
        </div>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityPopover;
