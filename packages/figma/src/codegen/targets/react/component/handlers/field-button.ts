import { defineComponentHandler } from "@/codegen/core";
import * as sets from "@/entities/data/__generated__/component-sets";
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

// published but taken down now
const FIELD_BUTTON_KEYS = {
  selectField: "a2138764f60a9b5a35e22ff40bc6cd701c660260",
  datePickerField: "c161d1326a1087258e4f762aa3c378c098308d98",
  timePickerField: "e38df17cf1e0f96e09774b015739dfde30d46115",
  addressPickerField: "4af06df28eca43fe2be5fe5ba5e6019587de9fac",
} as const;

export const createFieldButtonHandler = (ctx: ComponentHandlerDeps) => {
  const fieldHeaderHandler = createFieldHeaderHandler(ctx);
  const fieldFooterHandler = createFieldFooterHandler(ctx);

  return defineComponentHandler<FieldButtonProperties>(
    sets.templateFieldButton.key,
    (node, traverse) => {
      const props = node.componentProperties;

      const [inputButton] = findAllInstances<InputButtonProperties>({
        node,
        key: sets.privateComponentInputButton.key,
      });

      const [clearButton] = findAllInstances<ActionButtonGhostProperties>({
        node,
        key: sets.componentActionButtonGhostButton.key,
      });

      const [fieldHeader] = findAllInstances<FieldHeaderProperties>({
        node,
        key: sets.privateComponentFieldHeader.key,
      });
      const [fieldFooter] = findAllInstances<FieldFooterProperties>({
        node,
        key: sets.privateComponentFieldFooter.key,
      });

      // maxGraphemeCount and required can't be props of FieldButton
      const { required: __required, ...headerProps } =
        props["Show Header#40606:8"].value && fieldHeader
          ? (fieldHeaderHandler.transform(fieldHeader, traverse).props as FieldHeaderProps)
          : {};
      const { maxGraphemeCount: __maxGraphemeCount, ...footerProps } =
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
    FIELD_BUTTON_KEYS.selectField,
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
    FIELD_BUTTON_KEYS.datePickerField,
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
    FIELD_BUTTON_KEYS.timePickerField,
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
    FIELD_BUTTON_KEYS.addressPickerField,
    (node, traverse) => {
      const [fieldButton] = findAllInstances<FieldButtonProperties>({
        node,
        key: fieldButtonHandler.key,
      });

      return fieldButtonHandler.transform(fieldButton, traverse);
    },
  );
};
