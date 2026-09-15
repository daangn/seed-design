import "@seed-design/lynx-css/base.css";

import type { AttachmentDisplayEntry } from "@seed-design/lynx-react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
} from "@/components/ui/attachment-display-field";

const INITIAL_ENTRIES: AttachmentDisplayEntry[] = [
  {
    id: "disabled-1",
    thumbnailUrl: "https://picsum.photos/seed/disabled1/200/200",
    status: "success",
  },
];

export default function AttachmentDisplayDisabled() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <view className={seedClassName}>
      <VStack gap="x4" p="x6" width="100%">
        <AttachmentDisplayField defaultEntries={INITIAL_ENTRIES} maxEntries={5} disabled>
          <AttachmentDisplay onTriggerTap={() => {}} />
        </AttachmentDisplayField>
      </VStack>
    </view>
  );
}
