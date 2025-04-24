const FROM_PACKAGE = new Set([
  "ActionChip",
  "Badge",
  "Box",
  "Celcius",
  "Count",
  "Divider",
  "ExtendedFab",
  "Fab",
  "Flex",
  "Icon",
  "PrefixIcon",
  "SuffixIcon",
  "IdentityPlaceholder",
  "LinkContent",
  "NotificationBadge",
  "Skeleton",
  "HStack",
  "VStack",
  "Text",
  "VisuallyHidden",
]);

export function createImportSyntaxService() {
  function makeImportSyntax(
    importName: string,
    importPath: string,
    options: { isDefaultImport?: boolean } = {},
  ) {
    const { isDefaultImport = false } = options;
    return isDefaultImport
      ? `import ${importName} from "${importPath}";`
      : `import { ${importName} } from "${importPath}";`;
  }

  function getImportPath(componentName: string) {
    if (FROM_PACKAGE.has(componentName)) {
      return "@seed-design/react";
    }
    if (componentName.startsWith("Icon")) {
      return "@karrotmarket/react-monochrome-icon";
    }
    return "{SNIPPET_PATH}";
  }
}
