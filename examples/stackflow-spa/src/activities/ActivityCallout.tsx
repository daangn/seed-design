import type { ActivityComponentType } from "@stackflow/react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { ActionableCallout, Callout, Flex } from "../design-system/components";

const ActivityCallout: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: "Callout" }}>
      <Flex flexDirection="column" paddingX={4}>
        <Callout
          variant="neutral"
          title="타이틀"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod a maxime quaerat odio. Totam dicta ut corporis fuga delectus adipisci."
        />
        <Callout
          variant="outline"
          title="타이틀"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod a maxime quaerat odio. Totam dicta ut corporis fuga delectus adipisci."
        />
        <Callout
          variant="informative"
          title="타이틀"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod a maxime quaerat odio. Totam dicta ut corporis fuga delectus adipisci."
        />
        <Callout
          variant="warning"
          title="타이틀"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod a maxime quaerat odio. Totam dicta ut corporis fuga delectus adipisci."
        />
        <Callout
          variant="danger"
          title="타이틀"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod a maxime quaerat odio. Totam dicta ut corporis fuga delectus adipisci."
        />
        <ActionableCallout variant="neutral" description="ActionableCallout" />
      </Flex>
    </AppScreen>
  );
};

export default ActivityCallout;
