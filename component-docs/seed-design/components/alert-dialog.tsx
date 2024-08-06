import * as React from "react";

import { AlertDialog as UIAlertDialog } from "../ui/alert-dialog";
import { BoxButton } from "../ui/box-button";

export const AlertDialog: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const onInteractOutside = () => {
    setOpen(false);
  };
  const onButtonClick = () => {
    setOpen(true);
  };

  return (
    <>
      <BoxButton onClick={onButtonClick}>Open</BoxButton>
      {open && (
        <UIAlertDialog
          onInteractOutside={onInteractOutside}
          title="Title"
          description="Description"
        />
      )}
    </>
  );
};
