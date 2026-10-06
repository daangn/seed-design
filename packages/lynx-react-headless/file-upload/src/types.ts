/**
 * @platform Lynx
 *
 * 호스트 앱의 파일 선택 adapter가 반환하는 파일입니다. Lynx에는 `File`·`Blob`·object URL이 없으므로
 * native URI와 메타데이터만 다룹니다. `previewUrl`이 없으면 이미지 미리보기에 `uri`를 사용합니다.
 */
export interface NativeFile {
  uri: string;
  name: string;
  /** MIME type입니다. `accept`의 MIME 패턴과 비교합니다. */
  type: string;
  /** bytes 단위 크기입니다. `minFileSize`·`maxFileSize`와 비교합니다. */
  size: number;
  previewUrl?: string;
}

export type FileError =
  | "FILE_TOO_LARGE"
  | "FILE_TOO_SMALL"
  | "TOO_MANY_FILES"
  | "INVALID_TYPE"
  | (string & {});

export interface FileRejection {
  file: NativeFile;
  errors: FileError[];
}

export type FileStatusDetails =
  | { status: "pending" }
  | { status: "uploading"; progress?: number }
  | { status: "success" }
  | { status: "error" };

export type FileEntry = {
  id: string;
  file: NativeFile;
} & FileStatusDetails;

/** `accept`가 이미지 패턴만 포함하면 `"image"`입니다. */
export type FileAcceptType = "image" | undefined;
