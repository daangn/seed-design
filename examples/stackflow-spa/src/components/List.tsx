import IconChevronRightFill from "@karrotmarket/react-monochrome-icon/IconChevronRightFill";
import type React from "react";
import * as styles from "./List.css";
import { forwardRef } from "react";

export function List({ children, ...otherProps }: React.PropsWithChildren<{}>) {
  return (
    <div className={styles.root} {...otherProps}>
      {children}
    </div>
  );
}

interface ListItemProps {
  title: string;
  onClick?: () => void;
}

export const ListItem = forwardRef<HTMLButtonElement, ListItemProps>((props, ref) => {
  const { title, onClick, ...otherProps } = props;

  return (
    <button ref={ref} type="button" className={styles.item} onClick={onClick} {...otherProps}>
      <div className={styles.title}>{title}</div>
      <div>
        <IconChevronRightFill className={styles.icon} />
      </div>
    </button>
  );
});
ListItem.displayName = "ListItem";

interface ListItemGroupProps {
  title: string;
}

export const ListItemGroup = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ListItemGroupProps>
>((props, ref) => {
  const { children, title, ...otherProps } = props;

  return (
    <div ref={ref} className={styles.listItemGroup} {...otherProps}>
      <div className={styles.listItemGroupTitle}>{title}</div>
      {children}
    </div>
  );
});
ListItemGroup.displayName = "ListItemGroup";
