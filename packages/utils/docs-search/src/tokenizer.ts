import { type Tokenizer, components } from "zbsearch";

/**
 * The tokenizer the documentation index is built with, and therefore the one every reader has
 * to query it through — a document is only findable by the tokens it was indexed under, so a
 * different split here silently returns different results for the same query.
 *
 * Splitting follows Lucene's word delimiter filter: a chunk breaks apart at hyphens,
 * underscores and case boundaries, so `ActionButton`, `action-button` and `action button` all
 * reach the page written "Action Button". Each part is then stemmed, which is what lets
 * `action buttons` reach it too. Hangul has neither boundary nor stem here and comes through
 * whole, so `액션 버튼` is findable and `액션버튼` is not.
 */

/**
 * Stemming is off in zbsearch unless asked for. Splitting is what makes it worth asking: it
 * is the parts that carry the plural, so `buttons` only folds onto `button` once
 * `ActionButtons` has become two words.
 */
const defaultTokenizer = components.tokenizer.createTokenizer({
  language: "english",
  stemming: true,
});

const normalizeToken = defaultTokenizer.normalizeToken.bind(defaultTokenizer);

/** Everything that is not a letter, a digit or a mark this splitter carries into a token. */
const SEPARATORS = /[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|A-Za-zàèéìòóù0-9_'-]+/gim;

const DELIMITERS = /[-_']+/;

/** `actionButton` and `ActionButton` split; `HTTPServer` splits before the last capital. */
const CASE_BOUNDARY =
  /(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|(?<=[A-Za-z])(?=[0-9])|(?<=[0-9])(?=[A-Za-z])/;

/**
 * Signature fixed by zbsearch, which calls this with the property being indexed and leaves
 * that argument out when splitting a query. Widening only the indexing side is what Lucene's
 * `catenate_words` is for: a document written `ActionButton` is then also findable as
 * `actionbutton`, while the query stays split so it still matches "Action Button".
 */
export function tokenize(
  input: string,
  _language?: string,
  property?: string,
  withCache = true,
): string[] {
  if (typeof input !== "string") return [input];

  const tokens: string[] = [];

  for (const chunk of input.split(SEPARATORS)) {
    if (!chunk) continue;

    const parts = chunk
      .split(DELIMITERS)
      .flatMap((part) => part.split(CASE_BOUNDARY))
      .filter(Boolean);

    // A chunk that was nothing but delimiters leaves no part behind, and one that carries a
    // leading or trailing delimiter leaves the word without it.
    if (parts.length === 0) continue;

    tokens.push(...parts);
    if (property !== undefined && parts.length > 1) tokens.push(parts.join(""));
  }

  return Array.from(
    new Set(
      tokens
        .map((token) => normalizeToken(property ?? "", token.toLowerCase(), withCache))
        .filter(Boolean),
    ),
  );
}

export const koreanTokenizer: Tokenizer = { ...defaultTokenizer, tokenize };
