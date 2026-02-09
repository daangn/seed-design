import type {
  SegmentedControlItemProperties,
  SegmentedControlProperties,
} from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { findAllInstances } from "@/utils/figma-node";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";

const { createLocalSnippetElement } = createLocalSnippetHelper("segmented-control");

const createSegmentedControlItemHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<SegmentedControlItemProperties>(
    metadata.privateComponentSegmentedControlItem.key,
    ({ componentProperties: props }) => {
      const states = props.State.value.split("-");
      const commonProps = {
        value: props["Label#11366:15"].value,
        ...(states.includes("Disabled") && {
          disabled: true,
        }),
      };

      return createLocalSnippetElement(
        "SegmentedControlItem",
        commonProps,
        props["Label#11366:15"].value,
      );
    },
  );

export const createSegmentedControlHandler = (ctx: ComponentHandlerDeps) => {
  const segmentedControlItemHandler = createSegmentedControlItemHandler(ctx);

  return defineComponentHandler<SegmentedControlProperties>(
    metadata.componentSegmentedControl.key,
    (node, traverse) => {
      const segments = findAllInstances<SegmentedControlItemProperties>({
        node,
        key: segmentedControlItemHandler.key,
      });

      const selectedSegment = segments.find((segment) =>
        segment.componentProperties.State.value.split("-").includes("Selected"),
      );

      const segmentedControlChildren = segments.map((segment) =>
        segmentedControlItemHandler.transform(segment, traverse),
      );

      const commonProps = {
        ...(selectedSegment && {
          defaultValue: selectedSegment.componentProperties["Label#11366:15"].value,
        }),
      };

      return createLocalSnippetElement("SegmentedControl", commonProps, segmentedControlChildren, {
        comment: "aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
      });
    },
  );
};
