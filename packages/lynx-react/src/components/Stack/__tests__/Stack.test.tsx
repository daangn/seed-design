import "@testing-library/jest-dom";
import { getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { vars } from "@seed-design/lynx-css/vars";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { Text } from "../../Text";
import { HStack, VStack } from "../Stack";

const currentDir = dirname(fileURLToPath(import.meta.url));
const stackSource = readFileSync(join(currentDir, "..", "Stack.tsx"), "utf8");

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

describe("Stack", () => {
  it("renders native view directly instead of importing Box", () => {
    expect(stackSource).not.toContain('from "../Box"');
    expect(stackSource).toContain("<view");
  });

  it("renders VStack as a flex column with layout aliases", () => {
    render(
      <VStack className="stack-test" gap="x2" align="center" justify="spaceBetween">
        <Text>Stack content</Text>
      </VStack>,
    );

    const { getByText } = getRenderedQueries();
    const stack = getByText("Stack content").parentElement;

    expect(stack).toHaveClass("stack-test");
    expect(stack).toHaveStyle({
      display: "flex",
      flexDirection: "column",
      gap: vars.$dimension.x2,
      alignItems: "center",
      justifyContent: "space-between",
    });
  });

  it("renders HStack as a flex row with wrapping and flex aliases", () => {
    render(
      <HStack className="stack-test" gap="x1" wrap grow shrink={false}>
        <Text>Stack content</Text>
      </HStack>,
    );

    const { getByText } = getRenderedQueries();
    const stack = getByText("Stack content").parentElement;

    expect(stack).toHaveClass("stack-test");
    expect(stack).toHaveStyle({
      display: "flex",
      flexDirection: "row",
      gap: vars.$dimension.x1,
      flexWrap: "wrap",
      flexGrow: "1",
      flexShrink: "0",
    });
  });
});
