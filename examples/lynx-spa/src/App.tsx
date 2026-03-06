import ActionButton from "./components/action-button";

export function App(props: { onRender?: () => void }) {
  props.onRender?.();

  return (
    <view
      style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
    >
      <text>Hello, Lynx</text>

      <ActionButton>Hello</ActionButton>
    </view>
  );
}
