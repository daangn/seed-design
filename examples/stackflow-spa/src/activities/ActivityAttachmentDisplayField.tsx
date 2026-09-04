import type { StaticActivityComponentType } from "@stackflow/react/future";
import { useFlow } from "@stackflow/react/future";
import { NextAppScreen, NextAppScreenContent } from "seed-design/ui/next-app-screen";
import {
  NextAppBar,
  NextAppBarLeft,
  NextAppBarMain,
  NextAppBarBackButton,
  NextAppBarIconButton,
  NextAppBarRight,
} from "seed-design/ui/next-app-bar";
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

function presetEntries(prefix: string, count: number): DisplayItemEntry[] {
  return Array.from(
    { length: count },
    (_, i): DisplayItemEntry => ({
      id: `${prefix}-${i}`,
      thumbnailUrl: sampleThumbnailUrl(`${prefix}-${i}`),
      status: "success",
    }),
  );
}

// uncontrolled defaultEntries는 첫 렌더에서만 읽히므로 모듈 상수로 한 번만 만든다.
const customizingEntries = presetEntries("customizing", 2);
const disabledEntries = presetEntries("disabled", 2);
const readOnlyEntries = presetEntries("readonly", 3);

// 외부 미디어 피커가 이미지 하나를 반환했다고 가정한다.
async function openMediaPicker(): Promise<DisplayItemEntry[]> {
  const id = crypto.randomUUID();
  return [{ id, thumbnailUrl: sampleThumbnailUrl(`display-${id}`), status: "uploading" }];
}

// 외부 업로드 상태 구독을 흉내 낸다. AttachmentDisplay가 entries를 소유하므로
// status는 컴포넌트가 콜백으로 전달하는 updateEntryStatus 헬퍼로만 갱신한다.
function simulateUpload(
  id: string,
  updateEntryStatus: (id: string, details: DisplayItemStatusDetails) => void,
) {
  const totalChunks = 5;
  let chunk = 0;

  const tick = () => {
    chunk += 1;
    updateEntryStatus(id, {
      status: "uploading",
      progress: Math.round((chunk / totalChunks) * 100),
    });

    if (chunk < totalChunks) {
      setTimeout(tick, 200 + Math.random() * 300);
      return;
    }

    // AttachmentField 예제와 동일하게 50% 확률로 실패시켜 재시도 버튼을 노출한다.
    updateEntryStatus(id, { status: Math.random() > 0.5 ? "success" : "error" });
  };

  setTimeout(tick, 200 + Math.random() * 300);
}

// 피커 결과를 addEntries로 추가하고(maxEntries 상한은 내부 처리), 곧바로 업로드 상태를 구동한다.
async function pickAndUpload(
  addEntries: (entries: DisplayItemEntry[]) => void,
  updateEntryStatus: (id: string, details: DisplayItemStatusDetails) => void,
) {
  const pickedEntries = await openMediaPicker();
  addEntries(pickedEntries);
  for (const entry of pickedEntries) {
    simulateUpload(entry.id, updateEntryStatus);
  }
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

  return (
    <NextAppScreen>
      <NextAppBar>
        <NextAppBarLeft>
          <NextAppBarBackButton />
        </NextAppBarLeft>
        <NextAppBarMain>AttachmentDisplayField</NextAppBarMain>
        <NextAppBarRight>
          <NextAppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </NextAppBarIconButton>
        </NextAppBarRight>
      </NextAppBar>
      <NextAppScreenContent>
        <VStack gap="x6" px="spacingX.globalGutter" py="x4">
          <AttachmentDisplayField
            label="AttachmentDisplay"
            description="trigger 클릭 시 외부 피커 호출 시뮬레이션 (50% 확률로 실패)"
            maxEntries={5}
            style={insetStyle}
          >
            <AttachmentDisplay
              onTriggerClick={({ addEntries, updateEntryStatus }) =>
                pickAndUpload(addEntries, updateEntryStatus)
              }
              onRetry={(entry, { updateEntryStatus }) =>
                simulateUpload(entry.id, updateEntryStatus)
              }
            />
          </AttachmentDisplayField>

          <Divider />

          <AttachmentDisplayField
            label="AttachmentDisplayReorderable"
            description="드래그로 순서 변경 가능"
            maxEntries={5}
            style={insetStyle}
          >
            <AttachmentDisplayReorderable
              onTriggerClick={({ addEntries, updateEntryStatus }) =>
                pickAndUpload(addEntries, updateEntryStatus)
              }
              onRetry={(entry, { updateEntryStatus }) =>
                simulateUpload(entry.id, updateEntryStatus)
              }
            />
          </AttachmentDisplayField>

          <Divider />

          <AttachmentDisplayField
            label="Customizing Items (대표사진 배지)"
            description="첫 번째 이미지에 ItemBadge 표시"
            defaultEntries={customizingEntries}
            maxEntries={5}
            style={insetStyle}
          >
            <AttachmentDisplay
              onTriggerClick={({ addEntries, updateEntryStatus }) =>
                pickAndUpload(addEntries, updateEntryStatus)
              }
            >
              {({ entries, updateEntryStatus }) =>
                entries.map((entry, index) => (
                  <FeaturedDisplayItem
                    key={entry.id}
                    entry={entry}
                    featured={index === 0}
                    onRetry={() => simulateUpload(entry.id, updateEntryStatus)}
                  />
                ))
              }
            </AttachmentDisplay>
          </AttachmentDisplayField>

          <Divider />

          <AttachmentDisplayField
            label="Disabled"
            description="trigger는 비활성, 제거는 가능"
            defaultEntries={disabledEntries}
            maxEntries={5}
            disabled
            style={insetStyle}
          >
            <AttachmentDisplay
              onTriggerClick={({ addEntries, updateEntryStatus }) =>
                pickAndUpload(addEntries, updateEntryStatus)
              }
              onRetry={(entry, { updateEntryStatus }) =>
                simulateUpload(entry.id, updateEntryStatus)
              }
            />
          </AttachmentDisplayField>

          <Divider />

          <AttachmentDisplayField
            label="Read Only"
            description="trigger·제거·순서 변경 모두 비활성"
            defaultEntries={readOnlyEntries}
            maxEntries={5}
            readOnly
            style={insetStyle}
          >
            <AttachmentDisplay
              onTriggerClick={({ addEntries, updateEntryStatus }) =>
                pickAndUpload(addEntries, updateEntryStatus)
              }
              onRetry={(entry, { updateEntryStatus }) =>
                simulateUpload(entry.id, updateEntryStatus)
              }
            />
          </AttachmentDisplayField>

          <Divider />

          <AttachmentDisplayField
            label="Field Integration"
            description="label·description·errorMessage 전달"
            errorMessage="사진을 1장 이상 등록해 주세요."
            invalid
            showRequiredIndicator
            maxEntries={5}
            style={insetStyle}
          >
            <AttachmentDisplay
              onTriggerClick={({ addEntries, updateEntryStatus }) =>
                pickAndUpload(addEntries, updateEntryStatus)
              }
              onRetry={(entry, { updateEntryStatus }) =>
                simulateUpload(entry.id, updateEntryStatus)
              }
            />
          </AttachmentDisplayField>
        </VStack>
      </NextAppScreenContent>
    </NextAppScreen>
  );
};

export default ActivityAttachmentDisplayField;
