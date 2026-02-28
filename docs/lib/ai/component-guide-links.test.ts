import { afterEach, describe, expect, it } from "bun:test";
import {
  clearComponentGuideLinksCache,
  resolveComponentGuideLinks,
  resolveVerifiedLinksForQuery,
} from "./component-guide-links";

const REACT_LLMS_INDEX = `# SEED Design React - LLM Reference

### components

- [Action Button](https://seed-design.io/llms/react/components/action-button.txt)
`;

const DOCS_LLMS_INDEX = `# SEED Design Guidelines - LLM Reference

### components

- [Action Button](https://seed-design.io/llms/docs/components/action-button.txt)
- [Bottom Sheet](https://seed-design.io/llms/docs/components/bottom-sheet.txt)
`;

const getRequestUrl = (input: RequestInfo | URL) =>
  typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

describe("resolveComponentGuideLinks", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    clearComponentGuideLinksCache();
    globalThis.fetch = originalFetch;
  });

  it("returns verified docs/react links parsed from llms documents", async () => {
    globalThis.fetch = (async (input) => {
      const url = getRequestUrl(input);

      if (url === "https://seed-design.io/react/llms.txt") {
        return new Response(REACT_LLMS_INDEX, { status: 200 });
      }

      if (url === "https://seed-design.io/docs/llms.txt") {
        return new Response(DOCS_LLMS_INDEX, { status: 200 });
      }

      if (url === "https://seed-design.io/llms/react/components/action-button.txt") {
        return new Response(
          `# Action Button\nURL: https://seed-design.io/react/components/action-button\n\n본문`,
          { status: 200 },
        );
      }

      if (url === "https://seed-design.io/llms/docs/components/action-button.txt") {
        return new Response(
          `# Action Button\nURL: https://seed-design.io/docs/components/action-button\n\n본문`,
          { status: 200 },
        );
      }

      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    const links = await resolveComponentGuideLinks({
      componentId: "action-button",
      baseUrl: "https://seed-design.io",
    });

    expect(links).toEqual([
      {
        title: "Action Button (Docs)",
        url: "https://seed-design.io/docs/components/action-button",
      },
      {
        title: "Action Button (React)",
        url: "https://seed-design.io/react/components/action-button",
      },
    ]);
  });

  it("filters out non-seed domains from llms URL field", async () => {
    globalThis.fetch = (async (input) => {
      const url = getRequestUrl(input);

      if (url === "https://seed-design.io/react/llms.txt") {
        return new Response(REACT_LLMS_INDEX, { status: 200 });
      }

      if (url === "https://seed-design.io/docs/llms.txt") {
        return new Response(DOCS_LLMS_INDEX, { status: 200 });
      }

      if (url === "https://seed-design.io/llms/react/components/action-button.txt") {
        return new Response(`# Action Button\nURL: https://example.com/react/components/action-button`, {
          status: 200,
        });
      }

      if (url === "https://seed-design.io/llms/docs/components/action-button.txt") {
        return new Response(`# Action Button\nURL: /docs/components/action-button`, { status: 200 });
      }

      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    const links = await resolveComponentGuideLinks({
      componentId: "action-button",
      baseUrl: "https://seed-design.io",
    });

    expect(links).toEqual([
      {
        title: "Action Button (Docs)",
        url: "https://seed-design.io/docs/components/action-button",
      },
    ]);
  });

  it("returns only available links when one side is missing", async () => {
    globalThis.fetch = (async (input) => {
      const url = getRequestUrl(input);

      if (url === "https://seed-design.io/react/llms.txt") {
        return new Response(REACT_LLMS_INDEX, { status: 200 });
      }

      if (url === "https://seed-design.io/docs/llms.txt") {
        return new Response(`# empty`, { status: 200 });
      }

      if (url === "https://seed-design.io/llms/react/components/action-button.txt") {
        return new Response(`# Action Button\nURL: /react/components/action-button`, { status: 200 });
      }

      if (url === "https://seed-design.io/llms/docs/components/action-button.txt") {
        return new Response("not found", { status: 404 });
      }

      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    const links = await resolveComponentGuideLinks({
      componentId: "action-button",
      baseUrl: "https://seed-design.io",
    });

    expect(links).toEqual([
      {
        title: "Action Button (React)",
        url: "https://seed-design.io/react/components/action-button",
      },
    ]);
  });

  it("accepts localhost baseUrl and relative llms URL fields", async () => {
    globalThis.fetch = (async (input) => {
      const url = getRequestUrl(input);

      if (url === "http://localhost:3000/react/llms.txt") {
        return new Response(
          `# index\n\n### components\n\n- [Action Button](http://localhost:3000/llms/react/components/action-button.txt)\n`,
          { status: 200 },
        );
      }

      if (url === "http://localhost:3000/docs/llms.txt") {
        return new Response(
          `# index\n\n### components\n\n- [Action Button](http://localhost:3000/llms/docs/components/action-button.txt)\n`,
          { status: 200 },
        );
      }

      if (url === "http://localhost:3000/llms/react/components/action-button.txt") {
        return new Response(`# Action Button\nURL: /react/components/action-button`, { status: 200 });
      }

      if (url === "http://localhost:3000/llms/docs/components/action-button.txt") {
        return new Response(`# Action Button\nURL: /docs/components/action-button`, { status: 200 });
      }

      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    const links = await resolveComponentGuideLinks({
      componentId: "action-button",
      baseUrl: "http://localhost:3000",
    });

    expect(links).toEqual([
      {
        title: "Action Button (Docs)",
        url: "https://seed-design.io/docs/components/action-button",
      },
      {
        title: "Action Button (React)",
        url: "https://seed-design.io/react/components/action-button",
      },
    ]);
  });

  it("resolves query links from docs/react llms indexes only", async () => {
    globalThis.fetch = (async (input) => {
      const url = getRequestUrl(input);

      if (url === "https://seed-design.io/react/llms.txt") {
        return new Response(
          `${REACT_LLMS_INDEX}\n- [Bottom Sheet](https://seed-design.io/llms/react/components/bottom-sheet.txt)\n`,
          { status: 200 },
        );
      }

      if (url === "https://seed-design.io/docs/llms.txt") {
        return new Response(DOCS_LLMS_INDEX, { status: 200 });
      }

      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    const links = await resolveVerifiedLinksForQuery({
      query: "bottom sheet 사용법",
      baseUrl: "https://seed-design.io",
      limit: 2,
    });

    expect(links).toEqual([
      {
        title: "Bottom Sheet",
        url: "https://seed-design.io/docs/components/bottom-sheet",
      },
      {
        title: "Bottom Sheet",
        url: "https://seed-design.io/react/components/bottom-sheet",
      },
    ]);
  });

  it("resolves query links when llms index uses localhost URLs", async () => {
    globalThis.fetch = (async (input) => {
      const url = getRequestUrl(input);

      if (url === "http://localhost:3000/react/llms.txt") {
        return new Response(
          `# index\n\n### components\n\n- [Action Button](http://localhost:3000/llms/react/components/action-button.txt)\n`,
          { status: 200 },
        );
      }

      if (url === "http://localhost:3000/docs/llms.txt") {
        return new Response(
          `# index\n\n### components\n\n- [Action Button](http://localhost:3000/llms/docs/components/action-button.txt)\n`,
          { status: 200 },
        );
      }

      return new Response("not found", { status: 404 });
    }) as typeof fetch;

    const links = await resolveVerifiedLinksForQuery({
      query: "action button",
      baseUrl: "http://localhost:3000",
      limit: 2,
    });

    expect(links).toEqual([
      {
        title: "Action Button",
        url: "https://seed-design.io/docs/components/action-button",
      },
      {
        title: "Action Button",
        url: "https://seed-design.io/react/components/action-button",
      },
    ]);
  });
});
