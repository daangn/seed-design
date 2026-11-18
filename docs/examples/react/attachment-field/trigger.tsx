import type { AttachmentInputFileEntry } from "@seed-design/react";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

const defaultAcceptedFileEntries: AttachmentInputFileEntry[] = [
  {
    id: "1",
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    status: "success",
  },
];

export default function AttachmentFieldTriggerExample() {
  return (
    <AttachmentField
      maxFiles={3}
      label="파일 업로드"
      defaultAcceptedFileEntries={defaultAcceptedFileEntries}
    >
      <AttachmentInput />
    </AttachmentField>
  );
}
