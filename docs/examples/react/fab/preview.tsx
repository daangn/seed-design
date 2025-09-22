import IconPlusLine from "@karrotmarket/react-monochrome-icon/IconPlusLine";
import { Fab, Icon } from "@seed-design/react";

export default function FabPreview() {
  return (
    <Fab aria-label="Example FAB">
      <Icon svg={<IconPlusLine />} />
    </Fab>
  );
}
