/** @jsxImportSource @lynx-js/react */
import '@testing-library/jest-dom';
import { getQueriesForElement, render } from '@lynx-js/react/testing-library';
import { expect, test, vi } from 'vitest';

import { App } from '../App.jsx';
import { ThemingPage } from '../pages/ThemingPage.jsx';

function getRenderedQueries() {
  const root = elementTree.root;

  if (!root) {
    throw new Error('Expected Lynx render root to exist.');
  }

  return getQueriesForElement(root);
}

test('App renders the current Lynx catalog home', async () => {
  const cb = vi.fn();

  render(
    <App
      onRender={() => {
        cb(`__MAIN_THREAD__: ${__MAIN_THREAD__}`);
      }}
    />,
  );

  expect(cb).toBeCalledTimes(1);
  expect(cb.mock.calls).toMatchInlineSnapshot(`
    [
      [
        "__MAIN_THREAD__: false",
      ],
    ]
  `);

  const { findByText } = getRenderedQueries();

  expect(await findByText('SEED Design Lynx Catalog')).toBeInTheDocument();
  expect(await findByText('Getting Started')).toBeInTheDocument();
  expect(await findByText('Theming')).toBeInTheDocument();
});

test('ThemingPage renders class-based theme examples', async () => {
  render(<ThemingPage />);

  const { findByText } = getRenderedQueries();

  expect(await findByText('getSeedClassName()')).toBeInTheDocument();
  expect(await findByText('Theme Overrides')).toBeInTheDocument();
  expect(await findByText('Light only')).toBeInTheDocument();
  expect(await findByText('Dark only')).toBeInTheDocument();
  expect(await findByText('Tailwind Tokens')).toBeInTheDocument();
});
