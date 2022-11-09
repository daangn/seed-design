import { Link } from "gatsby";
import React, { useEffect, useState } from "react";

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
      {tableOfContentsItem.items && (
        <ul className={style.list}>
          {tableOfContentsItem.items.map((item) => (
            <TableOfContentsItem
              activeId={activeId}
              key={item.url}
              tableOfContentsItem={item}
            />
          ))}
        </ul>
      )}
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

    const observer = new IntersectionObserver(callback);

    const observe = (item: TableOfContentsItemType) => {
      const element = document.querySelector(item.url);

      if (element) observer.observe(element);
      if (item.items) item.items.forEach(observe);
    };

    tableOfContents.items.forEach(observe);

    return () => observer.disconnect();
  }, [setActiveId]);

  return (
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
  );
}