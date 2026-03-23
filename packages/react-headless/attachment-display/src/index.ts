export {
  AttachmentDisplayRoot,
  AttachmentDisplayTrigger,
  AttachmentDisplayItemRemoveButton,
  AttachmentDisplayContext,
  type AttachmentDisplayRootProps,
  type AttachmentDisplayTriggerProps,
  type AttachmentDisplayItemRemoveButtonProps,
  type AttachmentDisplayContextProps,
} from "./AttachmentDisplay";

export {
  AttachmentDisplayItemProvider,
  useAttachmentDisplayContext,
  useAttachmentDisplayItemContext,
  type UseAttachmentDisplayContext,
  type AttachmentDisplayItemContext,
} from "./useAttachmentDisplayContext";

export {
  useAttachmentDisplay,
  type UseAttachmentDisplayProps,
  type UseAttachmentDisplayReturn,
} from "./useAttachmentDisplay";

export type {
  DisplayItem,
  DisplayItemEntry,
  DisplayItemStatusDetails,
} from "./types";

export * as AttachmentDisplay from "./AttachmentDisplay.namespace";
