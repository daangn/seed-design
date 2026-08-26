import IconChevronDownSmallLine from "@karrotmarket/lynx-monochrome-icon/IconChevronDownSmallLine";
import * as React from "@lynx-js/react";
import { Accordion as SeedAccordion } from "@seed-design/lynx-react";
import type { LynxIconElementProps } from "@seed-design/lynx-react";

export interface AccordionProps extends SeedAccordion.RootProps {}

/**
 * @see https://seed-design.io/lynx/components/accordion
 */
export const Accordion = React.forwardRef<unknown, AccordionProps>((props, ref) => {
  const { children, ...otherProps } = props;
  return (
    <SeedAccordion.Root ref={ref} {...otherProps}>
      {children}
    </SeedAccordion.Root>
  );
});
Accordion.displayName = "Accordion";

export interface AccordionItemProps extends SeedAccordion.ItemProps {}

/**
 * @see https://seed-design.io/lynx/components/accordion
 */
export const AccordionItem = React.forwardRef<unknown, AccordionItemProps>((props, ref) => {
  const { children, ...otherProps } = props;
  return (
    <SeedAccordion.Item ref={ref} {...otherProps}>
      {children}
    </SeedAccordion.Item>
  );
});
AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps extends Omit<SeedAccordion.TriggerProps, "children"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  prefix?: React.ReactNode;
  suffixIcon?: React.ReactElement<LynxIconElementProps>;
}

/**
 * @see https://seed-design.io/lynx/components/accordion
 */
export const AccordionTrigger = React.forwardRef<unknown, AccordionTriggerProps>((props, ref) => {
  const {
    title,
    description,
    prefix,
    suffixIcon = <IconChevronDownSmallLine />,
    "accessibility-label": accessibilityLabel,
    ...otherProps
  } = props;

  return (
    <SeedAccordion.Header>
      <SeedAccordion.Trigger
        ref={ref}
        accessibility-label={accessibilityLabel ?? (typeof title === "string" ? title : undefined)}
        {...otherProps}
      >
        {prefix != null ? <SeedAccordion.Prefix>{prefix}</SeedAccordion.Prefix> : null}
        <SeedAccordion.Body>
          <SeedAccordion.Title>{title}</SeedAccordion.Title>
          {description != null ? (
            <SeedAccordion.Description>{description}</SeedAccordion.Description>
          ) : null}
        </SeedAccordion.Body>
        <SeedAccordion.SuffixIcon icon={suffixIcon} />
      </SeedAccordion.Trigger>
    </SeedAccordion.Header>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps extends SeedAccordion.ContentProps {}

/**
 * @see https://seed-design.io/lynx/components/accordion
 */
export const AccordionContent = React.forwardRef<unknown, AccordionContentProps>((props, ref) => {
  const { children, ...otherProps } = props;
  return (
    <SeedAccordion.Content ref={ref} {...otherProps}>
      {children}
    </SeedAccordion.Content>
  );
});
AccordionContent.displayName = "AccordionContent";
