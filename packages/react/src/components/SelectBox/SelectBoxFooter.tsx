import { composeRefs } from "@radix-ui/react-compose-refs";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { Collapsible, useCollapsibleContext } from "@seed-design/react-collapsible";
import { forwardRef } from "react";
import clsx from "clsx";
import { useClassNames, useFooterStateContext } from "./context";

export interface SelectBoxFooterProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const SelectBoxFooter = forwardRef<HTMLDivElement, SelectBoxFooterProps>(
  ({ className, children, ...props }, ref) => {
    const classNames = useClassNames();

    const collapsibleContext = useCollapsibleContext({ strict: false });
    const footerStateContext = useFooterStateContext();

    const composedRef = composeRefs(ref, footerStateContext?.footerRef ?? null);

    if (collapsibleContext) {
      return (
        <Collapsible.Content
          ref={composedRef}
          className={clsx(classNames.footer, className)}
          {...props}
        >
          {children}
        </Collapsible.Content>
      );
    }

    return (
      <Primitive.div ref={composedRef} className={clsx(classNames.footer, className)} {...props}>
        {children}
      </Primitive.div>
    );
  },
);
SelectBoxFooter.displayName = "SelectBoxFooter";
