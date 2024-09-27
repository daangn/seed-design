import * as React from "react";

import { AlertDialog as UIAlertDialog } from "../../seed-design/ui/alert-dialog";
import { ActionButton } from "../../seed-design/ui/action-button";

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
      <ActionButton onClick={onButtonClick}>Open</ActionButton>
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
