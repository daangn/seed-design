import type { Element, Properties } from "hast";
import type {
  HastNode,
  HastPluginDefinition,
  MdxJsxFlowElementHast,
  MdxJsxTextElementHast,
} from "satteri";

type JsxElement = MdxJsxFlowElementHast | MdxJsxTextElementHast;
type JsxAttribute = JsxElement["attributes"][number];

/**
 * island tree의 노드. 문자열은 텍스트, `{ slot }`은 Astro가 렌더링한 정적 조각이다.
 * props 안의 `{ slot }`도 같은 뜻이다(JSX로 쓴 prop 값).
 */
export type MdxIslandNode =
  | string
  | { slot: string }
  | [name: string, props: Record<string, unknown>, ...children: MdxIslandNode[]];

/** 혼자서도 island가 되는 컴포넌트. 상호작용이 있어 브라우저에서 hydrate해야 한다. */
const ISLAND_ROOTS = new Set([
  "Accordions",
  "BlockPreview",
  "CodeBlockTabs",
  "ComponentExample",
  "DoImage",
  "DontImage",
  "Files",
  "IconLibrary",
  "IconographyMigrationIndex",
  "Image",
  "ImageZoom",
  "StackflowExample",
  "Tabs",
  "TypeTable",
]);

/** root 안에서만 의미가 있는 컴포넌트. 부모의 context나 children 검사에 의존한다. */
const ISLAND_MEMBERS = new Set([
  "Accordion",
  "CodeBlockTab",
  "CodeBlockTabsList",
  "CodeBlockTabsTrigger",
  "File",
  "Folder",
  "Tab",
]);

const ISLAND_IMPORT = `import { MdxIsland as _MdxIsland } from "@/components/mdx-island";
import { MdxIslandRoot as _MdxIslandRoot } from "@/components/mdx-island-root";`;
const ISLAND_NAME = "_MdxIsland";
const ISLAND_ROOT_NAME = "_MdxIslandRoot";

function isJsxElement(node: HastNode): node is JsxElement {
  return node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";
}

function isIslandRoot(node: HastNode): boolean {
  if (node.type === "element") return node.tagName === "pre" || node.tagName === "img";
  return isJsxElement(node) && node.name != null && ISLAND_ROOTS.has(node.name);
}

function isIslandComponent(node: HastNode): boolean {
  return (
    isIslandRoot(node) || (isJsxElement(node) && node.name != null && ISLAND_MEMBERS.has(node.name))
  );
}

function isBlank(node: HastNode): boolean {
  if (node.type === "text") return node.value.trim() === "";
  if (node.type === "mdxFlowExpression" || node.type === "mdxTextExpression") {
    return /^(?:\s|\/\*[\s\S]*?\*\/)*$/.test(node.value);
  }
  return false;
}

function stringAttribute(name: string, value: string): JsxAttribute {
  return { type: "mdxJsxAttribute", name, value };
}

function expressionAttribute(name: string, value: string): JsxAttribute {
  return {
    type: "mdxJsxAttribute",
    name,
    value: { type: "mdxJsxAttributeValueExpression", value },
  };
}

/** JSX 속성을 island props 객체의 소스 코드로 옮긴다. 표현식은 MDX 모듈에서 평가된다. */
function serializeJsxProps(node: JsxElement): string {
  const entries: string[] = [];

  for (const attribute of node.attributes) {
    if (attribute.type === "mdxJsxExpressionAttribute") {
      entries.push(attribute.value);
      continue;
    }

    const key = JSON.stringify(attribute.name);
    if (attribute.value == null) entries.push(`${key}:true`);
    else if (typeof attribute.value === "string") {
      entries.push(`${key}:${JSON.stringify(attribute.value)}`);
    } else {
      entries.push(`${key}:(${attribute.value.value})`);
    }
  }

  return `{${entries.join(",")}}`;
}

function classNameOf(properties: Properties): string | undefined {
  const { className } = properties;
  if (Array.isArray(className)) return className.join(" ");
  return typeof className === "string" ? className : undefined;
}

/** inline style 문자열을 React style 객체의 소스 코드로 옮긴다. */
function serializeStyle(style: string): string {
  const entries = style
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separator = declaration.indexOf(":");
      const property = declaration.slice(0, separator).trim();
      const name = property.startsWith("--")
        ? property
        : property.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
      return `${JSON.stringify(name)}:${JSON.stringify(declaration.slice(separator + 1).trim())}`;
    });

  return `{${entries.join(",")}}`;
}

/** hast element의 속성을 React 컴포넌트가 받는 JSX 속성으로 옮긴다. */
function toJsxAttributes(properties: Properties, omit: string[] = []): JsxAttribute[] {
  const attributes: JsxAttribute[] = [];

  for (const [name, value] of Object.entries(properties)) {
    if (omit.includes(name) || value == null || value === false) continue;

    if (name === "className" || name === "class") {
      const className = classNameOf({ className: value });
      if (className) attributes.push(stringAttribute("className", className));
    } else if (name === "style" && typeof value === "string") {
      attributes.push(expressionAttribute("style", serializeStyle(value)));
    } else if (typeof value === "string") {
      attributes.push(stringAttribute(name, value));
    } else if (Array.isArray(value)) {
      attributes.push(stringAttribute(name, value.join(" ")));
    } else {
      attributes.push(expressionAttribute(name, JSON.stringify(value)));
    }
  }

  return attributes;
}

/** 한 island의 tree 소스와, 그 island가 Astro에 맡기는 slot을 모은다. */
class IslandBuilder {
  readonly slots: JsxElement[] = [];

  /** 정적 조각을 slot으로 옮기고 tree에는 참조만 남긴다. 안쪽의 다른 island는 그대로 변환한다. */
  private slot(nodes: HastNode[]): string {
    const name = `s${this.slots.length}`;
    this.slots.push({
      type: "mdxJsxFlowElement",
      name: "Fragment",
      attributes: [stringAttribute("slot", name)],
      children: nodes.map(transform) as JsxElement["children"],
    });
    return `{slot:${JSON.stringify(name)}}`;
  }

  /** island 컴포넌트는 tree에 남기고, 그 사이의 정적 노드는 이어진 것끼리 한 slot으로 묶는다. */
  children(nodes: readonly HastNode[]): string {
    let out = "";
    let run: HastNode[] = [];
    const flush = () => {
      if (run.some((node) => !isBlank(node))) out += `,${this.slot(run)}`;
      run = [];
    };

    for (const node of nodes) {
      if (isIslandComponent(node)) {
        flush();
        out += `,${this.node(node)}`;
      } else {
        run.push(node);
      }
    }
    flush();

    return out;
  }

  node(node: HastNode): string {
    if (node.type === "element") return this.element(node);
    if (isJsxElement(node)) {
      return `[${JSON.stringify(node.name)},${serializeJsxProps(node)}${this.children(node.children)}]`;
    }
    throw new Error(`island tree에 넣을 수 없는 노드입니다: ${node.type}`);
  }

  private element(node: Element): string {
    if (node.tagName === "img") {
      const { className: _className, class: _class, ...rest } = node.properties;
      const className = classNameOf(node.properties);
      return `["img",${JSON.stringify(className ? { ...rest, className } : rest)}]`;
    }

    // 코드 카드(복사 버튼)는 React가, 하이라이트된 `<pre>`는 Astro가 정적으로 렌더링한다.
    const { title, icon } = node.properties;
    const pre: JsxElement = {
      type: "mdxJsxFlowElement",
      name: "Pre",
      attributes: toJsxAttributes(node.properties, ["title", "icon"]),
      children: node.children as JsxElement["children"],
    };
    const props = JSON.stringify({
      ...(typeof title === "string" ? { title } : {}),
      ...(typeof icon === "string" ? { icon } : {}),
    });

    return `["CodeBlock",${props},${this.slot([pre])}]`;
  }
}

function createIsland(root: HastNode): JsxElement {
  const builder = new IslandBuilder();
  const tree = builder.node(root);

  const type =
    root.type === "element" && root.tagName === "img" ? "mdxJsxTextElement" : "mdxJsxFlowElement";

  // tree 표현식은 MDX 모듈에서 평가되어 JSX 노드를 품을 수 있다. `MdxIslandRoot`가 그것을 slot으로
  // 옮긴 뒤 안쪽의 `<MdxIsland client:visible>`에 넘긴다.
  return {
    type,
    name: ISLAND_ROOT_NAME,
    attributes: [
      { type: "mdxJsxAttribute", name: "server:root", value: null },
      expressionAttribute("tree", `[${tree}]`),
    ],
    children: [
      {
        type,
        name: ISLAND_NAME,
        attributes: [{ type: "mdxJsxAttribute", name: "client:visible", value: null }],
        children: builder.slots,
      },
    ],
  } as JsxElement;
}

/** island root를 island로 바꾼 노드를 돌려준다. 바뀐 것이 없으면 같은 노드를 그대로 돌려준다. */
function transform(node: HastNode): HastNode {
  if (isIslandRoot(node)) return createIsland(node);
  if (!("children" in node)) return node;

  let changed = false;
  const children = node.children.map((child) => {
    const next = transform(child);
    if (next !== child) changed = true;
    return next;
  });

  return changed ? ({ ...node, children } as HastNode) : node;
}

/**
 * 상호작용이 필요한 MDX 조각만 React island로 바꾼다.
 *
 * Astro MDX는 컴포넌트를 하나씩 따로 렌더링해서, `Tabs`·`Tab`처럼 context를 공유하거나 children을
 * 읽는 컴포넌트는 본문 그대로는 동작하지 않는다. 그런 묶음을 `[이름, props, ...children]` tree로
 * 직렬화해 `MdxIsland`(components/mdx-island.tsx)가 한 번에 렌더링하게 하고, 묶음 안의 마크다운은
 * slot으로 남겨 정적 HTML로 유지한다.
 */
export function rehypeMdxIslands(): HastPluginDefinition {
  return {
    name: "seed-docs-mdx-islands",
    after(root, ctx) {
      let islands = 0;

      for (const child of root.children) {
        if (child.type === "mdxjsEsm") continue;
        const next = transform(child);
        if (next === child) continue;
        ctx.replaceNode(child, next);
        islands++;
      }

      if (islands > 0) ctx.prependChild(root, { type: "mdxjsEsm", value: ISLAND_IMPORT });
    },
  };
}
