import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
} from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import {
  useTextFieldInput,
  type TextFieldInputEvent,
  type TextFieldSelectionEvent,
  type UseTextFieldInputProps,
  type UseTextFieldInputReturn,
  type UseTextFieldReturn,
} from "@seed-design/lynx-react-text-field";
import { digitsOnly, normalizeBirthDate } from "./normalize.js";
import { useSegmentedTextInputContext } from "./useSegmentedTextInputContext.js";

const noop = () => {};
const identity = (value: string) => value;

// `useTextFieldInput`이 무제한 `maxlength`로 쓰는 32비트 센티널과 같은 값.
const NATIVE_TEXT_MAX_LENGTH_UNLIMITED = 2_147_483_647;

export interface UseSegmentedTextInputSegmentProps {
  /** 자리 수. */
  length: number;
}

export interface UseSegmentedTextInputSegmentReturn {
  /** Root 등록부에서 이 Segment를 가리키는 key입니다. `useSegmentedTextInputSegmentInput`에 넘깁니다. */
  segmentKey: object;
  /** Segment의 native 입력이 읽을 TextField 상태입니다. `TextFieldProvider`로 내려 줍니다. */
  textField: UseTextFieldReturn;
}

/**
 * @platform Lynx
 *
 * 입력 Segment를 Root에 등록하고, Segment의 native 입력이 쓸 TextField 상태를 만듭니다.
 * 값·focus는 Root가 소유하고 TextField 상태는 항상 controlled입니다.
 */
export function useSegmentedTextInputSegment({
  length,
}: UseSegmentedTextInputSegmentProps): UseSegmentedTextInputSegmentReturn {
  const ctx = useSegmentedTextInputContext();
  const [segmentKey] = useState(() => ({}));
  const index = ctx.claimSegment(segmentKey);
  const value = ctx.values[index] ?? "";

  const { releaseSegment, setSegmentFocused } = ctx;
  useEffect(() => () => releaseSegment(segmentKey), [releaseSegment, segmentKey]);

  const setFocused = useCallback(
    (segmentFocused: boolean) => setSegmentFocused(segmentKey, segmentFocused),
    [setSegmentFocused, segmentKey],
  );

  // Root가 반영하지 않은 입력(자리 수 초과·숫자 외 문자)은 controlled 동기화가 native 입력에서 되돌린다.
  // 다 채운 Segment는 native `maxlength`로 추가 입력을 막아 글자가 잠깐 보였다 사라지지 않게 한다.
  // 범위 선택 교체·조합 중에는 TextField가 제한을 풀어, 붙여넣기는 그대로 bindinput으로 받는다.
  const nativeInsertionMaxLength =
    value.length >= length ? value.length : NATIVE_TEXT_MAX_LENGTH_UNLIMITED;
  const textField = useMemo<UseTextFieldReturn>(
    () => ({
      rootRef: ctx.rootRef,
      value,
      controlled: true,
      nativeInsertionMaxLength,
      required: ctx.required,
      disabled: ctx.disabled,
      readOnly: ctx.readOnly,
      invalid: ctx.invalid,
      focused: ctx.focused,
      setValue: noop,
      setFocused,
    }),
    [
      ctx.rootRef,
      value,
      nativeInsertionMaxLength,
      ctx.required,
      ctx.disabled,
      ctx.readOnly,
      ctx.invalid,
      ctx.focused,
      setFocused,
    ],
  );

  return { segmentKey, textField };
}

export interface UseSegmentedTextInputSegmentInputProps
  extends Omit<UseTextFieldInputProps, "readonly" | "maxlength"> {
  /** `useSegmentedTextInputSegment`가 반환한 key입니다. */
  segmentKey: object;
  /**
   * 자리 수. 다 채운 Segment에서만 native `maxlength`로 추가 입력을 막고, 그 밖에는 붙여넣은 값이 잘리지 않도록 JS로 제한합니다.
   */
  length: number;
  /**
   * 값을 가립니다. 선택 영역을 항상 값 끝으로 되돌립니다. native 글자를 숨기는 표시는 소비자가 맡습니다.
   * @default false
   */
  masked?: boolean;
  /**
   * 생략하면 Root의 `readOnly`를 따릅니다. `true`이면 native 입력 대신 `<text>`로 렌더링하고,
   * 붙여넣기 분배가 이 Segment 앞에서 멈춥니다.
   */
  readOnly?: boolean;
  /**
   * native 입력의 키보드 종류.
   * @default "number"
   */
  type?: "number" | "digit" | "tel" | "text" | "email";
  /**
   * `"bday"`면 붙여넣은 날짜를 `length`에 맞춰 정규화합니다(6 → `yyMMdd`, 8 → `yyyyMMdd`).
   * Lynx native 입력에는 자동완성 속성이 없어 native에는 전달하지 않습니다.
   */
  autoComplete?: string;
  /**
   * 입력값을 정규화합니다. 기본값은 `type`이 `"text"`·`"email"`이 아니면 숫자 외 문자를 지우고, 그 밖에는 그대로 둡니다.
   */
  normalize?: (value: string) => string;
}

type ManagedSegmentInputKey =
  | "segmentKey"
  | "length"
  | "masked"
  | "readOnly"
  | "autoComplete"
  | "normalize";

export interface UseSegmentedTextInputSegmentInputReturn<
  P extends UseSegmentedTextInputSegmentInputProps,
> extends UseTextFieldInputReturn<Omit<P, ManagedSegmentInputKey>> {
  /** 이 Segment의 native 입력이 focus되어 있는지 여부입니다. */
  focused: boolean;
}

interface InputSnapshot {
  start: number;
  end: number;
}

interface InputState extends InputSnapshot {
  value: string;
}

/**
 * @platform Lynx
 *
 * Segment의 native `<input>` 연결을 만듭니다. `useSegmentedTextInputSegment`의 `textField`를
 * `TextFieldProvider`로 내려 준 안에서 호출합니다.
 *
 * React와의 차이:
 * - native 입력에 paste 이벤트가 없어, 한 번의 입력으로 두 글자 이상 늘어나면 붙여넣기·자동완성으로 보고
 *   현재 Segment부터 나눠 채웁니다.
 * - 빈 Segment에서 Backspace를 눌러도 native 입력 이벤트가 오지 않아 이전 Segment로 이동하지 않습니다.
 *   방향키 이동도 없습니다.
 */
export function useSegmentedTextInputSegmentInput<P extends UseSegmentedTextInputSegmentInputProps>(
  props: P,
  forwardedRef?: ForwardedRef<NodesRef>,
): UseSegmentedTextInputSegmentInputReturn<P> {
  const {
    segmentKey,
    length,
    masked = false,
    readOnly,
    type = "number",
    autoComplete,
    normalize: normalizeProp,
    bindinput,
    bindselection,
    bindfocus,
    bindblur,
    ...otherProps
  } = props;
  const ctx = useSegmentedTextInputContext();
  const index = ctx.getSegmentIndex(segmentKey);
  const value = ctx.values[index] ?? "";
  const normalize = normalizeProp ?? (type === "text" || type === "email" ? identity : digitsOnly);
  const isBirthDate = autoComplete?.split(/\s+/).includes("bday") ?? false;

  const latest = useRef({ index, value, length, normalize, isBirthDate, masked });
  latest.current = { index, value, length, normalize, isBirthDate, masked };
  const nativeRef = useRef<NodesRef | null>(null);
  const mergedRef = useMemo<ForwardedRef<NodesRef>>(() => {
    if (!forwardedRef) return nativeRef;
    return (node: NodesRef | null) => {
      "background only";
      nativeRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else forwardedRef.current = node;
    };
  }, [forwardedRef]);
  // native 입력에 남을 값의 길이. masked Segment의 caret을 끝에 고정할 때 쓴다.
  const nativeLengthRef = useRef(value.length);
  nativeLengthRef.current = value.length;
  const [focused, setFocused] = useState(false);
  const selectionRef = useRef<InputSnapshot | null>(null);
  // 조합을 시작하기 전의 값과 선택 영역. 조합이 끝난 입력을 이 상태에서 바꾼 것으로 판단한다.
  const compositionRef = useRef<InputState | null>(null);

  const handleInput = useCallback(
    (event: TextFieldInputEvent) => {
      "background only";

      const { value: raw, selectionStart, selectionEnd, isComposing } = event.detail;
      const { index, value, length, normalize, isBirthDate } = latest.current;
      // iOS는 입력 뒤의 선택 변경을 bindinput보다 먼저 보낸다. 값 끝을 넘는 선택은 입력 전 끝으로 본다.
      const last = selectionRef.current;
      const selection = {
        start: Math.min(last?.start ?? value.length, value.length),
        end: Math.min(last?.end ?? value.length, value.length),
      };
      selectionRef.current = { start: selectionStart, end: selectionEnd };

      if (isComposing) {
        // 조합 중에는 값만 반영하고, 정규화와 자동 이동은 조합이 끝난 입력에서 판단한다.
        compositionRef.current ??= { ...selection, value };
        ctx.setSegmentValues({ [index]: raw });
      } else {
        const composed = compositionRef.current !== null;
        const before = compositionRef.current ?? { ...selection, value };
        compositionRef.current = null;

        // 입력은 이전 선택 영역을 바꾼 것으로 본다. 앞뒤 값이 그대로면 바뀐 부분만 정규화한다.
        const prefix = before.value.slice(0, before.start);
        const suffix = before.value.slice(before.end);
        const keepsSurroundings =
          raw.length >= prefix.length + suffix.length &&
          raw.startsWith(prefix) &&
          raw.endsWith(suffix);
        const inserted = keepsSurroundings
          ? raw.slice(prefix.length, raw.length - suffix.length)
          : null;
        // 자리 수를 넘는 값은 반영하지 않고 이전 값으로 되돌린다. native 값은 TextField 동기화가 맞춘다.
        const revert = () => {
          nativeLengthRef.current = before.value.length;
          ctx.setSegmentValues({ [index]: before.value });
        };

        // paste 이벤트가 없으므로 조합이 아닌 입력으로 여러 글자가 들어오면 붙여넣기·자동완성으로 본다.
        const insertedLength =
          inserted?.length ?? raw.length - (before.value.length - (before.end - before.start));
        const isPaste = !composed && insertedLength > 1;
        const commit = (next: string) => {
          nativeLengthRef.current = next.length;
          ctx.setSegmentValues({ [index]: next });
        };

        if (isPaste) {
          const date = isBirthDate ? normalizeBirthDate(inserted ?? raw, length) : null;

          if (date) {
            ctx.distribute(index, date);
          } else if (suffix !== "") {
            // 뒤에 선택하지 않은 값이 남아 있으면 현재 Segment 안에서만 반영한다.
            const next = inserted === null ? normalize(raw) : prefix + normalize(inserted) + suffix;
            if (next.length > length) revert();
            else commit(next);
          } else {
            // 앞 값까지 바뀐 입력(자동완성 교체 등)은 Segment 전체를 바꾼다.
            ctx.distribute(
              index,
              inserted === null ? normalize(raw) : prefix + normalize(inserted),
            );
          }
        } else {
          const next = inserted === null ? normalize(raw) : prefix + normalize(inserted) + suffix;

          if (next.length > length) {
            revert();
          } else {
            commit(next);

            const typedAtEnd =
              before.start === before.end &&
              before.end === before.value.length &&
              next.length > before.value.length;
            if (typedAtEnd && next.length === length) ctx.focusSegment(index + 1);
          }
        }
      }

      bindinput?.(event);
    },
    [ctx.setSegmentValues, ctx.distribute, ctx.focusSegment, bindinput],
  );

  const handleSelection = useCallback(
    (event: TextFieldSelectionEvent) => {
      "background only";

      const { selectionStart: start, selectionEnd: end } = event.detail;
      const nativeLength = nativeLengthRef.current;
      // 가린 값은 보이지 않으므로 가운데를 고칠 수 없게 caret을 끝에 둔다.
      // 입력보다 먼저 온 선택 변경(입력 직후 caret)은 끝보다 뒤에 있으므로 건드리지 않는다.
      if (latest.current.masked && (start !== end || start < nativeLength)) {
        selectionRef.current = { start: nativeLength, end: nativeLength };
        try {
          nativeRef.current
            ?.invoke({
              method: "setSelectionRange",
              params: { selectionStart: nativeLength, selectionEnd: nativeLength },
            })
            .exec();
        } catch {
          // native 입력이 아직 commit되지 않았으면 선택 영역도 없다.
        }
      } else {
        selectionRef.current = { start, end };
      }
      bindselection?.(event);
    },
    [bindselection],
  );

  const handleFocus = useCallback<NonNullable<UseTextFieldInputProps["bindfocus"]>>(
    (event) => {
      "background only";
      setFocused(true);
      bindfocus?.(event);
    },
    [bindfocus],
  );

  const handleBlur = useCallback<NonNullable<UseTextFieldInputProps["bindblur"]>>(
    (event) => {
      "background only";
      setFocused(false);
      bindblur?.(event);
    },
    [bindblur],
  );

  const api = useTextFieldInput(
    {
      ...otherProps,
      readonly: readOnly,
      type,
      bindinput: handleInput,
      bindselection: handleSelection,
      bindfocus: handleFocus,
      bindblur: handleBlur,
    },
    mergedRef,
  );

  ctx.updateSegment(segmentKey, { length, masked, readOnly: api.readOnly, focus: api.focus });

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!otherProps["accessibility-label"]) {
      console.warn(
        "SegmentedTextInputSegment: Please provide `accessibility-label` for each input segment so that assistive technologies can tell the segments apart.",
      );
    }
  }, []);

  // 관리하는 prop을 뺀 `P`의 나머지가 `inputProps`에 남는다. TypeScript는 generic `Omit`의 동치를 증명하지 못한다.
  return { ...api, focused } as UseSegmentedTextInputSegmentInputReturn<P>;
}
