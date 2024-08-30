"use client";

import "@seed-design/stylesheet/dialog.css";

import * as React from "react";
import { dialog } from "@seed-design/recipe/dialog";

import { BoxButton } from "./box-button";

export type AlertDialogProps = {
  title: string;
  description: string;
  onInteractOutside?: React.MouseEventHandler;
};

/**
 * @see https://component.seed-design.io/components/alert-dialog
 */
export const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  description,
  onInteractOutside,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);

  const popLock = React.useRef(false);

  const onClickOutside: React.MouseEventHandler = (e) => {
    onInteractOutside?.(e);

    if (e.defaultPrevented) {
      return;
    }

    if (popLock.current) {
      return;
    }
    popLock.current = true;
  };
  const onClickContent: React.MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  const classNames = dialog();

  return (
    <div
      ref={containerRef}
      role="alertdialog"
      className={classNames.container}
      onClick={onClickOutside}
    >
      <div ref={backdropRef} className={classNames.backdrop} />
      <div onClick={onClickContent} className={classNames.content}>
        <div className={classNames.header}>
          <h2 className={classNames.title}>{title}</h2>
          <p className={classNames.description}>{description}</p>
        </div>
        <div className={classNames.footer}>
          <BoxButton className={classNames.action}>lol</BoxButton>
          <BoxButton className={classNames.action}>lol</BoxButton>
        </div>
      </div>
    </div>
  );
};
AlertDialog.displayName = "AlertDialog";
