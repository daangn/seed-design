import "@seed-design/lynx-css/base.css";

import * as React from "@lynx-js/react";
import { useRef } from "@lynx-js/react";
import type { AttachmentDisplayEntry } from "@seed-design/lynx-react";
import { useSeedClassName, VStack } from "@seed-design/lynx-react";
import {
  AttachmentDisplay,
  AttachmentDisplayField,
} from "@/components/ui/attachment-display-field";
import { TextField, TextFieldInput } from "@/components/ui/text-field";

type AttachmentDisplayFieldStyle = NonNullable<
  React.ComponentProps<typeof AttachmentDisplayField>["style"]
> & {
  "--seed-attachment-input-extend-x": string;
};

const INSET_STYLE: AttachmentDisplayFieldStyle = {
  "--seed-attachment-input-extend-x": "var(--seed-dimension-spacing-x-global-gutter)",
};

const INITIAL_ENTRIES: AttachmentDisplayEntry[] = Array.from({ length: 8 }, (_, index) => ({
  id: `inset-${index + 1}`,
  thumbnailUrl: `https://picsum.photos/seed/inset${index + 1}/200/200`,
  status: "success",
}));

export default function AttachmentDisplayCustomInset() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const nextId = useRef(0);
  return (
    <view className={seedClassName}>
      <VStack
        px="x6"
        width="400px"
        maxWidth="full"
        bg="palette.gray300"
        borderWidth={1}
        borderColor="stroke.neutralMuted"
      >
        <VStack gap="spacingY.componentDefault" bg="bg.layerDefault">
          <TextField label="이름">
            <TextFieldInput placeholder="홍길동" />
          </TextField>
          <AttachmentDisplayField
            defaultEntries={INITIAL_ENTRIES}
            maxEntries={10}
            style={INSET_STYLE}
          >
            <AttachmentDisplay
              onTriggerTap={({ addEntries }) => {
                // 문서 고정 fixture입니다. 실제 앱에서는 호스트 picker 결과를 전달하세요.
                const id = `inset-added-${nextId.current++}`;
                addEntries([
                  {
                    id,
                    thumbnailUrl: `https://picsum.photos/seed/${id}/200/200`,
                    status: "success",
                  },
                ]);
              }}
            />
          </AttachmentDisplayField>
        </VStack>
      </VStack>
    </view>
  );
}
