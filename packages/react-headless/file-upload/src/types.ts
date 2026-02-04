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

// =============================================================================
// File Status Types
// =============================================================================

/**
 * Possible upload status values for a file.
 */
export type FileUploadItemStatus = "pending" | "uploading" | "success" | "error";

/**
 * Status details with discriminated union for type-safe progress access.
 */
export type FileStatusDetails =
  | { status: "pending" }
  | { status: "uploading"; progress: number }
  | { status: "success" }
  | { status: "error" };

/**
 * A file with its upload status details.
 */
export interface FileWithStatus {
  file: File;
  details: FileStatusDetails;
}
