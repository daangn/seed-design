import { defineComponentHandler } from "@/codegen/core";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import type { IdentityPlaceholderProperties } from "@/codegen/component-properties";
import * as metadata from "@/entities/data/__generated__/component-sets";

const { createLocalSnippetElement } = createLocalSnippetHelper("identity-placeholder");

export const createIdentityPlaceholderHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<IdentityPlaceholderProperties>(
    metadata.privateComponentIdentityPlaceholder.key,
    ({ componentProperties: props }) => {
      const commonProps = {
        identity: camelCase(props.Identity.value),
      };

      return createLocalSnippetElement("IdentityPlaceholder", commonProps);
    },
  );
