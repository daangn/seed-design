export type FileError =
  | "FILE_TOO_LARGE"
  | "FILE_TOO_SMALL"
  | "TOO_MANY_FILES"
  | "INVALID_TYPE"
  | (string & {});

export interface FileRejection {
  file: File;
  errors: FileError[];
}

export type FileStatusDetails =
  | { status: "pending" }
  | { status: "uploading"; progress?: number }
  | { status: "success" }
  | { status: "error" };

export type FileEntry = {
  id: string;
  file: File;
} & FileStatusDetails;

export type FileAcceptType = "image" | undefined;
