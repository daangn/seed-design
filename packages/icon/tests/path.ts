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

tests.forEach(({ from, to, expect }) => {
  test(`generateRelativePath ${from}, ${to}`, () => {
    const relativePath = generateRelativeFilePath(from, to);
    assert.is(relativePath, expect);
  });
});

test.run();
