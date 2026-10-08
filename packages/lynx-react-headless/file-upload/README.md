# @seed-design/lynx-react-file-upload

Headless component built to implement [SEED Lynx Attachment Field](https://seed-design.io/lynx/components/attachment-field). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { FileUpload } from "@seed-design/lynx-react-file-upload";

export function Attachments({
  onSelectFiles,
}: {
  onSelectFiles: NonNullable<FileUpload.RootProps["onSelectFiles"]>;
}) {
  return (
    <FileUpload.Root onSelectFiles={onSelectFiles} maxFiles={5}>
      <FileUpload.Trigger>
        <text>Add files</text>
      </FileUpload.Trigger>
      <FileUpload.Context>
        {({ acceptedFileEntries, removeFileEntry }) =>
          acceptedFileEntries.map((entry) => (
            <view key={entry.id}>
              <text>{entry.file.name}</text>
              <view bindtap={() => removeFileEntry(entry.id)}>
                <text>Remove</text>
              </view>
            </view>
          ))
        }
      </FileUpload.Context>
    </FileUpload.Root>
  );
}
```
