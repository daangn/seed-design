import { lineBreak, type Message, text } from "@optique/core/message";

/**
 * The `예시:` block a command shows under its options.
 *
 * A single newline inside a `message` template renders as a space, so the examples have to be
 * joined with `lineBreak()` terms to reach the terminal one per line.
 */
export function exampleFooter(examples: string[]): Message {
  return [text("예시:"), ...examples.flatMap((example) => [lineBreak(), text(`  ${example}`)])];
}
