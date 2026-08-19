import { IconBellLine, IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { appScreenVariantMap } from "@seed-design/css/recipes/app-screen";
import { Flex, HStack, Text, VStack } from "@seed-design/react";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { useRef, useState, type ReactNode } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
  AppBarSlot,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent, type AppScreenProps } from "seed-design/ui/app-screen";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { Snackbar, useSnackbarAdapter } from "seed-design/ui/snackbar";
import { Switch } from "seed-design/ui/switch";
import img from "../assets/peng.jpeg";

declare module "@stackflow/config" {
  interface Register {
    ActivityAppScreen: {
      transitionStyle?: NonNullable<AppScreenProps["transitionStyle"]>;
    };
  }
}

function Case({ label, children }: { label: string; children: ReactNode }) {
  return (
    <VStack gap="x3" p="x3" borderRadius="r3" bg="bg.neutralWeak">
      <Text textStyle="t4Bold" color="fg.neutral">
        {label}
      </Text>
      {children}
    </VStack>
  );
}

function VariantControl<T extends string>({
  label,
  values,
  value,
  onChange,
}: {
  label: string;
  values: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <VStack gap="x2" align="center">
      <Text textStyle="t5Bold" aria-hidden>
        {label}
      </Text>
      <SegmentedControl
        value={value}
        aria-label={label}
        onValueChange={(next) => {
          const found = values.find((candidate) => candidate === next);
          if (found) onChange(found);
        }}
      >
        {values.map((candidate) => (
          <SegmentedControlItem key={candidate} value={candidate}>
            {candidate}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </VStack>
  );
}

// Legacy AppScreen 회귀 검증 전용. 신규 activity 는 NextAppScreen 만 쓴다.
// NextAppScreen 짝: ActivityNextAppScreen
const ActivityAppScreen: StaticActivityComponentType<"ActivityAppScreen"> = ({
  params: { transitionStyle },
}) => {
  const { push } = useFlow();
  const { create } = useSnackbarAdapter();

  const [theme, setTheme] = useState<NonNullable<AppScreenProps["theme"]>>("cupertino");
  const [tone, setTone] = useState<NonNullable<AppScreenProps["tone"]>>("layer");
  const [layerOffsetTop, setLayerOffsetTop] =
    useState<NonNullable<AppScreenProps["layerOffsetTop"]>>("appBar");
  const [layerOffsetBottom, setLayerOffsetBottom] =
    useState<NonNullable<AppScreenProps["layerOffsetBottom"]>>("none");
  const [gradient, setGradient] = useState(true);

  const [preventSwipeBack, setPreventSwipeBack] = useState(false);
  const [ptr, setPtr] = useState(false);

  const [mainSlot, setMainSlot] = useState<"main" | "slot">("main");
  const [subtitle, setSubtitle] = useState(false);
  const [barBg, setBarBg] = useState(false);
  const [iconCounts, setIconCounts] = useState({ left: 0, right: 1 });

  // 제스처 진행 중에는 ref 에만 적어 프레임마다 리렌더가 걸리지 않게 한다.
  const peakRatioRef = useRef(0);

  return (
    <AppScreen
      theme={theme}
      tone={tone}
      transitionStyle={transitionStyle}
      layerOffsetTop={layerOffsetTop}
      layerOffsetBottom={layerOffsetBottom}
      gradient={gradient}
      preventSwipeBack={preventSwipeBack}
      onSwipeBackStart={() => {
        peakRatioRef.current = 0;
        create({ render: () => <Snackbar message="Started swiping" />, timeout: 500 });
      }}
      onSwipeBackMove={({ displacementRatio }) => {
        peakRatioRef.current = Math.max(peakRatioRef.current, displacementRatio);
      }}
      onSwipeBackEnd={({ swiped }) => {
        const peak = peakRatioRef.current.toFixed(2);
        create({
          render: () => <Snackbar message={`Swiped: ${swiped} (peak ratio ${peak})`} />,
          timeout: 1000,
        });
      }}
    >
      <AppBar {...(barBg && { bg: "palette.blue200" })}>
        <AppBarLeft>
          <AppBarBackButton />
          {Array.from({ length: iconCounts.left }).map((_, index) => (
            <AppBarIconButton key={index} aria-label={`알림 ${index + 1}`}>
              <IconBellLine />
            </AppBarIconButton>
          ))}
        </AppBarLeft>
        {mainSlot === "main" ? (
          <AppBarMain
            title="AppScreen (Legacy)"
            {...(subtitle && { subtitle: "Subtitle 이 붙으면 Main 레이아웃이 바뀝니다" })}
          />
        ) : (
          <AppBarSlot>
            <Flex grow py="x2" px="x2_5" height="full" style={{ boxSizing: "border-box" }}>
              <Flex
                px="x3"
                grow
                align="center"
                borderRadius="r2"
                background="bg.neutralWeak"
                borderColor="stroke.neutralMuted"
                borderWidth={1}
              >
                <Text color="fg.placeholder" textStyle="t4Medium">
                  검색어를 입력하세요
                </Text>
              </Flex>
            </Flex>
          </AppBarSlot>
        )}
        <AppBarRight>
          {Array.from({ length: iconCounts.right }).map((_, index) => (
            <AppBarIconButton key={index} aria-label={`알림 ${index + 1}`}>
              <IconBellLine />
            </AppBarIconButton>
          ))}
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent
        ptr={ptr}
        onPtrRefresh={() => new Promise((resolve) => setTimeout(resolve, 1500))}
      >
        {tone === "transparent" && <img src={img} alt="penguin" />}
        <VStack px="spacingX.globalGutter" py="x3" gap="x2">
          <Case label="화면">
            <VariantControl
              label="theme"
              values={appScreenVariantMap.theme}
              value={theme}
              onChange={setTheme}
            />
            <VariantControl
              label="tone"
              values={appScreenVariantMap.tone}
              value={tone}
              onChange={setTone}
            />
            <Switch
              label="gradient"
              tone="neutral"
              size="24"
              checked={gradient}
              onCheckedChange={setGradient}
            />
            <Text textStyle="t6Regular" color="fg.neutralMuted">
              gradient 는 tone="transparent" 에서만 눈에 띕니다. 사진 위로 AppBar 가 얹힌 상태에서
              꺼보세요.
            </Text>
          </Case>

          <Case label="오프셋">
            <VariantControl
              label="layerOffsetTop"
              values={appScreenVariantMap.layerOffsetTop}
              value={layerOffsetTop}
              onChange={setLayerOffsetTop}
            />
            <VariantControl
              label="layerOffsetBottom"
              values={appScreenVariantMap.layerOffsetBottom}
              value={layerOffsetBottom}
              onChange={setLayerOffsetBottom}
            />
          </Case>

          <Case label="AppBar">
            <VariantControl
              label="main / slot"
              values={["main", "slot"] as const}
              value={mainSlot}
              onChange={setMainSlot}
            />
            <Switch
              label="subtitle"
              tone="neutral"
              size="24"
              checked={subtitle}
              onCheckedChange={setSubtitle}
            />
            <Switch
              label="bg"
              tone="neutral"
              size="24"
              checked={barBg}
              onCheckedChange={setBarBg}
            />
            <HStack gap="x2">
              {(["left", "right"] as const).map((side) => (
                <ActionButton
                  key={side}
                  flexGrow
                  variant="neutralWeak"
                  onClick={() => setIconCounts((prev) => ({ ...prev, [side]: prev[side] + 1 }))}
                >
                  {side} +
                </ActionButton>
              ))}
            </HStack>
            <HStack gap="x2">
              {(["left", "right"] as const).map((side) => (
                <ActionButton
                  key={side}
                  flexGrow
                  variant="neutralWeak"
                  onClick={() =>
                    setIconCounts((prev) => ({ ...prev, [side]: Math.max(0, prev[side] - 1) }))
                  }
                >
                  {side} -
                </ActionButton>
              ))}
            </HStack>
            <Text textStyle="t6Regular" color="fg.neutralMuted">
              slot 은 검색바 같은 커스텀 요소에 전환 애니메이션을 입힙니다. 스와이프백 하면
              IconButton 과 같은 fade 로 빠집니다.
            </Text>
          </Case>

          <Case label="transitionStyle">
            {transitionStyle && (
              <Text textStyle="articleBody">transitionStyle: {transitionStyle}</Text>
            )}
            {appScreenVariantMap.transitionStyle.map((style) => (
              <ActionButton
                key={style}
                variant={transitionStyle === style ? "neutralWeak" : "neutralSolid"}
                onClick={() => push("ActivityAppScreen", { transitionStyle: style })}
              >
                push transitionStyle: {style}
              </ActionButton>
            ))}
          </Case>

          <Case label="스와이프백">
            <Switch
              label="preventSwipeBack"
              tone="neutral"
              size="24"
              checked={preventSwipeBack}
              onCheckedChange={setPreventSwipeBack}
            />
            <Text textStyle="t6Regular" color="fg.neutralMuted">
              {preventSwipeBack
                ? "Edge 가 렌더되지 않아 제스처를 받지 않습니다."
                : "스와이프백 후 Snackbar 로 swiped 와 최대 displacement ratio 를 확인하세요."}
            </Text>
          </Case>

          <Case label="PullToRefresh">
            <Switch label="ptr" tone="neutral" size="24" checked={ptr} onCheckedChange={setPtr} />
            <Text textStyle="t6Regular" color="fg.neutralMuted">
              snippet 의 AppScreenContent 가 PullToRefresh 를 감싸는 경로입니다. 수동 조합은
              ActivityPullToRefreshPreview 에 남아 있습니다.
            </Text>
          </Case>
        </VStack>
        {tone === "transparent" && <img src={img} alt="penguin" />}
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAppScreen;
