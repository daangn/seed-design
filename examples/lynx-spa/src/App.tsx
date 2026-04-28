import { Suspense, lazy, useState } from '@lynx-js/react';
import { vars } from '@seed-design/lynx-css/vars';

import { ActionButtonPage } from './pages/ActionButtonPage.jsx';
import { BottomSheetPage } from './pages/BottomSheetPage.jsx';
import { CheckboxPage } from './pages/CheckboxPage.jsx';
import { FoundationColorPage } from './pages/FoundationColorPage.jsx';
import { FoundationMonochromeIconPage } from './pages/FoundationMonochromeIconPage.jsx';
import { FoundationMulticolorIconPage } from './pages/FoundationMulticolorIconPage.jsx';
import { FoundationTypographyPage } from './pages/FoundationTypographyPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { TailwindDemoPage } from './pages/TailwindDemoPage.jsx';
import { TestNativeBoxPage } from './pages/TestNativeBoxPage.jsx';
import { TestTailwindBoxPage } from './pages/TestTailwindBoxPage.jsx';
import { NestedVarsTestPage } from './pages/NestedVarsTestPage.jsx';
import { ProgressCirclePage } from './pages/ProgressCirclePage.jsx';
import { RadioGroupPage } from './pages/RadioGroupPage.jsx';
import { SwitchPage } from './pages/SwitchPage.jsx';
import { TagGroupPage } from './pages/TagGroupPage.jsx';
import { ThemingPage } from './pages/ThemingPage.jsx';
import { CSSSelectorTestPage } from './pages/CSSSelectorTestPage.jsx';
import { IconColorPOCPage } from './pages/IconColorPOCPage.jsx';
import { UseControllableStatePage } from './pages/UseControllableStatePage.jsx';
import { UsePressTapPage } from './pages/UsePressTapPage.jsx';

const LynxConsole = lazy(() => import('lynx-console'));

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
  | 'test-native-box'
  | 'test-tailwind-box'
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

// VariantPlayground 를 쓰는 카탈로그 페이지들은 scroll-view 루트 대신 flex column
// fullscreen shell 을 사용한다. preview 가 남은 공간을 flex:1 로 점유하고 controls 가
// 하단 고정되려면 부모가 scroll-view 가 아니어야 함.
const CATALOG_PAGES = new Set<Page>(['checkbox', 'radio-group']);

export function App(props: { onRender?: () => void }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  props.onRender?.();

  if (CATALOG_PAGES.has(currentPage)) {
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
        {currentPage === 'checkbox' && <CheckboxPage />}
        {currentPage === 'radio-group' && <RadioGroupPage />}
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
      {currentPage === 'action-button' && <ActionButtonPage />}
      {currentPage === 'bottom-sheet' && <BottomSheetPage />}
      {currentPage === 'progress-circle' && <ProgressCirclePage />}
      {currentPage === 'switch' && <SwitchPage />}
      {currentPage === 'tag-group' && <TagGroupPage />}
      {currentPage === 'nested-vars-test' && <NestedVarsTestPage />}
      {currentPage === 'foundation-color' && <FoundationColorPage />}
      {currentPage === 'foundation-monochrome-icon' && (
        <FoundationMonochromeIconPage />
      )}
      {currentPage === 'foundation-multicolor-icon' && (
        <FoundationMulticolorIconPage />
      )}
      {currentPage === 'foundation-typography' && <FoundationTypographyPage />}
      {currentPage === 'tailwind-demo' && <TailwindDemoPage />}
      {currentPage === 'test-native-box' && <TestNativeBoxPage />}
      {currentPage === 'test-tailwind-box' && <TestTailwindBoxPage />}
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
