import { useState } from '@lynx-js/react';

import { ActionButtonPage } from './pages/ActionButtonPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { ThemingPage } from './pages/ThemingPage.jsx';

export type Page = 'home' | 'theming' | 'action-button';

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <view
      bindtap={onBack}
      style={{
        padding: '8px 0',
        marginBottom: '8px',
      }}
    >
      <text style={{ fontSize: '16px', color: '#3498db' }}>{'← Back'}</text>
    </view>
  );
}

export function App(props: { onRender?: () => void }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  props.onRender?.();

  return (
    <view
      style={{
        padding: '16px',
        paddingTop: 'calc(16px + var(--seed-safe-area-top))',
        paddingBottom: 'calc(16px + var(--seed-safe-area-bottom))',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {currentPage !== 'home' && (
        <BackButton onBack={() => setCurrentPage('home')} />
      )}
      {currentPage === 'home' && <HomePage navigate={setCurrentPage} />}
      {currentPage === 'theming' && <ThemingPage />}
      {currentPage === 'action-button' && <ActionButtonPage />}
    </view>
  );
}
