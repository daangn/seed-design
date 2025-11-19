import Image from "next/image";
import Link from "next/link";

interface ComponentCardProps {
  title: string;
  description?: string;
  href: string;
  imagePath?: string;
}

export function ComponentCard({ title, description, href, imagePath }: ComponentCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-fd-border bg-fd-card transition-colors hover:bg-fd-accent/50"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-fd-muted">
        {imagePath ? (
          <Image
            src={imagePath}
            alt={`${title} anatomy`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-fd-muted to-fd-muted/50">
            <svg
              className="h-10 w-10 text-fd-muted-foreground/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
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
