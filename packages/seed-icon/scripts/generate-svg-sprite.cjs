const fs = require("fs");
const path = require("path");
const SVGSpriter = require("svg-sprite");

const iconData = require('../data/icondata.json');
const ids = iconData.map(icon => icon[1]);

// const ids = [
//   "icon_add_circle_fill",
//   "icon_add_circle_regular",
//   "icon_add_circle_thin",
// ];

// 1. Create and configure a spriter instance
// ====================================================================
const spriter = new SVGSpriter({
  dest: "out", // Main output directory
  mode: {
    symbol: true,
  },
});

// 2. Add some SVG files to process
// ====================================================================
ids.forEach((id) => {
  console.log(`Adding ${id}.svg`);
  spriter.add(
    path.resolve(`svg/${id}.svg`),
    `${id}.svg`,
    fs.readFileSync(`svg/${id}.svg`, "utf-8"),
  );
});

// 3. Trigger the (asynchronous) compilation process
// ====================================================================
spriter.compile((error, result, data) => {
  // Run through all files that have been created for the `css` mode
  for (const type in result.symbol) {
    // Recursively create directories as needed
    fs.mkdirSync(path.dirname(result.symbol[type].path), { recursive: true });
    // Write the generated resource to disk
    fs.writeFileSync(result.symbol[type].path, result.symbol[type].contents);
  }
});
