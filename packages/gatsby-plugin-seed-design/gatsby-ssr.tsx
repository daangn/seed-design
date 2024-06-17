import "@seed-design/stylesheet/global.css";
import { generateNoFlashScript } from "@seed-design/react-theming";
import type {
  GatsbySSR,
	PluginOptions,
	WrapPageElementBrowserArgs,
	WrapRootElementNodeArgs
} from 'gatsby';
import * as React from 'react';
import { type Options, Wrapper } from './wrapRootElement';

export const onRenderBody: GatsbySSR['onRenderBody'] = ({
  setPreBodyComponents,
  setHtmlAttributes,
  setHeadComponents,
}, pluginOptions: PluginOptions) => {
  const { mode } = pluginOptions as unknown as Options;
  setHtmlAttributes({
    // @ts-ignore
    'data-seed': '',
  });

  setHeadComponents([
    <meta
      key="color-scheme"
      name="color-scheme"
      content={{
        'auto': 'light dark',
        'light-only': 'light',
        'dark-only': 'dark',
      }[mode]}
    />,
  ]);

  setPreBodyComponents([
    <script
      key="seed-design-no-flash"
      id="seed-design-no-flash"
      dangerouslySetInnerHTML={{
        __html: generateNoFlashScript({ mode }),
      }}
    />,
  ]);
};

export const wrapRootElement = ({
	element,
}: (WrapPageElementBrowserArgs | WrapRootElementNodeArgs),
	pluginOptions: PluginOptions,
) => {
	const { mode } = pluginOptions as unknown as Options;
	return (
		<Wrapper mode={mode}>
			{element}
		</Wrapper>
	);
}
