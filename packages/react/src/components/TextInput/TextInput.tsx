import { composeRefs } from "@radix-ui/react-compose-refs";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { textInput } from "@seed-design/css/recipes/text-input";
import { GraphemeInput, useGraphemeInputContext } from "@seed-design/react-field";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import clsx from "clsx";
import type * as React from "react";
import { forwardRef, useCallback, useRef } from "react";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";

const { withProvider, withContext, useClassNames } = createSlotRecipeContext(textInput);
const withStateProps = createWithStateProps([useGraphemeInputContext]);

////////////////////////////////////////////////////////////////////////////////////

export interface TextInputRootProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const TextInputRoot = GraphemeInput.Root;

////////////////////////////////////////////////////////////////////////////////////

export interface TextInputGroupProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}
export const TextInputGroup = withProvider<HTMLDivElement, TextInputGroupProps>(
  withStateProps(Primitive.div),
  "root",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextInputInputProps extends GraphemeInput.InputProps {}

export const TextInputInput = withContext<HTMLInputElement, TextInputInputProps>(
  GraphemeInput.Input,
  "value",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TextInputTextareaProps extends GraphemeInput.TextareaProps {
  /**
   * If true, the textarea will automatically resize based on its content.
   * @default true
   */
  autoresize?: boolean;
}

export const TextInputTextarea = forwardRef<HTMLTextAreaElement, TextInputTextareaProps>(
  (props, ref) => {
    const { className, autoresize = true, ...otherProps } = props;
    const classNames = useClassNames();
    const { value } = useGraphemeInputContext();

    // referenced from React Spectrum
    const inputRef = useRef<HTMLTextAreaElement>(null);
    // biome-ignore lint/correctness/useExhaustiveDependencies: intended
    const onHeightChange = useCallback(() => {
      if (!inputRef.current) return;
      if (otherProps.style?.height) return;
      if (!autoresize) return;

      // Quiet textareas always grow based on their text content.
      // Standard textareas also grow by default, unless an explicit height is set.

      const input = inputRef.current;
      const prevAlignment = input.style.alignSelf;
      const prevOverflow = input.style.overflow;
      // Firefox scroll position is lost when overflow: 'hidden' is applied so we skip applying it.
      // The measure/applied height is also incorrect/reset if we turn on and off
      // overflow: hidden in Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1787062
      const isFirefox = "MozAppearance" in input.style;
      if (!isFirefox) {
        input.style.overflow = "hidden";
      }

      input.style.alignSelf = "start";
      input.style.height = "auto";

      // offsetHeight - clientHeight accounts for the border/padding.
      input.style.height = `${input.scrollHeight + (input.offsetHeight - input.clientHeight)}px`;

      input.style.overflow = prevOverflow;
      input.style.alignSelf = prevAlignment;
    }, [inputRef, otherProps.style?.height, autoresize]);

    useLayoutEffect(() => {
      if (inputRef.current) {
        onHeightChange();
      }
    }, [onHeightChange, value, inputRef]);

    return (
      <GraphemeInput.Textarea
        ref={composeRefs(inputRef, ref)}
        {...otherProps}
        className={clsx(classNames.value, className)}
      />
    );
  },
);
