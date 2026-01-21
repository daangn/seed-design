import { VStack } from "@seed-design/react";
import { ResultSection } from "seed-design/ui/result-section";

export default function ResultSectionMedium() {
  return (
    <VStack minHeight="480px" width="320px" borderWidth={1} borderColor="stroke.neutralMuted">
      <ResultSection
        size="medium"
        title="cupidatat ad consequat"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
        primaryActionProps={{
          children: "Primary Action",
        }}
        secondaryActionProps={{
          children: "Secondary Action",
        }}
      />
    </VStack>
  );
}
