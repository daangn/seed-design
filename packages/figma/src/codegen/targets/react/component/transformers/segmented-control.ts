import { createElement, defineComponentTransformer } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import type { SeedComponentTransformerDeps } from "../deps.interface";
import type {
  SegmentedControlItemProperties,
  SegmentedControlProperties,
} from "../properties.type";

const SEGMENTED_CONTROL_ITEM_KEY = "9a7ba0d4c041ddbce84ee48881788434fd6bccc8";
const createSegmentedControlItemTransformer = (_ctx: SeedComponentTransformerDeps) =>
  defineComponentTransformer<SegmentedControlItemProperties>(
    SEGMENTED_CONTROL_ITEM_KEY,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");
      const commonProps = {
        value: props["Label#11366:15"].value,
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
      };

      return createElement("SegmentedControlItem", commonProps, props["Label#11366:15"].value);
    },
  );

export const createSegmentedControlTransformer = (ctx: SeedComponentTransformerDeps) => {
  const segmentedControlItemTransformer = createSegmentedControlItemTransformer(ctx);

  return defineComponentTransformer<SegmentedControlProperties>(
    metadata.segmentedControl.key,
    (node) => {
      const segments = findAllInstances<SegmentedControlItemProperties>({
        node,
        key: segmentedControlItemTransformer.key,
      });

      const selectedSegment = segments.find((segment) =>
        segment.componentProperties.State.value.split("-").includes("Selected"),
      );

      const segmentedControlChildren = segments.map(segmentedControlItemTransformer.transform);

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
  );
};
