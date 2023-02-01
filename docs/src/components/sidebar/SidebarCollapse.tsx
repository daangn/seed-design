import type { PropsWithChildren } from "react";
import { useState } from "react";

import * as style from "./SidebarCollapse.css";

const SidebarCollapse = ({
  title,
  children,
}: PropsWithChildren<{
  title: string;
}>) => {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen((prev) => !prev);

  return (
    <ul className={style.container}>
      <div className={style.topContainer} onClick={toggle}>
        <h2 className={style.title}>{title}</h2>
        <ArrowIcon open={open} />
      </div>
      <div className={style.collapseItemContainer({ open })}>
        {open && children}
      </div>
    </ul>
  );
};

const ArrowIcon = ({ open }: { open: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={style.icon({ open })}
  >
    <path
      d="M10.1829 8.65788C10.5813 8.09329 11.4187 8.09329 11.8171 8.65788L14.6506 12.6734C15.1181 13.3359 14.6443 14.25 13.8336 14.25H8.16642C7.35567 14.25 6.88192 13.3359 7.34936 12.6734L10.1829 8.65788Z"
      fill="#D1D3D8"
    />
  </svg>
);

export default SidebarCollapse;
