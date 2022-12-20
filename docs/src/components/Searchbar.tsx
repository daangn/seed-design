import SearchIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconSearchFill";
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
  const searchResults = useFlexSearch(query, index, store);

  const closeSearchbar = () => {
    setOpen(false);
    document.body.style.overflowY = "auto";
  };

  const openSearchbar = () => {
    setOpen(true);
    inputRef.current?.focus();
    document.body.style.overflowY = "hidden";
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = (e.target as HTMLInputElement).value;
    setQuery(query);
  };

  useEffect(() => {
    if (query.length < 2) {
      setItems([]);
      return;
    }
    setItems(searchResults);
  }, [query]);

  useEffect(() => {
    const callback = (e: KeyboardEvent) => {
      if (e.key === "k" && e.metaKey && !open) {
        openSearchbar();
      }

      if (e.key === "k" && e.metaKey && open) {
        closeSearchbar();
      }

      if (e.key === "Escape") {
        closeSearchbar();
      }
    };

    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [open]);

  const handleContainerClick = (e: MouseEvent) => {
    if (containerRef.current !== e.target) {
      return;
    }

    closeSearchbar();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={style.container({ open })}
    >
      <section className={style.content}>
        <div className={style.inputContainer}>
          <SearchIcon className={style.inputLeftIcon} />
          <input
            ref={inputRef}
            value={query}
            onChange={handleInputChange}
            type="text"
            className={style.input({ underline: items.length > 0 })}
          />
        </div>
        {items.length !== 0 && (
          <ul className={style.list}>
            {items.map(({ id, slug, title }) => {
              const titleHighlight = title.replace(
                new RegExp(query, "gi"),
                (match) =>
                  `<span class=${style.listItemHighlight}>${match}</span>`,
              );

              const slugHighlight = slug.replace(
                new RegExp(query, "gi"),
                (match) =>
                  `<span class=${style.listItemHighlight}>${match}</span>`,
              );

              return (
                <Link to={slug} key={id} onClick={close}>
                  <li className={style.listItem}>
                    <p
                      className={style.listItemTitle}
                      dangerouslySetInnerHTML={{ __html: titleHighlight }}
                    />
                    <p
                      className={style.listItemDescription}
                      dangerouslySetInnerHTML={{ __html: slugHighlight }}
                    />
                  </li>
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
