import type { LoaderDefinitionFunction } from "webpack";
import path from "node:path";

// Regex to match the special comment at the end of a recipe.
// For example: "// @recipe(seed): action-button"
const recipeRegex = /\/\/\s*@recipe\(\s*([^)]*)\s*\):\s*(\S+)/;

const seedRecipeLoader: LoaderDefinitionFunction = function (source) {
  if (!recipeRegex.test(source as string)) {
    return source;
  }

  const resourcePath = this.resourcePath;
  const filename = path.basename(resourcePath);
  const cssFileName = filename.replace(/\.(m?js)$/, ".css");

  // If the import is already present, skip injecting
  if ((source as string).includes(`import "./${cssFileName}"`)) {
    return source;
  }

  // Otherwise, inject the CSS import at the end of the file
  return `${source}\nimport "./${cssFileName}";\n`;
};

export default seedRecipeLoader;
