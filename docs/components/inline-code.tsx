import { clsx } from "cn";
import { Children, cloneElement, isValidElement, type ComponentProps, type ReactNode } from "react";

export const INLINE_CODE_CLASS_NAME =
  "rounded-r1 border-0 bg-bg-transparent-selected px-0 py-x0_5 font-mono text-[0.92em] font-medium leading-[inherit] wrap-anywhere [box-shadow:2px_0_0_var(--seed-color-bg-transparent-selected),-2px_0_0_var(--seed-color-bg-transparent-selected)] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]";

// Changelog Markdown is sanitized HTML rather than React nodes, so it needs the same
// treatment expressed as descendant variants on its prose container.
export const INLINE_CODE_DESCENDANT_CLASS_NAME =
  "[&_code]:rounded-r1 [&_code]:border-0 [&_code]:bg-bg-transparent-selected [&_code]:px-0 [&_code]:py-x0_5 [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:font-medium [&_code]:leading-[inherit] [&_code]:wrap-anywhere [&_code]:[box-shadow:2px_0_0_var(--seed-color-bg-transparent-selected),-2px_0_0_var(--seed-color-bg-transparent-selected)] [&_code]:[box-decoration-break:clone] [&_code]:[-webkit-box-decoration-break:clone]";

export function InlineCode({ className, ...props }: ComponentProps<"code">) {
  return (
    <code
      className={clsx(
        INLINE_CODE_CLASS_NAME,
        "[pre_&]:rounded-none [pre_&]:bg-transparent [pre_&]:p-0 [pre_&]:shadow-none [pre_&]:text-[inherit] [pre_&]:font-normal [pre_&]:[overflow-wrap:normal]",
        className,
      )}
      {...props}
    />
  );
}

export function renderInlineCode(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return child;

    if (child.type === "code") {
      return <InlineCode {...(child.props as ComponentProps<"code">)} />;
    }

    if (child.props.children === undefined) return child;

    return cloneElement(child, undefined, renderInlineCode(child.props.children));
  });
}
