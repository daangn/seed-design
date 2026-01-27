import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
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
  TextareaProperties,
  TextInputFieldProperties,
  TextInputOutlineProperties,
  TextInputUnderlineProperties,
  TextInputOutlinePrefixProperties,
  TextInputOutlineSuffixProperties,
  TextInputUnderlinePrefixProperties,
  TextInputUnderlineSuffixProperties,
  TextareaFieldProperties,
} from "@/codegen/component-properties.archive";
import { findAllInstances, findOne } from "@/utils/figma-node";
import type { NormalizedTextNode } from "@/normalizer";

const { createLocalSnippetElement } = createLocalSnippetHelper("text-field");

const TEXT_INPUT_OUTLINE_KEY = "22eebd645d310c086d9f5f69d8f179ff5c7cf7ca";
const TEXT_INPUT_OUTLINE_PREFIX_KEY = "1ab174dd51bc42a5efe530f52f1dd02255c50b18";
const TEXT_INPUT_OUTLINE_SUFFIX_KEY = "555fee288d9053760e301791665bbac31d19c43f";

const TEXT_INPUT_UNDERLINE_KEY = "16e9e343fc319190149369bd61076d6415e09a8a";
const TEXT_INPUT_UNDERLINE_PREFIX_KEY = "a7ceae43b6daf4490e8ab408d2c29fb63b2eb891";
const TEXT_INPUT_UNDERLINE_SUFFIX_KEY = "1b88368820be61f358e24a8aaa601e7f2a2ea101";

const TEXTAREA_KEY = "22bb206483f00cd635188eea6ae8a6aac058b5d5";

export const createTextInputFieldHandler = (ctx: ComponentHandlerDeps) => {
  const fieldHeaderHandler = createFieldHeaderHandler(ctx);
  const fieldFooterHandler = createFieldFooterHandler(ctx);

  return defineComponentHandler<TextInputFieldProperties>(
    metadata.templateTextField.key,
    (node, traverse) => {
      const props = node.componentProperties;

      const [textInputOutline] = findAllInstances<TextInputOutlineProperties>({
        node,
        key: TEXT_INPUT_OUTLINE_KEY,
      });
      const [textInputUnderline] = findAllInstances<TextInputUnderlineProperties>({
        node,
        key: TEXT_INPUT_UNDERLINE_KEY,
      });

      const [fieldHeader] = findAllInstances<FieldHeaderProperties>({
        node,
        key: FIELD_KEYS.HEADER,
      });
      const [fieldFooter] = findAllInstances<FieldFooterProperties>({
        node,
        key: FIELD_KEYS.FOOTER,
      });

      const fieldProps = {
        ...(props["Show Header#40606:8"].value && fieldHeader
          ? (fieldHeaderHandler.transform(fieldHeader, traverse).props as FieldHeaderProps)
          : {}),
        ...(props["Show Footer#40606:9"].value && fieldFooter
          ? (fieldFooterHandler.transform(fieldFooter, traverse).props as FieldFooterProps)
          : {}),
      };

      const commonProps = (() => {
        if (textInputOutline) {
          const [prefix] = findAllInstances<TextInputOutlinePrefixProperties>({
            node: textInputOutline,
            key: TEXT_INPUT_OUTLINE_PREFIX_KEY,
          });

          const [suffix] = findAllInstances<TextInputOutlineSuffixProperties>({
            node: textInputOutline,
            key: TEXT_INPUT_OUTLINE_SUFFIX_KEY,
          });

          return {
            variant: "outline",
            ...(textInputOutline.componentProperties.State.value === "Disabled" && {
              disabled: true,
            }),
            ...(textInputOutline.componentProperties.State.value === "Read Only" && {
              readOnly: true,
            }),
            ...(textInputOutline.componentProperties.State.value === "Error" && {
              invalid: true,
            }),
            ...(textInputOutline.componentProperties.State.value === "Error Focused" && {
              invalid: true,
            }),
            ...(textInputOutline.componentProperties["Has Prefix#32514:10"].value === true &&
              prefix &&
              prefix.componentProperties.Type.value === "Icon" && {
                prefixIcon: ctx.iconHandler.transform(prefix.componentProperties["Icon#34021:2"]),
              }),
            ...(textInputOutline.componentProperties["Has Suffix#32865:68"].value === true &&
              suffix &&
              suffix.componentProperties["Type (Figma Only)"].value === "Icon" && {
                suffixIcon: ctx.iconHandler.transform(suffix.componentProperties["Icon#45391:0"]),
              }),
            ...(textInputOutline.componentProperties["Has Suffix#32865:68"].value === true &&
              suffix &&
              suffix.componentProperties["Type (Figma Only)"].value === "Text" && {
                suffix: suffix.componentProperties["Suffix Text#34021:4"].value,
              }),
          };
        }

        if (textInputUnderline) {
          const [prefix] = findAllInstances<TextInputUnderlinePrefixProperties>({
            node: textInputUnderline,
            key: TEXT_INPUT_UNDERLINE_PREFIX_KEY,
          });

          const [suffix] = findAllInstances<TextInputUnderlineSuffixProperties>({
            node: textInputUnderline,
            key: TEXT_INPUT_UNDERLINE_SUFFIX_KEY,
          });

          return {
            variant: "underline",
            ...(textInputUnderline.componentProperties.State.value === "Disabled" && {
              disabled: true,
            }),
            ...(textInputUnderline.componentProperties.State.value === "Read Only" && {
              readOnly: true,
            }),
            ...(textInputUnderline.componentProperties.State.value === "Error" && {
              invalid: true,
            }),
            ...(textInputUnderline.componentProperties.State.value === "Error Focused" && {
              invalid: true,
            }),
            ...(textInputUnderline.componentProperties["Has Prefix#34125:0"].value === true &&
              prefix &&
              prefix.componentProperties.Type.value === "Icon" && {
                prefixIcon: ctx.iconHandler.transform(prefix.componentProperties["Icon#34021:2"]),
              }),
            ...(textInputUnderline.componentProperties["Has Suffix#34125:8"].value === true &&
              suffix &&
              suffix.componentProperties["Type (Figma Only)"].value === "Icon" && {
                suffixIcon: ctx.iconHandler.transform(suffix.componentProperties["Icon#45391:5"]),
              }),
            ...(textInputUnderline.componentProperties["Has Suffix#34125:8"].value === true &&
              suffix &&
              suffix.componentProperties["Type (Figma Only)"].value === "Text" && {
                suffix: suffix.componentProperties["Suffix Text#34021:4"].value,
              }),
          };
        }

        return {};
      })();

      // these can be fragile but better than having 9 different handlers
      const placeholder = findOne(
        node,
        (node) => node.type === "TEXT" && node.name.toLowerCase().includes("placeholder"),
      ) as NormalizedTextNode;

      const value = findOne(
        node,
        (node) => node.type === "TEXT" && node.name.toLowerCase().includes("value"),
      ) as NormalizedTextNode;

      const inputProps = {
        ...(placeholder && {
          placeholder: placeholder.characters,
        }),
      };

      return createLocalSnippetElement(
        "TextField",
        {
          ...fieldProps,
          ...commonProps,
          ...(value && {
            defaultValue: value.characters,
          }),
        },
        createLocalSnippetElement("TextFieldInput", inputProps),
      );
    },
  );
};

export const createTextareaFieldHandler = (ctx: ComponentHandlerDeps) => {
  const fieldHeaderHandler = createFieldHeaderHandler(ctx);
  const fieldFooterHandler = createFieldFooterHandler(ctx);

  return defineComponentHandler<TextareaFieldProperties>(
    metadata.templateTextareaField.key,
    (node, traverse) => {
      const [textarea] = findAllInstances<TextareaProperties>({
        node,
        key: TEXTAREA_KEY,
      });
      const [fieldHeader] = findAllInstances<FieldHeaderProperties>({
        node,
        key: FIELD_KEYS.HEADER,
      });
      const [fieldFooter] = findAllInstances<FieldFooterProperties>({
        node,
        key: FIELD_KEYS.FOOTER,
      });

      const fieldProps = {
        ...(fieldHeader
          ? (fieldHeaderHandler.transform(fieldHeader, traverse).props as FieldHeaderProps)
          : {}),
        ...(fieldFooter
          ? (fieldFooterHandler.transform(fieldFooter, traverse).props as FieldFooterProps)
          : {}),
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

      const inputProps = {
        autoresize: textarea.componentProperties["Auto Size (Figma Only)"].value === "true",
        ...(placeholder && {
          placeholder: placeholder.characters,
        }),
      };

      const commonProps = {
        ...(textarea.componentProperties.State.value === "Disabled" && {
          disabled: true,
        }),
        ...(textarea.componentProperties.State.value === "Read Only" && {
          readOnly: true,
        }),
        ...(value && {
          defaultValue: value.characters,
        }),
      };

      return createLocalSnippetElement(
        "TextField",
        { ...fieldProps, ...commonProps },
        createLocalSnippetElement("TextFieldTextarea", inputProps),
      );
    },
  );
};
