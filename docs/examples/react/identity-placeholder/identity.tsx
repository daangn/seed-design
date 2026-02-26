import { Grid } from "@seed-design/react";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function IdentityPlaceholderPreview() {
  return (
    <Grid columns={2} gap="x4">
      <IdentityPlaceholder identity="person" />
      <IdentityPlaceholder identity="business" />
    </Grid>
  );
}
