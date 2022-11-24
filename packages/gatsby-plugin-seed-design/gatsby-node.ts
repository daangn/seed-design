import { type GatsbyNode } from 'gatsby';

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({
	Joi,
}) => {
	return Joi.object({
		mode: Joi.string()
			.valid('auto', 'light-only', 'dark-only')
			.default('auto'),
	});
};
