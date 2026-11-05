import { expect, it } from "bun:test";
import { legacyReactRedirectRules } from "./legacy-redirects";

const archive = {
  platform: "react",
  version: "v1.2",
  origin: "https://verified.example.pages.dev",
  sourceBranch: "react/v1.2",
  probe: { document: "components/button", registryItem: "ui/button" },
};

it("generates a bounded, query-preserving permanent redirect for a published legacy channel", () => {
  expect(legacyReactRedirectRules([archive])).toEqual([
    {
      ref: "seed_react_v1_2_archive",
      description: "React v1.2 documentation archive",
      enabled: true,
      expression:
        '(http.host eq "v1-2.seed-design.io" and (http.request.uri.path eq "/react" or starts_with(http.request.uri.path, "/react/")))',
      action: "redirect",
      action_parameters: {
        from_value: {
          target_url: {
            expression:
              'concat("https://seed-design.io/react/v1.2", substring(http.request.uri.path, 6))',
          },
          status_code: 308,
          preserve_query_string: true,
        },
      },
    },
  ]);
});

it("does not redirect unregistered channels, modern React or Lynx", () => {
  expect(legacyReactRedirectRules([])).toEqual([]);
  expect(
    legacyReactRedirectRules([
      { ...archive, version: "v2" },
      { ...archive, platform: "lynx", version: "v1" },
    ]),
  ).toEqual([]);
  expect(() => legacyReactRedirectRules([{ ...archive, origin: "" }])).toThrow();
});

it("creates independent rules for the three retained minor channels", () => {
  expect(
    legacyReactRedirectRules(
      ["v1.0", "v1.1", "v1.2"].map((version) => ({
        ...archive,
        version,
        sourceBranch: `react/${version}`,
      })),
    ).map((rule) => rule.ref),
  ).toEqual(["seed_react_v1_0_archive", "seed_react_v1_1_archive", "seed_react_v1_2_archive"]);
});
