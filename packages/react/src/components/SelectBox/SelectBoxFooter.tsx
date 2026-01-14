import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { useRadioGroupContext, useRadioGroupItemContext } from "@seed-design/react-radio-group";
import { useCheckboxContext } from "@seed-design/react-checkbox";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { isTabbable } from "tabbable";
import { useClassNames, useItemContext, getFooterId } from "./context";

export interface SelectBoxFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

// when footer clicked -> if checkbox, toggle item; if radio, select item
// footer display logic -> if collapsible, follow checkbox/radio selection state; if not collapsible, always display
export const SelectBoxFooter = forwardRef<HTMLDivElement, SelectBoxFooterProps>(
  ({ className, style, children, onClick, ...props }, ref) => {
    const classNames = useClassNames();

    const radioGroupContext = useRadioGroupContext({ strict: false });
    const radioItemContext = useRadioGroupItemContext({ strict: false });
    const checkboxContext = useCheckboxContext({ strict: false });

    const stateProps = useMemo(
      () => radioItemContext?.stateProps ?? checkboxContext?.stateProps ?? {},
      [radioItemContext, checkboxContext],
    );
    const isChecked = useMemo(
      () => radioItemContext?.checked ?? checkboxContext?.checked ?? false,
      [radioItemContext, checkboxContext],
    );

    const itemContext = useItemContext();
    const collapsible = itemContext?.footerVisibility === "when-selected";
    const { contentRef, hidden, panelHeight, onTransitionEnd } = useCollapsible(isChecked);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(event);

      if (event.defaultPrevented) return;
      if (event.target instanceof HTMLElement && isTabbable(event.target)) return;

      if (checkboxContext) {
        checkboxContext.setChecked((prev) => !prev);

        return;
      }

      if (radioGroupContext && radioItemContext) {
        radioGroupContext.setValue(radioItemContext.value);

        return;
      }
    };

    return (
      <Primitive.div
        ref={ref}
        className={clsx(classNames.footer, className)}
        onClick={handleClick}
        style={{
          ...style,
          ...(panelHeight && {
            "--seed-select-box-panel-height": panelHeight,
          }),
        }}
        {...(collapsible && {
          "data-collapsible": "",

          id: itemContext ? getFooterId(itemContext.id) : undefined,

          hidden,

          onTransitionEnd,
        })}
        {...stateProps}
        {...props}
      >
        {collapsible ? <Primitive.div ref={contentRef}>{children}</Primitive.div> : children}
      </Primitive.div>
    );
  },
);
SelectBoxFooter.displayName = "SelectBoxFooter";

// TODO: migrate to react-collapsible as a headless component
function useCollapsible(open: boolean) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [visible, setVisible] = useState(open);

  useLayoutEffect(() => {
    if (!contentRef.current) return;

    const updateHeight = () => {
      if (!contentRef.current) return;

      setHeight(contentRef.current.offsetHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, []);

  // When expanded, immediately show to allow transition
  useEffect(() => {
    if (!open) return;

    setVisible(true);
  }, [open]);

  const panelHeight = open ? `${height}px` : "0px";

  return {
    contentRef,
    hidden: !open && !visible,
    panelHeight: height !== undefined ? panelHeight : undefined,
    onTransitionEnd: (event: React.TransitionEvent) => {
      if (event.propertyName !== "height") return;
      if (open) return;

      // When collapse transition ends, hide from screen readers and remove from tab order
      setVisible(false);
    },
  };
}
