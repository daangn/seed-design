import { appBarVariantMap } from "@seed-design/lynx-css/recipes/app-bar";
import { appBarMainVariantMap } from "@seed-design/lynx-css/recipes/app-bar-main";

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
    key: "divider",
    options: appBarVariantMap.divider,
    defaultValue: false,
  },
  {
    key: "layout",
    options: appBarMainVariantMap.layout,
    defaultValue: "titleOnly",
  },
]);

const previewStates = definePreviewStates([]);

type AppBarValues = VariantCatalogValues<typeof variants, typeof previewStates>;

function renderAppBar(values: AppBarValues) {
  const layout = values.layout;
  const withSubtitle = layout === "withSubtitle";

  return (
    <view className="w-full bg-bg-layer-default">
      <AppBar theme={values.theme} tone={values.tone} divider={Boolean(values.divider)}>
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
      <AppBar divider>
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
      <AppBar theme="cupertino" divider>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Centered title" />
        <AppBarRight>
          <AppBarCloseButton />
        </AppBarRight>
      </AppBar>

      <CatalogSectionTitle>Android</CatalogSectionTitle>
      <AppBar theme="android" divider>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Left title" subtitle="with subtitle" />
        <AppBarRight>
          <AppBarCloseButton />
        </AppBarRight>
      </AppBar>

      <CatalogSectionTitle>Transparent tone</CatalogSectionTitle>
      <view className="bg-bg-brand-solid">
        <AppBar theme="cupertino" tone="transparent">
          <AppBarLeft>
            <AppBarBackButton />
          </AppBarLeft>
          <AppBarMain title="Transparent" />
          <AppBarRight>
            <AppBarCloseButton />
          </AppBarRight>
        </AppBar>
      </view>
    </CatalogExamples>
  );
}

export function AppBarPage() {
  return (
    <VariantCatalog variants={variants} previewStates={previewStates} examples={<AppBarExamples />}>
      {(values) => renderAppBar(values)}
    </VariantCatalog>
  );
}
