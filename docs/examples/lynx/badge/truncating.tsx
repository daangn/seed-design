import { VStack } from "@seed-design/lynx-react";
import { Badge } from "@/components/ui/badge";

export default function Example() {
  return (
    <VStack width="full" gap="x4">
      <Badge style={{ maxWidth: "120px" }}>
        In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
      </Badge>
      <Badge style={{ maxWidth: "200px" }}>
        In velit velit deserunt amet veniam incididunt consectetur incididunt Lorem.
      </Badge>
    </VStack>
  );
}
