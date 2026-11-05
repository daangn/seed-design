"use client";

import { vars } from "@seed-design/css/vars";
import { useEffect, useState } from "react";
import { NO_RESULTS_FACES, NO_RESULTS_HEAD, NO_RESULTS_MIDDLE } from "./no-results-art";

/**
 * Zero-result state. Picks one face on mount and keeps it while results stay empty
 * (fumadocs keeps this instance mounted), so it does not reshuffle on every keystroke.
 * Lines stay left-aligned as a group (w-fit + mx-auto) so the leading spaces align the
 * ears/oOo over the face; the group as a whole is centered.
 *
 * Type hierarchy: the head is t13-medium (largest); the middle line, the mouth `ᴥ`, and the
 * `•`/`-` eyes are t12-regular; the face's left/right frame is t11-regular. The `@` eye renders
 * much denser than `•`/`-` at the same size, so only `@` eyes drop to t10 (26px). We apply the
 * size/weight of those SEED text styles inline (not the `t{n}-*` utility classes) so we can tune
 * each ASCII row's line-height independently: top t8, middle t5, bottom t3; only the `@` face uses
 * bottom t6 to give the denser eyes more vertical room. The message below is the one place a
 * bundled utility fits, so it uses `t5-regular`.
 */
const HEAD_STYLE = {
  fontSize: vars.$fontSize.t13,
  lineHeight: vars.$lineHeight.t8,
  fontWeight: vars.$fontWeight.medium,
} as const;

const MIDDLE_STYLE = {
  fontSize: vars.$fontSize.t12,
  lineHeight: vars.$lineHeight.t5,
  fontWeight: vars.$fontWeight.regular,
} as const;

const FRAME_STYLE = {
  fontSize: vars.$fontSize.t11,
  lineHeight: vars.$lineHeight.t3,
  fontWeight: vars.$fontWeight.regular,
} as const;

const DENSE_FRAME_STYLE = {
  fontSize: vars.$fontSize.t11,
  lineHeight: vars.$lineHeight.t6,
  fontWeight: vars.$fontWeight.regular,
} as const;

const FACE_STYLE = {
  fontSize: vars.$fontSize.t12,
  lineHeight: vars.$lineHeight.t3,
  fontWeight: vars.$fontWeight.regular,
} as const;

const DENSE_FACE_STYLE = {
  fontSize: vars.$fontSize.t12,
  lineHeight: vars.$lineHeight.t6,
  fontWeight: vars.$fontWeight.regular,
} as const;

const DENSE_EYE_STYLE = {
  fontSize: vars.$fontSize.t10,
  lineHeight: vars.$lineHeight.t6,
  fontWeight: vars.$fontWeight.regular,
} as const;

const FACE_ROW_STYLE = {
  lineHeight: vars.$lineHeight.t3,
} as const;

const DENSE_FACE_ROW_STYLE = {
  lineHeight: vars.$lineHeight.t6,
} as const;

// Remember the last face shown so a fresh empty state never repeats the previous one.
// Module-level so it survives this component's unmount/remount within a session. The pick
// only READS this during render (staying pure); the shown index is committed in an effect,
// so it can't drift from what's displayed under React StrictMode's double-invoke.
let lastFaceIndex = -1;

function pickFaceIndex() {
  const count = NO_RESULTS_FACES.length;
  if (lastFaceIndex < 0 || count <= 1) return Math.floor(Math.random() * count);
  // Pick uniformly among the faces other than the one shown last time.
  const index = Math.floor(Math.random() * (count - 1));
  return index >= lastFaceIndex ? index + 1 : index;
}

export function NoResults() {
  const [faceIndex] = useState(pickFaceIndex);
  const face = NO_RESULTS_FACES[faceIndex];
  // Record the shown face so the next empty state excludes it.
  useEffect(() => {
    lastFaceIndex = faceIndex;
  }, [faceIndex]);

  // Face expr is always [eye][ᴥ][eye]. The @ eye glyph is far denser than • or - at the same
  // size, so shrink only the @ eyes to t10 (26px) and give that row a taller t6 line-height.
  const isDenseFace = face.expr[0] === "@";
  const rowStyle = isDenseFace ? DENSE_FACE_ROW_STYLE : FACE_ROW_STYLE;
  const frameStyle = isDenseFace ? DENSE_FRAME_STYLE : FRAME_STYLE;
  const faceStyle = isDenseFace ? DENSE_FACE_STYLE : FACE_STYLE;
  const eyeStyle = isDenseFace ? DENSE_EYE_STYLE : FACE_STYLE;

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-12" role="status" aria-live="polite">
      <div className="mx-auto w-fit text-left text-fg-neutral-subtle" aria-hidden>
        <div className="whitespace-pre" style={HEAD_STYLE}>
          {NO_RESULTS_HEAD}
        </div>
        <div className="whitespace-pre" style={MIDDLE_STYLE}>
          {NO_RESULTS_MIDDLE}
        </div>
        <div className="flex items-center whitespace-pre" style={rowStyle}>
          <span style={frameStyle}>{face.left}</span>
          <span style={eyeStyle}>{face.expr[0]}</span>
          <span style={faceStyle}>{face.expr[1]}</span>
          <span style={eyeStyle}>{face.expr[2]}</span>
          <span style={frameStyle}>{face.right}</span>
        </div>
      </div>
      <span className="t5-regular text-fg-neutral-subtle">검색결과가 없어요.</span>
    </div>
  );
}
