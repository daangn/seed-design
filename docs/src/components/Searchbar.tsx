import { graphql, Link, useStaticQuery } from "gatsby";
import type { ChangeEvent, MouseEvent } from "react";
import { useRef } from "react";
import React, { useEffect, useState } from "react";
import { useFlexSearch } from "react-use-flexsearch";

import * as style from "./Searchbar.css";

const Searchbar = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [items, setItems] = useState<QueryResultItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const data = useStaticQuery(
    graphql`
      query {
        allLocalSearchPages {
          nodes {
            index
            store
          }
        }
      }
    `,
  );

  const index = data.allLocalSearchPages.nodes[0].index;
  const store = data.allLocalSearchPages.nodes[0].store;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = (e.target as HTMLInputElement).value;
    setQuery(query);
  };

  const results = useFlexSearch(query, index, store);

  useEffect(() => {
    if (query.length < 2) {
      setItems([]);
      return;
    }
    setItems(results);
  }, [query]);

  useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey) {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, []);

  const handleContainerClick = (e: MouseEvent) => {
    if (containerRef.current !== e.target) {
      return;
    }

    setOpen(false);
  };

  const close = () => {
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={style.container({ open })}
    >
      <section className={style.content}>
        <input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          type="text"
          className={style.input}
        />
        {items.length !== 0 && (
          <ul className={style.list}>
            {items.map((item) => {
              const content = `${item.title} - ${item.slug}`;
              const highlight = content.replace(
                new RegExp(query, "gi"),
                (match) =>
                  `<span class=${style.listItemHighlight}>${match}</span>`,
              );
              return (
                <Link to={item.slug} key={item.id} onClick={close}>
                  <li
                    className={style.listItem}
                    dangerouslySetInnerHTML={{ __html: highlight }}
                  />
                </Link>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Searchbar;
