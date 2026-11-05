export const getRootId = (id: string) => `segmented-text-input:${id}:root`;

export function getSegmentElements(scope: ParentNode | null, rootId: string) {
  if (!scope) return [];

  return Array.from(scope.querySelectorAll<HTMLInputElement>(`input[data-ownedby="${rootId}"]`));
}

export function isMasked(el: HTMLInputElement) {
  return el.type === "password";
}

export function focusSegment(el: HTMLInputElement, caret: number | "end") {
  el.focus();
  const position = caret === "end" ? el.value.length : caret;
  el.setSelectionRange(position, position);
}
