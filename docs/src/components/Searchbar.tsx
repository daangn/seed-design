import SearchIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconSearchFill";
import { useCombobox } from "downshift";
import { AnimatePresence, motion } from "framer-motion";
import { graphql, navigate, useStaticQuery } from "gatsby";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useFlexSearch } from "react-use-flexsearch";

import { useSearchbarState } from "../contexts/SearchbarContext";
import Portal from "./Portal";
import * as style from "./Searchbar.css";

const SearchCombobox = () => {
  const { closeSearchbar } = useSearchbarState();
  const [items, setItems] = useState<QueryResultItem[]>([]);

  const {
    getInputProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    inputValue,
  } = useCombobox({
    items,
    itemToString: (item) => (item ? item.name : ""),
    onSelectedItemChange({ selectedItem }) {
      if (!selectedItem) return;
      closeSearchbar();
      navigate(selectedItem.slug);
    },
  });

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
  const searchResults = useFlexSearch(inputValue, index, store);

  useEffect(() => {
    if (inputValue.length < 2) {
      setItems([]);
      return;
    }

    setItems(searchResults);
  }, [inputValue]);

  return (
    <div className={style.content}>
      <div className={style.inputContainer}>
        <SearchIcon className={style.inputLeftIcon} />
        <input
          {...getInputProps({ autoFocus: true })}
          className={style.input({ underline: items.length > 0 })}
          placeholder="Button, Switch, ..."
        />
        <div className={style.inputRight}>
          <kbd>⌘</kbd> + <kbd>K</kbd>
        </div>
      </div>
      <ul
        {...getMenuProps()}
        className={style.list({
          active: items.length > 0,
        })}
      >
        {items.map((item, index) => {
          const { id, slug, name } = item;

          const titleHighlight = name.replace(
            new RegExp(inputValue, "gi"),
            (match) => `<span class=${style.listItemHighlight}>${match}</span>`,
          );

          const slugHighlight = slug.replace(
            new RegExp(inputValue, "gi"),
            (match) => `<span class=${style.listItemHighlight}>${match}</span>`,
          );

          return (
            <li
              key={id}
              className={style.listItem({
                active: highlightedIndex === index,
              })}
              {...getItemProps({ item, index })}
            >
              <p
                className={style.listItemTitle}
                dangerouslySetInnerHTML={{ __html: titleHighlight }}
              />
              <p
                className={style.listItemDescription}
                dangerouslySetInnerHTML={{ __html: slugHighlight }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Searchbar = () => {
  const { open, openSearchbar, closeSearchbar } = useSearchbarState();
  const containerRef = useRef<HTMLDivElement>(null);

  // TODO: custom keyboard hooks
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
            <SearchCombobox />
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default Searchbar;
