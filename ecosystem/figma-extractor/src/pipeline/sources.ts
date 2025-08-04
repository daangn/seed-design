import { getComponentMetadataItemsInFile } from "../api/nodes";
import { getComponentSetMetadataItemsInFile } from "../api/nodes";
import { getStylesMetadataInFile } from "../api/styles";
import { getVariableMetadataItemsInFile } from "../api/variables";
import type { PipelineContext } from "./builder";

export const sources = {
  components: (context: PipelineContext) =>
    getComponentMetadataItemsInFile({ api: context.api, fileKey: context.fileKey }),

  componentSets: (context: PipelineContext) =>
    getComponentSetMetadataItemsInFile({ api: context.api, fileKey: context.fileKey }),

  styles: (context: PipelineContext) =>
    getStylesMetadataInFile({ api: context.api, fileKey: context.fileKey }),

  variables: (context: PipelineContext) =>
    getVariableMetadataItemsInFile({ api: context.api, fileKey: context.fileKey }),
};
