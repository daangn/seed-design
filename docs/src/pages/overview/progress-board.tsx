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
    allComponentInfoJson(sort: { title: ASC }) {
      nodes {
        title
        primitive {
          status
          path {
            childMdx {
              ...Slug
            }
          }
        }
        items {
          name
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
                path {
                  childMdx {
                    ...Slug
                  }
                }
              }
              usage {
                status
                path {
                  childMdx {
                    ...Slug
                  }
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
  primitive?: DocsData;
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

const Row = ({
  title,
  primitive,
  android,
  ios,
  react,
  usage,
  style,
}: RowProps) => {
  return (
    <TableRow>
      <TableData>
        <strong>{title}</strong>
      </TableData>
      <TableData>
        <p>{status[primitive?.status!]}</p>
        {primitive?.slug && <Link to={primitive.slug}>Link</Link>}
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
  const components = data.allComponentInfoJson.nodes;
  return (
    <PageLayout>
      <motion.div {...fadeInFromBottom}>
        <h1 className={style.title}>컴포넌트 현황판</h1>
        <Table>
          <TableHead>
            <TableRow>
              <TableData>컴포넌트</TableData>
              <TableData>Primitive</TableData>
              <TableData>Style</TableData>
              <TableData>Usage</TableData>
              <TableData>React</TableData>
              <TableData>IOS</TableData>
              <TableData>Android</TableData>
            </TableRow>
          </TableHead>

          <TableBody>
            {components?.map((component) => {
              return (
                <>
                  {component.items?.map((item) => {
                    return (
                      <Row
                        key={item?.name}
                        title={item?.name!}
                        primitive={{
                          status: component.primitive
                            ?.status! as ComponentStatus,
                          slug: component.primitive?.path?.childMdx?.frontmatter
                            ?.slug!,
                        }}
                        ios={{
                          status: item?.platform?.ios
                            ?.status! as ComponentStatus,
                          alias: item?.platform?.ios?.alias!,
                          path: item?.platform?.ios?.path!,
                        }}
                        android={{
                          status: item?.platform?.android
                            ?.status! as ComponentStatus,
                          path: item?.platform?.android?.path!,
                        }}
                        react={{
                          status: item?.platform?.react
                            ?.status! as ComponentStatus,
                          path: item?.platform?.react?.path!,
                        }}
                        usage={{
                          status: item?.platform?.docs?.usage
                            ?.status! as ComponentStatus,
                          slug: item?.platform?.docs?.usage?.path?.childMdx
                            ?.frontmatter?.slug!,
                        }}
                        style={{
                          status: item?.platform?.docs?.style
                            ?.status! as ComponentStatus,
                          slug: item?.platform?.docs?.style?.path?.childMdx
                            ?.frontmatter?.slug!,
                        }}
                      />
                    );
                  })}
                </>
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
