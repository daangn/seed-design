import { IconSeedArrow } from "@/components/icon-seed-arrow";
import clsx from "clsx";
import Link from "fumadocs-core/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

const CARD =
  "not-prose group flex min-h-[52px] flex-col justify-center rounded-r3 bg-bg-transparent-selected px-x5 py-x3_5 " +
  "text-fg-neutral transition-colors duration-color-transition hover:bg-bg-transparent-selected-pressed @max-lg:col-span-full";

type DocsCardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  external?: boolean;
};

function isExternalHref(href: string | undefined, external: boolean | undefined) {
  if (external !== undefined) return external;
  if (!href) return false;
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

function CardContent({
  icon,
  title,
  description,
  children,
  showArrow,
  external,
}: Pick<DocsCardProps, "icon" | "title" | "description" | "children"> & {
  showArrow: boolean;
  external: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-x3">
      {icon ? (
        <span className="mt-[1px] flex size-x5 shrink-0 items-center justify-center rounded-r2 bg-bg-transparent-selected-pressed text-fg-neutral [&_svg]:size-x3_5">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center justify-between gap-x3">
          <h3 className="t5-medium my-0 min-w-0 truncate text-fg-neutral">{title}</h3>
          {showArrow ? (
            <IconSeedArrow
              external={external}
              className={clsx("size-x4 text-fg-neutral", external && "-translate-y-[0.5px]")}
            />
          ) : null}
        </div>
        {description ? (
          <p className="t4-regular mb-0 mt-x1 break-words text-fg-neutral-muted">{description}</p>
        ) : null}
        {children ? (
          <div className="prose-no-margin t4-regular mt-x1 break-words text-fg-neutral-muted empty:hidden">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function DocsCards({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={clsx("grid grid-cols-2 gap-3 @container", className)}>
      {props.children}
    </div>
  );
}

export function DocsCard({
  icon,
  title,
  description,
  href,
  external,
  className,
  children,
  ...props
}: DocsCardProps) {
  const isExternal = isExternalHref(href, external);
  const content = (
    <CardContent
      icon={icon}
      title={title}
      description={description}
      showArrow={Boolean(href)}
      external={isExternal}
    >
      {children}
    </CardContent>
  );

  if (href) {
    return (
      <Link
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        href={href}
        external={isExternal}
        data-card
        className={clsx(CARD, className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <div {...(props as HTMLAttributes<HTMLDivElement>)} data-card className={clsx(CARD, className)}>
      {content}
    </div>
  );
}
