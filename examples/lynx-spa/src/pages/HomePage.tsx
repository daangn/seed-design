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

export function HomePage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <view style={{ display: 'flex', flexDirection: 'column' }}>
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
      <ListItem title="Theming" onTap={() => navigate('theming')} />
      <ListItem title="ActionButton" onTap={() => navigate('action-button')} />
      <ListItem title="Nested Vars Test (Lynx 3.6+)" onTap={() => navigate('nested-vars-test')} />
    </view>
  );
}
