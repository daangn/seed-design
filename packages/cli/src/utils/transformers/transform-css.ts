import type { Transformer } from "@/src/utils/transformers";

export const transformCSS: Transformer = async ({ sourceFile, config }) => {
  if (config.css) {
    return sourceFile;
  }

  const imports = sourceFile.getImportDeclarations();
  const cssImports = imports.filter((i) => i.getModuleSpecifierValue().endsWith(".css"));

  for (const cssImport of cssImports) {
    cssImport.remove();
  }

  return sourceFile;
};
