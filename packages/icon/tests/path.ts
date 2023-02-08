import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { generateRelativePath } from '../src/utils/path';

const tests = [
	{
		componentPath: "src",
		spritePath: "assets",
		expect: "../assets"
	},
	{
		componentPath: "src",
		spritePath: "src/assets",
		expect: "./assets"
	},
	{
		componentPath: "src/components",
		spritePath: "src/assets",
		expect: "../assets"
	},
	{
		componentPath: "src/components",
		spritePath: "src/components/assets",
		expect: "./assets"
	},
	{
		componentPath: "src/components",
		spritePath: "",
		expect: "../.."
	},
	{
		componentPath: "",
		spritePath: "",
		expect: "./"
	}
]

tests.forEach(({ componentPath, spritePath, expect }) => {
	test(`generateRelativePath ${componentPath}, ${spritePath}`, () => {
		const relativePath = generateRelativePath(componentPath, spritePath);
		assert.is(relativePath, expect);
	});
});

test.run();
