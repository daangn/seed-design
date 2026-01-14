import { composeRefs } from "@radix-ui/react-compose-refs";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { useRadioGroupContext, useRadioGroupItemContext } from "@seed-design/react-radio-group";
import { useCheckboxContext } from "@seed-design/react-checkbox";
import { Collapsible, useCollapsibleContext } from "@seed-design/react-collapsible";
import { forwardRef } from "react";
import clsx from "clsx";
import { isTabbable, isFocusable } from "tabbable";
import { useClassNames, useFooterStateContext } from "./context";

export interface SelectBoxFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

// when footer clicked -> if checkbox, toggle item; if radio, select item
// footer display logic -> if collapsible, follow checkbox/radio selection state; if not collapsible, always display
export const SelectBoxFooter = forwardRef<HTMLDivElement, SelectBoxFooterProps>(
  ({ className, children, onClick, onPointerDown, ...props }, ref) => {
    const classNames = useClassNames();

    const radioGroupContext = useRadioGroupContext({ strict: false });
    const radioItemContext = useRadioGroupItemContext({ strict: false });
    const checkboxContext = useCheckboxContext({ strict: false });
    const collapsibleContext = useCollapsibleContext({ strict: false });
    const footerStateContext = useFooterStateContext();

    const composedRef = composeRefs(ref, footerStateContext?.footerRef ?? null);

    // Handle pointer down to properly focus tabbable elements inside the footer
    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event);

      if (event.defaultPrevented) return;

      if (event.target instanceof HTMLElement && isTabbable(event.target)) {
        event.stopPropagation();
      }
    };

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(event);

      if (event.defaultPrevented) return;

      if (event.target instanceof HTMLElement && isTabbable(event.target)) return;

      // Check if clicking a label that controls a focusable element
      if (
        event.target instanceof HTMLLabelElement &&
        event.target.control &&
        isFocusable(event.target.control)
      ) {
        return;
      }

      if (checkboxContext) {
        checkboxContext.setChecked((prev) => !prev);

        return;
      }

      if (radioGroupContext && radioItemContext) {
        radioGroupContext.setValue(radioItemContext.value);

        return;
      }
    };

    if (collapsibleContext) {
      return (
        <Collapsible.Content
          ref={composedRef}
          className={clsx(classNames.footer, className)}
          onPointerDown={handlePointerDown}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Collapsible.Content>
      );
    }

    return (
      <Primitive.div
        ref={composedRef}
        className={clsx(classNames.footer, className)}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Primitive.div>
    );
  },
);
SelectBoxFooter.displayName = "SelectBoxFooter";
