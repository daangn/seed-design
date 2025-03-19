"use client";

import { create } from "@orama/orama";
import { useDocsSearch } from "fumadocs-core/search/client";
import { useOnChange } from "fumadocs-core/utils/use-on-change";
import {
  SearchDialog,
  type SharedProps,
  type TagItem,
  TagsList,
} from "fumadocs-ui/components/dialog/search";
import { type ReactNode, useState } from "react";
import { tokenize } from "./tokenizer";

export interface DefaultSearchDialogProps extends SharedProps {
  defaultTag?: string;

  tags?: TagItem[];

  /**
   * Search API URL
   */
  api?: string;

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
  tags,
  api,
  allowClear = false,
  ...props
}: DefaultSearchDialogProps): ReactNode {
  const [tag, setTag] = useState(defaultTag);
  const { search, setSearch, query } = useDocsSearch(
    {
      type: "static",
      initOrama,
      from: api,
    },
    undefined,
    tag,
  );

  useOnChange(defaultTag, (v) => {
    setTag(v);
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      results={query.data ?? []}
      {...props}
      footer={
        tags ? (
          <TagsList tag={tag} onTagChange={setTag} items={tags} allowClear={allowClear} />
        ) : null
      }
    />
  );
}
