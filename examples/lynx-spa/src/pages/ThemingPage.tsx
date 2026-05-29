import { ActionButton, getSeedClassName } from "@seed-design/lynx-react";
import clsx from "clsx";

type ColorMode = "system" | "light-only" | "dark-only";

type LynxRuntime = typeof globalThis & {
  lynx?: {
    __globalProps?: Record<string, unknown> | null;
  };
};

const runtime = globalThis as LynxRuntime;

function getGlobalProps() {
  return runtime.lynx?.__globalProps ?? {};
}

function getFallbackSeedClassName(colorMode: ColorMode) {
  const systemTheme = String(getGlobalProps().theme ?? "").toLowerCase();
  const resolvedTheme =
    colorMode === "dark-only" || (colorMode === "system" && systemTheme === "dark")
      ? "dark"
      : "light";

  return `seed-user-color-scheme-${resolvedTheme}`;
}

function getSafeSeedClassName(colorMode: ColorMode) {
  try {
    return getSeedClassName({ colorMode });
  } catch {
    return getFallbackSeedClassName(colorMode);
  }
}

function SectionTitle({ children }: { children: string }) {
  return <text className="t5-bold mt-x4 mb-x2 text-fg-neutral">{children}</text>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <view className="flex flex-col gap-x0_5">
      <text className="t2-regular text-fg-neutral-subtle">{label}</text>
      <text className="t3-regular text-fg-neutral">{value}</text>
    </view>
  );
}

function TokenLine({ name, value }: { name: string; value: string }) {
  return (
    <view className="flex flex-row items-center gap-x2">
      <view
        className="w-x5 h-x5 rounded-r1 border border-stroke-neutral-muted"
        style={{
          backgroundColor: value,
        }}
      />
      <text className="t2-regular text-fg-neutral-muted">{name}</text>
    </view>
  );
}

function ThemeSurface({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <view
      className={clsx(
        "p-x3 rounded-r2 border border-stroke-neutral-muted bg-bg-layer-default flex flex-col gap-x2_5",
        className,
      )}
    >
      <view className="flex flex-col gap-[3px]">
        <text className="t4-bold text-fg-neutral">{title}</text>
        <text className="t2-regular text-fg-neutral-subtle">{description}</text>
      </view>

      <view className="p-x2_5 rounded-r1_5 bg-bg-neutral-weak flex flex-col gap-x1_5">
        <text className="t3-regular text-fg-neutral">
          CSS variables inherit through this surface.
        </text>
        <TokenLine name="bg.neutralWeak" value="var(--seed-color-bg-neutral-weak)" />
        <TokenLine name="fg.neutral" value="var(--seed-color-fg-neutral)" />
        <TokenLine name="stroke.neutralMuted" value="var(--seed-color-stroke-neutral-muted)" />
      </view>

      <view className="flex flex-row flex-wrap gap-x2">
        <ActionButton size="small" variant="brandSolid">
          Brand
        </ActionButton>
        <ActionButton size="small" variant="neutralWeak">
          Neutral
        </ActionButton>
      </view>
    </view>
  );
}

function TailwindTokenPreview({ className }: { className?: string }) {
  return (
    <view className={clsx("flex flex-col gap-x2", className)}>
      <view className="bg-bg-layer-default border border-stroke-neutral-muted rounded-r2 p-x3">
        <text className="t4-bold text-fg-neutral">Tailwind token surface</text>
        <text className="t3-regular text-fg-neutral-subtle">
          bg-bg-layer-default / text-fg-neutral / border-stroke-neutral-muted
        </text>
      </view>
      <view className="bg-bg-brand-weak rounded-r2 p-x3">
        <text className="t4-regular text-fg-brand">Theme-aware Tailwind brand token</text>
      </view>
    </view>
  );
}

export function ThemingPage() {
  const globalProps = getGlobalProps();
  const systemTheme = String(globalProps.theme ?? "unknown");
  const frontendTheme = String(globalProps.frontendTheme ?? "unknown");

  return (
    <scroll-view scroll-y className="flex flex-col gap-x3 flex-1">
      <text className="t7-bold text-fg-neutral">Theming</text>
      <text className="t3-regular text-fg-neutral-subtle">
        Class-based SEED theme tokens for Lynx.
      </text>

      <view className="p-x3 bg-bg-neutral-weak rounded-r2 flex flex-col gap-x2_5">
        <text className="t4-bold text-fg-neutral">Runtime</text>
        <InfoRow label="lynx.__globalProps.theme" value={systemTheme} />
        <InfoRow label="lynx.__globalProps.frontendTheme" value={frontendTheme} />
      </view>

      <SectionTitle>getSeedClassName()</SectionTitle>
      <view className="p-x3 rounded-r2 border border-stroke-neutral-muted flex flex-col gap-x2">
        <InfoRow label='colorMode: "system"' value={getSafeSeedClassName("system")} />
        <InfoRow label='colorMode: "light-only"' value={getSafeSeedClassName("light-only")} />
        <InfoRow label='colorMode: "dark-only"' value={getSafeSeedClassName("dark-only")} />
      </view>

      <SectionTitle>Theme Overrides</SectionTitle>
      <ThemeSurface title="Global theme" description="No override class. Follows the page theme." />
      <ThemeSurface
        title="Light only"
        description="Uses seed-color-mode-light-only on this subtree."
        className="seed-color-mode-light-only"
      />
      <ThemeSurface
        title="Dark only"
        description="Uses seed-color-mode-dark-only on this subtree."
        className="seed-color-mode-dark-only"
      />

      <SectionTitle>Tailwind Tokens</SectionTitle>
      <TailwindTokenPreview />
      <TailwindTokenPreview className="seed-color-mode-dark-only" />
    </scroll-view>
  );
}
