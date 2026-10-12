import { defaultPreset } from "@seed-design/lynx-react/content-placeholder-presets/default";
import { HStack, VStack, Text } from "@seed-design/lynx-react";
import { ContentPlaceholder } from "@/components/ui/content-placeholder";

const sizes = [
  { label: "48x48", width: 48, height: 48 },
  { label: "200x80", width: 200, height: 80 },
  { label: "200x120", width: 200, height: 120 },
  { label: "200x50", width: 200, height: 50 },
  { label: "300x300", width: 300, height: 300 },
  { label: "320x200", width: 320, height: 200 },
  { label: "40x120", width: 40, height: 120 },
  { label: "40x40", width: 40, height: 40 },
];

export default function ContentPlaceholderSizes() {
  return (
    <HStack gap="x4" wrap="wrap" align="flex-end">
      {sizes.map(({ label, width, height }) => (
        <VStack key={label} gap="x1" align="center">
          <ContentPlaceholder preset={defaultPreset} width={`${width}px`} height={`${height}px`} />
          <Text textStyle="t1Regular" color="fg.neutralSubtle">
            {label}
          </Text>
        </VStack>
      ))}
    </HStack>
  );
}
