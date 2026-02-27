/**
 * @see https://bun.com/docs/guides/test/testing-library
 */

import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import type { AsymmetricMatchers, Matchers } from "bun:test";

declare module "bun:test" {
  interface Matchers<T> extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
  interface AsymmetricMatchers extends TestingLibraryMatchers {}
}
