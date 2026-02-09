import { describe, it, expect } from "bun:test";

import { fonts } from "../src";

describe("fonts", () => {
  it("fonts scheme - default", () => {
    expect(fonts.default.scheme).toMatchSnapshot();
  });

  it("semantic fonts scheme - default", () => {
    expect(fonts.default.semanticScheme).toMatchSnapshot();
  });
});
