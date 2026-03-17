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

export interface FileRejectDetails {
  files: FileRejection[];
}

export type FileUploadItemStatus = "pending" | "uploading" | "success" | "error";

export type FileStatusDetails =
  | { status: "pending" }
  | { status: "uploading"; progress?: number }
  | { status: "success" }
  | { status: "error" };

export interface FileWithStatus {
  file: File;
  details: FileStatusDetails;
}

export type FileAcceptType = "image" | undefined;
