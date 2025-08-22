import { createConfig, createPipeline, sources } from "@seed-design/figma-extractor";

const config = createConfig({
  pipelines: {
    variables: createPipeline()
      .source(sources.variables)
      .filter(({ hiddenFromPublishing }) => !hiddenFromPublishing)
      .write(async (items, ctx) => {
        await ctx.write(`${ctx.pipelineName}.json`, ctx.utils.toJson(items));
      }),
  },
});

export default config;
