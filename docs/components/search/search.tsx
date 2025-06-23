"use client";

import { create } from "@orama/orama";
import { useDocsSearch } from "fumadocs-core/search/client";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  TagsList,
  TagsListItem,
} from "fumadocs-ui/components/dialog/search";
import type { TagItem, SharedProps } from "fumadocs-ui/contexts/search";
import { type ReactNode, useState } from "react";
import { tokenize } from "./tokenizer";

export interface DefaultSearchDialogProps extends SharedProps {
  defaultTag?: string;

  tags?: TagItem[];

  /**
   * Search API URL
   */
  api?: string;

  footer?: ReactNode;

  /**
   * Allow to clear tag filters
   *
   * @defaultValue false
   */
  allowClear?: boolean;
}

const oramaClient = create({
  schema: { _: "string" },
  components: {
    tokenizer: {
      language: "english",
      tokenize,
    },
  },
});

const initOrama = () => oramaClient;

export default function DefaultSearchDialog({
  defaultTag,
  tags = [],
  api,
  footer,
  allowClear = false,
  ...props
}: DefaultSearchDialogProps): ReactNode {
  const [tag, setTag] = useState(defaultTag);
  const { search, setSearch, query } = useDocsSearch({
    type: "static",
    initOrama,
    from: api,
    tag,
  });

  useOnChange(defaultTag, (v) => {
    setTag(v);
  });

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
        <SearchDialogFooter>
          {tags.length > 0 && (
            <TagsList tag={tag} onTagChange={setTag} allowClear={allowClear}>
              {tags.map((tag) => (
                <TagsListItem key={tag.value} value={tag.value}>
                  {tag.name}
                </TagsListItem>
              ))}
            </TagsList>
          )}
          {footer}
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
