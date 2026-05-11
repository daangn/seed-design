/** @jsxImportSource @lynx-js/react */
import '@testing-library/jest-dom';
import { fireEvent, render } from '@lynx-js/react/testing-library';
import { expect, test } from 'vitest';

import {
  VariantPlayground,
  type PreviewState,
  type VariantAxis,
} from './variant-playground.jsx';

const booleanVariants: readonly VariantAxis[] = [
  {
    key: 'checked',
    options: [false, true],
    defaultValue: false,
  },
];

test('VariantPlayground renders preview state text', async () => {
  const previewStates: readonly PreviewState[] = [
    { key: 'checked', defaultValue: false },
    { key: 'open', defaultValue: false },
  ];

  const { findByText } = render(
    <VariantPlayground variants={booleanVariants} previewStates={previewStates}>
      {(values) => <text>{String(values.checked)}</text>}
    </VariantPlayground>,
  );

  expect(await findByText('checked=false · open=false')).toBeInTheDocument();
});

test('VariantPlayground updates hidden preview state from child render function', async () => {
  const previewStates: readonly PreviewState[] = [
    { key: 'open', defaultValue: false },
  ];

  const { findByText } = render(
    <VariantPlayground variants={[]} previewStates={previewStates}>
      {(_values, setValue) => (
        <view bindtap={() => setValue('open', true)}>
          <text>Toggle open</text>
        </view>
      )}
    </VariantPlayground>,
  );

  expect(await findByText('open=false')).toBeInTheDocument();

  const triggerText = (await findByText('Toggle open')) as HTMLElement;
  if (triggerText.parentElement == null) {
    throw new Error(
      'Expected trigger text to be rendered inside a tappable view.',
    );
  }

  fireEvent.tap(triggerText.parentElement);

  expect(await findByText('open=true')).toBeInTheDocument();
});
