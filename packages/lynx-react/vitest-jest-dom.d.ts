import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

// jest-dom 7.0.1까지의 `@testing-library/jest-dom/vitest`는 `Assertion<T>`를 확장한다.
// vitest 5의 `Assertion<R, T>`와 타입 매개변수가 달라 선언이 합쳐지지 않으므로 같은 matcher를 여기서 연결한다.
declare module "vitest" {
  interface Assertion<R extends void | Promise<void> = void, T = unknown>
    extends TestingLibraryMatchers<unknown, R> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<unknown, unknown> {}
}
