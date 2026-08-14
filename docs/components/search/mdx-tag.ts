/**
 * A custom MDX component as it survives into the search index. `remarkStructure` serializes
 * page content to Markdown and leaves whitelisted components as raw JSX (see
 * `structureStringify` in app/source.tsx), so naming the source component in a result row
 * means parsing that JSX back out.
 */
export interface MdxTag {
  name: string;
  attributes: { name: string; value: string }[];
  children: string;
}

const NAMED_CHARACTER_REFERENCES = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  quot: '"',
} as const satisfies Record<string, string>;

/**
 * Undo the character references Markdown serialization leaves behind: `mdast-util-to-markdown`
 * writes a `"` inside an attribute value as `&#x22;`, and a `*` that would otherwise read as
 * emphasis as `&#x2A;`.
 */
export function decodeCharacterReferences(value: string): string {
  return value.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (match, decimal, hex, name) => {
    if (name) {
      const key = name.toLowerCase() as keyof typeof NAMED_CHARACTER_REFERENCES;
      return NAMED_CHARACTER_REFERENCES[key] ?? match;
    }

    const code = decimal ? Number(decimal) : Number.parseInt(hex, 16);
    return code <= 0x10ffff ? String.fromCodePoint(code) : match;
  });
}

/** Read the opening tag's attributes and return the offset just past it, or `null` if malformed. */
function readOpeningTag(source: string, start: number) {
  const attributes: MdxTag["attributes"] = [];
  let cursor = start;

  while (cursor < source.length) {
    while (/\s/.test(source[cursor])) cursor++;

    if (source.startsWith("/>", cursor)) return { attributes, end: cursor + 2, selfClosing: true };
    if (source[cursor] === ">") return { attributes, end: cursor + 1, selfClosing: false };

    const name = /^[A-Za-z_][A-Za-z0-9_.:-]*/.exec(source.slice(cursor))?.[0];
    if (!name) return null;

    cursor += name.length;

    // Boolean attribute — a bare name with no value.
    if (source[cursor] !== "=") {
      attributes.push({ name, value: "" });
      continue;
    }

    const quote = source[cursor + 1];
    if (quote !== '"' && quote !== "'") return null;

    const closing = source.indexOf(quote, cursor + 2);
    if (closing === -1) return null;

    attributes.push({ name, value: decodeCharacterReferences(source.slice(cursor + 2, closing)) });
    cursor = closing + 1;
  }

  return null;
}

/**
 * Only parse content that is a single MDX component tag end to end. Anything outside the tag
 * returns `null`, which keeps JSX written inside a code block from being read as a component.
 */
export function parseMdxTag(content: string): MdxTag | null {
  const source = content.trim();
  // MDX components are capitalized. `img` is the one lowercase tag the index carries, emitted
  // for Markdown images by the same `structureStringify`; naming it keeps the highlighter's
  // own `<mark>` wrappers from reading as a component.
  const name = /^<(img|[A-Z][A-Za-z0-9]*)(?=[\s/>])/.exec(source)?.[1];
  if (!name) return null;

  const opening = readOpeningTag(source, name.length + 1);
  if (!opening) return null;

  if (opening.selfClosing) {
    if (opening.end !== source.length) return null;

    return { name, attributes: opening.attributes, children: "" };
  }

  const closingTag = `</${name}>`;
  if (!source.endsWith(closingTag)) return null;

  return {
    name,
    attributes: opening.attributes,
    children: source.slice(opening.end, source.length - closingTag.length).trim(),
  };
}
