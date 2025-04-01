import * as metadata from "../../data/__generated__/component-sets";
import { createElement } from "../../jsx";
import { findAllInstances } from "../../node-util";
import type { ComponentHandler } from "../type-helper";
import type { SegmentedControlItemProperties, SegmentedControlProperties } from "../type";

export const segmentedControlHandler: ComponentHandler<SegmentedControlProperties> = {
  key: metadata.segmentedControl.key,
  codegen: async (node) => {
    const segments = await findAllInstances<SegmentedControlItemProperties>({
      node,
      key: segmentedControlItemHandler.key,
    });

    const selectedSegment = segments.find((segment) =>
      segment.componentProperties.State.value.split("-").includes("Selected"),
    );

    const segmentedControlChildren = await Promise.all(
      segments.map(segmentedControlItemHandler.codegen),
    );

    const commonProps = {
      ...(selectedSegment && {
        defaultValue: selectedSegment.componentProperties["Label#11366:15"].value,
      }),
    };

    return createElement(
      "SegmentedControl",
      commonProps,
      segmentedControlChildren,
      "aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
    );
  },
};

const segmentedControlItemHandler: ComponentHandler<SegmentedControlItemProperties> = {
  key: "9a7ba0d4c041ddbce84ee48881788434fd6bccc8",
  codegen: async ({ componentProperties: props }) => {
    const states = props.State.value.split("-");
    const commonProps = {
      value: props["Label#11366:15"].value,
      ...(states.includes("Disabled") && {
        disabled: true,
      }),
    };

    return createElement("SegmentedControlItem", commonProps, props["Label#11366:15"].value);
  },
};
