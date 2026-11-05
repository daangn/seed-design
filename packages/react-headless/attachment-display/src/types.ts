export type DisplayItemStatusDetails =
  | { status: "pending" }
  | { status: "uploading"; progress?: number }
  | { status: "success" }
  | { status: "error" };

export type DisplayItemEntry = {
  id: string;
  thumbnailUrl: string;
} & DisplayItemStatusDetails;
