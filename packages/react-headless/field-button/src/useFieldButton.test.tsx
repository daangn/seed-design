import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import type { ReactElement } from "react";

afterEach(cleanup);

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}
