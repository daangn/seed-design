import type { Page } from '../App.jsx';

function ListItem({ title, onTap }: { title: string; onTap: () => void }) {
  return (
    <view
      bindtap={onTap}
      style={{
        padding: '14px 12px',
        borderBottomWidth: '1px',
        borderBottomColor: '#eee',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <text style={{ fontSize: '16px', color: '#333' }}>{title}</text>
      <text style={{ fontSize: '16px', color: '#999' }}>{'→'}</text>
    </view>
  );
}

function SectionHeader({ children }: { children: string }) {
  return (
    <text
      style={{
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#999',
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
          color: '#3498db',
        }}
      >
        SEED Design Lynx Catalog
      </text>

      <SectionHeader>Foundation</SectionHeader>
      <ListItem title="Color" onTap={() => navigate('foundation-color')} />
      <ListItem title="Typography" onTap={() => navigate('foundation-typography')} />

      <SectionHeader>Components</SectionHeader>
      <ListItem title="ActionButton" onTap={() => navigate('action-button')} />

      <SectionHeader>Test</SectionHeader>
      <ListItem title="Theming" onTap={() => navigate('theming')} />
      <ListItem title="Nested Vars Test (Lynx 3.6+)" onTap={() => navigate('nested-vars-test')} />
    </scroll-view>
  );
}
