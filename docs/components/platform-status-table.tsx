import { client } from "@/sanity/lib/client";
import { COMPONENT_QUERY } from "@/sanity/lib/queries";
import { ComponentData, PlatformStatus } from "@/sanity/lib/types";

interface PlatformStatusTableProps {
  componentId: string;
}

const statusLabels: Record<PlatformStatus, string> = {
  ready: "✅ 준비됨",
  "not-ready": "❌ 준비안됨",
  "in-progress": "🚧 작업중",
  deprecated: "⚠️ 사용중단",
};

const platformLabels = {
  ios: "iOS",
  android: "Android",
  webview: "Webview",
  figma: "Figma",
} as const;

export async function PlatformStatusTable({ componentId }: PlatformStatusTableProps) {
  const component = await client.fetch<ComponentData>(COMPONENT_QUERY, { id: componentId });

  if (!component) {
    return null;
  }

  const platforms = [
    { key: "figma", status: component.figmaStatus, url: component.figmaUrl },
    { key: "webview", status: component.webviewStatus, url: component.webviewUrl },
    { key: "ios", status: component.iosStatus, url: component.iosUrl },
    { key: "android", status: component.androidStatus, url: component.androidUrl },
  ] as const;

  return (
    <div className="not-prose my-6">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-fd-border">
            <th className="px-4 py-2 text-left text-sm font-semibold">Platform</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold">Repository</th>
          </tr>
        </thead>
        <tbody>
          {platforms.map(({ key, status, url }) => (
            <tr key={key} className="border-b border-fd-border">
              <td className="px-4 py-3 text-sm font-medium">{platformLabels[key]}</td>
              <td className="px-4 py-3 text-sm">{statusLabels[status]}</td>
              <td className="px-4 py-3 text-sm">
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-primary hover:underline inline-flex items-center gap-1"
                  >
                    View Source →
                  </a>
                ) : (
                  <span className="text-fd-muted-foreground">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
