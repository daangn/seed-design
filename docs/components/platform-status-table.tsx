import { client } from "@/sanity/lib/client";
import { COMPONENT_QUERY } from "@/sanity/lib/queries";
import { ComponentData, PlatformStatus } from "@/sanity/lib/types";
import { IconArrowRightFill, IconArrowUpRightFill } from "@karrotmarket/react-monochrome-icon";
import { Badge, Icon } from "@seed-design/react";
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
  "not-planned": { label: "Not Planned", tone: "neutral" },
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
    <>
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg font-medium">{name}</div>
            <Badge size="large" variant="weak" tone={tone}>
              {label}
            </Badge>
          </div>
        </div>
        {note && <div className="text-sm text-fd-muted-foreground line-clamp-2">{note}</div>}
      </div>
      {href && (
        <Icon
          svg={isExternal ? <IconArrowUpRightFill /> : <IconArrowRightFill />}
          color="fg.neutralSubtle"
          size="x4"
        />
      )}
    </>
  );

  const baseClassName = `
    flex items-center justify-between gap-2
    rounded-lg border border-fd-border p-4
    ${isDisabled ? "text-fd-muted-foreground cursor-default" : ""} ${href ? "hover:bg-fd-muted/30 cursor-pointer" : ""}
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
    throw new Error("PlatformStatusTable: Component not found");
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
