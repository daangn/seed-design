import { lazy, Suspense, useState } from '@lynx-js/react';
import { vars } from '@seed-design/lynx-css/vars';

import { ActionButtonPage } from './pages/ActionButtonPage.jsx';
import { BottomSheetPage } from './pages/BottomSheetPage.jsx';
import { CheckboxPage } from './pages/CheckboxPage.jsx';
import { CSSSelectorTestPage } from './pages/CSSSelectorTestPage.jsx';
import { FoundationColorPage } from './pages/FoundationColorPage.jsx';
import { FoundationTypographyPage } from './pages/FoundationTypographyPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { IconColorPOCPage } from './pages/IconColorPOCPage.jsx';
import { NestedVarsTestPage } from './pages/NestedVarsTestPage.jsx';
import { ProgressCirclePage } from './pages/ProgressCirclePage.jsx';
import { RadioGroupPage } from './pages/RadioGroupPage.jsx';
import { SwitchPage } from './pages/SwitchPage.jsx';
import { TagGroupPage } from './pages/TagGroupPage.jsx';
import { TailwindDemoPage } from './pages/TailwindDemoPage.jsx';
import { ThemingPage } from './pages/ThemingPage.jsx';
import { UseControllableStatePage } from './pages/UseControllableStatePage.jsx';
import { UsePressTapPage } from './pages/UsePressTapPage.jsx';

const LynxConsole = lazy(() => import('lynx-console'));
const FoundationMonochromeIconPage = lazy(async () => ({
  default: (await import('./pages/FoundationMonochromeIconPage.jsx'))
    .FoundationMonochromeIconPage,
}));
const FoundationMulticolorIconPage = lazy(async () => ({
  default: (await import('./pages/FoundationMulticolorIconPage.jsx'))
    .FoundationMulticolorIconPage,
}));

export type Page =
  | 'home'
  | 'theming'
  | 'action-button'
  | 'bottom-sheet'
  | 'checkbox'
  | 'progress-circle'
  | 'radio-group'
  | 'switch'
  | 'tag-group'
  | 'nested-vars-test'
  | 'foundation-color'
  | 'foundation-monochrome-icon'
  | 'foundation-multicolor-icon'
  | 'foundation-typography'
  | 'tailwind-demo'
  | 'css-selector-test'
  | 'icon-color-poc'
  | 'use-controllable-state'
  | 'use-press-tap';

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <view
      bindtap={onBack}
      style={{
        padding: '8px 0',
        marginBottom: '8px',
      }}
    >
      <text style={{ fontSize: '16px', color: vars.$color.fg.brand }}>
        {'← Back'}
      </text>
    </view>
  );
}

// Pages that own their own scroll areas use a fullscreen flex shell.
const FULLSCREEN_PAGES = new Set<Page>([
  'action-button',
  'bottom-sheet',
  'checkbox',
  'progress-circle',
  'radio-group',
  'switch',
  'tag-group',
  'foundation-monochrome-icon',
  'foundation-multicolor-icon',
]);

export function App(props: { onRender?: () => void }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  props.onRender?.();

  if (FULLSCREEN_PAGES.has(currentPage)) {
    return (
      <view
        style={{
          paddingTop: 'calc(16px + env(safe-area-inset-top))',
          paddingBottom: 'env(safe-area-inset-bottom)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <view style={{ paddingLeft: '16px', paddingRight: '16px' }}>
          <BackButton onBack={() => setCurrentPage('home')} />
        </view>
        {currentPage === 'action-button' && <ActionButtonPage />}
        {currentPage === 'bottom-sheet' && <BottomSheetPage />}
        {currentPage === 'checkbox' && <CheckboxPage />}
        {currentPage === 'progress-circle' && <ProgressCirclePage />}
        {currentPage === 'radio-group' && <RadioGroupPage />}
        {currentPage === 'switch' && <SwitchPage />}
        {currentPage === 'tag-group' && <TagGroupPage />}
        <Suspense>
          {currentPage === 'foundation-monochrome-icon' && (
            <FoundationMonochromeIconPage />
          )}
          {currentPage === 'foundation-multicolor-icon' && (
            <FoundationMulticolorIconPage />
          )}
        </Suspense>
        <Suspense>
          <LynxConsole theme="light" />
        </Suspense>
      </view>
    );
  }

  return (
    <scroll-view
      scroll-y
      style={{
        padding: '16px',
        paddingTop: 'calc(16px + env(safe-area-inset-top))',
        paddingBottom: 'calc(16px + env(safe-area-inset-bottom))',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      {currentPage !== 'home' && (
        <BackButton onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'home' && <HomePage navigate={setCurrentPage} />}
      {currentPage === 'theming' && <ThemingPage />}
      {currentPage === 'nested-vars-test' && <NestedVarsTestPage />}
      {currentPage === 'foundation-color' && <FoundationColorPage />}
      {currentPage === 'foundation-typography' && <FoundationTypographyPage />}
      {currentPage === 'tailwind-demo' && <TailwindDemoPage />}
      {currentPage === 'css-selector-test' && <CSSSelectorTestPage />}
      {currentPage === 'icon-color-poc' && <IconColorPOCPage />}
      {currentPage === 'use-controllable-state' && <UseControllableStatePage />}
      {currentPage === 'use-press-tap' && <UsePressTapPage />}
      <Suspense>
        <LynxConsole theme="light" />
      </Suspense>
    </scroll-view>
  );
}
