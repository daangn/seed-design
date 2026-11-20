"use client";

import { IconChevronDownSmallLine } from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import { type CSSProperties, type ReactNode, useState } from "react";
import { SidebarFeaturedDot } from "../layout/sidebar-featured-dot";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../registry/react/ui/accordion";
import { NextList, NextListButtonItem, NextListLinkItem } from "../../registry/react/ui/next-list";
import { NextListHeader } from "../../registry/react/ui/next-list-header";

const MOBILE_NAV_REGULAR_WEIGHT = "var(--seed-font-weight-regular)";
const MOBILE_NAV_ROW_CLASS = "[&&]:h-10 [&&]:min-h-10 [&&]:py-0";
const MOBILE_NAV_ROW_CONTENT_CLASS =
  "min-h-0 justify-center t8-regular text-fg-neutral [&&::after]:rounded-lg";
const MOBILE_NAV_SELECTED_ROW_CLASS =
  "[&&::before]:left-1.5 [&&::before]:right-1.5 [&&::before]:rounded-lg [&&::before]:bg-bg-transparent-pressed";
const MOBILE_NAV_TITLE_CLASS = "block truncate t8-regular text-fg-neutral";
const MOBILE_NAV_ACCORDION_TRIGGER_CLASS =
  "[&&]:h-10 [&&]:min-h-10 [&&]:rounded-lg [&&]:py-0 [&&]:text-fg-neutral [&&_span]:t8-regular [&&_svg]:text-fg-neutral";
const MOBILE_NAV_SELECTED_ACCORDION_TRIGGER_CLASS = "[&&]:bg-bg-transparent-pressed";

export const MOBILE_NAV_ITEM_STYLE = {
  fontWeight: MOBILE_NAV_REGULAR_WEIGHT,
} as CSSProperties;

interface DocsMobileNavListProps {
  children: ReactNode;
  className?: string;
}

export function DocsMobileNavList({ children, className }: DocsMobileNavListProps) {
  return (
    <NextList itemBorderRadius="8px" className={clsx("flex flex-col gap-2", className)}>
      {children}
    </NextList>
  );
}

interface DocsMobileNavListHeaderProps {
  children: ReactNode;
}

export function DocsMobileNavListHeader({ children }: DocsMobileNavListHeaderProps) {
  return (
    <NextListHeader
      as="h2"
      variant="mediumWeak"
      className="t5-regular"
      style={MOBILE_NAV_ITEM_STYLE}
    >
      {children}
    </NextListHeader>
  );
}

interface MobileNavItemTitleProps {
  children: ReactNode;
  indent?: number;
}

function MobileNavItemTitle({ children, indent = 0 }: MobileNavItemTitleProps) {
  return (
    <span
      className={MOBILE_NAV_TITLE_CLASS}
      style={{
        fontWeight: MOBILE_NAV_REGULAR_WEIGHT,
        paddingLeft: indent || undefined,
      }}
    >
      {children}
    </span>
  );
}

const getMobileNavRowClass = (current: boolean) =>
  clsx(MOBILE_NAV_ROW_CLASS, current && MOBILE_NAV_SELECTED_ROW_CLASS);

interface DocsMobileNavButtonItemProps {
  title: ReactNode;
  current?: boolean;
  disabled?: boolean;
  indent?: number;
  onClick?: () => void;
}

export function DocsMobileNavButtonItem({
  title,
  current = false,
  disabled = false,
  indent,
  onClick,
}: DocsMobileNavButtonItemProps) {
  return (
    <NextListButtonItem
      title={<MobileNavItemTitle indent={indent}>{title}</MobileNavItemTitle>}
      disabled={disabled}
      onClick={onClick}
      className={MOBILE_NAV_ROW_CONTENT_CLASS}
      style={MOBILE_NAV_ITEM_STYLE}
      rootProps={{ className: getMobileNavRowClass(current) }}
    />
  );
}

interface DocsMobileNavLinkItemProps {
  title: ReactNode;
  current?: boolean;
  href: string;
  external?: boolean;
  indent?: number;
  suffix?: ReactNode;
  onClick?: () => void;
}

export function DocsMobileNavLinkItem({
  title,
  current = false,
  href,
  external = false,
  indent,
  suffix,
  onClick,
}: DocsMobileNavLinkItemProps) {
  return (
    <NextListLinkItem
      title={<MobileNavItemTitle indent={indent}>{title}</MobileNavItemTitle>}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-current={current ? "page" : undefined}
      suffix={suffix}
      onClick={onClick}
      className={MOBILE_NAV_ROW_CONTENT_CLASS}
      style={MOBILE_NAV_ITEM_STYLE}
      rootProps={{ className: getMobileNavRowClass(current) }}
    />
  );
}

interface DocsMobileNavAccordionProps {
  value: string;
  title: ReactNode;
  current?: boolean;
  /** 제어하지 않을 때의 처음 열림 상태. */
  defaultOpen?: boolean;
  /** 제어 모드. 문서 nav 폴더는 `DocsNav`의 폴더 맵이 정한다. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsible?: boolean;
  /** 폴더 자신의 페이지. trigger가 현재 항목 표시와 추천 점을 그린다. */
  index?: { current: boolean; featured?: boolean };
  children: ReactNode;
}

export function DocsMobileNavAccordion({
  value,
  title,
  current = false,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  collapsible = true,
  index,
  children,
}: DocsMobileNavAccordionProps) {
  const [openState, setOpenState] = useState(defaultOpen || current);
  const open = collapsible ? (openProp ?? openState) : true;
  const triggerCurrent = index ? index.current : current;

  return (
    <Accordion
      values={open ? [value] : []}
      onValuesChange={(values) => {
        const next = values.includes(value);
        if (onOpenChange) onOpenChange(next);
        else if (collapsible) setOpenState(next);
      }}
    >
      <AccordionItem value={value} disabled={!collapsible && !index}>
        <AccordionTrigger
          headingLevel={2}
          aria-current={index?.current ? "page" : undefined}
          title={
            <span className="block truncate t8-regular text-inherit" style={MOBILE_NAV_ITEM_STYLE}>
              {title}
              {index?.featured && <SidebarFeaturedDot />}
            </span>
          }
          suffixIcon={collapsible && <IconChevronDownSmallLine />}
          className={clsx(
            "justify-between",
            MOBILE_NAV_ACCORDION_TRIGGER_CLASS,
            triggerCurrent && MOBILE_NAV_SELECTED_ACCORDION_TRIGGER_CLASS,
          )}
          style={MOBILE_NAV_ITEM_STYLE}
        />
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
