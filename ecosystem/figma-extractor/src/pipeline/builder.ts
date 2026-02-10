import type { Api as figma } from "figma-api";
import type { WriterContext } from "../cli/write";
import type { GetFileNodesResponse } from "@figma/rest-api-spec";

export interface PipelineContext extends WriterContext {
  api: figma;
  fileKey: string;
  /**
   * Fetch multiple nodes by ID with automatic chunking (500 per request)
   * Useful for custom sources that need to fetch node details
   */
  fetchNodes: (params: {
    fileKey: string;
    nodeIds: string[];
  }) => Promise<NonNullable<GetFileNodesResponse["nodes"][string]>[]>;
}

export interface Pipeline {
  execute: (context: PipelineContext) => Promise<void>;
}

interface PipelineBuilder<T> {
  filter(predicate: (item: T) => boolean): PipelineBuilder<T>;
  sort(compareFn: (a: T, b: T) => number): PipelineBuilder<T>;
  transform<U>(fn: (item: T) => U): PipelineBuilder<U>;
  write(writer: (items: T[], context: WriterContext) => Promise<void>): Pipeline;
}

export function createPipeline() {
  return {
    source: <T>(fetcher: (context: PipelineContext) => Promise<T[]>) =>
      createPipelineBuilder(fetcher),
  };
}

function createPipelineBuilder<T>(
  source: (context: PipelineContext) => Promise<T[]>,
): PipelineBuilder<T> {
  return {
    filter: (predicate: (item: T) => boolean) => {
      const newSource = async (context: PipelineContext) => {
        const items = await source(context);
        return items.filter(predicate);
      };

      return createPipelineBuilder(newSource);
    },

    sort: (compareFn: (a: T, b: T) => number) => {
      const newSource = async (context: PipelineContext) => {
        const items = await source(context);
        return [...items].sort(compareFn);
      };

      return createPipelineBuilder(newSource);
    },

    transform: <U>(fn: (item: T) => U) => {
      const newSource = async (context: PipelineContext) => {
        const items = await source(context);
        return items.map(fn);
      };

      return createPipelineBuilder(newSource);
    },

    write: (writer: (items: T[], writerContext: WriterContext) => Promise<void>) => ({
      execute: async (context: PipelineContext) => {
        const items = await source(context);

        await writer(items, context);
      },
    }),
  };
}
