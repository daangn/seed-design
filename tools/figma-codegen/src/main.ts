import { generateCode } from "./codegen/generate-code";

export default function () {
  if (figma.editorType === "dev" && figma.mode === "codegen") {
    // Register a callback to the "generate" event
    figma.codegen.on("generate", async ({ node }) => {
      return [
        {
          title: "React",
          language: "TYPESCRIPT",
          code: generateCode(node),
        },
      ];
    });
  }
}
