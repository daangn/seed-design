"use client";

import { ContentPlaceholder } from "@/registry/react/ui/content-placeholder";
import { clsx } from "cn";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

// LinkProps doesn't include classNames and else
interface CatalogCardProps extends Omit<ComponentProps<typeof Link>, "title"> {
  title: ReactNode;
  coverImageSrc?: string;
  variant?: "default" | "showcase";
}

export function CatalogCard({
  title,
  coverImageSrc,
  variant = "default",
  className,
  ...linkProps
}: CatalogCardProps) {
  return (
    <Link
      {...linkProps}
      className={clsx("group flex flex-col gap-x3 min-[768px]:gap-x5", className)}
    >
      {/* Keep lazy images in layout while they load. ImageFrame hides non-loaded content
          with display:none, which can prevent a lazy image from ever becoming eligible. */}
      <div
        className="relative aspect-video overflow-hidden"
        style={{
          borderRadius: variant === "showcase" ? "var(--seed-radius-r3)" : "var(--seed-radius-r2)",
        }}
      >
        <ContentPlaceholder type="image" className="absolute inset-0 size-full" />
        {coverImageSrc ? (
          <Image
            src={coverImageSrc}
            alt=""
            fill
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1280px) 33vw, 50vw"
            className="absolute inset-0 block size-full object-cover transition-transform duration-[600ms] ease-out group-hover:[transform:scale(1.05)]"
          />
        ) : null}
      </div>
      <h2 className="t9-medium text-fg-neutral max-md:text-[16px]/[24px] md:text-[20px]/[30px]">
        {title}
      </h2>
    </Link>
  );
}
