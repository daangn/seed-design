import type { IdentityPlaceholderProperties } from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";

const IDENTITY_PLACEHOLDER_KEY = "b3563b6f16ba4cfe4240c9b33eef7edad4c304eb";

const { createLocalSnippetElement } = createLocalSnippetHelper("identity-placeholder");

export const createIdentityPlaceholderHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<IdentityPlaceholderProperties>(
    IDENTITY_PLACEHOLDER_KEY,
    ({ componentProperties: props }) => {
      const commonProps = {
        identity: camelCase(props.Identity.value),
      };

      return createLocalSnippetElement("IdentityPlaceholder", commonProps);
    },
  );
