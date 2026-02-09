import { defineComponentHandler } from "@/codegen/core";
import * as sets from "@/entities/data/__generated__/archive/component-sets";
import * as components from "@/entities/data/__generated__/archive/components";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import {
  createFieldFooterHandler,
  createFieldHeaderHandler,
  FIELD_KEYS,
  type FieldFooterProps,
  type FieldHeaderProps,
} from "@/codegen/targets/react/component/handlers/archive/field";
import type {
  FieldHeaderProperties,
  FieldFooterProperties,
  FieldButtonProperties,
  InputButtonProperties,
  InputButtonPrefixProperties,
  InputButtonSuffixProperties,
  ActionButtonGhostProperties,
  GenericFieldButtonProps,
} from "@/codegen/component-properties.archive";
import { findAllInstances, findOne } from "@/utils/figma-node";
import type { NormalizedTextNode } from "@/normalizer";

const { createLocalSnippetElement } = createLocalSnippetHelper("field-button");

const INPUT_BUTTON_KEY = "965bdecb58755af9a08d60cc3c8d2d33b42e15f0";
const INPUT_BUTTON_PREFIX_KEY = "12b40c736a098298c64ba16de85702b4b460d1f1";
const INPUT_BUTTON_SUFFIX_KEY = "5dda27af9f4afafa471925c17acf97d81912877a";

export const createFieldButtonHandler = (ctx: ComponentHandlerDeps) => {
  const fieldHeaderHandler = createFieldHeaderHandler(ctx);
  const fieldFooterHandler = createFieldFooterHandler(ctx);

  return defineComponentHandler<FieldButtonProperties>(
    sets.templateCustomPickerField.key,
    (node, traverse) => {
      const props = node.componentProperties;

      const [inputButton] = findAllInstances<InputButtonProperties>({
        node,
        key: INPUT_BUTTON_KEY,
      });

      const [clearButton] = findAllInstances<ActionButtonGhostProperties>({
        node,
        key: sets.actionButtonGhostButton.key,
      });

      const [fieldHeader] = findAllInstances<FieldHeaderProperties>({
        node,
        key: FIELD_KEYS.HEADER,
      });
      const [fieldFooter] = findAllInstances<FieldFooterProperties>({
        node,
        key: FIELD_KEYS.FOOTER,
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
        key: INPUT_BUTTON_PREFIX_KEY,
      });

      const [suffix] = findAllInstances<InputButtonSuffixProperties>({
        node: inputButton,
        key: INPUT_BUTTON_SUFFIX_KEY,
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
    components.templateSelectField.key,
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
    components.templateDatePickerField.key,
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
    components.templateTimePickerField.key,
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
    components.templateAddressPickerField.key,
    (node, traverse) => {
      const [fieldButton] = findAllInstances<FieldButtonProperties>({
        node,
        key: fieldButtonHandler.key,
      });

      return fieldButtonHandler.transform(fieldButton, traverse);
    },
  );
};
