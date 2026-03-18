import { FileUploadField } from "seed-design/ui/file-upload";
import { ReorderableFileUpload } from "seed-design/ui/file-upload-reorderable";

export default function FileUploadReorderableExample() {
  return (
    <FileUploadField
      accept="image/*"
      maxFiles={5}
      label="이미지 업로드"
      description="드래그하여 순서를 변경할 수 있습니다"
    >
      <ReorderableFileUpload />
    </FileUploadField>
  );
}
