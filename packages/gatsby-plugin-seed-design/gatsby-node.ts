import { type GatsbyNode } from 'gatsby';
import { ColorModeValues, DefaultColorModeValue } from '@seed-design/react-theming';

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({
	Joi,
}) => {
	return Joi.object({
		mode: Joi.string()
			.valid(...ColorModeValues)
			.default(DefaultColorModeValue),
	});
};
