export type LynxExampleLayout = "scroll" | "fill";

export function getExampleLayout(component: string): LynxExampleLayout {
  return component === "keyboard-avoiding-scroll-view" ? "fill" : "scroll";
}
