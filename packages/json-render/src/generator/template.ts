export function formatImports(imports: Array<{ module: string; named: string[] }>): string {
  return imports
    .map(({ module, named }) => {
      const names = named.join(", ");
      return `import { ${names} } from "${module}";`;
    })
    .join("\n");
}

export function indent(code: string, level: number): string {
  const spaces = "  ".repeat(level);
  return code
    .split("\n")
    .map((line) => (line.trim() ? spaces + line : line))
    .join("\n");
}

export function wrapSnippetFile(imports: string, componentName: string, jsxBody: string): string {
  return `"use client";

${imports}

export function ${componentName}() {
  return (
${indent(jsxBody, 2)}
  );
}
`;
}
