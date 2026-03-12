import { HStack, VStack } from "@seed-design/react";
import { ContentPlaceholder } from "seed-design/ui/content-placeholder";

const sizes = [
  { label: "48×48", width: 48, height: 48 },
  { label: "80×80", width: 80, height: 80 },
  { label: "120×120", width: 120, height: 120 },
  { label: "200×200", width: 200, height: 200 },
  { label: "80×120", width: 80, height: 120 },
  { label: "200×120", width: 200, height: 120 },
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
