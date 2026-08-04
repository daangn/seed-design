// Class names base.css declares for behaviour an element opts into, rather than
// for a component's own styles.
//
// Duplicated in packages/qvism-preset/src/utils/press-scale.ts, which emits the
// matching rule and cannot import from here (css is generated from it).
// Edit both together — nothing checks, and drift silently leaves the derivation
// unapplied.
export const PRESS_SCALE_CLASS_NAME = "seed-press-scale";
