import multicolorIconData from "@karrotmarket/icon-data/multicolor.json";
import * as MulticolorIcons from "@karrotmarket/lynx-multicolor-icon";

import { VirtualIconGrid } from "../components/icon-virtual-grid.jsx";
import { createIconEntries } from "../utils/icon-data";

const icons = createIconEntries(multicolorIconData, MulticolorIcons);

export function FoundationMulticolorIconPage() {
  return (
    <VirtualIconGrid
      title="Multicolor Icon"
      packageName="@karrotmarket/lynx-multicolor-icon"
      icons={icons}
    />
  );
}
