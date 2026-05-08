import { type ReactNode } from '@lynx-js/react';
import { vars } from '@seed-design/lynx-css/vars';

const { $color } = vars;

export function CatalogExamples({
  title,
  gap,
  children,
}: {
  title: string;
  gap?: string;
  children: ReactNode;
}) {
  return (
    <scroll-view
      scroll-y
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '16px',
        ...(gap == null ? {} : { gap }),
      }}
    >
      <text style={{ fontSize: '20px', fontWeight: 'bold' }}>{title}</text>
      {children}
    </scroll-view>
  );
}

export function CatalogSectionTitle({ children }: { children: string }) {
  return (
    <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
      {children}
    </text>
  );
}

export function CatalogSectionHeader({ children }: { children: string }) {
  return (
    <text
      style={{
        fontSize: '14px',
        fontWeight: 'bold',
        marginTop: '16px',
        marginBottom: '8px',
        color: $color.fg.neutralSubtle,
      }}
    >
      {children}
    </text>
  );
}
