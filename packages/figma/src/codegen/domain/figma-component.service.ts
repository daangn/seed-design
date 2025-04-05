import type { ComponentTransformer } from "@/codegen/core";

export interface FigmaComponentService {
  getTransformer: (key: string) => ComponentTransformer | undefined;
}

export function createFigmaComponentService({
  transformers,
}: {
  transformers: ComponentTransformer[];
}): FigmaComponentService {
  const transformerServiceMap = new Map(
    transformers.map((transformer) => [transformer.key, transformer]),
  );

  return {
    getTransformer: (key: string) => {
      return transformerServiceMap.get(key);
    },
  };
}
