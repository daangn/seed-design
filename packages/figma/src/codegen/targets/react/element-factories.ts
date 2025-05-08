import { createElement, type ElementNode } from "@/codegen/core";

const SEED_REACT_IMPORT_PATH = "@seed-design/react";
const LOCAL_SNIPPET_BASE_PATH = "@/seed-design/ui";
const MONOCHROME_ICON_IMPORT_PATH = "@karrotmarket/react-monochrome-icon";
const MULTICOLOR_ICON_IMPORT_PATH = "@karrotmarket/react-multicolor-icon";

type CreateElementArgs = Parameters<typeof createElement>;

export function createSeedReactElement(
  tag: CreateElementArgs[0],
  props?: CreateElementArgs[1],
  children?: CreateElementArgs[2],
  meta?: CreateElementArgs[3],
): ElementNode {
  return createElement(tag, props, children, {
    importPath: SEED_REACT_IMPORT_PATH,
    ...meta,
  });
}

export function createMonochromeIconElement(
  tag: CreateElementArgs[0],
  props?: CreateElementArgs[1],
  children?: CreateElementArgs[2],
  meta?: CreateElementArgs[3],
): ElementNode {
  return createElement(tag, props, children, {
    ...meta,
    importPath: MONOCHROME_ICON_IMPORT_PATH,
  });
}

export function createMulticolorIconElement(
  tag: CreateElementArgs[0],
  props?: CreateElementArgs[1],
  children?: CreateElementArgs[2],
  meta?: CreateElementArgs[3],
): ElementNode {
  return createElement(tag, props, children, { ...meta, importPath: MULTICOLOR_ICON_IMPORT_PATH });
}

export function createLocalSnippetHelper(moduleName: string) {
  function createLocalSnippetElement(
    tag: CreateElementArgs[0],
    props?: CreateElementArgs[1],
    children?: CreateElementArgs[2],
    meta?: CreateElementArgs[3],
  ): ElementNode {
    return createElement(tag, props, children, {
      importPath: `${LOCAL_SNIPPET_BASE_PATH}/${moduleName}`,
      ...meta,
    });
  }

  return {
    createLocalSnippetElement,
  };
}
