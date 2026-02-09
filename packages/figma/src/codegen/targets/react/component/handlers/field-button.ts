import { defineComponentHandler } from "@/codegen/core";
import * as sets from "@/entities/data/__generated__/component-sets";
import * as components from "@/entities/data/__generated__/components";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import {
  createFieldFooterHandler,
  createFieldHeaderHandler,
  type FieldFooterProps,
  type FieldHeaderProps,
} from "@/codegen/targets/react/component/handlers/field";
import type {
  FieldHeaderProperties,
  FieldFooterProperties,
  FieldButtonProperties,
  InputButtonProperties,
  InputButtonPrefixProperties,
  InputButtonSuffixProperties,
  ActionButtonGhostProperties,
  GenericFieldButtonProps,
} from "@/codegen/component-properties";
import { findAllInstances, findOne } from "@/utils/figma-node";
import type { NormalizedTextNode } from "@/normalizer";

const { createLocalSnippetElement } = createLocalSnippetHelper("field-button");

export const createFieldButtonHandler = (ctx: ComponentHandlerDeps) => {
  const fieldHeaderHandler = createFieldHeaderHandler(ctx);
  const fieldFooterHandler = createFieldFooterHandler(ctx);

  return defineComponentHandler<FieldButtonProperties>(
    sets.templateFieldButton.key,
    (node, traverse) => {
      const props = node.componentProperties;

      const [inputButton] = findAllInstances<InputButtonProperties>({
        node,
        key: sets.componentInputButton.key,
      });

      const [clearButton] = findAllInstances<ActionButtonGhostProperties>({
        node,
        key: sets.componentActionButtonGhostButton.key,
      });

      const [fieldHeader] = findAllInstances<FieldHeaderProperties>({
        node,
        key: sets.componentFieldHeader.key,
      });
      const [fieldFooter] = findAllInstances<FieldFooterProperties>({
        node,
        key: sets.componentFieldFooter.key,
      });

      // maxGraphemeCount and required can't be props of FieldButton
      const { required: _required, ...headerProps } =
        props["Show Header#40606:8"].value && fieldHeader
          ? (fieldHeaderHandler.transform(fieldHeader, traverse).props as FieldHeaderProps)
          : {};
      const { maxGraphemeCount: _maxGraphemeCount, ...footerProps } =
        props["Show Footer#40606:9"].value && fieldFooter
          ? (fieldFooterHandler.transform(fieldFooter, traverse).props as FieldFooterProps)
          : {};

      const [prefix] = findAllInstances<InputButtonPrefixProperties>({
        node: inputButton,
        key: sets.privateComponentInputButtonPrefix.key,
      });

      const [suffix] = findAllInstances<InputButtonSuffixProperties>({
        node: inputButton,
        key: sets.privateComponentInputButtonSuffix.key,
      });

      const commonProps = {
        ...(inputButton.componentProperties.State.value === "Disabled" && {
          disabled: true,
        }),
        ...((inputButton.componentProperties.State.value === "Error" ||
          inputButton.componentProperties.State.value === "Error Pressed") && {
          invalid: true,
        }),
        ...(clearButton && {
          showClearButton: true,
        }),
        ...(inputButton.componentProperties["Has Prefix#32514:10"].value === true &&
          prefix &&
          prefix.componentProperties.Type.value === "Icon" && {
            prefixIcon: ctx.iconHandler.transform(prefix.componentProperties["Icon#34021:2"]),
          }),
        ...(inputButton.componentProperties["Has Suffix#32865:68"].value === true &&
          suffix &&
          suffix.componentProperties["Type (Figma Only)"].value === "Icon" && {
            suffixIcon: ctx.iconHandler.transform(suffix.componentProperties["Icon#37963:0"]),
          }),
        ...(inputButton.componentProperties["Has Suffix#32865:68"].value === true &&
          suffix &&
          suffix.componentProperties["Type (Figma Only)"].value === "Text" && {
            suffix: suffix.componentProperties["Suffix Text#34021:4"].value,
          }),
      };

      // these can be fragile but better than having 9 different handlers
      const placeholder = findOne(
        node,
        (node) => node.type === "TEXT" && node.name.toLowerCase().includes("placeholder"),
      ) as NormalizedTextNode;

      const value = findOne(
        node,
        (node) => node.type === "TEXT" && node.name.toLowerCase().includes("value"),
      ) as NormalizedTextNode;

      return createLocalSnippetElement(
        "FieldButton",
        { ...headerProps, ...footerProps, ...commonProps },
        props["Has Value"].value === "True" && value
          ? createLocalSnippetElement("FieldButtonValue", undefined, value.characters)
          : placeholder
            ? createLocalSnippetElement("FieldButtonPlaceholder", undefined, placeholder.characters)
            : undefined,
        { comment: "buttonProps를 통해 aria-label을 제공하세요." },
      );
    },
  );
};

// TODO: those 4 are basically the same

export const createSelectFieldHandler = (ctx: ComponentHandlerDeps) => {
  const fieldButtonHandler = createFieldButtonHandler(ctx);

  return defineComponentHandler<GenericFieldButtonProps>(
    components.privateTemplateSelectField.key,
    (node, traverse) => {
      const [fieldButton] = findAllInstances<FieldButtonProperties>({
        node,
        key: fieldButtonHandler.key,
      });

      return fieldButtonHandler.transform(fieldButton, traverse);
    },
  );
};

export const createDatePickerFieldHandler = (ctx: ComponentHandlerDeps) => {
  const fieldButtonHandler = createFieldButtonHandler(ctx);

  return defineComponentHandler<GenericFieldButtonProps>(
    components.privateTemplateDatePickerField.key,
    (node, traverse) => {
      const [fieldButton] = findAllInstances<FieldButtonProperties>({
        node,
        key: fieldButtonHandler.key,
      });

      return fieldButtonHandler.transform(fieldButton, traverse);
    },
  );
};

export const createTimePickerFieldHandler = (ctx: ComponentHandlerDeps) => {
  const fieldButtonHandler = createFieldButtonHandler(ctx);

  return defineComponentHandler<GenericFieldButtonProps>(
    components.privateTemplateTimePickerField.key,
    (node, traverse) => {
      const [fieldButton] = findAllInstances<FieldButtonProperties>({
        node,
        key: fieldButtonHandler.key,
      });

      return fieldButtonHandler.transform(fieldButton, traverse);
    },
  );
};

export const createAddressFieldHandler = (ctx: ComponentHandlerDeps) => {
  const fieldButtonHandler = createFieldButtonHandler(ctx);

  return defineComponentHandler<GenericFieldButtonProps>(
    components.privateTemplateAddressPickerField.key,
    (node, traverse) => {
      const [fieldButton] = findAllInstances<FieldButtonProperties>({
        node,
        key: fieldButtonHandler.key,
      });

      return fieldButtonHandler.transform(fieldButton, traverse);
    },
  );
};
