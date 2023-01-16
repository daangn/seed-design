import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { Link } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableRow,
} from "../../components/mdx/Table";
import PageLayout from "../../components/PageLayout";
import { fadeInFromBottom } from "../../framer-motions";
import * as style from "../../styles/page-styles/get-started.page.css";

export const query = graphql`
  fragment Slug on Mdx {
    frontmatter {
      slug
    }
  }

  query ComponentProgressBoardPage {
    allAllComponentMetaJson(sort: { name: ASC }) {
      nodes {
        name
        description
        platform {
          android {
            path
            status
          }
          ios {
            alias
            path
            status
          }
          react {
            path
            status
          }
          docs {
            style {
              status
              mdx {
                childMdx {
                  ...Slug
                }
              }
            }
            usage {
              status
              mdx {
                childMdx {
                  ...Slug
                }
              }
            }
          }
        }
      }
    }

    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

type ComponentStatus = "todo" | "in-progress" | "done";
type PlatformData = {
  status: ComponentStatus;
  alias?: string;
  path?: string;
};
type DocsData = {
  status: ComponentStatus;
  slug?: string;
};
interface RowProps {
  title: string;
  ios?: PlatformData;
  android?: PlatformData;
  react?: PlatformData;
  usage?: DocsData;
  style?: DocsData;
}

const status: Record<ComponentStatus, string> = {
  todo: "❌",
  "in-progress": "🔨",
  done: "✅",
};

const Row = ({ title, android, ios, react, usage, style }: RowProps) => {
  return (
    <TableRow>
      <TableData>
        <strong>{title}</strong>
      </TableData>
      <TableData>
        <p>{status[usage?.status!]}</p>
        {usage?.slug && <Link to={usage.slug}>Link</Link>}
      </TableData>
      <TableData>
        <p>{status[style?.status!]}</p>
        {style?.slug && <Link to={style.slug}>Link</Link>}
      </TableData>
      <TableData>
        <p>{status[react?.status!]}</p>
        {react?.path && (
          <a href={react.path} target="_blank">
            Link
          </a>
        )}
      </TableData>
      <TableData>
        <p>{status[ios?.status!]}</p>
        <p>{ios?.alias}</p>
        {ios?.path && (
          <a href={ios.path} target="_blank">
            Link
          </a>
        )}
      </TableData>
      <TableData>
        <p>{status[android?.status!]}</p>
        {android?.path && (
          <a href={android.path} target="_blank">
            Link
          </a>
        )}
      </TableData>
    </TableRow>
  );
};

const ComponentProgressBoardPage = ({
  data,
}: {
  data: GatsbyTypes.ComponentProgressBoardPageQuery;
}) => {
  const componentNodes = data.allAllComponentMetaJson.nodes;
  return (
    <PageLayout>
      <motion.div {...fadeInFromBottom}>
        <h1 className={style.title}>컴포넌트 현황판</h1>
        <Table>
          <TableHead>
            <TableRow>
              <TableData>컴포넌트</TableData>
              <TableData>Usage</TableData>
              <TableData>Style</TableData>
              <TableData>React</TableData>
              <TableData>IOS</TableData>
              <TableData>Android</TableData>
            </TableRow>
          </TableHead>

          <TableBody>
            {componentNodes?.map((node) => {
              return (
                <Row
                  key={node?.name}
                  title={node?.name!}
                  ios={{
                    status: node?.platform?.ios?.status! as ComponentStatus,
                    alias: node?.platform?.ios?.alias!,
                    path: node?.platform?.ios?.path!,
                  }}
                  android={{
                    status: node?.platform?.android?.status! as ComponentStatus,
                    path: node?.platform?.android?.path!,
                  }}
                  react={{
                    status: node?.platform?.react?.status! as ComponentStatus,
                    path: node?.platform?.react?.path!,
                  }}
                  usage={{
                    status: node?.platform?.docs?.usage
                      ?.status! as ComponentStatus,
                    slug: node?.platform?.docs?.usage?.mdx?.childMdx
                      ?.frontmatter?.slug!,
                  }}
                  style={{
                    status: node?.platform?.docs?.style
                      ?.status! as ComponentStatus,
                    slug: node?.platform?.docs?.style?.mdx?.childMdx
                      ?.frontmatter?.slug!,
                  }}
                />
              );
            })}
          </TableBody>
        </Table>
      </motion.div>
    </PageLayout>
  );
};

// TODO:
export const Head: HeadFC<Queries.ComponentProgressBoardPageQuery> = ({
  data,
}) => {
  return (
    <>
      <title>Overview - Component Progress Board</title>
      <meta
        property="og:title"
        content={`Seed Design | Overview | Component Progress Board`}
      />
      <meta property="description" content="Component Progress Board." />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
    </>
  );
};

export default ComponentProgressBoardPage;
