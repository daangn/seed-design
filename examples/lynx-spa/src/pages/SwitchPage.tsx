import { useState } from '@lynx-js/react';
import {
  SwitchRoot,
  SwitchControl,
  SwitchThumb,
  SwitchLabel,
} from '@seed-design/lynx-react';

import { Switch, Switchmark } from '../seed-design/ui/switch';

export function SwitchPage() {
  const [controlled, setControlled] = useState(false);

  return (
    <scroll-view scroll-y style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
      <text style={{ fontSize: '20px', fontWeight: 'bold' }}>Switch</text>

      <text style={{ fontSize: '16px', fontWeight: 'bold' }}>Default (uncontrolled)</text>
      <view style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
        <Switchmark />
        <Switchmark defaultChecked />
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>With Label</text>
      <view style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Switch label="알림 받기" defaultChecked />
        <Switch label="자동 로그인" />
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>Controlled</text>
      <view style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
        <Switch label={controlled ? 'On' : 'Off'} checked={controlled} onCheckedChange={setControlled} />
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>Sizes</text>
      <view style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
        <Switchmark size="16" defaultChecked />
        <Switchmark size="24" defaultChecked />
        <Switchmark size="32" defaultChecked />
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>Tones</text>
      <view style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
        <Switch label="Brand" tone="brand" defaultChecked />
        <Switch label="Neutral" tone="neutral" defaultChecked />
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>Disabled</text>
      <view style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Switch label="Disabled Off" disabled />
        <Switch label="Disabled On" disabled defaultChecked />
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Compound: Control override (Root=brand, Control=neutral)
      </text>
      <view style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
        <SwitchRoot tone="brand" defaultChecked>
          <SwitchControl tone="neutral">
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>Override</SwitchLabel>
        </SwitchRoot>
      </view>
    </scroll-view>
  );
}
