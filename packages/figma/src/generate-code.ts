import { camelCase } from "change-case";
import { componentHandlerMap, ignoredComponentKeys } from "./component";
import { iconRecord } from "./data/icons";
import { FIGMA_TEXT_STYLES } from "./data/styles";
import { createIconTagNameFromKey, createMonochromeIconColorProps, isIconComponent } from "./icon";
import type { ElementNode } from "./jsx";
import { createElement, stringifyElement } from "./jsx";
import { inferLayoutComponent } from "./layout";
import type {
  NormalizedComponentNode,
  NormalizedFrameNode,
  NormalizedInstanceNode,
  NormalizedRectangleNode,
  NormalizedSceneNode,
  NormalizedTextNode,
} from "./normalizer/types";
import { createBackgroundProps, createBorderProps } from "./props/color";
import { createLayoutProps } from "./props/layout";
import { createSizingProps } from "./props/sizing";
import { createTextProps } from "./props/text";
import { getColorVariableName, getLayoutVariableName, inferDimension } from "./props/variable";
import { compactObject } from "./utils/common";

type PromiseLikeMaybe<T> = Promise<T | undefined> | T | undefined;

export type FigmaNodeHandler = (node: NormalizedSceneNode) => PromiseLikeMaybe<ElementNode>;

type FigmaNodeHandlerFactory<T extends NormalizedSceneNode> = (
  traverse: FigmaNodeHandler,
) => (node: T) => PromiseLikeMaybe<ElementNode>;

export type FrameNodeHandlerFactory = FigmaNodeHandlerFactory<
  NormalizedFrameNode | NormalizedComponentNode | NormalizedInstanceNode
>;

export type TextNodeHandlerFactory = FigmaNodeHandlerFactory<NormalizedTextNode>;

export type RectangleNodeHandlerFactory = FigmaNodeHandlerFactory<NormalizedRectangleNode>;

export type ComponentNodeHandlerFactory = FigmaNodeHandlerFactory<NormalizedComponentNode>;

export type InstanceNodeHandlerFactory = FigmaNodeHandlerFactory<NormalizedInstanceNode>;

const defaultFrameHandler: FrameNodeHandlerFactory = (traverse) => async (node) => {
  const children = node.children;

  const props = {
    ...createLayoutProps(node),
    ...createSizingProps(node),
    ...createBackgroundProps(node),
    ...createBorderProps(node),
  };

  const layoutComponent = inferLayoutComponent(props);

  if (layoutComponent === "Stack") {
    const { flexDirection, ...rest } = props;

    return createElement("Stack", rest, await Promise.all(children.map(traverse)));
  }

  if (layoutComponent === "Inline") {
    const { flexDirection, flexWrap, alignItems, justifyContent, ...rest } = props;

    return createElement("Inline", rest, await Promise.all(children.map(traverse)));
  }

  if (layoutComponent === "Columns") {
    const { flexDirection, flexWrap, justifyContent, ...rest } = props;

    const childrenResult = await Promise.all(children.map(traverse));

    return createElement(
      "Columns",
      rest,
      childrenResult.map((child) => createElement("Column", {}, child)),
    );
  }

  return createElement("Flex", props, await Promise.all(children.map(traverse)));
};

const defaultTextNodeHandler: TextNodeHandlerFactory = () => (node) => {
  const maxLines =
    node.style.textTruncation === "ENDING" ? (node.style.maxLines ?? undefined) : undefined;

  if (node.fills.length > 1) {
    throw new Error("Expected a single fill");
  }

  const onlyFill = node.fills.length === 1 ? node.fills[0] : null;
  const fillBoundVariableId =
    onlyFill && onlyFill.type === "SOLID" ? (onlyFill.boundVariables?.color?.id ?? null) : null;
  const color = fillBoundVariableId ? getColorVariableName(fillBoundVariableId) : undefined;

  const style = FIGMA_TEXT_STYLES.find((s) => s.key === node.textStyleKey);

  if (style) {
    const styleNameSlugs = style.name.split("/");
    const styleName = styleNameSlugs[styleNameSlugs.length - 1]!;
    return createElement(
      "Text",
      compactObject({
        textStyle: camelCase(styleName, { mergeAmbiguousCharacters: true }),
        maxLines,
        color,
      }),
      node.characters.replace(/\n/g, "<br />"),
      color ? "" : "color 프로퍼티는 반영되지 않았습니다.",
    );
  }

  const { fontSize, fontWeight, lineHeight } = createTextProps(node.boundVariables);

  return createElement(
    "Text",
    compactObject({
      fontSize,
      fontWeight,
      lineHeight,
      color,
    }),
    node.characters.replace(/\n/g, "<br />"),
  );
};

const defaultRectangleNodeHandler: RectangleNodeHandlerFactory = () => (node) => {
  return createElement(
    "Box",
    { ...createSizingProps(node), background: "palette.gray200" },
    undefined,
    "Rectangle Node Placeholder",
  );
};

const defaultComponentNodeHandler: ComponentNodeHandlerFactory = (traverse) => async (node) => {
  return defaultFrameHandler(traverse)(node);
};

const defaultInstanceNodeHandler: InstanceNodeHandlerFactory = (traverse) => async (node) => {
  const { componentKey, componentSetKey } = node;

  if (isIconComponent(componentKey)) {
    const iconElement = createElement(createIconTagNameFromKey(componentKey));

    switch (iconRecord[componentKey]?.type) {
      case "monochrome":
        return createElement("Icon", {
          size:
            getLayoutVariableName(node.boundVariables?.size?.x?.id) ??
            inferDimension(node.absoluteBoundingBox?.width ?? 0),
          ...createMonochromeIconColorProps(node),
          svg: iconElement,
        });
      case "multicolor":
        return iconElement;
      default:
        return createElement("Icon", {
          size:
            getLayoutVariableName(node.boundVariables?.size?.x?.id) ??
            inferDimension(node.absoluteBoundingBox?.width ?? 0),
          svg: iconElement,
          ...createMonochromeIconColorProps(node),
        });
    }
  }

  if (ignoredComponentKeys.has(componentSetKey ?? componentKey)) {
    return;
  }

  const componentData = componentSetKey
    ? componentHandlerMap.get(componentSetKey)
    : componentHandlerMap.get(componentKey);

  if (componentData) {
    return componentData.codegen(node);
  }

  // if (node.id === selection.id) {
  return await defaultFrameHandler(traverse)(node);
  // }

  // const mainComponent = node.mainComponent;

  // return createElement(
  //   mainComponent.parent?.type === "COMPONENT_SET"
  //     ? mainComponent.parent.name
  //     : mainComponent.name,
  //   Object.fromEntries(
  //     Object.entries(node.componentProperties)
  //       .filter(([_, props]) => props.type === "VARIANT" || props.type === "TEXT")
  //       .map(([key, props]) => [camelCase(key), camelCase(props.value as string)]),
  //   ),
  //   undefined,
  //   "Custom Component",
  // );
};

export async function generateCode(
  selection: NormalizedSceneNode,
  options?: {
    handlers?: {
      frame?: FrameNodeHandlerFactory;
      text?: TextNodeHandlerFactory;
      rectangle?: RectangleNodeHandlerFactory;
      component?: ComponentNodeHandlerFactory;
      instance?: InstanceNodeHandlerFactory;
    };
  },
) {
  const handlers = {
    frame: defaultFrameHandler,
    text: defaultTextNodeHandler,
    rectangle: defaultRectangleNodeHandler,
    component: defaultComponentNodeHandler,
    instance: defaultInstanceNodeHandler,
    ...options?.handlers,
  };

  const handleFrameNode = handlers.frame(traverse);
  const handleTextNode = handlers.text(traverse);
  const handleRectangleNode = handlers.rectangle(traverse);
  const handleComponentNode = handlers.component(traverse);
  const handleInstanceNode = handlers.instance(traverse);

  async function traverse(node: NormalizedSceneNode): Promise<ElementNode | undefined> {
    if ("visible" in node && !node.visible) {
      return;
    }

    if (node.type === "FRAME") return await handleFrameNode(node);
    if (node.type === "TEXT") return handleTextNode(node);
    if (node.type === "RECTANGLE") return await handleRectangleNode(node);
    if (node.type === "COMPONENT") return await handleComponentNode(node);
    if (node.type === "INSTANCE") return await handleInstanceNode(node);

    return;
  }

  try {
    const rootEl = await traverse(selection);
    if (!rootEl) {
      return "";
    }
    return stringifyElement(rootEl);
  } catch (e) {
    console.error(e);
    return "";
  }
}
