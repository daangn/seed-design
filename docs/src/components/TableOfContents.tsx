import { motion } from "framer-motion";
import { Link } from "gatsby";
import React, { useEffect, useState } from "react";

import { fadeInFromBottom } from "../framer-motions";
import * as style from "./TableOfContents.css";

export type TableOfContentsItemType = {
  url: string;
  title: string;
  items?: TableOfContentsItemType[];
};

export type TableOfContentsType = {
  items: TableOfContentsItemType[];
};

const TableOfContentsItem: React.FC<{
  tableOfContentsItem: TableOfContentsItemType;
  activeId: string;
}> = ({ tableOfContentsItem, activeId }) => {
  return (
    <>
      <li
        id={tableOfContentsItem.url}
        className={style.listItem({
          active: activeId === tableOfContentsItem.url,
        })}
      >
        <Link to={tableOfContentsItem.url} className={style.link}>
          {tableOfContentsItem.title}
        </Link>
      </li>
      {/* NOTE: This is for nested items */}
      {/* {tableOfContentsItem.items && (
        <ul className={style.list}>
          {tableOfContentsItem.items.map((item) => (
            <TableOfContentsItem
              activeId={activeId}
              key={item.url}
              tableOfContentsItem={item}
            />
          ))}
        </ul>
      )} */}
    </>
  );
};

export default function TableOfContents({
  tableOfContents,
}: {
  tableOfContents: TableOfContentsType;
}) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveId(`#${entry.target.id}`);
      });
    };

    const option: IntersectionObserverInit = {
      rootMargin: "0px 0px -80% 0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(callback, option);

    const observe = (item: TableOfContentsItemType) => {
      const element = document.querySelector(item.url);

      if (element) observer.observe(element);

      // NOTE: This is for nested items
      // if (item.items) item.items.forEach(observe);
    };

    tableOfContents.items.forEach(observe);

    return () => observer.disconnect();
  }, [setActiveId]);

  return (
    <motion.div {...fadeInFromBottom}>
      <nav className={style.nav}>
        <h2 className={style.title}>ON THIS PAGE</h2>
        <ul className={style.list}>
          {tableOfContents.items.map((item) => (
            <TableOfContentsItem
              key={item.url}
              activeId={activeId}
              tableOfContentsItem={item}
            />
          ))}
        </ul>
      </nav>
    </motion.div>
  );
}
