import type { Plugin } from "rollup";

interface QvismPluginOptions {
  recipePath: string;
}

export default function qvism(options: QvismPluginOptions): Plugin {
  if (!options.recipePath) {
    throw new Error("recipePath is required");
  }

  const escapedRecipePath = options.recipePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const recipeRegex = new RegExp(`(${escapedRecipePath}.*)"`, "g");

  return {
    name: "rollup-plugin-qvism",

    transform: {
      order: "pre",
      handler(code) {
        const matches = code.matchAll(recipeRegex);
        let codeToReturn = code;
        for (const match of matches) {
          const cssFileName = `${match[1]}.css`;

          if (
            codeToReturn.includes(`import "${cssFileName}"`) ||
            codeToReturn.includes(`import '${cssFileName}'`)
          ) {
            continue;
          }

          codeToReturn = `${codeToReturn}\nimport "${cssFileName}";`;
        }

        return {
          code: codeToReturn,
          map: null,
        };
      },
    },
  };
}
