import { REACT_ARCHIVE_VERSION } from "@/lib/docs-archive";

const VERSIONS = [
  { label: "latest", url: "https://seed-design.io/react" },
  { label: "v2", url: "https://seed-design.io/react/v2" },
  { label: "v1.2", url: "https://seed-design.io/react/v1.2" },
  { label: "v1.1", url: "https://seed-design.io/react/v1.1" },
  { label: "v1.0", url: "https://seed-design.io/react/v1.0" },
];

export function ReactVersionSwitcher() {
  const current = REACT_ARCHIVE_VERSION || "v1.1";
  return (
    <details className="relative text-sm mb-2">
      <summary className="cursor-pointer rounded-lg border p-2">{current}</summary>
      <div className="absolute z-50 flex flex-col w-full rounded-lg border p-1 bg-fd-background shadow-lg">
        {VERSIONS.map((version) =>
          version.label === current ? (
            <span key={version.label} aria-current="page" className="p-2 text-fd-primary">
              {version.label} ✓
            </span>
          ) : (
            <a key={version.label} href={version.url} className="rounded p-2 hover:bg-fd-accent">
              {version.label}
            </a>
          ),
        )}
      </div>
    </details>
  );
}
