import type {
  FieldFooterProperties,
  FieldHeaderProperties,
  SliderFieldProperties,
  SliderProperties,
  SliderTicksProperties,
} from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { match } from "ts-pattern";
import { findAllInstances } from "@/utils/figma-node";
import {
  createFieldFooterHandler,
  createFieldHeaderHandler,
  type FieldFooterProps,
  type FieldHeaderProps,
} from "@/codegen/targets/react/component/handlers/field";

const { createLocalSnippetElement } = createLocalSnippetHelper("slider");

function getSliderComment(props: { markers?: unknown; ticks?: unknown } & Record<string, unknown>) {
  return [
    "min, max, step 값을 적절히 조정해주세요.",
    props.markers && "markers 배열을 채워주세요.",
    props.ticks && "ticks 배열을 채워주세요.",
  ]
    .filter(Boolean)
    .join(" ");
}

export const createSliderFieldHandler = (ctx: ComponentHandlerDeps) => {
  const sliderHandler = createSliderHandler(ctx);
  const fieldHeaderHandler = createFieldHeaderHandler(ctx);
  const fieldFooterHandler = createFieldFooterHandler(ctx);

  return defineComponentHandler<SliderFieldProperties>(
    metadata.templateSliderField.key,
    (node, traverse) => {
      const props = node.componentProperties;

      const [slider] = findAllInstances<SliderProperties>({
        node,
        key: sliderHandler.key,
      });
      const [fieldHeader] = findAllInstances<FieldHeaderProperties>({
        node,
        key: fieldHeaderHandler.key,
      });
      const [fieldFooter] = findAllInstances<FieldFooterProperties>({
        node,
        key: fieldFooterHandler.key,
      });

      const sliderProps = sliderHandler.transform(slider, traverse).props;

      // maxGraphemeCount and required can't be props of Slider
      const { required: _required, ...headerProps } =
        props["Show Header#40606:8"].value && fieldHeader
          ? (fieldHeaderHandler.transform(fieldHeader, traverse).props as FieldHeaderProps)
          : {};
      const { maxGraphemeCount: _maxGraphemeCount, ...footerProps } =
        props["Show Footer#40606:9"].value && fieldFooter
          ? (fieldFooterHandler.transform(fieldFooter, traverse).props as FieldFooterProps)
          : {};

      const commonProps = {
        ...sliderProps,
        ...headerProps,
        ...footerProps,
      };

      return createLocalSnippetElement("Slider", commonProps, undefined, {
        comment: getSliderComment(commonProps),
      });
    },
  );
};

export const createSliderHandler = (_ctx: ComponentHandlerDeps) => {
  return defineComponentHandler<SliderProperties>(metadata.componentSlider.key, (node) => {
    const { componentProperties: props } = node;

    const { min, max, defaultValues } = match(props.Value.value)
      .with("Single", () => ({ min: 0, max: 100, defaultValues: [50] }))
      .with("Range", () => ({ min: 0, max: 100, defaultValues: [0, 50] }))
      .exhaustive();

    const [ticks] = findAllInstances<SliderTicksProperties>({
      node,
      key: metadata.privateComponentSliderItemTickMark.key,
    });

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
      comment: getSliderComment(commonProps),
    });
  });
};
