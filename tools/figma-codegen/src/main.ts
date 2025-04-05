import { generateCode, createPluginNormalizer } from "@seed-design/figma";

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
            code: generateCode(normalizedNode) ?? "Failed to generate code.",
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
