import {
  ChipTabsContent,
  ChipTabsList,
  ChipTabsRoot,
  ChipTabsTrigger,
} from "seed-design/ui/chip-tabs";

export default function ChipTabsVariantNeutralSolid() {
  return (
    <div style={{ width: "100%", maxWidth: "360px" }}>
      <ChipTabsRoot variant="neutralSolid" defaultValue="1">
        <ChipTabsList>
          <ChipTabsTrigger value="1">라벨1</ChipTabsTrigger>
          <ChipTabsTrigger value="2">라벨2</ChipTabsTrigger>
          <ChipTabsTrigger value="3">라벨3</ChipTabsTrigger>
        </ChipTabsList>
        <ChipTabsContent value="1">
          <Content>Content 1</Content>
        </ChipTabsContent>
        <ChipTabsContent value="2">
          <Content>Content 2</Content>
        </ChipTabsContent>
        <ChipTabsContent value="3">
          <Content>Content 3</Content>
        </ChipTabsContent>
      </ChipTabsRoot>
    </div>
  );
}

const Content = (props: React.PropsWithChildren) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "180px",
        backgroundColor: "var(--seed-color-bg-layer-default)",
      }}
    >
      {props.children}
    </div>
  );
};
