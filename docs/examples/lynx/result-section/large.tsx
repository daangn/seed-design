import { VStack } from "@seed-design/lynx-react";
import { ResultSection } from "@/components/ui/result-section";

export default function Example() {
  return (
    <VStack width="full" maxWidth="320px" alignSelf="center" grow minHeight="0">
      <ResultSection
        size="large"
        title="cupidatat ad consequat"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        primaryActionProps={{ children: "Primary Action" }}
        secondaryActionProps={{ children: "Secondary Action" }}
      />
    </VStack>
  );
}
