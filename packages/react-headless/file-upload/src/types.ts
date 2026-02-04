/**
 * Represents a file that failed validation.
 */
export interface FileRejection {
  file: File;
  errors: FileError[];
}

/**
 * Error types for file validation.
 */
export type FileErrorCode =
  | "FILE_TOO_LARGE"
  | "FILE_TOO_SMALL"
  | "TOO_MANY_FILES"
  | "INVALID_TYPE"
  | "CUSTOM";

export interface FileError {
  code: FileErrorCode;
  message: string;
}

/**
 * Details passed to onFileAccept callback.
 */
export interface FileAcceptDetails {
  files: File[];
}

/**
 * Details passed to onFileReject callback.
 */
export interface FileRejectDetails {
  files: FileRejection[];
}

/**
 * Details passed to onFileChange callback.
 */
export interface FileChangeDetails {
  acceptedFiles: File[];
  rejectedFiles: FileRejection[];
}

/**
 * Details passed to validate callback.
 */
export interface FileValidateDetails {
  acceptedFiles: File[];
  rejectedFiles: FileRejection[];
}
