import { camelCase } from "change-case";
import { createBackgroundProps, createBorderProps, createColorProps } from "./color";
import { componentHandlerMap } from "./component";
import { createIconTagNameFromKey, isIconComponent } from "./icon";
import type { ElementNode } from "./jsx";
import { createElement, stringifyElement } from "./jsx";
import { createLayoutProps } from "./layout";
import { createSizingProps } from "./sizing";
import { createBodyProps, createHeadingProps, isBodyText, isHeadingText } from "./text";

export function generateCode(selection: SceneNode) {
  function handleFrameNode(node: FrameNode | InstanceNode | ComponentNode) {
    const children = node.children;

    const autoLayout = node.inferredAutoLayout;
    if (!autoLayout) {
      return createElement("div", {}, children.map(traverse));
    }

    return createElement(
      "Flex",
      {
        ...createLayoutProps(node),
        ...createSizingProps(node),
        ...createBackgroundProps(node),
        ...createBorderProps(node),
      },
      children.map(traverse),
    );
  }

  function handleTextNode(node: TextNode) {
    if (!node.textStyleId) {
      return createElement("span", {}, node.characters);
    }
    if (node.textStyleId === figma.mixed) {
      return createElement("span", {}, node.characters, "Mixed text style is not supported");
    }

    const textStyle = figma.getStyleById(node.textStyleId) as TextStyle;

    if (isHeadingText(textStyle)) {
      return createElement(
        "Heading",
        { ...createHeadingProps(textStyle), ...createColorProps(node) },
        node.characters,
      );
    }

    if (isBodyText(textStyle)) {
      return createElement(
        "Text",
        { ...createBodyProps(textStyle), ...createColorProps(node) },
        node.characters,
      );
    }

    return createElement("span", {}, node.characters);
  }

  function handleRectangleNode(node: RectangleNode) {
    return createElement("div", createSizingProps(node), undefined, "Rectangle");
  }

  function handleComponentNode(node: ComponentNode) {
    return handleFrameNode(node);
  }

  function handleInstanceNode(node: InstanceNode) {
    const mainComponent = node.mainComponent;
    if (!mainComponent) {
      return;
    }

    const componentKey = mainComponent.key;
    const componentSetKey =
      mainComponent.parent?.type === "COMPONENT_SET" ? mainComponent.parent.key : null;

    if (isIconComponent(componentKey)) {
      return createElement("Icon", {
        svg: createElement(createIconTagNameFromKey(componentKey)),
        size: node.width,
        ...createColorProps(node.children[0] as VectorNode),
      });
    }

    const componentData = componentSetKey
      ? componentHandlerMap.get(componentSetKey)
      : componentHandlerMap.get(componentKey);

    if (componentData) {
      return componentData.codegen(node);
    }

    if (node.id === selection.id) {
      return handleFrameNode(node);
    }

    return createElement(
      mainComponent.parent?.type === "COMPONENT_SET"
        ? mainComponent.parent.name
        : mainComponent.name,
      Object.fromEntries(
        Object.entries(node.componentProperties)
          .filter(([_, props]) => props.type === "VARIANT" || props.type === "TEXT")
          .map(([key, props]) => [camelCase(key), camelCase(props.value as string)]),
      ),
      undefined,
      "Custom Component",
    );
  }

  function traverse(node: SceneNode): ElementNode | undefined {
    if (!node.visible) {
      return;
    }

    if (node.type === "FRAME") return handleFrameNode(node);
    if (node.type === "TEXT") return handleTextNode(node);
    if (node.type === "RECTANGLE") return handleRectangleNode(node);
    if (node.type === "COMPONENT") return handleComponentNode(node);
    if (node.type === "INSTANCE") return handleInstanceNode(node);

    return;
  }

  try {
    const rootEl = traverse(selection);
    if (!rootEl) {
      return "";
    }
    return stringifyElement(rootEl);
  } catch (e) {
    console.error(e);
    return "";
  }
}
