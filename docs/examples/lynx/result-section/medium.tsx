import "./styles";

import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { ResultSection } from "@/components/ui/result-section";

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <view className={`${seedClassName} docs-lynx-result-section-root`}>
      <VStack width="full" height="full" align="center" justify="center">
        <VStack minHeight="480px" width="320px" borderWidth={1} borderColor="stroke.neutralMuted">
          <ResultSection
            size="medium"
            title="cupidatat ad consequat"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            primaryActionProps={{ children: "Primary Action" }}
            secondaryActionProps={{ children: "Secondary Action" }}
          />
        </VStack>
      </VStack>
    </view>
  );
}
