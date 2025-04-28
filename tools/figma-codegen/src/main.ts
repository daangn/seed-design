import { react, createPluginNormalizer } from "@seed-design/figma";

const pipeline = react.createPipeline();

export default function () {
  if (figma.editorType === "dev" && figma.mode === "codegen") {
    // Register a callback to the "generate" event
    figma.codegen.on("generate", async ({ node }) => {
      try {
        const normalizer = createPluginNormalizer();
        const normalizedNode = await normalizer(node);
        return [
          {
            title: "React",
            language: "TYPESCRIPT",
            code:
              pipeline.generateCode(normalizedNode, {
                shouldInferAutoLayout: true,
                shouldInferVariableName: true,
                shouldPrintSource: false,
              }) ?? "Failed to generate code.",
          },
        ];
      } catch (error) {
        console.error(error);
        return [
          {
            title: "React",
            language: "TYPESCRIPT",
            code: `Error: ${error}`,
          },
        ];
      }
    });
  }
}
