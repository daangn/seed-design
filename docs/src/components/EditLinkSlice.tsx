import EditIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconEditRegular";

import * as style from "./EditLinkSlice.css";

interface DocumentEditLinkProps {
  slug: string;
}

/**
 * @param slug ex) /components/checkbox/primitive/
 */

export default function DocumentEditLink({ slug }: DocumentEditLinkProps) {
  return (
    <a
      className={style.link}
      target="_blank"
      href={`https://github.com/daangn/seed-design/edit/main/docs/content${slug}.mdx`}
    >
      <EditIcon width={20} />
      <span>Edit this page on GitHub</span>
    </a>
  );
}
