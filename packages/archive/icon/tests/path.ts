import { test } from "uvu";
import * as assert from "uvu/assert";

import { generateRelativeFilePath } from "../src/utils/path";

const tests = [
  {
    from: "src",
    to: "assets",
    expect: "../assets",
  },
  {
    from: "src",
    to: "src/assets",
    expect: "./assets",
  },
  {
    from: "src/components",
    to: "src/assets",
    expect: "../assets",
  },
  {
    from: "src/components",
    to: "src/components/assets",
    expect: "./assets",
  },
  {
    from: "src/components",
    to: "",
    expect: "../..",
  },
  {
    from: "",
    to: "",
    expect: "./",
  },
];

for (const t of tests) {
  test(`generateRelativePath ${t.from}, ${t.to}`, () => {
    const relativePath = generateRelativeFilePath(t.from, t.to);
    assert.is(relativePath, t.expect);
  });
}

test.run();
