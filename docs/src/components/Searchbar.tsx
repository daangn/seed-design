import SearchIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconSearchFill";
import { AnimatePresence, motion } from "framer-motion";
import { graphql, Link, useStaticQuery } from "gatsby";
import type { ChangeEvent, MouseEvent } from "react";
import { useRef } from "react";
import React, { useEffect, useState } from "react";
import { useFlexSearch } from "react-use-flexsearch";

import Portal from "./Portal";
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
    document.body.style.overflowY = "hidden";
    setOpen(true);
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
    if (open) {
      inputRef.current?.focus();
    }

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
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            exit={{ opacity: 0, y: -10 }}
            ref={containerRef}
            onClick={handleContainerClick}
            className={style.container}
          >
            <div className={style.content}>
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
                      <Link to={slug} key={id} onClick={closeSearchbar}>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default Searchbar;
