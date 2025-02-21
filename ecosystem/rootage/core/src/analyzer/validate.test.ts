import dedent from "dedent";
import { describe, expect, it } from "vitest";
import { Authoring } from "../parser";
import { buildContext } from "./context";
import type { SourceFile } from "./types";
import { validate } from "./validate";

describe("validate", () => {
  it("should return true for valid models", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes: 
              - light
              - dark`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: "#ffffff"
                dark: "#000000"`),
      },
      {
        fileName: "component",
        ast: Authoring.fromString(dedent`
        kind: ComponentSpec
        metadata:
          id: "3"
          name: component
        data:
          schema:
            slots:
              - name: root
                properties:
                  - name: color
                    type: color
          definitions:
            base:
              enabled:
                default:
                  color: "$color.bg.layer-1"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(true);
  });

  it("should return false if token collection is not defined", () => {
    const files: SourceFile[] = [
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: "#ffffff"
                dark: "#000000"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
  });

  it("should return false if mode is not defined in token collection", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes: 
              - light`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: "#ffffff"
                dark: "#000000"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
  });

  it("should return false if referenced token is not defined - Tokens", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes: 
              - light`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: color
          tokens:
            "$color.bg.layer-1":
              values:
                light: $color.bg.layer-2`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
  });

  it("should return false if referenced token is not defined - ComponentSpec", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: color
            modes: 
              - light
              - dark`),
      },
      {
        fileName: "component",
        ast: Authoring.fromString(dedent`
        kind: ComponentSpec
        metadata:
          id: "3"
          name: component
        data:
          schema:
            slots:
              - name: root
                properties:
                  - name: color
                    type: color
          definitions:
            base:
              enabled:
                default:
                  color: "$color.bg.layer-1"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
  });
});
