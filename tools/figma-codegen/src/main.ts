import { react, createPluginNormalizer } from "@seed-design/figma";

const pipeline = react.createPipeline({
  shouldInferAutoLayout: true,
  shouldInferVariableName: true,
});

export default function () {
  if (figma.editorType === "dev" && figma.mode === "codegen") {
    // Register a callback to the "generate" event
    figma.codegen.on("generate", async ({ node }) => {
      try {
        const normalizer = createPluginNormalizer();
        const normalizedNode = await normalizer(node);
        const generated = pipeline.generateCode(normalizedNode, {
          shouldPrintSource: false,
        });

        if (!generated) {
          return [
            {
              title: "React",
              language: "TYPESCRIPT",
              code: "Failed to generate code.",
            },
          ];
        }

        return [
          {
            title: "React",
            language: "TYPESCRIPT",
            code: generated.jsx,
          },
          {
            title: "React",
            language: "TYPESCRIPT",
            code: generated.imports,
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
