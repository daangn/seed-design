import { formatPublishedDate } from "@/lib/format-date";
import Link from "next/link";

interface ReleaseCardProps {
  href: string;
  title: string;
  description?: string;
  publishedAt?: string;
}

/** Updates 목록에서만 쓰는 릴리즈 노트 카드. */
export function ReleaseCard({ href, title, description, publishedAt }: ReleaseCardProps) {
  const published = publishedAt ? new Date(publishedAt) : null;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-r3 bg-bg-transparent-selected px-x5 py-x3_5 text-fg-neutral transition-colors duration-color-transition hover:bg-bg-transparent-selected-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring"
    >
      <div className="min-w-0 space-y-x1">
        {published && (
          <time
            dateTime={published.toISOString()}
            className="t4-regular block text-fg-neutral-muted"
          >
            {formatPublishedDate(published)}
          </time>
        )}
        <h3 className="min-w-0 break-words text-balance text-lg font-medium">{title}</h3>
      </div>
      {description && (
        <p className="t4-regular mt-x2 line-clamp-2 break-words text-fg-neutral-muted">
          {description}
        </p>
      )}
    </Link>
  );
}
