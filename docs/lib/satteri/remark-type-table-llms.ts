import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Generator, TypeTableProps } from "fumadocs-typescript";
import { defineMdastPlugin, type MdastVisitorContext, type MdxJsxFlowElement } from "satteri";
import { renderTypeTableMarkdown } from "@/lib/llms/type-table";

type GenerateTypeTableOptions = NonNullable<Parameters<Generator["generateTypeTable"]>[1]>;

interface RemarkTypeTableLlmsOptions {
  generator: Generator;
  /** `remarkAutoTypeTable`의 입력 컴포넌트 이름. */
  name?: string;
  /** `remarkAutoTypeTable`의 출력 컴포넌트 이름. */
  outputName?: string;
  /** `remarkAutoTypeTable`에 넘긴 것과 같아야 두 pass가 같은 파일을 읽습니다. */
  options?: GenerateTypeTableOptions;
}

/**
 * `captureProps`가 붙이고 `emitLlmsForm`이 떼는 속성. `remarkAutoTypeTable`은 자기가 읽는
 * `path`·`name`·`type`·`cwd`를 소비해 버리고 나머지 속성만 출력 노드로 넘기므로, 그 props를
 * 여기 담아 두어야 변환된 `<TypeTable>`만 보고도 어떤 타입을 그린 표인지 알 수 있습니다.
 */
const CAPTURED_PROPS_ATTRIBUTE = "data-llms-type-table";

function getStringAttribute(node: Readonly<MdxJsxFlowElement>, name: string): string | undefined {
  for (const attribute of node.attributes) {
    if (attribute.type !== "mdxJsxAttribute" || attribute.name !== name) continue;
    if (typeof attribute.value === "string") return attribute.value;
  }

  return undefined;
}

/** `remarkAutoTypeTable`이 입력 노드에서 props를 읽는 규칙을 그대로 따릅니다. */
function readTypeTableProps(node: Readonly<MdxJsxFlowElement>): TypeTableProps {
  const props: TypeTableProps = {};

  for (const attribute of node.attributes) {
    if (attribute.type !== "mdxJsxAttribute") continue;
    if (attribute.name === "cwd") props.cwd = true;
    if (typeof attribute.value !== "string") continue;
    if (attribute.name === "path" || attribute.name === "name" || attribute.name === "type") {
      props[attribute.name] = attribute.value;
    }
  }

  return props;
}

/** 빌드를 세울 때 어느 문서의 어느 표인지 알려 줍니다. */
function describe(context: MdastVisitorContext, id: string | undefined): string {
  const file = context.fileURL ? fileURLToPath(context.fileURL) : "(경로 없음)";

  return id ? `${file}의 ${id}` : file;
}

/** 이것도 `remarkAutoTypeTable`과 같아야 합니다. 어긋나면 두 pass가 서로 다른 파일을 읽습니다. */
function resolveBasePath(
  props: TypeTableProps,
  context: MdastVisitorContext,
  options: GenerateTypeTableOptions,
): string | undefined {
  const declared = props.cwd ? context.data._cwd : options.basePath;
  if (typeof declared === "string") return declared;

  return context.fileURL ? path.dirname(fileURLToPath(context.fileURL)) : undefined;
}

/**
 * `<TypeTable>`이 llms.txt에서 사라지지 않도록, 그 자리에 props 표를 마크다운으로 다시 써
 * 넣는 pass 한 쌍입니다. 목록을 그리는 일은 `lib/llms/type-table.ts`가 맡습니다.
 *
 * `remarkAutoTypeTable`이 만드는 `type` 속성은 Shiki가 색칠한 JSX 소스라, 남겨 두면 하이라이트
 * span이 llms.txt에 통째로 실리고 접으면 자식이 없어 흔적조차 남지 않습니다. 그래서 소비되기
 * 전의 props를 붙잡아 두었다가(`captureProps`) 같은 generator로 표 데이터를 다시 얻어 llms
 * 출력용 형태로 바꿔 답니다(`emitLlmsForm`). generator는 파일 단위로 결과를 캐시하므로 두 번째
 * 호출은 앞선 호출이 채워 둔 캐시를 읽습니다.
 *
 * ## 이 파일을 지울 수 있는 조건
 *
 * upstream `fumadocs-typescript`의 `remarkAutoTypeTable`은 `remarkStringify` 옵션(기본값
 * `true`)으로 직렬화가 읽는 `value`에 `JSON.stringify(doc)`을, 컴파일이 읽는 `data.estree`에
 * JSX를 나눠 담습니다. Satteri의 mdast는 Rust arena라 `MdxJsxAttributeValueExpression`이
 * `value: string` 하나뿐이라 그 분리를 못 하고, 포트는 `remarkStringify`를 두지 않습니다.
 * 0.5.0까지 그렇습니다.
 *
 * 포트가 자기가 만드는 노드에 `data._stringify`를 심거나 그에 준하는 통로를 두면, 이 파일과
 * `app/source.tsx`의 두 등록 지점을 지우고 `typeTableRule`이 그 노드를 직접 받게 하면 됩니다.
 */
export function remarkTypeTableLlms({
  generator,
  name = "auto-type-table",
  outputName = "TypeTable",
  options = {},
}: RemarkTypeTableLlmsOptions) {
  return {
    /** `remarkAutoTypeTable` 앞에 둡니다. 그 뒤로는 입력 노드가 남지 않습니다. */
    captureProps: defineMdastPlugin({
      name: "remark-type-table-llms-capture",
      mdxJsxFlowElement(node, context) {
        if (node.name !== name) return;

        // 속성은 `setProperty`가 받지 않는 키라 노드째 갈아 끼웁니다. spread 사본은 원본의
        // 노드 id를 물려받지 않으므로 satteri가 새 내용으로 읽습니다.
        context.replaceNode(node, {
          ...node,
          attributes: [
            ...node.attributes,
            {
              type: "mdxJsxAttribute",
              name: CAPTURED_PROPS_ATTRIBUTE,
              value: JSON.stringify(readTypeTableProps(node)),
            },
          ],
        });
      },
    }),

    /**
     * `remarkApplyLlmsFilter` 뒤, `remarkLlms` 앞에 둡니다. 앞선 필터가 `<TypeTable>`을
     * children-only로 접어 두므로, 여기서 손대지 못한 노드는 태그째 사라집니다. 그 조용한
     * 누락이 이 버그의 정체였으므로, 표를 그리지 못하는 상황은 모두 빌드를 세웁니다.
     */
    emitLlmsForm: defineMdastPlugin({
      name: "remark-type-table-llms-emit",
      async mdxJsxFlowElement(node, context) {
        if (node.name !== outputName) return;

        const captured = getStringAttribute(node, CAPTURED_PROPS_ATTRIBUTE);
        const id = getStringAttribute(node, "id");
        if (!captured) {
          throw new Error(
            `[remark-type-table-llms] ${describe(context, id)}: <${outputName}>에 captureProps가 남긴 props가 없습니다. ` +
              `MDX에는 <${outputName}>을 직접 쓰지 말고 <${name}>을 쓰고, captureProps가 remarkAutoTypeTable 앞에 있는지 확인하세요.`,
          );
        }

        const props = JSON.parse(captured) as TypeTableProps;
        const docs = await generator.generateTypeTable(props, {
          ...options,
          basePath: resolveBasePath(props, context, options),
        });
        // 태그 하나가 표 여럿으로 갈라지면 노드마다 자기 몫만 그려야 합니다.
        // `remarkAutoTypeTable`이 붙인 `id`가 그 몫을 가리킵니다.
        const doc = docs.find((candidate) => `type-table-${candidate.id}` === id);
        if (!doc) {
          throw new Error(
            `[remark-type-table-llms] ${describe(context, id)}: ${captured}로 만든 표 중 이 노드의 것을 찾지 못했습니다. ` +
              "remarkAutoTypeTable이 붙이는 id 형식이 바뀌었을 수 있습니다.",
          );
        }

        // 표가 비면 그릴 것이 없습니다. 태그를 남겨 그 자리에 표가 있었음을 알립니다 —
        // 접히면 그 자리가 통째로 사라져 문서가 잘린 것처럼 읽힙니다.
        const markdown = renderTypeTableMarkdown(doc) ?? `<${outputName} />`;

        // 표시할 속성이 아니므로 렌더 트리로 넘기지 않습니다.
        context.replaceNode(node, {
          ...node,
          attributes: node.attributes.filter(
            (attribute) =>
              attribute.type !== "mdxJsxAttribute" || attribute.name !== CAPTURED_PROPS_ATTRIBUTE,
          ),
          data: { ...node.data, _stringify: { text: markdown } },
        });
      },
    }),
  };
}
