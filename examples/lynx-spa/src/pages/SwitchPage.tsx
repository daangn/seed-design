import { useState } from '@lynx-js/react';
import {
  SwitchRoot,
  SwitchControl,
  SwitchThumb,
  SwitchLabel,
} from '@seed-design/lynx-react';

export function SwitchPage() {
  const [controlled, setControlled] = useState(false);

  return (
    <scroll-view scroll-y style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
      <text style={{ fontSize: '20px', fontWeight: 'bold' }}>Switch</text>

      <text style={{ fontSize: '16px', fontWeight: 'bold' }}>Default (uncontrolled)</text>
      <view style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
        <SwitchRoot>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
        </SwitchRoot>
        <SwitchRoot defaultChecked>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
        </SwitchRoot>
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>With Label</text>
      <view style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SwitchRoot defaultChecked>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>알림 받기</SwitchLabel>
        </SwitchRoot>
        <SwitchRoot>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>자동 로그인</SwitchLabel>
        </SwitchRoot>
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>Controlled</text>
      <view style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
        <SwitchRoot checked={controlled} onCheckedChange={setControlled}>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>{controlled ? 'On' : 'Off'}</SwitchLabel>
        </SwitchRoot>
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>Sizes</text>
      <view style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
        <SwitchRoot size="16" defaultChecked>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
        </SwitchRoot>
        <SwitchRoot size="24" defaultChecked>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
        </SwitchRoot>
        <SwitchRoot size="32" defaultChecked>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
        </SwitchRoot>
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>Tones</text>
      <view style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
        <SwitchRoot tone="brand" defaultChecked>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>Brand</SwitchLabel>
        </SwitchRoot>
        <SwitchRoot tone="neutral" defaultChecked>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>Neutral</SwitchLabel>
        </SwitchRoot>
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>Disabled</text>
      <view style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SwitchRoot disabled>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>Disabled Off</SwitchLabel>
        </SwitchRoot>
        <SwitchRoot disabled defaultChecked>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>Disabled On</SwitchLabel>
        </SwitchRoot>
      </view>
    </scroll-view>
  );
}
