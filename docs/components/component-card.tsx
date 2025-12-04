"use client";

import { IconPictureFill } from "@karrotmarket/react-monochrome-icon";
import Image from "next/image";
import Link from "next/link";
import { useState, type SyntheticEvent } from "react";

interface ComponentCardProps {
  title: string;
  description?: string;
  href: string;
  coverImageSrc?: string;
}

export function ComponentCard({ title, description, href, coverImageSrc }: ComponentCardProps) {
  const [error, setError] = useState<SyntheticEvent<HTMLImageElement, Event> | null>(null);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-fd-border bg-fd-card transition-colors hover:bg-fd-accent/50"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-fd-muted flex items-center justify-center">
        {!coverImageSrc || error ? (
          <IconPictureFill className="h-10 w-10 text-fd-muted-foreground/20 group-hover:scale-105 transition-transform" />
        ) : (
          <Image
            src={coverImageSrc}
            alt={`${title} anatomy`}
            onError={setError}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        <h3 className="font-semibold text-fd-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-fd-muted-foreground line-clamp-2">{description}</p>
        )}
      </div>
    </Link>
  );
}
