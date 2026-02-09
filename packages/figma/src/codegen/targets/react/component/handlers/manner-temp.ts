import type { MannerTempProperties } from "@/codegen/component-properties";
import { defineComponentHandler } from "@/codegen/core";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";

const { createLocalSnippetElement } = createLocalSnippetHelper("manner-temp");

export const createMannerTempHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<MannerTempProperties>(metadata.componentMannerTemp.key, ({ children }) => {
    const textNode = children.find((child) => child.type === "TEXT");

    const commonProps = {
      temperature: Number(textNode?.characters.replace(/[^\d.-]/g, "") ?? "-1"),
    };

    return createLocalSnippetElement("MannerTemp", commonProps);
  });
