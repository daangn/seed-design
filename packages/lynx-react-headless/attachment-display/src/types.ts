export type DisplayItemStatusDetails =
  | { status: "pending" }
  | { status: "uploading"; progress?: number }
  | { status: "success" }
  | { status: "error" };

/**
 * 원격 첨부 항목입니다. 파일 선택·업로드는 앱이 처리하고 결과 URL과 상태만 전달합니다.
 * `name`·`type`·`size`는 표시용 metadata이며 검증하지 않습니다.
 */
export type DisplayItemEntry = {
  id: string;
  thumbnailUrl?: string;
  name?: string;
  type?: string;
  size?: number;
} & DisplayItemStatusDetails;
