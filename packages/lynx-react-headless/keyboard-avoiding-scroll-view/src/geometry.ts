export const KEYBOARD_AVOIDANCE_EPSILON_PX = 1;

export interface VerticalRect {
  top: number;
  bottom: number;
}

export interface SafeArea {
  safeTop: number;
  safeBottom: number;
  spacerHeight: number;
}

export interface CalculateSafeAreaOptions {
  viewport: VerticalRect;
  keyboardOcclusionTop: number;
  toolbarHeight: number;
  keyboardGap: number;
}

export type AvoidanceTargetKind =
  | "field"
  | "fieldBody"
  | "control"
  | "native"
  | "anchor"
  | "fieldBottom";

export interface AvoidanceTarget {
  kind: AvoidanceTargetKind;
  rect: VerticalRect;
}

export interface AvoidanceTargetCandidates {
  field?: VerticalRect | null;
  fieldBody?: VerticalRect | null;
  control?: VerticalRect | null;
  native?: VerticalRect | null;
  anchor?: VerticalRect | null;
}

function normalizeNonNegativeFinite(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

/**
 * screen 좌표계에서 키보드와 툴바가 가리지 않는 세로 영역을 계산한다.
 */
export function calculateSafeArea({
  viewport,
  keyboardOcclusionTop,
  toolbarHeight,
  keyboardGap,
}: CalculateSafeAreaOptions): SafeArea {
  const normalizedToolbarHeight = normalizeNonNegativeFinite(toolbarHeight);
  const normalizedKeyboardGap = normalizeNonNegativeFinite(keyboardGap);
  const normalizedViewportBottom = Math.max(viewport.top, viewport.bottom);
  const safeBottom = Math.min(
    normalizedViewportBottom,
    Math.max(viewport.top, keyboardOcclusionTop - normalizedToolbarHeight - normalizedKeyboardGap),
  );

  return {
    safeTop: viewport.top,
    safeBottom,
    spacerHeight: normalizedViewportBottom - safeBottom,
  };
}

/**
 * Field의 header를 제외하고 control부터 footer까지 포함하는 영역을 만든다.
 */
export function createFieldBodyRect(
  field: VerticalRect | null,
  control: VerticalRect | null,
  epsilon = KEYBOARD_AVOIDANCE_EPSILON_PX,
): VerticalRect | null {
  if (field === null || control === null) return null;

  const normalizedEpsilon = Math.max(0, epsilon);
  const fieldHeight = field.bottom - field.top;
  const controlHeight = control.bottom - control.top;
  if (
    fieldHeight < 0 ||
    controlHeight < 0 ||
    control.top < field.top - normalizedEpsilon ||
    control.bottom > field.bottom + normalizedEpsilon
  ) {
    return null;
  }

  return { top: control.top, bottom: Math.max(field.bottom, control.bottom) };
}

/**
 * 화면에 온전히 들어오는 가장 큰 의미 단위를 선택한다.
 * 우선순위는 Field, Field body, Field bottom, control, native control, 정밀 anchor 순이다.
 * Field body가 너무 크면 autoresize Field의 footer를 추적할 수 있도록
 * control보다 먼저 Field body의 하단점을 사용한다.
 */
export function selectLargestFittingTarget(
  candidates: AvoidanceTargetCandidates,
  safeArea: Pick<SafeArea, "safeTop" | "safeBottom">,
  epsilon = KEYBOARD_AVOIDANCE_EPSILON_PX,
): AvoidanceTarget | null {
  const availableHeight = Math.max(0, safeArea.safeBottom - safeArea.safeTop);
  const normalizedEpsilon = Math.max(0, epsilon);
  const fieldCandidates: readonly (readonly [
    AvoidanceTargetKind,
    VerticalRect | null | undefined,
  ])[] = [
    ["field", candidates.field],
    ["fieldBody", candidates.fieldBody],
  ];
  const fallbackCandidates: readonly (readonly [
    AvoidanceTargetKind,
    VerticalRect | null | undefined,
  ])[] = [
    ["control", candidates.control],
    ["native", candidates.native],
    ["anchor", candidates.anchor],
  ];

  for (const [kind, rect] of fieldCandidates) {
    if (!rect) {
      continue;
    }

    const targetHeight = rect.bottom - rect.top;
    if (targetHeight >= 0 && targetHeight <= availableHeight + normalizedEpsilon) {
      return { kind, rect };
    }
  }

  const fieldBody = candidates.fieldBody;
  const fieldBodyHeight = fieldBody ? fieldBody.bottom - fieldBody.top : -1;
  if (
    fieldBody &&
    Number.isFinite(fieldBody.top) &&
    Number.isFinite(fieldBody.bottom) &&
    fieldBodyHeight > availableHeight + normalizedEpsilon
  ) {
    return {
      kind: "fieldBottom",
      rect: { top: fieldBody.bottom, bottom: fieldBody.bottom },
    };
  }

  for (const [kind, rect] of fallbackCandidates) {
    if (!rect) {
      continue;
    }

    const targetHeight = rect.bottom - rect.top;
    if (targetHeight >= 0 && targetHeight <= availableHeight + normalizedEpsilon) {
      return { kind, rect };
    }
  }

  return null;
}

/**
 * 양수는 아래로, 음수는 위로 이동해야 하는 scroll offset 변화량이다.
 */
export function calculateSignedScrollDelta(
  target: VerticalRect,
  safeArea: Pick<SafeArea, "safeTop" | "safeBottom">,
  epsilon = KEYBOARD_AVOIDANCE_EPSILON_PX,
): number {
  const normalizedEpsilon = Math.max(0, epsilon);

  if (target.top < safeArea.safeTop - normalizedEpsilon) {
    return target.top - safeArea.safeTop;
  }

  if (target.bottom > safeArea.safeBottom + normalizedEpsilon) {
    return target.bottom - safeArea.safeBottom;
  }

  return 0;
}

export function clampScrollOffset(offset: number, maxOffset: number): number {
  return Math.min(Math.max(0, offset), Math.max(0, maxOffset));
}

export function hasMeaningfulGeometryChange(
  previous: number,
  next: number,
  epsilon = KEYBOARD_AVOIDANCE_EPSILON_PX,
): boolean {
  return Math.abs(next - previous) > Math.max(0, epsilon);
}
