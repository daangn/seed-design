/**
 * Error types for file validation.
 * Built-in errors provide autocomplete, but custom error codes are also supported.
 */
export type FileError =
  | "FILE_TOO_LARGE"
  | "FILE_TOO_SMALL"
  | "TOO_MANY_FILES"
  | "INVALID_TYPE"
  | (string & {});

/**
 * Represents a file that failed validation.
 */
export interface FileRejection {
  file: File;
  errors: FileError[];
}

/**
 * Details passed to onFileReject callback.
 */
export interface FileRejectDetails {
  files: FileRejection[];
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
  | { status: "uploading"; progress?: number }
  | { status: "success" }
  | { status: "error" };

/**
 * A file with its upload status details.
 */
export interface FileWithStatus {
  file: File;
  details: FileStatusDetails;
}

// =============================================================================
// Accept Type
// =============================================================================

/**
 * Categorization of accepted file types.
 * - "image": Only image files are accepted
 * - undefined: General files are accepted (or mixed types)
 */
export type FileAcceptType = "image" | undefined;
