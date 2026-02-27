"use client";

import { IconPictureFill } from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState, type ComponentProps, type SyntheticEvent } from "react";

// LinkProps doesn't include classNames and else
interface ComponentCardProps extends ComponentProps<typeof Link> {
  title: string;
  description?: string;
  coverImageSrc?: string;
}

export function ComponentCard({
  title,
  description,
  coverImageSrc,
  className,
  ...linkProps
}: ComponentCardProps) {
  const [error, setError] = useState<SyntheticEvent<HTMLImageElement, Event> | null>(null);

  return (
    <Link
      {...linkProps}
      className={clsx(
        "group flex flex-col overflow-hidden rounded-lg border border-fd-border bg-fd-card transition-colors hover:bg-fd-accent/50 shadow-xs",
        className,
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-fd-muted flex items-center justify-center border-b border-fd-border">
        {!coverImageSrc || error ? (
          <IconPictureFill className="h-10 w-10 text-fd-muted-foreground/20 group-hover:scale-105 transition-transform" />
        ) : (
          <Image
            src={coverImageSrc}
            alt=""
            onError={setError}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <h2 className="font-semibold leading-snug text-fd-foreground text-balance">{title}</h2>
        {description && (
          <p className="text-sm text-fd-muted-foreground break-keep text-pretty">{description}</p>
        )}
      </div>
    </Link>
  );
}
