import type {
  HastNode,
  HastPluginDefinition,
  MdxJsxAttributeUnion,
  MdxJsxFlowElementHast,
} from "satteri";

function jsxChildren(
  node: Readonly<{ children?: readonly HastNode[] }>,
  name: string,
): MdxJsxFlowElementHast[] {
  return (node.children ?? []).filter(
    (child): child is MdxJsxFlowElementHast =>
      child.type === "mdxJsxFlowElement" && child.name === name,
  );
}

function withAttribute(
  node: Readonly<MdxJsxFlowElementHast>,
  name: string,
  value: string | null,
): MdxJsxAttributeUnion[] {
  return [...node.attributes, { type: "mdxJsxAttribute", name, value }];
}

/**
 * 이 문서에서 몇 번째 아코디언 root인지 센다(`Accordions`와 아코디언을 그리는 `*ManualInstallation`). 문서마다
 * `before`에서 0으로 시작해 결과가 컴파일 순서와 무관하다.
 */
const ACCORDION_COUNT = "seedDocsAccordionCount";

/** 이 문서에서 몇 번째 탭 묶음인지 센다(SEED React `ChipTabs`의 `useId` 자리). */
const TABS_COUNT = "seedDocsTabsCount";

/** 안에서 탭 하나를 그리는 MDX 컴포넌트(예제 카드의 미리보기/코드, 블록 코드 파일 탭). */
const TAB_CARDS = [
  "ComponentExample",
  "LynxComponentExample",
  "StackflowExample",
  "BlockCodeTabs",
] as const;

/** 안에서 `Accordions`를 그리는 MDX 컴포넌트(`src/mdx/InstallationSteps.astro`). */
const MANUAL_INSTALLATIONS = [
  "ManualInstallation",
  "LynxManualInstallation",
  "BreezeManualInstallation",
] as const;

/**
 * MDX 탭·아코디언을 정적 마크업으로 그릴 수 있게 컴파일 결과(hast)에 표시를 단다. 원문과 llms 출력(mdast 단계)은 그대로다.
 * `.astro` 컴포넌트는 형제 순서·부모를 모르므로, 그 정보가 필요한 값을 여기서 정한다.
 *
 * - `Tabs > Tab`, 생성된 `CodeBlockTabs > CodeBlockTabsList > CodeBlockTabsTrigger`·`CodeBlockTab`의 첫 항목에
 *   `defaultSelected`를 붙인다(서버 HTML의 처음 선택 상태).
 * - 탭 묶음(`Tabs`·`CodeBlockTabs`와 그 부품, 예제 카드·블록 코드 카드)에 문서 안에서 고유한 `tabsId`를 붙인다
 *   (SEED React `ChipTabs`의 `useId` 자리). list·trigger·panel id와 `aria-controls`·`aria-labelledby`가 이 값으로
 *   만들어진다.
 * - `CodeBlockTab` 안의 `pre`에 `data-code-tab`을 붙인다. 탭 카드가 머리·복사 버튼을 가지므로 그 안의 코드 블록은
 *   카드 없이 `<pre>`만 그린다(기존 React `CodeBlockTabs`가 children을 검사해 하던 일).
 * - `Accordions`와 그 바로 아래 `Accordion`에 문서 안에서 고유한 `rootId`를 붙인다(SEED React의 `useId` 자리).
 *   trigger·content id와 `data-ownedby`가 이 값으로 만들어진다. `*ManualInstallation`은 안에서 그리는 아코디언용으로
 *   같은 값을 `accordionId`로 받는다.
 *
 * rehype-code 뒤에 실행해야 한다.
 */
export function rehypeWidgetMarkers(): HastPluginDefinition {
  return {
    name: "seed-docs-widget-markers",
    before(_root, ctx) {
      ctx.data[ACCORDION_COUNT] = 0;
      ctx.data[TABS_COUNT] = 0;
    },
    mdxJsxFlowElement: {
      filter: ["Tabs", "CodeBlockTabs", "Accordions", ...MANUAL_INSTALLATIONS, ...TAB_CARDS],
      visit(node, ctx) {
        if (node.name === "Accordions" || MANUAL_INSTALLATIONS.some((name) => name === node.name)) {
          const rootId = `a${Number(ctx.data[ACCORDION_COUNT] ?? 0)}`;
          ctx.data[ACCORDION_COUNT] = Number(ctx.data[ACCORDION_COUNT] ?? 0) + 1;
          if (node.name !== "Accordions") {
            ctx.setField(node, "attributes", withAttribute(node, "accordionId", rootId));
            return;
          }
          ctx.setField(node, "attributes", withAttribute(node, "rootId", rootId));
          for (const item of jsxChildren(node, "Accordion")) {
            ctx.setField(item, "attributes", withAttribute(item, "rootId", rootId));
          }
          return;
        }
        const tabsId = `t${Number(ctx.data[TABS_COUNT] ?? 0)}`;
        ctx.data[TABS_COUNT] = Number(ctx.data[TABS_COUNT] ?? 0) + 1;
        if (TAB_CARDS.some((name) => name === node.name)) {
          ctx.setField(node, "attributes", withAttribute(node, "tabsId", tabsId));
          return;
        }
        const list = jsxChildren(node, "CodeBlockTabsList")[0];
        const parts =
          node.name === "Tabs"
            ? [node, ...jsxChildren(node, "Tab")]
            : [
                ...(list ? [list, ...jsxChildren(list, "CodeBlockTabsTrigger")] : []),
                ...jsxChildren(node, "CodeBlockTab"),
              ];
        const first =
          node.name === "Tabs"
            ? [jsxChildren(node, "Tab")[0]]
            : [
                jsxChildren(
                  jsxChildren(node, "CodeBlockTabsList")[0] ?? { children: [] },
                  "CodeBlockTabsTrigger",
                )[0],
                jsxChildren(node, "CodeBlockTab")[0],
              ];
        for (const element of parts) {
          const attributes = withAttribute(element, "tabsId", tabsId);
          ctx.setField(
            element,
            "attributes",
            first.includes(element)
              ? [...attributes, { type: "mdxJsxAttribute", name: "defaultSelected", value: null }]
              : attributes,
          );
        }
      },
    },
    element: {
      filter: ["pre"],
      visit(node, ctx) {
        let parent: Readonly<HastNode> | undefined = ctx.parent(node);
        while (parent && parent.type !== "root") {
          if (parent.type === "mdxJsxFlowElement" && parent.name === "CodeBlockTab") {
            ctx.setProperty(node, "dataCodeTab", "");
            return;
          }
          parent = ctx.parent(parent);
        }
      },
    },
  };
}
