import { outdent } from "outdent";
import { expect, test } from "vitest";

import { parse } from "./parse";
import YAML from "yaml";

import type { ParsedExpression } from "./types";

test("parse array", () => {
  const yaml = `
  base:
    enabled:
      root:
        height: 31px
        width: 51px
        shadow:
          - 0px 3px 8px 0px rgba(0, 0, 0, 0.15)
          - 0px 1px 3px 0px rgba(0, 0, 0, 0.06)
  `;

  const parsed = parse(YAML.parse(yaml));

  const expected: ParsedExpression = [
    {
      key: {},
      state: [
        {
          key: ["enabled"],
          slot: [
            {
              key: "root",
              property: [
                { key: "height", value: "31px" },
                { key: "width", value: "51px" },
                {
                  key: "shadow",
                  value: [
                    "0px 3px 8px 0px rgba(0, 0, 0, 0.15)",
                    "0px 1px 3px 0px rgba(0, 0, 0, 0.06)",
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  expect(parsed).toEqual(expected);
});

test("parse array with token", () => {
  const yaml = `
  base:
    enabled:
      root:
        height: 31px
        width: 51px
        color: $color.bg.layer-1
        shadow:
          - 0px 3px 8px 0px rgba(0, 0, 0, 0.15)
          - 0px 1px 3px 0px rgba(0, 0, 0, 0.06)
          - $shadow.1
  `;

  const parsed = parse(YAML.parse(yaml));

  const expected: ParsedExpression = [
    {
      key: {},
      state: [
        {
          key: ["enabled"],
          slot: [
            {
              key: "root",
              property: [
                { key: "height", value: "31px" },
                { key: "width", value: "51px" },
                { key: "color", value: { category: "color", group: ["bg"], key: "layer-1" } },
                {
                  key: "shadow",
                  value: [
                    "0px 3px 8px 0px rgba(0, 0, 0, 0.15)",
                    "0px 1px 3px 0px rgba(0, 0, 0, 0.06)",
                    { category: "shadow", group: [], key: "1" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  expect(parsed).toEqual(expected);
});
