import IconBellLine from "@karrotmarket/lynx-monochrome-icon/IconBellLine";
import IconPlusLine from "@karrotmarket/lynx-monochrome-icon/IconPlusLine";
import { appBarVariantMap } from "@seed-design/lynx-css/recipes/app-bar";
import { appBarMainVariantMap } from "@seed-design/lynx-css/recipes/app-bar-main";
import { useSafeArea } from "@seed-design/lynx-react";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import {
  definePreviewStates,
  defineVariantAxes,
  VariantCatalog,
  type VariantCatalogValues,
} from "../components/variant-catalog.jsx";
import {
  AppBar,
  AppBarBackButton,
  AppBarCloseButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
  AppBarSlot,
} from "../seed-design/ui/app-bar";

const variants = defineVariantAxes([
  {
    key: "theme",
    options: appBarVariantMap.theme,
    defaultValue: "cupertino",
  },
  {
    key: "tone",
    options: appBarVariantMap.tone,
    defaultValue: "layer",
  },
  {
    key: "layout",
    options: appBarMainVariantMap.layout,
    defaultValue: "titleOnly",
  },
]);

const previewStates = definePreviewStates([]);

type AppBarValues = VariantCatalogValues<typeof variants, typeof previewStates>;

const INLINE_APP_BAR_STYLE = { "--seed-safe-area-top": "0px" } as Record<string, string>;
const WEB_PREVIEW_SAFE_AREA_TOP = "47px";

function getTopAppBarStyle(safeAreaInsetTop: string) {
  return {
    "--seed-safe-area-top": safeAreaInsetTop.startsWith("env(")
      ? WEB_PREVIEW_SAFE_AREA_TOP
      : safeAreaInsetTop,
  } as Record<string, string>;
}

function renderAppBar(values: AppBarValues) {
  const layout = values.layout;
  const withSubtitle = layout === "withSubtitle";
  const backgroundClassName =
    values.tone === "transparent" ? "w-full bg-bg-brand-solid" : "w-full bg-bg-layer-default";

  return (
    <view className={backgroundClassName}>
      <AppBar theme={values.theme} tone={values.tone} style={INLINE_APP_BAR_STYLE}>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain
          title={values.theme === "android" ? "Android AppBar" : "Cupertino AppBar"}
          subtitle={withSubtitle ? "Subtitle" : undefined}
          layout={layout}
        />
        <AppBarRight>
          <AppBarCloseButton />
        </AppBarRight>
      </AppBar>
    </view>
  );
}

function AppBarExamples() {
  return (
    <CatalogExamples title="AppBar" gap="16px">
      <CatalogSectionTitle>Platform default</CatalogSectionTitle>
      <AppBar style={INLINE_APP_BAR_STYLE}>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="자동 theme" subtitle="SystemInfo.platform 기반" />
        <AppBarRight>
          <AppBarSlot>
            <text className="t4-bold text-fg-brand">Done</text>
          </AppBarSlot>
        </AppBarRight>
      </AppBar>

      <CatalogSectionTitle>Cupertino</CatalogSectionTitle>
      <AppBar theme="cupertino" style={INLINE_APP_BAR_STYLE}>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Centered title" />
        <AppBarRight>
          <AppBarCloseButton />
        </AppBarRight>
      </AppBar>

      <CatalogSectionTitle>Android</CatalogSectionTitle>
      <AppBar theme="android" style={INLINE_APP_BAR_STYLE}>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Left title" subtitle="with subtitle" />
        <AppBarRight>
          <AppBarCloseButton />
        </AppBarRight>
      </AppBar>

      <CatalogSectionTitle>Action count</CatalogSectionTitle>
      <AppBar theme="cupertino" style={INLINE_APP_BAR_STYLE}>
        <AppBarLeft>
          <AppBarBackButton />
          <AppBarIconButton aria-label="알림" icon={<IconBellLine />} />
        </AppBarLeft>
        <AppBarMain title="Left two" />
        <AppBarRight>
          <AppBarCloseButton />
        </AppBarRight>
      </AppBar>
      <AppBar theme="cupertino" style={INLINE_APP_BAR_STYLE}>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Right two" />
        <AppBarRight>
          <AppBarIconButton aria-label="추가" icon={<IconPlusLine />} />
          <AppBarCloseButton />
        </AppBarRight>
      </AppBar>

      <CatalogSectionTitle>Transparent tone</CatalogSectionTitle>
      <view className="bg-bg-brand-solid">
        <AppBar theme="cupertino" tone="transparent" style={INLINE_APP_BAR_STYLE}>
          <AppBarLeft>
            <AppBarBackButton />
          </AppBarLeft>
          <AppBarMain title="Transparent" />
          <AppBarRight>
            <AppBarCloseButton />
          </AppBarRight>
        </AppBar>
        <view className="px-x4 pb-x4">
          <text className="t3-regular text-fg-neutral-inverted">
            AppBar background is transparent over this brand surface.
          </text>
        </view>
      </view>
    </CatalogExamples>
  );
}

export function AppBarPage({ onBack }: { onBack?: () => void }) {
  const { safeAreaInsetTop } = useSafeArea();

  return (
    <view className="flex flex-col flex-1 min-h-0 bg-bg-layer-default">
      <AppBar theme="cupertino" style={getTopAppBarStyle(safeAreaInsetTop)}>
        <AppBarLeft>{onBack ? <AppBarBackButton bindtap={onBack} /> : null}</AppBarLeft>
        <AppBarMain title="AppBar" />
        <AppBarRight />
      </AppBar>
      <VariantCatalog
        variants={variants}
        previewStates={previewStates}
        examples={<AppBarExamples />}
      >
        {(values) => renderAppBar(values)}
      </VariantCatalog>
    </view>
  );
}
