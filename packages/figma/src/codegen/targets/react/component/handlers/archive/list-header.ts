import type { ListHeaderProperties } from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { camelCase } from "change-case";

const { createLocalSnippetElement } = createLocalSnippetHelper("list-header");

export const createListHeaderHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<ListHeaderProperties>(
    metadata.listHeader.key,
    ({ componentProperties: props }) => {
      const commonProps = {
        variant: camelCase(props["Variant"].value),
      };

      return createLocalSnippetElement("ListHeader", commonProps, props["Title#28588:0"].value);
    },
  );
