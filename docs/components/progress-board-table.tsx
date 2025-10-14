import { client } from "@/sanity/lib/client";
import { ALL_COMPONENTS_QUERY } from "@/sanity/lib/queries";
import { ComponentData, PlatformStatus } from "@/sanity/lib/types";
import { Badge } from "@seed-design/react";
import Link from "next/link";

const statusConfig: Record<
  PlatformStatus,
  { label: string; tone: "positive" | "warning" | "neutral" }
> = {
  ready: { label: "Done", tone: "positive" },
  "in-progress": { label: "In Progress", tone: "warning" },
  "not-ready": { label: "Not Ready", tone: "neutral" },
  deprecated: { label: "Deprecated", tone: "neutral" },
};

function StatusBadge({ status }: { status: PlatformStatus }) {
  const { label, tone } = statusConfig?.[status] ?? { label: "Not Ready", tone: "neutral" };
  return (
    <Badge size="large" variant="weak" tone={tone}>
      {label}
    </Badge>
  );
}

function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

const platformLabels = {
  ios: "iOS",
  android: "Android",
  react: "React",
  figma: "Figma",
} as const;

type PlatformKey = keyof typeof platformLabels;

export async function ProgressBoardTable() {
  const components = await client.fetch<ComponentData[]>(
    ALL_COMPONENTS_QUERY,
    {},
    { cache: "no-store" },
  );

  if (!components || components.length === 0) {
    return <div>컴포넌트 데이터가 없습니다.</div>;
  }

  // Calculate progress statistics
  const platforms: PlatformKey[] = ["figma", "react", "ios", "android"];
  const stats = platforms.reduce(
    (acc, platform) => {
      const total = components.length;
      const statusKey = `${platform}Status` as keyof ComponentData;
      const ready = components.filter((c) => c[statusKey] === "ready").length;
      acc[platform] = { ready, total, percentage: Math.round((ready / total) * 100) };
      return acc;
    },
    {} as Record<PlatformKey, { ready: number; total: number; percentage: number }>,
  );

  return (
    <div className="not-prose my-6">
      {/* Progress Statistics */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {platforms.map((platform) => {
          const stat = stats[platform];
          return (
            <div key={platform} className="rounded-lg border border-fd-border p-4">
              <div className="text-sm font-medium text-fd-muted-foreground mb-2">
                {platformLabels[platform]}
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">{stat.percentage}%</div>
                <div className="text-sm text-fd-muted-foreground">
                  ({stat.ready}/{stat.total})
                </div>
              </div>
              <div className="mt-2 h-2 bg-fd-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-fd-primary transition-all"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Components Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-fd-border bg-fd-muted/50">
              <th className="px-4 py-3 text-left text-sm font-semibold sticky left-0 bg-fd-muted/50">
                Component
              </th>
              {platforms.map((platform) => (
                <th key={platform} className="px-4 py-3 text-center text-sm font-semibold">
                  {platformLabels[platform]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {components.map((component) => (
              <tr key={component.id} className="border-b border-fd-border hover:bg-fd-muted/50">
                <td className="px-4 py-3 text-sm font-medium sticky left-0 bg-fd-background">
                  <Link
                    href={`/docs/components/${component.id}`}
                    className="text-fd-primary hover:underline"
                  >
                    {component.name}
                  </Link>
                </td>
                {platforms.map((platform) => {
                  const statusKey = `${platform}Status` as keyof ComponentData;
                  const urlKey = `${platform}Url` as keyof ComponentData;
                  const status = component[statusKey] as PlatformStatus;
                  const url = component[urlKey] as string | undefined;

                  return (
                    <td key={platform} className="px-4 py-3 text-center">
                      {url ? (
                        isExternalUrl(url) ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block hover:opacity-80 transition-opacity"
                            title={status}
                          >
                            <StatusBadge status={status} />
                          </a>
                        ) : (
                          <Link
                            href={url}
                            className="inline-block hover:opacity-80 transition-opacity"
                            title={status}
                          >
                            <StatusBadge status={status} />
                          </Link>
                        )
                      ) : (
                        <StatusBadge status={status} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
