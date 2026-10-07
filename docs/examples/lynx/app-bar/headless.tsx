import "./styles";

import { AppBar, useAppBarContext } from "@seed-design/lynx-react-app-bar";

function CenteredTitle({ children }: { children: string }) {
  const { centeredTitlePaddingX } = useAppBarContext();

  return (
    <AppBar.Main
      style={{
        display: "flex",
        position: "absolute",
        top: "0px",
        bottom: "0px",
        left: "8px",
        right: "8px",
        paddingLeft: centeredTitlePaddingX,
        paddingRight: centeredTitlePaddingX,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <text
        style={{
          fontSize: "17px",
          fontWeight: "bold",
          color: "var(--seed-color-fg-neutral)",
        }}
      >
        {children}
      </text>
    </AppBar.Main>
  );
}

function TextButton({ label }: { label: string }) {
  return (
    <AppBar.IconButton
      accessibility-label={label}
      style={{
        display: "flex",
        height: "44px",
        padding: "0px 8px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <text style={{ fontSize: "15px", color: "var(--seed-color-fg-neutral)" }}>{label}</text>
    </AppBar.IconButton>
  );
}

export default function Example() {
  return (
    <AppBar.Root
      style={{
        display: "flex",
        width: "100%",
        maxWidth: "375px",
        position: "relative",
        height: "56px",
        flexDirection: "row",
        alignItems: "center",
        padding: "0px 8px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      <CenteredTitle>관심 목록</CenteredTitle>
      <AppBar.Left style={{ display: "flex", flexDirection: "row" }}>
        <TextButton label="뒤로" />
      </AppBar.Left>
      <AppBar.Right style={{ display: "flex", flexDirection: "row", marginLeft: "auto" }}>
        <TextButton label="공유" />
        <TextButton label="편집" />
      </AppBar.Right>
    </AppBar.Root>
  );
}
