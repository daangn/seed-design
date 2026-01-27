import { defineComponentHandler, type InferComponentDefinition } from "@/codegen/core";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";

// hardcoded since this lives in a different figma file
const IDENTITY_PLACEHOLDER_KEY = "b3563b6f16ba4cfe4240c9b33eef7edad4c304eb";

export type IdentityPlaceholderProperties = InferComponentDefinition<{
  Identity: {
    type: "VARIANT";
    defaultValue: "Person";
    variantOptions: ["Person", "Business"];
  };
}>;

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
