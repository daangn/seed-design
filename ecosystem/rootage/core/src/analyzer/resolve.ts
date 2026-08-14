import type { ComponentSpecDeclaration, PropertyDeclaration, RuleDeclaration } from "../parser/ast";

/**
 * The rules of composition, in one place.
 *
 * A component spec answers one question: given a value for every variant axis and
 * a set of active states, which value does each slot property take? Everything
 * here exists so that question has exactly one answer, derivable from the
 * document alone — no document order, no host map ordering, no reader convention.
 *
 * Three ideas carry it:
 *
 * 1. **Suppression** removes a state before anything is matched, so a state that
 *    loses cannot leave a few of its declarations behind. This is what lets a
 *    spec say "disabled beats pressed" as a fact about states.
 * 2. **State precedence** is the order of `schema.states`. Rank vectors of
 *    distinct state sets are always comparable, so the state half of the ordering
 *    is total.
 * 3. **Variant specificity** is subset containment, which is only partial. Rules
 *    left incomparable by it are not resolved by a tiebreak — `validate` rejects
 *    the document instead, so an ambiguous spec cannot exist to be resolved.
 */

export interface ResolvedProperty {
  declaration: PropertyDeclaration;
  /** The rule the value came from, so a resolution can be explained, not just read. */
  rule: RuleDeclaration;
}

export type ResolvedSlots = Record<string, Record<string, ResolvedProperty>>;

export interface ResolveInput {
  variants: Record<string, string>;
  states: string[];
}

export function getStateRanks(spec: ComponentSpecDeclaration): Map<string, number> {
  return new Map(spec.schema.states.map((state, index) => [state.name, index]));
}

/**
 * Drop every state cancelled by a state that itself survives.
 *
 * A single pass from the strongest state down suffices because `validate` forbids
 * suppressing a state of equal or higher rank: once a state is reached, nothing
 * left to process can cancel it.
 */
export function getEffectiveStates(spec: ComponentSpecDeclaration, active: string[]): string[] {
  const activeSet = new Set(active);
  const suppressed = new Set<string>();

  for (const state of [...spec.schema.states].reverse()) {
    if (!activeSet.has(state.name) || suppressed.has(state.name)) continue;

    for (const target of state.suppresses) {
      suppressed.add(target);
    }
  }

  return spec.schema.states
    .map((state) => state.name)
    .filter((name) => activeSet.has(name) && !suppressed.has(name));
}

function matches(rule: RuleDeclaration, variants: Record<string, string>, states: Set<string>) {
  return (
    rule.variants.every((expr) => variants[expr.name] === expr.value) &&
    rule.states.every((expr) => states.has(expr.value))
  );
}

/**
 * Rank vector: every state rank the rule constrains, strongest first.
 *
 * Comparing these lexicographically orders `{disabled, selected}` above
 * `{disabled}` above `{selected}` without anyone having to say so, and since two
 * distinct state sets always differ at some position, no two are ever tied.
 */
function getStateRankVector(rule: RuleDeclaration, ranks: Map<string, number>): number[] {
  return rule.states
    .map((expr) => {
      const rank = ranks.get(expr.value);
      if (rank === undefined)
        throw new Error(`State "${expr.value}" is not declared in the schema`);

      return rank;
    })
    .sort((a, b) => b - a);
}

function compareStateRankVectors(a: number[], b: number[]): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) return a[i]! - b[i]!;
  }

  return a.length - b.length;
}

export function variantSelectorsOverlap(a: RuleDeclaration, b: RuleDeclaration): boolean {
  const bValues = new Map(b.variants.map((expr) => [expr.name, expr.value]));

  return a.variants.every(
    (expr) => !bValues.has(expr.name) || bValues.get(expr.name) === expr.value,
  );
}

function isVariantSubset(a: RuleDeclaration, b: RuleDeclaration): boolean {
  const bValues = new Map(b.variants.map((expr) => [expr.name, expr.value]));

  return a.variants.every((expr) => bValues.get(expr.name) === expr.value);
}

/**
 * Positive when `a` wins, negative when `b` does, `undefined` when the document
 * does not say — the case `validate` refuses to let through.
 */
export function compareRules(
  a: RuleDeclaration,
  b: RuleDeclaration,
  ranks: Map<string, number>,
): number | undefined {
  const byState = compareStateRankVectors(
    getStateRankVector(a, ranks),
    getStateRankVector(b, ranks),
  );
  if (byState !== 0) return byState;

  const aInB = isVariantSubset(a, b);
  const bInA = isVariantSubset(b, a);

  if (aInB && bInA) return 0;
  if (aInB) return -1;
  if (bInA) return 1;

  return undefined;
}

export function resolveComponentSpec(
  spec: ComponentSpecDeclaration,
  input: ResolveInput,
): ResolvedSlots {
  const ranks = getStateRanks(spec);
  const effective = new Set(getEffectiveStates(spec, input.states));
  const resolved: ResolvedSlots = {};

  for (const rule of spec.rules) {
    if (!matches(rule, input.variants, effective)) continue;

    for (const slot of rule.body) {
      const slotProperties = (resolved[slot.slot] ??= {});

      for (const declaration of slot.body) {
        const incumbent = slotProperties[declaration.property];

        if (incumbent) {
          const order = compareRules(rule, incumbent.rule, ranks);

          if (order === undefined) {
            throw new Error(
              `Cannot resolve "${slot.slot}.${declaration.property}" of component spec "${spec.id}": ` +
                `${stringifyRuleSelector(rule)} and ${stringifyRuleSelector(incumbent.rule)} both declare it and neither takes precedence`,
            );
          }

          if (order < 0) continue;
        }

        slotProperties[declaration.property] = { declaration, rule };
      }
    }
  }

  return resolved;
}

export function stringifyRuleSelector(rule: RuleDeclaration): string {
  const variants = rule.variants.map((expr) => `${expr.name}=${expr.value}`).join(", ");
  const states = rule.states.map((expr) => expr.value).join(", ");

  return `{${variants || "*"} | ${states || "any state"}}`;
}
