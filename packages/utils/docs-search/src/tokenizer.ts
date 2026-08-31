import { type Tokenizer, components } from "zbsearch";

/**
 * The tokenizer the documentation index is built with, and therefore the one every reader has
 * to query it through — a document is only findable by the tokens it was indexed under, so a
 * different split here silently returns different results for the same query.
 *
 * It splits on anything that is not a Hangul syllable, a Hangul jamo, a Latin letter or a
 * digit, which leaves whole words rather than morphemes. `액션 버튼` reaches a document
 * indexed under `버튼`; `액션버튼` reaches nothing, because that string was never a token.
 */

const defaultTokenizer = components.tokenizer.createTokenizer({ language: "english" });

const normalizeToken = defaultTokenizer.normalizeToken.bind(defaultTokenizer);

/** Empty tokens at either end come from leading or trailing separators, and index as nothing. */
function trim(text: string[]): string[] {
  while (text[text.length - 1] === "") {
    text.pop();
  }
  while (text[0] === "") {
    text.shift();
  }
  return text;
}

/** Signature fixed by zbsearch: it calls this with the property being indexed or searched. */
export function tokenize(
  input: string,
  _language?: string,
  property = "",
  withCache = true,
): string[] {
  if (typeof input !== "string") return [input];

  const tokens = input
    .toLowerCase()
    .split(/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|A-Za-zàèéìòóù0-9_'-]+/gim)
    .map((token) => normalizeToken(property, token, withCache))
    .filter(Boolean);

  return Array.from(new Set(trim(tokens)));
}

export const koreanTokenizer: Tokenizer = { ...defaultTokenizer, tokenize };
