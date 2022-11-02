import EditIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconEditRegular";
import React from "react";

import * as style from "./EditLink.css";

interface DocumentEditLinkProps {
  slug: string;
}

export default function DocumentEditLink({ slug }: DocumentEditLinkProps) {
  return (
    <a
      className={style.link}
      target="_blank"
      href={`https://github.com/daangn/seed-design/edit/feat/seed-design-web/web/content${slug}.mdx`}
    >
      <EditIcon width={20} />
      <span>Edit this page on github</span>
    </a>
  );
}
