const iconData = require('../data/icondata.json');
const fs = require('fs/promises');

const names = iconData.map(icon => icon[1]);

const filePath = "src/typescript/index.d.ts";

const component = `import type { SVGProps } from "react";

type IconName = ${names.map(name => `"${name}"`).join(" | ")};

export type IconProps = SVGProps<SVGSVGElement> & {
	name: IconName;
};
`;

fs.writeFile(filePath, component, 'utf-8');
