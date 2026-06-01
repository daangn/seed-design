import { useCallback, useRef, useState } from "react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import {
  AppBar,
  AppBarLeft,
  AppBarMain,
  AppBarBackButton,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AttachmentDisplay, AttachmentDisplayField } from "seed-design/ui/attachment-display-field";
import { AttachmentDisplayReorderable } from "seed-design/ui/attachment-display-field-reorderable";
import { ProgressCircle } from "seed-design/ui/progress-circle";
import {
  AttachmentDisplay as SeedAttachmentDisplay,
  Divider,
  Icon,
  VStack,
} from "@seed-design/react";
import {
  IconArrowClockwiseCircularFill,
  IconHouseLine,
  IconXmarkFill,
} from "@karrotmarket/react-monochrome-icon";
import type { DisplayItemEntry, DisplayItemStatusDetails } from "@seed-design/react/primitive";
import { vars } from "@seed-design/css/vars";

declare module "@stackflow/config" {
  interface Register {
    ActivityAttachmentDisplayField: {};
  }
}

const LABEL_RETRY = "재시도";
const LABEL_REMOVE = "파일 제거";

// AttachmentDisplay는 URL 기반이라 실제 파일을 다루지 않는다.
// 외부 미디어 피커가 던져준 썸네일 URL이라고 가정하고 picsum 이미지를 사용한다.
const sampleThumbnailUrl = (seed: string) => `https://picsum.photos/seed/${seed}/200/200`;

const insetStyle = {
  "--seed-attachment-input-extend-x": vars.$dimension.spacingX.globalGutter,
} as React.CSSProperties;

function presetEntries(count: number): DisplayItemEntry[] {
  return Array.from(
    { length: count },
    (_, i): DisplayItemEntry => ({
      id: `preset-${i}`,
      thumbnailUrl: sampleThumbnailUrl(`preset-${i}`),
      status: "success",
    }),
  );
}

// 외부 업로드 상태 구독을 흉내 낸다. AttachmentDisplay 자체는 업로드를 수행하지 않으므로
// 활동에서 entries를 직접 소유하고 status를 갱신한다.
function useSimulatedDisplay(initialEntries: DisplayItemEntry[] = []) {
  const [entries, setEntries] = useState<DisplayItemEntry[]>(initialEntries);
  const idRef = useRef(0);

  const updateStatus = useCallback((id: string, details: DisplayItemStatusDetails) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { id: entry.id, thumbnailUrl: entry.thumbnailUrl, ...details } : entry,
      ),
    );
  }, []);

  const simulateUpload = useCallback(
    (id: string) => {
      const totalChunks = 5;
      let chunk = 0;

      const tick = () => {
        chunk += 1;
        updateStatus(id, {
          status: "uploading",
          progress: Math.round((chunk / totalChunks) * 100),
        });

        if (chunk < totalChunks) {
          setTimeout(tick, 200 + Math.random() * 300);
          return;
        }

        // AttachmentField 예제와 동일하게 50% 확률로 실패시켜 재시도 버튼을 노출한다.
        updateStatus(id, { status: Math.random() > 0.5 ? "success" : "error" });
      };

      setTimeout(tick, 200 + Math.random() * 300);
    },
    [updateStatus],
  );

  // 외부 미디어 피커가 이미지 하나를 반환했다고 가정한다.
  // maxEntries에 도달하면 trigger가 비활성화되므로 별도 cap은 두지 않는다.
  const handleTriggerClick = useCallback(() => {
    const seq = idRef.current++;
    const entry: DisplayItemEntry = {
      id: `entry-${seq}`,
      thumbnailUrl: sampleThumbnailUrl(`display-${seq}`),
      status: "uploading",
      progress: 0,
    };

    setEntries((prev) => [...prev, entry]);
    simulateUpload(entry.id);
  }, [simulateUpload]);

  const handleRetry = useCallback(
    (entry: DisplayItemEntry) => {
      updateStatus(entry.id, { status: "uploading", progress: 0 });
      simulateUpload(entry.id);
    },
    [simulateUpload, updateStatus],
  );

  return { entries, setEntries, handleTriggerClick, handleRetry };
}

interface FeaturedDisplayItemProps {
  entry: DisplayItemEntry;
  featured: boolean;
  onRetry: () => void;
}

// "Customizing Items" 예제: @seed-design/react의 AttachmentDisplay 파츠를 직접 조합해
// 첫 번째 이미지에 "대표사진" 배지를 단다.
function FeaturedDisplayItem({ entry, featured, onRetry }: FeaturedDisplayItemProps) {
  return (
    <SeedAttachmentDisplay.Item entry={entry}>
      <SeedAttachmentDisplay.ItemImage />
      {featured && <SeedAttachmentDisplay.ItemBadge>대표사진</SeedAttachmentDisplay.ItemBadge>}
      <SeedAttachmentDisplay.ItemBackdrop status="uploading">
        {(item) => (
          <ProgressCircle
            size="24"
            tone="staticWhite"
            {...("progress" in item && { value: item.progress })}
          />
        )}
      </SeedAttachmentDisplay.ItemBackdrop>
      <SeedAttachmentDisplay.ItemBackdrop status="error">
        <SeedAttachmentDisplay.ItemActionButton onClick={onRetry}>
          <Icon svg={<IconArrowClockwiseCircularFill />} />
          {LABEL_RETRY}
        </SeedAttachmentDisplay.ItemActionButton>
      </SeedAttachmentDisplay.ItemBackdrop>
      <SeedAttachmentDisplay.ItemRemoveButton aria-label={LABEL_REMOVE}>
        <Icon svg={<IconXmarkFill />} />
      </SeedAttachmentDisplay.ItemRemoveButton>
    </SeedAttachmentDisplay.Item>
  );
}

const ActivityAttachmentDisplayField: StaticActivityComponentType<
  "ActivityAttachmentDisplayField"
> = () => {
  const { push } = useFlow();

  const basic = useSimulatedDisplay();
  const reorderable = useSimulatedDisplay();
  const customizing = useSimulatedDisplay(presetEntries(2));
  const disabled = useSimulatedDisplay(presetEntries(2));
  const readOnly = useSimulatedDisplay(presetEntries(3));
  const field = useSimulatedDisplay();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>AttachmentDisplayField</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x6" px="spacingX.globalGutter" py="x4">
          <AttachmentDisplayField
            label="AttachmentDisplay"
            description="trigger 클릭 시 외부 피커 호출 시뮬레이션 (50% 확률로 실패)"
            entries={basic.entries}
            onEntriesChange={basic.setEntries}
            maxEntries={5}
            style={insetStyle}
          >
            <AttachmentDisplay
              onTriggerClick={basic.handleTriggerClick}
              onRetry={basic.handleRetry}
            />
          </AttachmentDisplayField>

          <Divider />

          <AttachmentDisplayField
            label="AttachmentDisplayReorderable"
            description="드래그로 순서 변경 가능"
            entries={reorderable.entries}
            onEntriesChange={reorderable.setEntries}
            maxEntries={5}
            style={insetStyle}
          >
            <AttachmentDisplayReorderable
              onTriggerClick={reorderable.handleTriggerClick}
              onRetry={reorderable.handleRetry}
            />
          </AttachmentDisplayField>

          <Divider />

          <AttachmentDisplayField
            label="Customizing Items (대표사진 배지)"
            description="첫 번째 이미지에 ItemBadge 표시"
            entries={customizing.entries}
            onEntriesChange={customizing.setEntries}
            maxEntries={5}
            style={insetStyle}
          >
            <AttachmentDisplay onTriggerClick={customizing.handleTriggerClick}>
              {({ entries }) =>
                entries.map((entry, index) => (
                  <FeaturedDisplayItem
                    key={entry.id}
                    entry={entry}
                    featured={index === 0}
                    onRetry={() => customizing.handleRetry(entry)}
                  />
                ))
              }
            </AttachmentDisplay>
          </AttachmentDisplayField>

          <Divider />

          <AttachmentDisplayField
            label="Disabled"
            description="trigger는 비활성, 제거는 가능"
            entries={disabled.entries}
            onEntriesChange={disabled.setEntries}
            maxEntries={5}
            disabled
            style={insetStyle}
          >
            <AttachmentDisplay
              onTriggerClick={disabled.handleTriggerClick}
              onRetry={disabled.handleRetry}
            />
          </AttachmentDisplayField>

          <Divider />

          <AttachmentDisplayField
            label="Read Only"
            description="trigger·제거·순서 변경 모두 비활성"
            entries={readOnly.entries}
            onEntriesChange={readOnly.setEntries}
            maxEntries={5}
            readOnly
            style={insetStyle}
          >
            <AttachmentDisplay
              onTriggerClick={readOnly.handleTriggerClick}
              onRetry={readOnly.handleRetry}
            />
          </AttachmentDisplayField>

          <Divider />

          <AttachmentDisplayField
            label="Field Integration"
            description="label·description·errorMessage 전달"
            errorMessage="사진을 1장 이상 등록해 주세요."
            invalid
            showRequiredIndicator
            entries={field.entries}
            onEntriesChange={field.setEntries}
            maxEntries={5}
            style={insetStyle}
          >
            <AttachmentDisplay
              onTriggerClick={field.handleTriggerClick}
              onRetry={field.handleRetry}
            />
          </AttachmentDisplayField>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityAttachmentDisplayField;
