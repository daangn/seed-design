import { defineComponentHandler } from "@/codegen/core";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import type { ContentPlaceholderProperties } from "@/codegen/component-properties";
import * as metadata from "@/entities/data/__generated__/component-sets";

const { createLocalSnippetElement } = createLocalSnippetHelper("content-placeholder");

export const createContentPlaceholderHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ContentPlaceholderProperties>(
    metadata.privateComponentContentPlaceholder.key,
    ({ componentProperties: props }) => {
      const commonProps = {
        type: camelCase(props.Type.value),
      };

      return createLocalSnippetElement("ContentPlaceholder", commonProps);
    },
  );
