import fs from "fs";

const fileKey = "uHRm9RZuaFbFCkRnO07Sfo";
const nodeId = "4:74307";

const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`, {
  headers: {
    "X-Figma-Token": process.env.FIGMA_API_KEY!,
  },
});

const data = await response.json();

fs.writeFileSync("fixtures/fixture.json", JSON.stringify(data, null, 2));
