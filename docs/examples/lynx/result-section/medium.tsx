import "./styles";

import { root } from "@lynx-js/react";
import { VStack, useSeedClassName } from "@seed-design/lynx-react";
import { ResultSection } from "@/components/ui/result-section";

function Root() {
  const seedClassName = useSeedClassName({ colorMode: "system" });

  return (
    <page className={seedClassName}>
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
    </page>
  );
}

root.render(<Root />);
