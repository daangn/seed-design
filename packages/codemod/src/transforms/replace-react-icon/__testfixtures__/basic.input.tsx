// @ts-nocheck

import {
  IconSellRegular,
  IconListFill,
  IconAddFill as AddIconAlias,
} from "@ride-developer/react-icon";
import IconSellFill from "@ride-developer/react-icon/IconSellFill";
import IconAddThin from '@karrotmarket/karrot-ui-icon/lib/react/IconAddThin';
import IconCloseThin from '@karrotmarket/karrot-ui-icon/lib/react/IconCloseThin';
import IconCarRegular from '@karrotmarket/karrot-ui-icon/lib/react/IconCarRegular';

function App() {
  console.log(IconSellRegular);

  return (
    <>
      <IconListFill />
      <IconCloseThin />
      <IconCarRegular />
      <AddIconAlias />
    </>
  );
} 