import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { ariaAttr, dataAttr, inputProps } from "@seed-design/dom-utils";
import type * as React from "react";
import { useEffect, useId, useRef } from "react";
import { flushSync } from "react-dom";
import { focusSegment, isMasked } from "./dom";
import { digitsOnly, normalizeBirthDate } from "./normalize";
import { useSegmentedTextInputContext } from "./useSegmentedTextInputContext";

export interface UseSegmentedTextInputSegmentProps {
  /**
   * 자리 수. 자동완성 값이 잘리지 않도록 네이티브 `maxLength` 대신 JS로 제한한다.
   */
  length: number;
  /**
   * 값을 가린다. `type="password"`로 렌더링한다.
   * @default false
   */
  masked?: boolean;
  /**
   * @default "numeric"
   */
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  /**
   * `"bday"`면 자동완성·붙여넣기한 날짜를 `length`에 맞춰 정규화한다(6 → `yyMMdd`, 8 → `yyyyMMdd`).
   * masked Segment의 기본값은 `"off"`다.
   */
  autoComplete?: string;
  /**
   * 입력값을 정규화한다. 기본값은 `inputMode`가 `"numeric"`일 때 숫자 외 문자를 지우고, 그 밖에는 그대로 둔다.
   */
  normalize?: (value: string) => string;
}

interface InputSnapshot {
  start: number;
  end: number;
  value: string;
}

const identity = (value: string) => value;

export type UseSegmentedTextInputSegmentReturn = ReturnType<typeof useSegmentedTextInputSegment>;

export function useSegmentedTextInputSegment(props: UseSegmentedTextInputSegmentProps) {
  const { length, masked = false, inputMode = "numeric", autoComplete } = props;
  const normalize = props.normalize ?? (inputMode === "numeric" ? digitsOnly : identity);
  const isBirthDate = autoComplete?.split(/\s+/).includes("bday") ?? false;

  const ctx = useSegmentedTextInputContext();
  const segmentId = useId();
  const index = ctx.segmentIds.indexOf(segmentId);
  const value = index === -1 ? "" : (ctx.values[index] ?? "");

  const inputRef = useRef<HTMLInputElement>(null);
  const snapshotRef = useRef<InputSnapshot | null>(null);
  const composingRef = useRef(false);

  const { registerSegment } = ctx;
  useLayoutEffect(
    () => registerSegment(segmentId, { length }),
    [registerSegment, segmentId, length],
  );

  const latest = useRef({ value, length, normalize });
  latest.current = { value, length, normalize };

  // 붙여넣기·자동완성이 아닌 한 글자 입력은 브라우저가 반영하기 전에 막는다.
  // 막으면 caret과 값이 그대로 남는다.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const onBeforeInput = (event: InputEvent) => {
      const { value, length, normalize } = latest.current;
      const start = el.selectionStart ?? value.length;
      const end = el.selectionEnd ?? value.length;
      snapshotRef.current = { start, end, value };

      if (event.isComposing || event.inputType !== "insertText" || event.data == null) return;

      const data = normalize(event.data);
      if (data === "" || value.length - (end - start) + data.length > length) {
        event.preventDefault();
      }
    };

    el.addEventListener("beforeinput", onBeforeInput);
    return () => el.removeEventListener("beforeinput", onBeforeInput);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const el = inputRef.current;
    if (el && !el.hasAttribute("aria-label") && !el.hasAttribute("aria-labelledby")) {
      console.warn(
        "SegmentedTextInputSegment: Please provide `aria-label` or `aria-labelledby` for each input segment so that assistive technologies can tell the segments apart.",
      );
    }
  }, []);

  /**
   * `text`를 `startIndex` Segment부터 차례로 채운다. masked·readOnly·disabled Segment 앞에서 멈추고,
   * 다 채운 Segment 다음으로 focus를 옮긴다.
   */
  const distribute = (startEl: HTMLInputElement, text: string) => {
    const segments = ctx.getSegments();
    const startIndex = segments.indexOf(startEl);
    if (startIndex === -1) return;

    const updates: Record<number, string> = {};
    let rest = text;
    let focusTarget: { el: HTMLInputElement; caret: number | "end" } = {
      el: startEl,
      caret: "end",
    };

    for (let i = startIndex; i < segments.length; i++) {
      const el = segments[i] as HTMLInputElement;
      const segmentLength = ctx.getSegmentLength(el);
      const chunk = rest.slice(0, segmentLength);
      rest = rest.slice(segmentLength);
      updates[i] = chunk;

      const next = segments[i + 1];
      const isFull = chunk.length === segmentLength;
      focusTarget =
        isFull && next && !next.disabled ? { el: next, caret: 0 } : { el, caret: "end" };

      const canFillNext = next && !isMasked(next) && !next.readOnly && !next.disabled;
      if (!isFull || rest === "" || !canFillNext) break;
    }

    flushSync(() => ctx.setSegmentValues(updates));
    focusSegment(focusTarget.el, focusTarget.caret);
  };

  const commitTyping = (el: HTMLInputElement, raw: string, snapshot: InputSnapshot | null) => {
    const next = normalize(raw);

    if (next.length > length) {
      // beforeinput에서 막지 못한 입력(IME 등)은 이전 값과 caret으로 되돌린다.
      el.value = value;
      if (snapshot) el.setSelectionRange(snapshot.start, snapshot.end);
      return;
    }

    ctx.setSegmentValues({ [index]: next });

    const typedAtEnd =
      snapshot !== null &&
      snapshot.start === snapshot.end &&
      snapshot.end === snapshot.value.length &&
      next.length > snapshot.value.length;

    if (typedAtEnd && next.length === length) {
      const segments = ctx.getSegments();
      const nextEl = segments[segments.indexOf(el) + 1];
      if (nextEl && !nextEl.disabled) focusSegment(nextEl, 0);
    }
  };

  const normalizePasted = (text: string) => {
    if (isBirthDate) {
      const date = normalizeBirthDate(text, length, { allowCompact: false });
      if (date) return { text: date, replaceAll: true };
    }
    return { text: normalize(text), replaceAll: false };
  };

  return {
    index,
    value,
    inputRef,

    inputProps: inputProps({
      "data-ownedby": ctx.rootId,
      "data-segment-id": segmentId,
      "data-masked": dataAttr(masked),
      "data-empty": dataAttr(value === ""),
      "data-disabled": dataAttr(ctx.disabled),
      "data-readonly": dataAttr(ctx.readOnly),
      "data-invalid": dataAttr(ctx.invalid),
      type: masked ? "password" : "text",
      inputMode,
      autoComplete: autoComplete ?? (masked ? "off" : undefined),
      spellCheck: false,
      value,
      disabled: ctx.disabled,
      readOnly: ctx.readOnly,
      "aria-invalid": ariaAttr(ctx.invalid),
      "aria-required": ariaAttr(ctx.required),

      onChange(event) {
        const el = event.currentTarget;
        const raw = el.value;

        if (composingRef.current || (event.nativeEvent as InputEvent).isComposing) {
          // 조합 중에는 값만 반영하고 자동 이동은 조합이 끝난 뒤에 판단한다.
          ctx.setSegmentValues({ [index]: raw });
          return;
        }

        const snapshot = snapshotRef.current;
        snapshotRef.current = null;
        const inputType = (event.nativeEvent as InputEvent).inputType;
        const insertedLength = snapshot
          ? raw.length - (snapshot.value.length - (snapshot.end - snapshot.start))
          : raw.length - value.length;

        // beforeinput 없이 들어온 값, 교체 입력, 여러 글자 입력은 자동완성으로 보고 Segment 전체를 바꾼다.
        const isAutofill = !snapshot || inputType === "insertReplacementText" || insertedLength > 1;

        if (isAutofill) {
          const text = (isBirthDate && normalizeBirthDate(raw, length)) || normalize(raw);
          distribute(el, text);
          return;
        }

        commitTyping(el, raw, snapshot);
      },

      onCompositionStart() {
        composingRef.current = true;
      },

      onCompositionEnd(event) {
        composingRef.current = false;
        const el = event.currentTarget;
        const next = normalize(el.value).slice(0, length);
        ctx.setSegmentValues({ [index]: next });

        const caretAtEnd = el.selectionStart === el.value.length;
        if (caretAtEnd && next.length === length) {
          const segments = ctx.getSegments();
          const nextEl = segments[segments.indexOf(el) + 1];
          if (nextEl && !nextEl.disabled) focusSegment(nextEl, 0);
        }
      },

      onPaste(event) {
        const el = event.currentTarget;
        if (el.readOnly || el.disabled) return;

        event.preventDefault();
        const pasted = normalizePasted(event.clipboardData.getData("text"));
        if (pasted.text === "") return;

        const start = pasted.replaceAll ? 0 : (el.selectionStart ?? value.length);
        const end = pasted.replaceAll ? value.length : (el.selectionEnd ?? value.length);

        if (end < value.length) {
          // caret 뒤에 선택하지 않은 값이 남아 있으면 현재 Segment 안에서만 반영한다.
          const next = value.slice(0, start) + pasted.text + value.slice(end);
          if (next.length > length) return;

          flushSync(() => ctx.setSegmentValues({ [index]: next }));
          focusSegment(el, start + pasted.text.length);
          return;
        }

        distribute(el, value.slice(0, start) + pasted.text);
      },

      onKeyDown(event) {
        if (event.nativeEvent.isComposing || event.keyCode === 229) return;
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

        const el = event.currentTarget;
        const segments = ctx.getSegments();
        const position = segments.indexOf(el);
        const prev = segments[position - 1];
        const next = segments[position + 1];
        const collapsed = el.selectionStart === el.selectionEnd;

        switch (event.key) {
          case "Backspace": {
            // 빈 Segment에서는 이전 Segment로 옮겨 마지막 글자를 지운다.
            if (el.value !== "" || el.readOnly || !prev || prev.disabled) return;
            event.preventDefault();
            if (!prev.readOnly) {
              flushSync(() =>
                ctx.setSegmentValues({
                  [position - 1]: (ctx.values[position - 1] ?? "").slice(0, -1),
                }),
              );
            }
            focusSegment(prev, "end");
            return;
          }
          case "ArrowRight": {
            if (!collapsed || el.selectionEnd !== el.value.length || !next || next.disabled) return;
            event.preventDefault();
            focusSegment(next, 0);
            return;
          }
          case "ArrowLeft": {
            if (!collapsed || el.selectionStart !== 0 || !prev || prev.disabled) return;
            event.preventDefault();
            focusSegment(prev, "end");
            return;
          }
        }
      },
    }) as React.InputHTMLAttributes<HTMLInputElement>,
  };
}
