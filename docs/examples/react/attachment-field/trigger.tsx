import type { FileEntry } from "@seed-design/react/primitive";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";

const defaultAcceptedFileEntries: FileEntry[] = [
  {
    id: "1",
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    status: "success",
  },
];

export default function AttachmentInputTriggerExample() {
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
