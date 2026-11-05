import { components, type Tokenizer } from "zbsearch";

// it should be cached forever
export const revalidate = false;

const defaultTokenizer = components.tokenizer.createTokenizer({
  language: "english",
});

const normalizeToken = defaultTokenizer.normalizeToken.bind(defaultTokenizer);

function trim(text: string[]): string[] {
  while (text[text.length - 1] === "") {
    text.pop();
  }
  while (text[0] === "") {
    text.shift();
  }
  return text;
}

export function tokenize(
  input: string,
  _language?: string,
  property = "",
  withCache = true,
): string[] {
  if (typeof input !== "string") {
    return [input];
  }

  const splitRule = /[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|A-Za-zàèéìòóù0-9_'-]+/gim;
  const tokens = input
    .toLowerCase()
    .split(splitRule)
    .map((token) => normalizeToken(property, token, withCache))
    .filter(Boolean);

  const trimTokens = trim(tokens);

  return Array.from(new Set(trimTokens));
}

export const koreanTokenizer: Tokenizer = {
  ...defaultTokenizer,
  tokenize,
};
