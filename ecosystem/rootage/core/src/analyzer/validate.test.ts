import dedent from "dedent";
import { describe, expect, it } from "bun:test";
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
              root:
                properties:
                  color:
                    type: color
          definitions:
            base:
              enabled:
                root:
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
              root:
                properties:
                  color:
                    type: color
          definitions:
            base:
              enabled:
                root:
                  color: "$color.bg.layer-1"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
  });

  it("should return false if slot is not defined in schema", () => {
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
              root:
                properties:
                  color:
                    type: color
          definitions:
            base:
              enabled:
                container:
                  color: "$color.bg.layer-1"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain('Slot "container" is not defined in schema');
  });

  it("should return false if property is not defined in slot schema", () => {
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
              root:
                properties:
                  color:
                    type: color
          definitions:
            base:
              enabled:
                root:
                  background: "$color.bg.layer-1"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain('Property "background" is not defined in slot "root" schema');
  });

  it("should return false if property type mismatches - literal value", () => {
    const files: SourceFile[] = [
      {
        fileName: "component",
        ast: Authoring.fromString(dedent`
        kind: ComponentSpec
        metadata:
          id: "1"
          name: component
        data:
          schema:
            slots:
              root:
                properties:
                  color:
                    type: color
          definitions:
            base:
              enabled:
                root:
                  color: 8px`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain('Property "color" expects type "color" but got "dimension"');
  });

  it("should return false if property type mismatches - token reference", () => {
    const files: SourceFile[] = [
      {
        fileName: "collection",
        ast: Authoring.fromString(dedent`
        kind: TokenCollections
        metadata:
          id: "1"
          name: collection
        data:
          - name: dimension
            modes:
              - default`),
      },
      {
        fileName: "tokens",
        ast: Authoring.fromString(dedent`
        kind: Tokens
        metadata:
          id: "2"
          name: tokens
        data:
          collection: dimension
          tokens:
            "$dimension.x4":
              values:
                default: 16px`),
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
              root:
                properties:
                  color:
                    type: color
          definitions:
            base:
              enabled:
                root:
                  color: "$dimension.x4"`),
      },
    ];

    const result = validate(buildContext(files));

    expect(result.valid).toEqual(false);
    expect(result.message).toContain('Property "color" expects type "color" but got "dimension"');
  });
});
