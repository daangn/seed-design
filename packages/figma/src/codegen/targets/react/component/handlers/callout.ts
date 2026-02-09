import type { CalloutProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import type { NormalizedTextNode } from "@/normalizer";
import { camelCase } from "change-case";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { match } from "ts-pattern";

const { createLocalSnippetElement } = createLocalSnippetHelper("callout");

export const createCalloutHandler = (ctx: ComponentHandlerDeps) =>
  defineComponentHandler<CalloutProperties>(
    metadata.componentCallout.key,
    ({ componentProperties: props, children }) => {
      const tag = match(props.Interaction.value)
        .with("Display", () => "Callout")
        .with("Actionable", () => "ActionableCallout")
        .with("Dismissible", () => "DismissibleCallout")
        .exhaustive();

      const textNode = children.find((child) => child.type === "TEXT") as NormalizedTextNode | null;

      if (!textNode) {
        return createLocalSnippetElement(tag, undefined, undefined, {
          comment: "내용을 제공해주세요.",
        });
      }

      const slices = textNode.segments;

      let title: string | undefined;
      let description: string | undefined;
      let linkLabel: string | undefined;

      switch (slices.length) {
        case 1: {
          description = slices[0]?.characters.trim();

          break;
        }
        case 2: {
          const firstSlice = slices[0];
          const secondSlice = slices[1];

          if (firstSlice?.style.fontWeight === 700) {
            title = firstSlice?.characters.trim();
            description = secondSlice?.characters.trim();
            break;
          }

          description = firstSlice?.characters.trim();

          if (tag !== "ActionableCallout") {
            linkLabel = secondSlice?.characters.trim();
          }

          break;
        }
        case 3: {
          title = slices[0]?.characters.trim();
          description = slices[1]?.characters.trim();

          if (tag !== "ActionableCallout") {
            linkLabel = slices[2]?.characters.trim();
          }

          break;
        }
      }

      const commonProps = {
        tone: camelCase(props.Tone.value),
        title,
        description,
        ...(linkLabel && {
          linkProps: {
            children: linkLabel,
          },
        }),
        ...(props["Show Prefix Icon#35087:1"].value && {
          prefixIcon: ctx.iconHandler.transform(props["Prefix Icon#35087:0"]),
        }),
      };

      return createLocalSnippetElement(tag, commonProps);
    },
  );
