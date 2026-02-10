import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
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
  TextareaProperties,
  TextInputFieldProperties,
  TextInputOutlineProperties,
  TextInputUnderlineProperties,
  TextInputOutlinePrefixProperties,
  TextInputOutlineSuffixProperties,
  TextInputUnderlinePrefixProperties,
  TextInputUnderlineSuffixProperties,
  TextareaFieldProperties,
} from "@/codegen/component-properties";
import { findAllInstances, findOne } from "@/utils/figma-node";
import type { NormalizedTextNode } from "@/normalizer";

const { createLocalSnippetElement } = createLocalSnippetHelper("text-field");

export const createTextInputFieldHandler = (ctx: ComponentHandlerDeps) => {
  const fieldHeaderHandler = createFieldHeaderHandler(ctx);
  const fieldFooterHandler = createFieldFooterHandler(ctx);

  return defineComponentHandler<TextInputFieldProperties>(
    metadata.templateTextField.key,
    (node, traverse) => {
      const props = node.componentProperties;

      const [textInputOutline] = findAllInstances<TextInputOutlineProperties>({
        node,
        key: metadata.componentTextInput.key,
      });
      const [textInputUnderline] = findAllInstances<TextInputUnderlineProperties>({
        node,
        key: metadata.componentUnderlineTextInput.key,
      });

      const [fieldHeader] = findAllInstances<FieldHeaderProperties>({
        node,
        key: fieldHeaderHandler.key,
      });
      const [fieldFooter] = findAllInstances<FieldFooterProperties>({
        node,
        key: fieldFooterHandler.key,
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
            key: metadata.privateComponentTextInputPrefix.key,
          });

          const [suffix] = findAllInstances<TextInputOutlineSuffixProperties>({
            node: textInputOutline,
            key: metadata.privateComponentTextInputSuffix.key,
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
            key: metadata.privateComponentUnderlineTextInputPrefix.key,
          });

          const [suffix] = findAllInstances<TextInputUnderlineSuffixProperties>({
            node: textInputUnderline,
            key: metadata.privateComponentUnderlineTextInputSuffix.key,
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
        key: metadata.componentTextarea.key,
      });
      const [fieldHeader] = findAllInstances<FieldHeaderProperties>({
        node,
        key: fieldHeaderHandler.key,
      });
      const [fieldFooter] = findAllInstances<FieldFooterProperties>({
        node,
        key: fieldFooterHandler.key,
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
