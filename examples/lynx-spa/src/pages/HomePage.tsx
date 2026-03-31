import { vars } from "@seed-design/css/vars";

import type { Page } from '../App.jsx';

const { $color } = vars;

function ListItem({ title, onTap }: { title: string; onTap: () => void }) {
  return (
    <view
      bindtap={onTap}
      style={{
        padding: '14px 12px',
        borderBottomWidth: '1px',
        borderBottomColor: $color.stroke.neutralMuted,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <text style={{ fontSize: '16px', color: $color.fg.neutral }}>{title}</text>
      <text style={{ fontSize: '16px', color: $color.fg.neutralSubtle }}>{'→'}</text>
    </view>
  );
}

function SectionHeader({ children }: { children: string }) {
  return (
    <text
      style={{
        fontSize: '13px',
        fontWeight: 'bold',
        color: $color.fg.neutralSubtle,
        marginTop: '16px',
        marginBottom: '4px',
        paddingLeft: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      {children}
    </text>
  );
}

export function HomePage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <scroll-view scroll-y style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <text
        style={{
          fontSize: '22px',
          fontWeight: 'bold',
          marginBottom: '16px',
          color: $color.fg.brand,
        }}
      >
        SEED Design Lynx Catalog
      </text>

      <SectionHeader>Foundation</SectionHeader>
      <ListItem title="Color" onTap={() => navigate('foundation-color')} />
      <ListItem title="Monochrome Icon" onTap={() => navigate('foundation-monochrome-icon')} />
      <ListItem title="Multicolor Icon" onTap={() => navigate('foundation-multicolor-icon')} />
      <ListItem title="Typography" onTap={() => navigate('foundation-typography')} />

      <SectionHeader>Layout</SectionHeader>
      <ListItem title="Box" onTap={() => navigate('layout-box')} />
      <ListItem title="Flex" onTap={() => navigate('layout-flex')} />
      <ListItem title="VStack / HStack" onTap={() => navigate('layout-stack')} />
      <ListItem title="Text" onTap={() => navigate('layout-text')} />

      <SectionHeader>Components</SectionHeader>
      <ListItem title="ActionButton" onTap={() => navigate('action-button')} />
      <ListItem title="ProgressCircle" onTap={() => navigate('progress-circle')} />

      <SectionHeader>Test</SectionHeader>
      <ListItem title="Theming" onTap={() => navigate('theming')} />
      <ListItem title="Nested Vars Test (Lynx 3.6+)" onTap={() => navigate('nested-vars-test')} />
    </scroll-view>
  );
}
