import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function IdentityPlaceholderPreview() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
      <IdentityPlaceholder identity="person" />
      <IdentityPlaceholder identity="business" />
    </div>
  );
}
