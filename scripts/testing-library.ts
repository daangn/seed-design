/**
 * @see https://bun.com/docs/guides/test/testing-library
 */

import { afterEach, expect } from "bun:test";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
