import { useCallback, useEffect, useMemo, useRef } from "@lynx-js/react";
import { useControllableState } from "@seed-design/lynx-react-use-controllable-state";
import type {
  FileAcceptType,
  FileEntry,
  FileError,
  FileRejection,
  FileStatusDetails,
  NativeFile,
} from "./types.js";

export interface UseFileUploadStateProps {
  /** 제어 모드의 첨부 목록입니다. */
  acceptedFileEntries?: FileEntry[];
  /** 비제어 모드의 초기 첨부 목록입니다. */
  defaultAcceptedFileEntries?: FileEntry[];
  onAcceptedFileEntriesChange?: (entries: FileEntry[]) => void;
  /** 검증을 통과하지 못한 파일과 error code 목록을 받습니다. */
  onFileReject?: (rejections: FileRejection[]) => void;
  /**
   * 새로 추가된 entry를 받습니다. 업로드를 시작한 뒤 `updateFileEntryStatus`로 상태를 갱신합니다.
   */
  onFileAccept?: (
    entries: FileEntry[],
    helpers: { updateFileEntryStatus: (id: string, details: FileStatusDetails) => void },
  ) => void;
}

export interface UseFileUploadProps extends UseFileUploadStateProps {
  /**
   * 허용할 MIME type(`image/png`, `image/*`)이나 확장자(`.pdf`)입니다. 쉼표로 구분한 문자열이나 배열을 받습니다.
   * 모든 패턴이 이미지이면 `acceptType`이 `"image"`가 됩니다.
   */
  accept?: string | string[];
  /**
   * 파일 선택(`openFilePicker`)과 선택 결과 적용을 막습니다. 이미 추가된 파일의 삭제와 상태 갱신은 막지 않습니다.
   * @default false
   */
  disabled?: boolean;
  /** @default false */
  required?: boolean;
  /** @default false */
  invalid?: boolean;
  /**
   * 파일 선택, 삭제(`removeFileEntry`·`clearFileEntries`), 순서 변경을 막습니다. 상태 갱신은 막지 않습니다.
   * @default false
   */
  readOnly?: boolean;
  /**
   * 첨부할 수 있는 최대 파일 수입니다. 1보다 작으면 1로 보정합니다. 1이면 새 파일이 기존 파일을 대체합니다.
   * @default 1
   */
  maxFiles?: number;
  /** bytes 단위 최대 크기입니다. 초과하면 `FILE_TOO_LARGE`로 거부합니다. */
  maxFileSize?: number;
  /**
   * bytes 단위 최소 크기입니다. 미만이면 `FILE_TOO_SMALL`로 거부합니다.
   * @default 0
   */
  minFileSize?: number;
  /** 파일별 추가 검증입니다. error code 배열을 반환하면 거부하고 `null`이면 통과시킵니다. */
  validate?: (file: NativeFile) => FileError[] | null;
  /**
   * @platform Lynx
   *
   * 호스트 앱의 파일 선택 adapter입니다. `openFilePicker`가 호출합니다. 선택 취소는 빈 배열로 반환합니다.
   * 동기 throw와 rejected Promise는 `onSelectError`로 전달하고 목록을 바꾸지 않습니다.
   * 결과가 오기 전에 unmount되거나 새 선택 요청이 시작되면 이전 결과를 버립니다.
   */
  onSelectFiles?: () => NativeFile[] | Promise<NativeFile[]>;
  /** @platform Lynx */
  onSelectError?: (error: unknown) => void;
}

export interface FileUploadStateDataProps {
  /** 파일 선택이 막혔는지(`disabled`·`readOnly`·최대 개수 도달)를 나타냅니다. */
  "data-disabled": boolean;
  "data-readonly": boolean;
  "data-invalid": boolean;
  "data-required": boolean;
}

export interface UseFileUploadReturn extends UseFileUploadProps {
  acceptedFileEntries: FileEntry[];
  currentFileEntryCount: number;
  acceptType: FileAcceptType;
  /** 보정한 `maxFiles`가 1보다 크면 `true`입니다. */
  multiple: boolean;
  /** 1 이상으로 보정한 값입니다. */
  maxFiles: number;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  readOnly: boolean;
  /** `disabled`·`readOnly`이거나 최대 개수에 도달하면 `true`입니다. */
  triggerDisabled: boolean;
  stateProps: FileUploadStateDataProps;
  /** `onSelectFiles`를 호출하고 결과를 검증해 추가합니다. `triggerDisabled`이면 호출하지 않습니다. */
  openFilePicker: () => void;
  /** 파일을 검증해 추가합니다. `disabled`·`readOnly`이면 무시합니다. */
  setFileEntries: (files: NativeFile[]) => void;
  /** entry 상태를 바꿉니다. `disabled`·`readOnly`와 무관하게 동작합니다. */
  updateFileEntryStatus: (id: string, details: FileStatusDetails) => void;
  /** `readOnly`이면 무시합니다. `disabled`에서는 동작합니다. */
  removeFileEntry: (id: string) => void;
  /** `readOnly`이면 무시합니다. `disabled`에서는 동작합니다. */
  clearFileEntries: () => void;
  /** `disabled`·`readOnly`, 범위 밖 index, 같은 index이면 무시합니다. */
  reorderFileEntry: (fromIndex: number, toIndex: number) => void;
}

function parseAccept(accept: string | string[]): string[] {
  return (Array.isArray(accept) ? accept : accept.split(","))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function isAcceptedType(file: NativeFile, accept?: string | string[]): boolean {
  if (!accept) return true;

  const patterns = parseAccept(accept);
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) return fileName.endsWith(pattern);
    if (pattern.endsWith("/*")) return fileType.startsWith(pattern.slice(0, -1));
    if (pattern.includes("*")) {
      const [type] = pattern.split("/");
      return fileType.startsWith(`${type}/`);
    }
    return fileType === pattern;
  });
}

const IMAGE_EXTENSIONS = [
  ".avif",
  ".bmp",
  ".gif",
  ".heic",
  ".heif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
];

function getAcceptType(accept?: string | string[]): FileAcceptType {
  if (!accept) return undefined;
  const patterns = parseAccept(accept);
  return patterns.length > 0 &&
    patterns.every((pattern) => pattern.startsWith("image/") || IMAGE_EXTENSIONS.includes(pattern))
    ? "image"
    : undefined;
}

/**
 * @platform Lynx
 *
 * NativeFile 첨부 목록의 상태·검증·파일 선택 수명을 관리하는 headless 훅입니다.
 * Field 상태를 읽지 않으므로 Field fallback이 필요하면 호출하는 쪽에서 해석해 넘깁니다.
 */
export function useFileUpload(props: UseFileUploadProps = {}): UseFileUploadReturn {
  const {
    acceptedFileEntries: value,
    defaultAcceptedFileEntries,
    onAcceptedFileEntriesChange,
    onFileAccept,
    onFileReject,
    accept,
    disabled = false,
    required = false,
    invalid = false,
    readOnly = false,
    maxFiles: maxFilesProp = 1,
    maxFileSize,
    minFileSize,
    validate,
    onSelectFiles,
    onSelectError,
  } = props;
  const maxFiles = Math.max(1, maxFilesProp);
  const [acceptedFileEntries, setAcceptedFileEntries] = useControllableState<FileEntry[]>({
    value,
    defaultValue: defaultAcceptedFileEntries ?? [],
    onChange: onAcceptedFileEntriesChange,
  });
  const entries = acceptedFileEntries ?? [];
  const entriesRef = useRef(entries);
  entriesRef.current = entries;
  const options = {
    disabled,
    readOnly,
    accept,
    maxFiles,
    maxFileSize: maxFileSize ?? Number.POSITIVE_INFINITY,
    minFileSize: minFileSize ?? 0,
    validate,
    onSelectFiles,
    onSelectError,
    onFileAccept,
    onFileReject,
  };
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const idCounterRef = useRef(0);
  const pickerRequestRef = useRef(0);
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      pickerRequestRef.current += 1;
    };
  }, []);

  const multiple = maxFiles > 1;
  const triggerDisabled = disabled || readOnly || entries.length >= maxFiles;
  const acceptType = getAcceptType(accept);

  const commit = useCallback(
    (next: FileEntry[]) => {
      "background only";
      entriesRef.current = next;
      setAcceptedFileEntries(next);
    },
    [setAcceptedFileEntries],
  );

  const updateFileEntryStatus = useCallback(
    (id: string, details: FileStatusDetails) => {
      "background only";
      commit(
        entriesRef.current.map((entry) => (entry.id === id ? { ...entry, ...details } : entry)),
      );
    },
    [commit],
  );

  const setFileEntries = useCallback(
    (files: NativeFile[]) => {
      "background only";
      const current = optionsRef.current;
      if (current.disabled || current.readOnly) return;

      const accepted: FileEntry[] = [];
      const rejected: FileRejection[] = [];
      for (const file of files) {
        const errors: FileError[] = [];
        if (entriesRef.current.length + accepted.length >= current.maxFiles) {
          errors.push("TOO_MANY_FILES");
        }
        if (!isAcceptedType(file, current.accept)) errors.push("INVALID_TYPE");
        if (file.size > current.maxFileSize) errors.push("FILE_TOO_LARGE");
        if (file.size < current.minFileSize) errors.push("FILE_TOO_SMALL");
        const customErrors = current.validate?.(file);
        if (customErrors) errors.push(...customErrors);

        if (errors.length > 0) {
          rejected.push({ file, errors });
        } else {
          accepted.push({
            id: `attachment-${Date.now()}-${++idCounterRef.current}`,
            file,
            status: "pending",
          });
        }
      }

      if (accepted.length > 0) {
        const acceptedForCallback = current.maxFiles > 1 ? accepted : [accepted[0]];
        commit(current.maxFiles > 1 ? [...entriesRef.current, ...accepted] : acceptedForCallback);
        current.onFileAccept?.(acceptedForCallback, { updateFileEntryStatus });
      }
      if (rejected.length > 0) current.onFileReject?.(rejected);
    },
    [commit, updateFileEntryStatus],
  );

  const openFilePicker = useCallback(() => {
    "background only";
    const current = optionsRef.current;
    if (current.disabled || current.readOnly || entriesRef.current.length >= current.maxFiles) {
      return;
    }
    const picker = current.onSelectFiles;
    if (!picker) return;

    const requestId = ++pickerRequestRef.current;
    let result: NativeFile[] | Promise<NativeFile[]>;
    try {
      result = picker();
    } catch (error) {
      current.onSelectError?.(error);
      return;
    }

    Promise.resolve(result)
      .then((files) => {
        if (!mountedRef.current || requestId !== pickerRequestRef.current) return;
        if (!Array.isArray(files) || files.length === 0) return;
        setFileEntries(files);
      })
      .catch((error: unknown) => {
        if (mountedRef.current && requestId === pickerRequestRef.current) {
          optionsRef.current.onSelectError?.(error);
        }
      });
  }, [setFileEntries]);

  const removeFileEntry = useCallback(
    (id: string) => {
      "background only";
      if (optionsRef.current.readOnly) return;
      commit(entriesRef.current.filter((entry) => entry.id !== id));
    },
    [commit],
  );

  const clearFileEntries = useCallback(() => {
    "background only";
    if (optionsRef.current.readOnly) return;
    commit([]);
  }, [commit]);

  const reorderFileEntry = useCallback(
    (fromIndex: number, toIndex: number) => {
      "background only";
      if (optionsRef.current.disabled || optionsRef.current.readOnly) return;
      const current = entriesRef.current;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= current.length ||
        toIndex >= current.length ||
        fromIndex === toIndex
      ) {
        return;
      }
      const next = [...current];
      const [entry] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, entry);
      commit(next);
    },
    [commit],
  );

  return useMemo<UseFileUploadReturn>(
    () => ({
      defaultAcceptedFileEntries,
      onAcceptedFileEntriesChange,
      onFileAccept,
      onFileReject,
      accept,
      maxFileSize,
      minFileSize,
      validate,
      onSelectFiles,
      onSelectError,
      acceptedFileEntries: entries,
      currentFileEntryCount: entries.length,
      acceptType,
      multiple,
      maxFiles,
      disabled,
      required,
      invalid,
      readOnly,
      triggerDisabled,
      stateProps: {
        "data-disabled": triggerDisabled,
        "data-readonly": readOnly,
        "data-invalid": invalid,
        "data-required": required,
      },
      openFilePicker,
      setFileEntries,
      updateFileEntryStatus,
      removeFileEntry,
      clearFileEntries,
      reorderFileEntry,
    }),
    [
      defaultAcceptedFileEntries,
      onAcceptedFileEntriesChange,
      onFileAccept,
      onFileReject,
      accept,
      maxFileSize,
      minFileSize,
      validate,
      onSelectFiles,
      onSelectError,
      entries,
      acceptType,
      multiple,
      maxFiles,
      disabled,
      required,
      invalid,
      readOnly,
      triggerDisabled,
      openFilePicker,
      setFileEntries,
      updateFileEntryStatus,
      removeFileEntry,
      clearFileEntries,
      reorderFileEntry,
    ],
  );
}
