import type { RadioGroupFieldProperties, RadioProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";
import { camelCase } from "change-case";
import { match } from "ts-pattern";
import {
  createFieldFooterHandler,
  createFieldHeaderHandler,
  type FieldFooterProps,
  type FieldHeaderProps,
} from "@/codegen/targets/react/component/handlers/field";
import { findAllInstances } from "@/utils/figma-node";
import type { FieldFooterProperties, FieldHeaderProperties } from "@/codegen/component-properties";

const { createLocalSnippetElement } = createLocalSnippetHelper("radio-group");

export const createRadioGroupItemHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<RadioProperties>(
    metadata.componentRadio.key,
    ({ componentProperties: props }) => {
      const tone = match(props.Tone.value)
        .with("Neutral", () => "neutral")
        .with("🚫[Deprecated]Brand", () => "brand")
        .exhaustive();

      const commonProps = {
        ...(props.State.value === "Disabled" && {
          disabled: true,
        }),
        label: props["Label#49990:171"].value,
        value: props["Label#49990:171"].value,
        size: handleSizeProp(props.Size.value),
        tone,
        weight: camelCase(props.Weight.value),
      };

      return createLocalSnippetElement("RadioGroupItem", commonProps, undefined, {
        comment: "RadioGroup으로 묶어서 사용하세요.",
      });
    },
  );

export const createRadioGroupFieldHandler = (ctx: ComponentHandlerDeps) => {
  const radioItemHandler = createRadioGroupItemHandler(ctx);
  const fieldHeaderHandler = createFieldHeaderHandler(ctx);
  const fieldFooterHandler = createFieldFooterHandler(ctx);

  return defineComponentHandler<RadioGroupFieldProperties>(
    metadata.templateRadioField.key,
    (node, traverse) => {
      const { componentProperties: props } = node;

      const items = findAllInstances<RadioProperties>({
        node,
        key: radioItemHandler.key,
      });
      const [fieldHeader] = findAllInstances<FieldHeaderProperties>({
        node,
        key: fieldHeaderHandler.key,
      });
      const [fieldFooter] = findAllInstances<FieldFooterProperties>({
        node,
        key: fieldFooterHandler.key,
      });

      // maxGraphemeCount and required can't be props of RadioGroup
      const { required: _required, ...headerProps } =
        props["Show Header#40606:8"].value && fieldHeader
          ? (fieldHeaderHandler.transform(fieldHeader, traverse).props as FieldHeaderProps)
          : {};
      const { maxGraphemeCount: _maxGraphemeCount, ...footerProps } =
        props["Show Footer#40606:9"].value && fieldFooter
          ? (fieldFooterHandler.transform(fieldFooter, traverse).props as FieldFooterProps)
          : {};

      const selectedItem = items.find((item) => item.componentProperties.Selected.value === "True");

      const commonProps = {
        ...headerProps,
        ...footerProps,

        ...(selectedItem && {
          defaultValue: selectedItem.componentProperties["Label#49990:171"].value,
        }),
      };

      return createLocalSnippetElement(
        "RadioGroup",
        commonProps,
        items.map((item) => {
          const result = radioItemHandler.transform(item, traverse);

          return {
            ...result,
            meta: {
              ...result.meta,

              // remove comment from individual RadioGroupItem items
              comment: undefined,
            },
          };
        }),
      );
    },
  );
};
