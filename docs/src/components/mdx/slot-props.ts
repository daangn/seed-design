import { Fragment, jsx } from "astro/jsx-runtime";

/**
 * JSX로 받은 prop(`<Card icon={<IconFile />}>`)을 Astro named slot으로 옮겨 React 컴포넌트에 넘긴다.
 * MDX의 JSX는 Astro 노드로 컴파일되므로 React 컴포넌트의 prop으로 그대로 넘기면 렌더링할 수 없다.
 * Astro는 named slot을 정적 HTML로 렌더링해 같은 이름의 prop으로 넘겨준다.
 */
export function withSlotProps<Props extends object>(
  Component: (props: Props) => unknown,
  names: (keyof Props & string)[],
) {
  return function SlotProps(props: Props & { children?: unknown }) {
    const rest: Record<string, unknown> = { ...props };
    const slots: unknown[] = [];

    for (const name of names) {
      const value = rest[name];
      if (typeof value !== "object" || value === null) continue;
      delete rest[name];
      slots.push(jsx(Fragment, { slot: name, children: value }));
    }

    return jsx(Component, { ...rest, children: [props.children, ...slots] });
  };
}
