import type { FileEntry } from "@seed-design/react/primitive";
import { FileUploadField, FileUpload } from "seed-design/ui/file-upload";

const defaultAcceptedFileEntries: FileEntry[] = [
  {
    id: "1",
    file: new File(["hello"], "document.pdf", { type: "application/pdf" }),
    status: "success",
  },
];

export default function FileUploadTriggerExample() {
  return (
    <FileUploadField
      maxFiles={3}
      label="파일 업로드"
      defaultAcceptedFileEntries={defaultAcceptedFileEntries}
    >
      <FileUpload />
    </FileUploadField>
  );
}
