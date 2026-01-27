import type { SwitchProperties } from "@/codegen/component-properties.archive";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/archive/component-sets";
import { createLocalSnippetHelper } from "../../../element-factories";
import type { ComponentHandlerDeps } from "../../deps.interface";
import { match } from "ts-pattern";

const { createLocalSnippetElement } = createLocalSnippetHelper("switch");

export const createSwitchHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<SwitchProperties>(
    metadata._switch.key,
    ({ componentProperties: props }) => {
      const tone = match(props.Tone.value)
        .with("Neutral", () => "neutral")
        .with("🚫[Deprecated] Brand", () => "brand")
        .exhaustive();

      const commonProps = {
        tone,
        size: props.Size.value,
      };

      if (props["Layout(Figma Only)"].value === "🚫[Switch Mark 사용] Switch Only") {
        return createLocalSnippetElement("Switchmark", commonProps);
      }

      return createLocalSnippetElement("Switch", {
        ...commonProps,
        label: props["Label#36578:0"].value,
        ...(props.Selected.value === "True" && {
          defaultChecked: true,
        }),
        ...(props.State.value === "Disabled" && {
          disabled: true,
        }),
      });
    },
  );
