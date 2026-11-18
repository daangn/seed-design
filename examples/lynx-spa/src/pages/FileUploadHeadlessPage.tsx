import { useRef, useState } from "@lynx-js/react";
import {
  FileUpload,
  FileUploadItemProvider,
  useFileUploadContext,
  useFileUploadItem,
  type FileEntry,
  type FileStatusDetails,
  type NativeFile,
} from "@seed-design/lynx-react-file-upload";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import "../styles/file-upload-headless.css";

const PIXELS = [
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN4FcEDAAN+AU+hW/ICAAAAAElFTkSuQmCC",
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGOYbPwKAAMNAbHKe2UaAAAAAElFTkSuQmCC",
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGN4tZkDAAQwAaYlKXDxAAAAAElFTkSuQmCC",
];

let pickCount = 0;
function pickImage(): NativeFile[] {
  pickCount += 1;
  return [
    {
      uri: `fixture://file-upload-headless/photo-${pickCount}.png`,
      name: `photo-${pickCount}.png`,
      type: "image/png",
      size: 1024 * pickCount,
      previewUrl: `data:image/png;base64,${PIXELS[pickCount % PIXELS.length]}`,
    },
  ];
}

function Item({ fileEntry }: { fileEntry: FileEntry }) {
  const item = useFileUploadItem(fileEntry);
  return (
    <FileUploadItemProvider value={item}>
      <view className="fu-item">
        <view className="fu-item-surface">
          <FileUpload.ItemImage className="fu-item-image" />
          <FileUpload.ItemBackdrop className="fu-item-backdrop" status="uploading">
            {(entry) => (
              <text className="fu-item-backdrop-text">
                {"progress" in entry ? `${entry.progress ?? 0}%` : ""}
              </text>
            )}
          </FileUpload.ItemBackdrop>
          <FileUpload.ItemBackdrop className="fu-item-backdrop" status="error">
            <text className="fu-item-backdrop-text">실패</text>
          </FileUpload.ItemBackdrop>
        </view>
        <FileUpload.ItemName className="fu-item-name" text-maxline="1" />
        <FileUpload.ItemSize className="fu-item-meta" />
        <FileUpload.ItemRemoveButton
          className="fu-item-remove"
          accessibility-label={`${fileEntry.file.name} 제거`}
        >
          <text className="fu-item-remove-text">×</text>
        </FileUpload.ItemRemoveButton>
      </view>
    </FileUploadItemProvider>
  );
}

function Count() {
  const { currentFileEntryCount, maxFiles } = useFileUploadContext();
  return <text className="fu-trigger-text">{`${currentFileEntryCount}/${maxFiles}`}</text>;
}

function List() {
  return (
    <scroll-view className="fu-list" scroll-orientation="horizontal" scroll-bar-enable={false}>
      <view className="fu-list-content">
        <FileUpload.Trigger className="fu-trigger" accessibility-label="파일 선택">
          <text className="fu-trigger-text">+</text>
          <Count />
        </FileUpload.Trigger>
        <FileUpload.Context>
          {({ acceptedFileEntries }) =>
            acceptedFileEntries.map((entry) => <Item key={entry.id} fileEntry={entry} />)
          }
        </FileUpload.Context>
      </view>
    </scroll-view>
  );
}

function Actions() {
  const { acceptedFileEntries, reorderFileEntry, clearFileEntries } = useFileUploadContext();
  return (
    <view className="fu-row">
      <view
        className="fu-button"
        accessibility-label="첫 항목을 끝으로"
        bindtap={() => reorderFileEntry(0, acceptedFileEntries.length - 1)}
      >
        <text>첫 항목을 끝으로</text>
      </view>
      <view className="fu-button" accessibility-label="모두 지우기" bindtap={clearFileEntries}>
        <text>모두 지우기</text>
      </view>
    </view>
  );
}

function UploadSection() {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  function startUpload(
    accepted: FileEntry[],
    {
      updateFileEntryStatus,
    }: { updateFileEntryStatus: (id: string, d: FileStatusDetails) => void },
  ) {
    for (const entry of accepted) {
      updateFileEntryStatus(entry.id, { status: "uploading", progress: 30 });
      setTimeout(() => updateFileEntryStatus(entry.id, { status: "uploading", progress: 70 }), 600);
      setTimeout(() => updateFileEntryStatus(entry.id, { status: "success" }), 1200);
    }
  }

  return (
    <view className="fu-section">
      <view className="fu-row">
        <view
          className="fu-button"
          accessibility-label="disabled 전환"
          bindtap={() => setDisabled((value) => !value)}
        >
          <text>{`disabled: ${disabled}`}</text>
        </view>
        <view
          className="fu-button"
          accessibility-label="readOnly 전환"
          bindtap={() => setReadOnly((value) => !value)}
        >
          <text>{`readOnly: ${readOnly}`}</text>
        </view>
      </view>
      <FileUpload.Root
        className="fu-root"
        accept="image/*"
        maxFiles={4}
        disabled={disabled}
        readOnly={readOnly}
        acceptedFileEntries={entries}
        onAcceptedFileEntriesChange={setEntries}
        onSelectFiles={() =>
          // Lynx 런타임(PrimJS)에는 Promise.withResolvers가 없다.
          new Promise<NativeFile[]>((resolve) => {
            setTimeout(() => resolve(pickImage()), 300);
          })
        }
        onFileAccept={startUpload}
      >
        <List />
        <Actions />
      </FileUpload.Root>
      <text className="fu-log">{`entries: ${entries.map((entry) => `${entry.file.name}(${entry.status})`).join(", ") || "없음"}`}</text>
    </view>
  );
}

const PICKER_OUTCOMES = ["throw", "reject", "cancel", "invalid"] as const;

function PickerFailureSection() {
  const outcome = useRef(0);
  const [log, setLog] = useState("Trigger를 탭하세요");

  return (
    <view className="fu-section">
      <FileUpload.Root
        className="fu-root"
        accept=".txt"
        maxFiles={3}
        maxFileSize={10}
        defaultAcceptedFileEntries={[
          {
            id: "kept",
            file: { uri: "fixture://kept.txt", name: "kept.txt", type: "text/plain", size: 4 },
            status: "success",
          },
        ]}
        onSelectFiles={() => {
          const current = PICKER_OUTCOMES[outcome.current % PICKER_OUTCOMES.length];
          outcome.current += 1;
          setLog(`요청: ${current}`);
          if (current === "throw") throw new Error("동기 오류");
          if (current === "reject") return Promise.reject(new Error("비동기 오류"));
          if (current === "cancel") return [];
          return [{ uri: "fixture://big.pdf", name: "big.pdf", type: "application/pdf", size: 20 }];
        }}
        onSelectError={(error) =>
          setLog(`onSelectError: ${error instanceof Error ? error.message : String(error)}`)
        }
        onFileReject={(rejections) =>
          setLog(
            `onFileReject: ${rejections.map((r) => `${r.file.name}=${r.errors.join("+")}`).join(", ")}`,
          )
        }
      >
        <List />
      </FileUpload.Root>
      <text className="fu-log">{log}</text>
    </view>
  );
}

export function FileUploadHeadlessPage() {
  return (
    <CatalogExamples title="FileUpload (Headless)" gap="16px">
      <CatalogSectionTitle>이미지 선택·업로드 상태·삭제·순서 변경</CatalogSectionTitle>
      <UploadSection />
      <CatalogSectionTitle>선택 실패·취소·검증 거부 (탭할 때마다 순환)</CatalogSectionTitle>
      <PickerFailureSection />
    </CatalogExamples>
  );
}
