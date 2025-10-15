import { client } from "@/sanity/lib/client";
import { COMPONENT_QUERY } from "@/sanity/lib/queries";
import { ComponentData, PlatformStatus } from "@/sanity/lib/types";
import { Badge } from "@seed-design/react";
import Link from "next/link";

interface PlatformStatusTableProps {
  componentId: string;
}

const platformConfig = [
  { key: "figma" as const, label: "Figma" },
  { key: "react" as const, label: "React" },
  { key: "ios" as const, label: "iOS" },
  { key: "android" as const, label: "Android" },
] as const;

const statusConfig: Record<
  PlatformStatus,
  { label: string; tone: "positive" | "warning" | "neutral" }
> = {
  ready: { label: "Done", tone: "positive" },
  "in-progress": { label: "In Progress", tone: "warning" },
  "not-ready": { label: "Not Ready", tone: "neutral" },
  deprecated: { label: "Deprecated", tone: "neutral" },
};

function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

function PlatformCard({
  name,
  status,
  href,
  note,
}: {
  name: string;
  status: PlatformStatus;
  href?: string;
  note?: string;
}) {
  const isDisabled = !status || status === "not-ready" || status === "deprecated";
  const { label, tone } = statusConfig?.[status] ?? { label: "Not Ready", tone: "neutral" };
  const isExternal = href ? isExternalUrl(href) : false;

  const cardContent = (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-lg font-medium">{name}</div>
          <Badge size="large" variant="weak" tone={tone}>
            {label}
          </Badge>
        </div>

        {href && !isDisabled && isExternal && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
            aria-label="External link"
          >
            <title>External link</title>
            <path
              d="M16.2498 17.5H3.74976C3.41837 17.4996 3.10069 17.3677 2.86637 17.1334C2.63204 16.8991 2.5002 16.5814 2.49976 16.25V3.75C2.5002 3.41862 2.63204 3.10093 2.86637 2.86661C3.10069 2.63229 3.41837 2.50045 3.74976 2.5H9.99976V3.75H3.74976V16.25H16.2498V10H17.4998V16.25C17.4993 16.5814 17.3675 16.8991 17.1331 17.1334C16.8988 17.3677 16.5811 17.4996 16.2498 17.5Z"
              fill="currentColor"
            />
            <path
              d="M12.4998 1.25V2.5H16.616L11.2498 7.86625L12.1335 8.75L17.4998 3.38375V7.5H18.7498V1.25H12.4998Z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>

      {note && <div className="text-sm text-fd-muted-foreground line-clamp-2">{note}</div>}
    </div>
  );

  const baseClassName = `
    flex items-center
    rounded-lg border border-fd-border p-4
    ${isDisabled ? "text-fd-muted-foreground cursor-default" : "hover:bg-fd-muted/30 cursor-pointer"}
  `;

  if (!href || isDisabled) {
    return <div className={baseClassName}>{cardContent}</div>;
  }

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={baseClassName}>
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClassName}>
      {cardContent}
    </Link>
  );
}

export async function PlatformStatusTable({ componentId }: PlatformStatusTableProps) {
  const component = await client.fetch<ComponentData>(
    COMPONENT_QUERY,
    { id: componentId },
    { cache: "no-store" },
  );

  if (!component) {
    return null;
  }

  return (
    <div className="not-prose my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {platformConfig.map(({ key, label }) => {
          const statusKey = `${key}Status` as keyof ComponentData;
          const urlKey = `${key}Url` as keyof ComponentData;
          const noteKey = `${key}Note` as keyof ComponentData;
          const status = component[statusKey] as PlatformStatus;
          const url = component[urlKey] as string | undefined;
          const note = component[noteKey] as string | undefined;

          return <PlatformCard key={key} name={label} status={status} href={url} note={note} />;
        })}
      </div>
    </div>
  );
}
