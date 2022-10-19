import NoteIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconNoteRegular";
import clsx from "clsx";
import { Link } from "gatsby";
import React from "react";

import * as style from "./ContentCard.css";

interface ContentCardProps {
  content: GatsbyTypes.ContentsQuery["allMdx"]["nodes"][0];
  currentSlug?: string;
}

export default function ContentCard({
  content,
  currentSlug,
}: ContentCardProps) {
  const { frontmatter } = content;
  const highlight = currentSlug ? currentSlug === frontmatter?.slug : false;

  if (!frontmatter || !frontmatter.slug) {
    return null;
  }

  return (
    <Link to={frontmatter.slug}>
      <div className={clsx(style.contentCard({ highlight }))}>
        <NoteIcon width={20} />
        <h1>{frontmatter.slug}</h1>
      </div>
    </Link>
  );
}
