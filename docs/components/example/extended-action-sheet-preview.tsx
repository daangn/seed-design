import { IconEyeSlashLine } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  ExtendedActionSheetContent,
  ExtendedActionSheetGroup,
  ExtendedActionSheetItem,
  ExtendedActionSheetRoot,
  ExtendedActionSheetTrigger,
} from "seed-design/ui/extended-action-sheet";

const ExtendedActionSheetPreview = () => {
  return (
    <ExtendedActionSheetRoot>
      <ExtendedActionSheetTrigger asChild>
        <ActionButton>Open</ActionButton>
      </ExtendedActionSheetTrigger>
      <ExtendedActionSheetContent aria-label="Extended Action Sheet">
        <ExtendedActionSheetGroup>
          <ExtendedActionSheetItem>
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 1
          </ExtendedActionSheetItem>
          <ExtendedActionSheetItem>
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 2
          </ExtendedActionSheetItem>
          <ExtendedActionSheetItem>
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 3
          </ExtendedActionSheetItem>
        </ExtendedActionSheetGroup>
        <ExtendedActionSheetGroup>
          <ExtendedActionSheetItem>
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 4
          </ExtendedActionSheetItem>
          <ExtendedActionSheetItem tone="critical">
            <PrefixIcon svg={<IconEyeSlashLine />} />
            Action 5
          </ExtendedActionSheetItem>
        </ExtendedActionSheetGroup>
      </ExtendedActionSheetContent>
    </ExtendedActionSheetRoot>
  );
};

export default ExtendedActionSheetPreview;
