import type {
  CheckboxGroupFieldProperties,
  CheckboxProperties,
  FieldFooterProperties,
  FieldHeaderProperties,
} from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { handleSizeProp } from "../size";
import { match } from "ts-pattern";
import {
  createFieldFooterHandler,
  createFieldHeaderHandler,
  type FieldFooterProps,
  type FieldHeaderProps,
} from "@/codegen/targets/react/component/handlers/field";
import { findAllInstances } from "@/utils/figma-node";

const { createLocalSnippetElement } = createLocalSnippetHelper("checkbox");

export const createCheckboxHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<CheckboxProperties>(
    metadata.componentCheckbox.key,
    ({ componentProperties: props }) => {
      const tone = match(props.Tone.value)
        .with("Neutral", () => "neutral")
        .with("Brand", () => "brand")
        .exhaustive();

      const commonProps = {
        label: props["Label#49990:0"].value,
        weight: camelCase(props.Weight.value),
        tone,
        variant: camelCase(props.Shape.value),
        size: handleSizeProp(props.Size.value),
        ...(props.Selected.value === "True" && {
          defaultChecked: true,
        }),
        ...(props.Selected.value === "Indeterminate" && {
          defaultChecked: true,
          indeterminate: true,
        }),
        ...(props.State.value === "Disabled" && {
          disabled: true,
        }),
      };

      return createLocalSnippetElement("Checkbox", commonProps, undefined, {
        comment: "CheckboxGroup으로 묶어서 사용하는 것을 권장합니다.",
      });
    },
  );

export const createCheckboxGroupFieldHandler = (ctx: ComponentHandlerDeps) => {
  const checkboxHandler = createCheckboxHandler(ctx);
  const fieldHeaderHandler = createFieldHeaderHandler(ctx);
  const fieldFooterHandler = createFieldFooterHandler(ctx);

  return defineComponentHandler<CheckboxGroupFieldProperties>(
    metadata.componentCheckboxField.key,
    (node, traverse) => {
      const { componentProperties: props } = node;

      const items = findAllInstances<CheckboxProperties>({
        node,
        key: checkboxHandler.key,
      });
      const [fieldHeader] = findAllInstances<FieldHeaderProperties>({
        node,
        key: fieldHeaderHandler.key,
      });
      const [fieldFooter] = findAllInstances<FieldFooterProperties>({
        node,
        key: fieldFooterHandler.key,
      });

      // maxGraphemeCount / required / invalid can't be props of CheckboxGroup
      const { required: _required, ...headerProps } =
        props["Show Header#40606:8"].value && fieldHeader
          ? (fieldHeaderHandler.transform(fieldHeader, traverse).props as FieldHeaderProps)
          : {};
      const {
        maxGraphemeCount: _maxGraphemeCount,
        invalid: _invalid,
        ...footerProps
      } = props["Show Footer#40606:9"].value && fieldFooter
        ? (fieldFooterHandler.transform(fieldFooter, traverse).props as FieldFooterProps)
        : {};

      const commonProps = {
        ...headerProps,
        ...footerProps,
      };

      return createLocalSnippetElement(
        "CheckboxGroup",
        commonProps,
        items.map((item) => {
          const result = checkboxHandler.transform(item, traverse);

          return {
            ...result,
            meta: {
              ...result.meta,

              // remove comment from individual Checkbox items
              comment: undefined,
            },
          };
        }),
        {
          comment: [
            headerProps.label
              ? undefined
              : "label을 제공하지 않는 경우 aria-label이나 aria-labelledby 중 하나를 제공해야 합니다.",
            footerProps.errorMessage
              ? "errorMessage를 표시하는 경우, 접근성을 위해 개별 Checkbox 중 무효한 항목에 invalid를 설정해주세요."
              : undefined,
          ]
            .filter(Boolean)
            .join(" "),
        },
      );
    },
  );
};
