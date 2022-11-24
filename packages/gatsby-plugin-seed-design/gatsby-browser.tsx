import "@seed-design/stylesheet/global.css";
import type {
	PluginOptions,
	WrapPageElementBrowserArgs,
	WrapRootElementNodeArgs
} from 'gatsby';
import * as React from 'react';
import { type Options, Wrapper } from './wrapRootElement';

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
