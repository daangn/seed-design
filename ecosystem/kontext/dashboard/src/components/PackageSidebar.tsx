import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getPackageDotColor, getPackageLabel } from "@/lib/packages";
import type { PackageSummary } from "@/types";

interface PackageSidebarProps {
  packages: PackageSummary[];
  selected: string | null;
  onSelect: (packageDir: string) => void;
}

export function PackageSidebar({ packages, selected, onSelect }: PackageSidebarProps) {
  const withKontext = packages.filter((p) => p.hasKontext);
  const withoutKontext = packages.filter((p) => !p.hasKontext);

  return (
    <div className="flex h-full flex-col border-r border-border bg-sidebar-background">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[11px] font-medium tracking-widest uppercase text-muted-foreground">
          Packages
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-0.5 px-2 pb-4">
          {withKontext.map((pkg) => (
            <PackageItem
              key={pkg.packageDir}
              pkg={pkg}
              isSelected={selected === pkg.packageDir}
              onClick={() => onSelect(pkg.packageDir)}
            />
          ))}

          {withoutKontext.length > 0 && (
            <>
              <div className="dither-divider mx-2 my-3" />
              <div className="px-2 pb-1">
                <span className="text-[10px] tracking-wider uppercase text-muted-foreground/50">
                  No kontext.yaml
                </span>
              </div>
              {withoutKontext.map((pkg) => (
                <PackageItem
                  key={pkg.packageDir}
                  pkg={pkg}
                  isSelected={selected === pkg.packageDir}
                  onClick={() => onSelect(pkg.packageDir)}
                  dimmed
                />
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function PackageItem({
  pkg,
  isSelected,
  onClick,
  dimmed,
}: {
  pkg: PackageSummary;
  isSelected: boolean;
  onClick: () => void;
  dimmed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] cursor-pointer transition-all duration-100",
        isSelected
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/80 hover:bg-[oklch(0.20_0.01_260)] active:bg-[oklch(0.24_0.01_260)]",
        dimmed && "opacity-40 hover:opacity-60",
      )}
    >
      <span className={cn("h-2 w-2 shrink-0 rounded-full", getPackageDotColor(pkg.packageDir))} />
      <span className="min-w-0 flex-1 truncate font-mono text-[12px]">
        {getPackageLabel(pkg.packageDir)}
      </span>
      {pkg.hasKontext && pkg.edgeCount > 0 && (
        <Badge
          variant="secondary"
          className="h-5 shrink-0 px-1.5 text-[10px] font-mono tabular-nums"
        >
          {pkg.edgeCount}
        </Badge>
      )}
    </button>
  );
}
