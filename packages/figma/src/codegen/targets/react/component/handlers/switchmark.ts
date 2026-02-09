import type { SwitchmarkProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { match } from "ts-pattern";

const { createLocalSnippetElement } = createLocalSnippetHelper("switch");

export const createSwitchmarkHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<SwitchmarkProperties>(
    metadata.componentSwitchmark.key,
    ({ componentProperties: props }) => {
      const tone = match(props.Tone.value)
        .with("Neutral", () => "neutral")
        .with("🚫[Deprecated] Brand", () => "brand")
        .exhaustive();

      const commonProps = {
        tone,
        size: props.Size.value,
      };

      return createLocalSnippetElement("Switchmark", commonProps);
    },
  );
