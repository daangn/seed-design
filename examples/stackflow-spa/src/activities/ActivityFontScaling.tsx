import type { StaticActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarLeft, AppBarMain, AppBarBackButton } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";

import { Box, VStack, Text } from "@seed-design/react";
import { Callout } from "seed-design/ui/callout";
import { vars } from "@seed-design/css/vars";
import { ActionButton } from "seed-design/ui/action-button";

const FONT_SCALE_THRESHOLDS = [
  { min: 1.35, scale: "large" },
  { min: 1.15, scale: "medium" },
  { min: 1, scale: "base" },
  { min: 0, scale: "small" },
] as const satisfies { min: number; scale: string }[];

function useFontScalingMultiplier() {
  const attr = document.documentElement.getAttribute("data-seed-font-multiplier");
  const value = attr ? Number(attr) : null;
  const scale = FONT_SCALE_THRESHOLDS.find((t) => (value ?? 1) >= t.min)?.scale ?? "small";

  return { value, scale };
}

const GRID_COLUMNS: Record<(typeof FONT_SCALE_THRESHOLDS)[number]["scale"], number> = {
  small: 5,
  base: 4,
  medium: 3,
  large: 2,
};

declare module "@stackflow/config" {
  interface Register {
    ActivityFontScaling: {};
  }
}

const ActivityFontScaling: StaticActivityComponentType<"ActivityFontScaling"> = () => {
  const { value, scale } = useFontScalingMultiplier();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Font Scaling 데모" />
      </AppBar>
      <AppScreenContent>
        <VStack gap="spacingY.componentDefault" px="spacingX.globalGutter">
          <Callout
            tone="informative"
            title="Font Scaling 데모"
            description="SEED 번들러 플러그인의 fontScaling: true 옵션을 설정하면, 페이지 최초 로드 시 root element의 data-seed-font-multiplier 속성에 사용자의 폰트 스케일링 배율이 저장됩니다."
          />
          <VStack gap="x2" p="x1">
            <Text textStyle="t5Bold" color="fg.neutral">
              현재 폰트 배율
            </Text>
            <Text textStyle="t4Medium" color="fg.neutralMuted">
              {value ?? "미설정"}
            </Text>
            <Text textStyle="t4Medium" color="fg.neutralMuted">
              scale: {scale}
            </Text>
            {value === null && (
              <Text textStyle="t4Medium" color="fg.critical">
                data-seed-font-multiplier 속성이 설정되지 않았습니다. 번들러 플러그인에서
                fontScaling: true 옵션을 활성화해주세요.
              </Text>
            )}
          </VStack>
          <VStack gap="x2" p="x1">
            <Text textStyle="t5Bold" color="fg.neutral">
              Grid 열 개수 조정 예시
            </Text>
            <Text textStyle="t4Medium" color="fg.neutralSubtle">
              폰트 배율이 클수록 열 개수가 줄어듭니다.
            </Text>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_COLUMNS[scale]}, 1fr)`,
                gap: vars.$dimension.x1_5,
              }}
            >
              {Array.from({ length: 8 }, (_, i) => ({
                id: i + 1,
                title: `아이템 ${i + 1}`,
              })).map((item) => (
                <Box
                  key={item.id}
                  bg="bg.positiveSolid"
                  p="x4"
                  borderRadius="r2"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text textStyle="t4Medium" color="palette.staticWhite">
                    {item.title}
                  </Text>
                </Box>
              ))}
            </div>
          </VStack>
          <ActionButton variant="neutralSolid" onClick={() => location.reload()}>
            새로고침
          </ActionButton>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityFontScaling;
