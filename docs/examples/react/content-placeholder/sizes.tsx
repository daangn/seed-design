import { HStack, VStack } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

const sizes = [
  { label: "48x48", width: 48, height: 48 },
  { label: "200x80", width: 200, height: 80 },
  { label: "200x120", width: 200, height: 120 },
  { label: "200x50", width: 200, height: 50 },
  { label: "320x200", width: 320, height: 200 },
  { label: "40x120", width: 40, height: 120 },
  { label: "40x40", width: 40, height: 40 },
];

export default function ContentPlaceholderSizes() {
  return (
    <HStack gap="x4" wrap align="flex-end">
      {sizes.map(({ label, width, height }) => (
        <VStack key={label} gap="x1" align="center">
          <ContentPlaceholder style={{ width, height }} />
          <span style={{ fontSize: 11, color: "#999" }}>{label}</span>
        </VStack>
      ))}
    </HStack>
  );
}
