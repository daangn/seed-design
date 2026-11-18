import * as React from "@lynx-js/react";
import type { ReactNode } from "@lynx-js/react";

/**
 * children에서 접근성 label로 쓸 텍스트를 모읍니다.
 *
 * Lynx는 `accessibility-element` view의 label을 하위 `<text>`에서 만들지 않습니다(iOS는 비워 두고,
 * Android는 flatten 여부와 접근성 경로에 따라 다릅니다). 그래서 텍스트 children을 가진 컨트롤은
 * 이 값으로 `accessibility-label`을 채웁니다.
 *
 * - 문자열·숫자는 그대로 이어 붙이고, 컴포넌트 요소는 `children`으로 내려가며 요소 경계는 공백으로 나눕니다.
 * - `accessibility-label`이 있는 요소는 그 값을 쓰고 하위로 내려가지 않습니다.
 * - `accessibility-elements-hidden`이 `true`인 요소는 건너뜁니다.
 * - prop으로만 텍스트를 그리는 컴포넌트(예: `title` prop)는 알 수 없으므로 결과에 포함되지 않습니다.
 * - intrinsic 요소(`<text>`, `<view>` 등)는 ReactLynx 컴파일러가 정적 내용을 snapshot에 넣어 런타임 props에
 *   남기지 않습니다. 일부만 읽은 label은 틀린 이름이 되므로, 이런 요소를 만나면 전체 결과를 `undefined`로
 *   돌려 호출자가 명시 `accessibility-label`을 요구하게 합니다.
 *
 * 텍스트가 없거나 알 수 없으면 `undefined`를 반환합니다.
 */
export function getAccessibleText(node: ReactNode): string | undefined {
  const text = collectText(node)?.replace(/\s+/g, " ").trim();
  return text ? text : undefined;
}

/** `null`은 정적 내용을 알 수 없는 intrinsic 요소를 만났다는 뜻입니다. */
function collectText(node: ReactNode): string | null {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    let text = "";
    for (const child of node) {
      const childText = collectText(child);
      if (childText === null) return null;
      text += childText;
    }
    return text;
  }
  if (!React.isValidElement(node)) return "";

  const props = node.props as Record<string, unknown>;
  if (props["accessibility-elements-hidden"] === true) return "";

  const label = props["accessibility-label"];
  if (typeof label === "string" && label.trim() !== "") return ` ${label} `;

  if (typeof node.type === "string") return null;

  const childrenText = collectText(props["children"] as ReactNode);
  return childrenText === null ? null : ` ${childrenText} `;
}

const InsideAccessibilityElementContext = React.createContext(false);

/**
 * 하위 트리가 이미 하나의 접근성 요소(Trigger, 컨트롤 root 등) 안에 있음을 알립니다.
 *
 * 접근성 요소를 중첩하면 iOS는 VoiceOver가 꺼져 있을 때 안쪽을 숨기고, 켜져 있을 때는 바깥 요소를 dummy로
 * 바꿔 `accessibility-value`를 잃습니다. Android는 바깥·안쪽을 모두 노출해 같은 label이 두 번 나옵니다.
 * 이 scope 안의 SEED 컨트롤은 스스로 접근성 요소가 되지 않고, label 텍스트는 접근성 트리에서 숨깁니다.
 */
export function AccessibilityElementScope({ children }: { children?: ReactNode }) {
  return (
    <InsideAccessibilityElementContext.Provider value={true}>
      {children}
    </InsideAccessibilityElementContext.Provider>
  );
}

/** 조상 중에 의미를 소유한 접근성 요소가 있으면 `true`입니다. */
export function useInsideAccessibilityElement(): boolean {
  return React.useContext(InsideAccessibilityElementContext);
}

const hiddenLabelTextProps = {
  "accessibility-element": false,
  "accessibility-elements-hidden": true,
} as const;

/**
 * 접근성 요소의 label과 같은 내용을 그리는 `<text>` slot에 펼칩니다. 조상 접근성 요소가 label을 가지므로
 * 텍스트를 따로 노출하지 않습니다. scope 밖이면 빈 객체입니다.
 */
export function useLabelTextAccessibilityProps(): Partial<typeof hiddenLabelTextProps> {
  return useInsideAccessibilityElement() ? hiddenLabelTextProps : {};
}
