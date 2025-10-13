import { react, createPluginNormalizer } from "@seed-design/figma";
import { posthog } from "./posthog";

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

        const code: CodegenResult[] = [
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

        posthog.capture({
          event: "codegen.generate",
          properties: {
            code,

            nodeType: node.type,
            nodeName: node.name,
            nodeId: node.id,

            fileName: figma.root.name,
            fileKey: figma.fileKey,

            username: figma.currentUser?.name,
            userId: figma.currentUser?.id,
          },
        });

        return code;
      } catch (error) {
        console.error(error);

        posthog.capture({
          event: "codegen.error",
          properties: {
            error: `${error}`,

            nodeType: node.type,
            nodeName: node.name,
            nodeId: node.id,

            fileName: figma.root.name,
            fileKey: figma.fileKey,

            username: figma.currentUser?.name,
            userId: figma.currentUser?.id,
          },
        });

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
