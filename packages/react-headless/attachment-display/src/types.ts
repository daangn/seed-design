export type DisplayItemStatusDetails =
  | { status: "pending" }
  | { status: "uploading"; progress?: number }
  | { status: "success" }
  | { status: "error" };

export interface DisplayItem {
  id: string;
  thumbnailUrl: string;
}

export type DisplayItemEntry = DisplayItem & DisplayItemStatusDetails;
