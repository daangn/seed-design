import { AppBar, useAppBarContext } from "@seed-design/lynx-react-app-bar";

function CenteredTitle({ children }: { children: string }) {
  const { centeredTitlePaddingX } = useAppBarContext("CenteredTitle");

  return (
    <view
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
      <text style={{ fontSize: "17px", fontWeight: "bold", color: "#1a1c20" }}>{children}</text>
    </view>
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
      <text style={{ fontSize: "15px", color: "#1a1c20" }}>{label}</text>
    </AppBar.IconButton>
  );
}

export default function Example() {
  return (
    <view style={{ padding: "16px" }}>
      <AppBar.Root
        style={{
          display: "flex",
          position: "relative",
          height: "56px",
          flexDirection: "row",
          alignItems: "center",
          padding: "0px 8px",
          backgroundColor: "#ffffff",
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
    </view>
  );
}
