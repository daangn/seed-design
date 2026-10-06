import { useState } from "@lynx-js/react";
import {
  AttachmentDisplay,
  AttachmentDisplayItemProvider,
  useAttachmentDisplayContext,
  useAttachmentDisplayItem,
  type DisplayItemEntry,
  type DisplayItemStatusDetails,
} from "@seed-design/lynx-react-attachment-display";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import "../styles/attachment-display-headless.css";

const PIXELS = [
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN4FcEDAAN+AU+hW/ICAAAAAElFTkSuQmCC",
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGOYbPwKAAMNAbHKe2UaAAAAAElFTkSuQmCC",
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN4tZkDAAQwAaYlKXDxAAAAAElFTkSuQmCC",
];

let pickCount = 0;
/** 앱의 media picker 대신 원격 URL 항목 두 개를 비동기로 돌려주는 fixture입니다. */
function pickRemoteEntries(): Promise<DisplayItemEntry[]> {
  // Lynx 런타임(PrimJS)에는 Promise.withResolvers가 없다.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        [0, 1].map(() => {
          pickCount += 1;
          return {
            id: `remote-${pickCount}`,
            thumbnailUrl: `data:image/png;base64,${PIXELS[pickCount % PIXELS.length]}`,
            name: `remote-${pickCount}.png`,
            type: "image/png",
            size: 1024 * pickCount,
            status: "pending",
          };
        }),
      );
    }, 300);
  });
}

type UpdateStatus = (id: string, details: DisplayItemStatusDetails) => void;

/** 업로드 서비스 대신 진행률을 올리고, 세 번째 항목마다 실패시키는 fixture입니다. */
function simulateUpload(id: string, updateEntryStatus: UpdateStatus, fail: boolean) {
  updateEntryStatus(id, { status: "uploading", progress: 30 });
  setTimeout(() => updateEntryStatus(id, { status: "uploading", progress: 70 }), 600);
  setTimeout(() => updateEntryStatus(id, { status: fail ? "error" : "success" }), 1200);
}

function Item({ entry }: { entry: DisplayItemEntry }) {
  const item = useAttachmentDisplayItem(entry);
  const { updateEntryStatus } = useAttachmentDisplayContext();
  return (
    <AttachmentDisplayItemProvider value={item}>
      <view className="ad-item">
        <view className="ad-item-surface">
          <AttachmentDisplay.ItemImage className="ad-item-image" />
          <AttachmentDisplay.ItemBackdrop className="ad-item-backdrop" status="uploading">
            {(current) => (
              <text className="ad-item-backdrop-text">
                {current.status === "uploading" ? `${current.progress ?? 0}%` : ""}
              </text>
            )}
          </AttachmentDisplay.ItemBackdrop>
          <AttachmentDisplay.ItemBackdrop className="ad-item-backdrop" status="error">
            <view
              className="ad-item-retry"
              accessibility-element
              accessibility-traits="button"
              accessibility-label={`${entry.name ?? entry.id} 재시도`}
              bindtap={() => simulateUpload(entry.id, updateEntryStatus, false)}
            >
              <text className="ad-item-backdrop-text">재시도</text>
            </view>
          </AttachmentDisplay.ItemBackdrop>
        </view>
        <text className="ad-item-name" text-maxline="1">
          {entry.name ?? entry.id}
        </text>
        <AttachmentDisplay.ItemRemoveButton
          className="ad-item-remove"
          accessibility-label={`${entry.name ?? entry.id} 제거`}
        >
          <text className="ad-item-remove-text">×</text>
        </AttachmentDisplay.ItemRemoveButton>
      </view>
    </AttachmentDisplayItemProvider>
  );
}

function List() {
  const { entries, currentEntryCount, maxEntries, addEntries, updateEntryStatus } =
    useAttachmentDisplayContext();
  return (
    <scroll-view className="ad-list" scroll-orientation="horizontal" scroll-bar-enable={false}>
      <view className="ad-list-content">
        <AttachmentDisplay.Trigger
          className="ad-trigger"
          accessibility-label="사진 추가"
          bindtap={async () => {
            const picked = await pickRemoteEntries();
            addEntries(picked);
            for (const entry of picked) {
              simulateUpload(entry.id, updateEntryStatus, pickCount % 3 === 0);
            }
          }}
        >
          <text className="ad-trigger-text">+</text>
          <text className="ad-trigger-text">{`${currentEntryCount}/${maxEntries}`}</text>
        </AttachmentDisplay.Trigger>
        {entries.map((entry) => (
          <Item key={entry.id} entry={entry} />
        ))}
      </view>
    </scroll-view>
  );
}

function Actions() {
  const { entries, reorderEntry, clearEntries } = useAttachmentDisplayContext();
  return (
    <view className="ad-row">
      <view
        className="ad-button"
        accessibility-label="첫 항목을 끝으로"
        bindtap={() => reorderEntry(0, entries.length - 1)}
      >
        <text>첫 항목을 끝으로</text>
      </view>
      <view className="ad-button" accessibility-label="모두 지우기" bindtap={clearEntries}>
        <text>모두 지우기</text>
      </view>
    </view>
  );
}

const HYDRATED: DisplayItemEntry[] = [
  {
    id: "server-1",
    thumbnailUrl: `data:image/png;base64,${PIXELS[0]}`,
    name: "server-1.png",
    status: "success",
  },
  { id: "server-2", name: "server-2.png", status: "error" },
];

function ControlledSection() {
  const [entries, setEntries] = useState<DisplayItemEntry[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  return (
    <view className="ad-section">
      <view className="ad-row">
        <view
          className="ad-button"
          accessibility-label="disabled 전환"
          bindtap={() => setDisabled((value) => !value)}
        >
          <text>{`disabled: ${disabled}`}</text>
        </view>
        <view
          className="ad-button"
          accessibility-label="readOnly 전환"
          bindtap={() => setReadOnly((value) => !value)}
        >
          <text>{`readOnly: ${readOnly}`}</text>
        </view>
        <view
          className="ad-button"
          accessibility-label="서버 값으로 재설정"
          bindtap={() => setEntries(HYDRATED)}
        >
          <text>서버 값</text>
        </view>
      </view>
      <AttachmentDisplay.Root
        className="ad-root"
        maxEntries={5}
        disabled={disabled}
        readOnly={readOnly}
        entries={entries}
        onEntriesChange={setEntries}
      >
        <List />
        <Actions />
        <AttachmentDisplay.Description className="ad-description">
          최대 5개까지 첨부할 수 있어요.
        </AttachmentDisplay.Description>
      </AttachmentDisplay.Root>
      <text className="ad-log">{`entries: ${entries.map((entry) => `${entry.id}(${entry.status})`).join(", ") || "없음"}`}</text>
    </view>
  );
}

function SingleSection() {
  const [log, setLog] = useState("Trigger를 탭하세요");
  return (
    <view className="ad-section">
      <AttachmentDisplay.Root
        className="ad-root"
        maxEntries={1}
        onEntriesChange={(next) => setLog(`entries: ${next.map((entry) => entry.id).join(", ")}`)}
      >
        <List />
        <AttachmentDisplay.ErrorMessage className="ad-description">
          두 항목을 골라도 첫 항목 하나만 남아요.
        </AttachmentDisplay.ErrorMessage>
      </AttachmentDisplay.Root>
      <text className="ad-log">{log}</text>
    </view>
  );
}

export function AttachmentDisplayHeadlessPage() {
  return (
    <CatalogExamples title="AttachmentDisplay (Headless)" gap="16px">
      <CatalogSectionTitle>
        원격 항목 추가·업로드 상태·재시도·삭제·순서 변경 (controlled)
      </CatalogSectionTitle>
      <ControlledSection />
      <CatalogSectionTitle>maxEntries=1 (첫 항목으로 교체)</CatalogSectionTitle>
      <SingleSection />
    </CatalogExamples>
  );
}
