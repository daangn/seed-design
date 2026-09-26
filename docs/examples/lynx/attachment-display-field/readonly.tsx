import "@seed-design/lynx-css/base.css";

import type { AttachmentDisplayEntry } from "@seed-design/lynx-react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
} from "@/components/ui/attachment-display-field";

const INITIAL_ENTRIES: AttachmentDisplayEntry[] = [
  {
    id: "readonly-1",
    thumbnailUrl: "https://picsum.photos/seed/readonly1/200/200",
    status: "success",
  },
  {
    id: "readonly-2",
    thumbnailUrl: "https://picsum.photos/seed/readonly2/200/200",
    status: "success",
  },
];

export default function AttachmentDisplayReadOnly() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentDisplayField defaultEntries={INITIAL_ENTRIES} maxEntries={5} readOnly>
          <AttachmentDisplay onTriggerTap={() => {}} />
        </AttachmentDisplayField>
      </VStack>
    </view>
  );
}
