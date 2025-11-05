import type { SliderProperties, SliderTicksProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { match } from "ts-pattern";
import { findAllInstances } from "@/utils/figma-node";

const { createLocalSnippetElement } = createLocalSnippetHelper("slider");

const SLIDER_TICK_KEY = "ace432ffb7a2af13bce549b19c932ac5f96a9a78";

export const createSliderHandler = (_ctx: ComponentHandlerDeps) => {
  return defineComponentHandler<SliderProperties>(metadata.slider.key, (node) => {
    const { componentProperties: props } = node;

    const { min, max, defaultValues } = match(props.Value.value)
      .with("Single", () => ({ min: 0, max: 100, defaultValues: [50] }))
      .with("Range", () => ({ min: 0, max: 100, defaultValues: [0, 50] }))
      .exhaustive();

    const [ticks] = findAllInstances<SliderTicksProperties>({ node, key: SLIDER_TICK_KEY });

    const commonProps = {
      min,
      max,
      defaultValues,
      hideRange: props["Show Active Track#48156:0"].value === false,
      ...(props["Show Markers#49596:0"].value === true && {
        markers: [],
      }),
      ...(props["Has Tick Mark#47921:0"].value === true &&
        ticks && {
          ticks: [],
          tickWeight: ticks.componentProperties.Type.value === "Discrete" ? "thick" : "thin",
        }),
      ...(props.State.value === "Disabled" && {
        disabled: true,
      }),
    };

    return createLocalSnippetElement("Slider", commonProps, undefined, {
      comment: [
        "min, max, step 값을 적절히 조정해주세요.",
        commonProps.markers && "markers 배열을 채워주세요..",
        commonProps.ticks && "ticks 배열을 채워주세요.",
      ].join(" "),
    });
  });
};

// label?
// labelWeight?
// indicator?
// description?
// errorMessage?
// showRequiredIndicator?
