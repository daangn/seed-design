const INSET_LONGHAND_PROPS = ["top", "right", "bottom", "left"] as const;

interface PostcssDeclaration {
  prop: string;
  value: string;
  clone(overrides: { prop: string; value: string }): PostcssDeclaration;
  replaceWith(...nodes: PostcssDeclaration[]): void;
}

function splitCssSpaceList(value: string): string[] {
  const values: string[] = [];
  let current = "";
  let depth = 0;
  let quote: "\"" | "'" | undefined;

  for (const char of value.trim()) {
    if (quote) {
      current += char;

      if (char === quote) {
        quote = undefined;
      }

      continue;
    }

    if (char === "\"" || char === "'") {
      quote = char;
      current += char;
      continue;
    }

    if (char === "(") {
      depth += 1;
      current += char;
      continue;
    }

    if (char === ")") {
      depth = Math.max(0, depth - 1);
      current += char;
      continue;
    }

    if (/\s/.test(char) && depth === 0) {
      if (current) {
        values.push(current);
        current = "";
      }

      continue;
    }

    current += char;
  }

  if (current) {
    values.push(current);
  }

  return values;
}

function expandInsetValue(value: string): [string, string, string, string] | undefined {
  const values = splitCssSpaceList(value);

  if (values.length === 1) {
    const [all] = values;
    return [all, all, all, all];
  }

  if (values.length === 2) {
    const [block, inline] = values;
    return [block, inline, block, inline];
  }

  if (values.length === 3) {
    const [top, inline, bottom] = values;
    return [top, inline, bottom, inline];
  }

  if (values.length === 4) {
    return values as [string, string, string, string];
  }

  return undefined;
}

export const expandInsetPlugin = {
  postcssPlugin: "seed-lynx-expand-inset",
  Declaration(decl: PostcssDeclaration) {
    if (decl.prop !== "inset") {
      return;
    }

    const values = expandInsetValue(decl.value);

    if (!values) {
      return;
    }

    decl.replaceWith(
      ...INSET_LONGHAND_PROPS.map((prop, index) =>
        decl.clone({
          prop,
          value: values[index],
        }),
      ),
    );
  },
};
