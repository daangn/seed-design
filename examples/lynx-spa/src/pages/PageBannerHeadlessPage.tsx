import { useState } from "@lynx-js/react";
import {
  getIndependentActionProps,
  PageBanner,
  usePageBannerCloseButton,
  usePageBannerContext,
} from "@seed-design/lynx-react-page-banner";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import "../styles/page-banner-headless.css";

function Message({ title, description }: { title: string; description: string }) {
  const { interactive, pressed } = usePageBannerContext();

  return (
    <view
      className={
        interactive && pressed ? "page-banner-headless-body-pressed" : "page-banner-headless-body"
      }
    >
      <text className="page-banner-headless-title">{title}</text>
      <text className="page-banner-headless-description">{description}</text>
    </view>
  );
}

function CloseButton({ onTap }: { onTap?: () => void }) {
  const { pressed, closeButtonProps } = usePageBannerCloseButton({
    "accessibility-label": "닫기",
    bindtap: onTap,
  });

  return (
    <view
      {...getIndependentActionProps(closeButtonProps)}
      className={pressed ? "page-banner-headless-close-pressed" : "page-banner-headless-close"}
    >
      <text className="page-banner-headless-close-text">✕</text>
    </view>
  );
}

function ActionableExample() {
  const [counts, setCounts] = useState({ root: 0, button: 0, close: 0, dismiss: 0 });
  const [generation, setGeneration] = useState(0);
  const count = (key: keyof typeof counts) => () =>
    setCounts((current) => ({ ...current, [key]: current[key] + 1 }));

  return (
    <view className="page-banner-headless-section">
      <PageBanner.Root
        key={generation}
        className="page-banner-headless-root"
        bindtap={count("root")}
        onDismiss={count("dismiss")}
        accessibility-label="새로운 기능, 탭해서 자세히 보기"
      >
        <Message title="새로운 기능" description="배너를 탭하면 root가 올라갑니다." />
        <PageBanner.Button className="page-banner-headless-action" bindtap={count("button")}>
          <text className="page-banner-headless-action-text">자세히</text>
        </PageBanner.Button>
        <CloseButton onTap={count("close")} />
      </PageBanner.Root>
      <text className="page-banner-headless-log">
        {`root=${counts.root} button=${counts.button} close=${counts.close} dismiss=${counts.dismiss}`}
      </text>
      <view
        className="page-banner-headless-reset"
        bindtap={() => setGeneration((value) => value + 1)}
      >
        <text className="page-banner-headless-reset-text">다시 표시</text>
      </view>
    </view>
  );
}

function ControlledExample() {
  const [open, setOpen] = useState(true);
  const [dismissCount, setDismissCount] = useState(0);

  return (
    <view className="page-banner-headless-section">
      <PageBanner.Root
        className="page-banner-headless-root"
        open={open}
        onDismiss={() => {
          setDismissCount((value) => value + 1);
          setOpen(false);
        }}
      >
        <Message title="안내" description="닫기를 누르면 부모 상태가 바뀝니다." />
        <PageBanner.CloseButton className="page-banner-headless-close" accessibility-label="닫기">
          <text className="page-banner-headless-close-text">✕</text>
        </PageBanner.CloseButton>
      </PageBanner.Root>
      <text className="page-banner-headless-log">{`open=${open} dismiss=${dismissCount}`}</text>
      <view className="page-banner-headless-reset" bindtap={() => setOpen((value) => !value)}>
        <text className="page-banner-headless-reset-text">외부에서 열기/닫기</text>
      </view>
    </view>
  );
}

export function PageBannerHeadlessPage() {
  return (
    <CatalogExamples title="PageBanner (Headless)" gap="12px">
      <CatalogSectionTitle>Actionable · Button · CloseButton 독립 action</CatalogSectionTitle>
      <ActionableExample />
      <CatalogSectionTitle>Controlled dismiss</CatalogSectionTitle>
      <ControlledExample />
    </CatalogExamples>
  );
}
