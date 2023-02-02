import type { HeadFC } from "gatsby";
import { graphql, Link } from "gatsby";
import type { PropsWithChildren } from "react";

import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableRow,
} from "../../components/mdx/Table";
import SEO from "../../components/SEO";
import * as progressStyle from "../../styles/page-styles/progress-board.page.css";
import * as t from "../../styles/token.css";

export const query = graphql`
  fragment Slug on Mdx {
    frontmatter {
      slug
    }
  }

  query ComponentProgressBoardPage {
    allComponentMetaJson(sort: { name: ASC }) {
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
            overview {
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
            style {
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
  overview?: DocsData;
}

const TableDataWithStatus = ({
  children,
  status,
}: PropsWithChildren<{ status: ComponentStatus }>) => {
  switch (status) {
    case "todo":
      return (
        <td className={progressStyle.tableDataTodo}>
          <p className={progressStyle.tableDataTodoText}>TO DO</p>
          {children}
        </td>
      );
    case "in-progress":
      return (
        <td className={progressStyle.tableInProgDataress}>
          <p className={progressStyle.tableDataInProgressText}>IN PROGRESS</p>
          {children}
        </td>
      );
    case "done":
      return (
        <td className={progressStyle.tableDataDone}>
          <p className={progressStyle.tableDataDoneText}>DONE</p>
          {children}
        </td>
      );
  }
};

const Row = ({
  title,
  android,
  ios,
  react,
  usage,
  overview,
  style,
}: RowProps) => {
  return (
    <TableRow>
      <TableData>
        <strong>{title}</strong>
      </TableData>
      <TableDataWithStatus status={overview?.status!}>
        {overview?.slug && (
          <Link className={progressStyle.linkText} to={overview.slug}>
            link
          </Link>
        )}
      </TableDataWithStatus>

      <TableDataWithStatus status={usage?.status!}>
        {usage?.slug && (
          <Link className={progressStyle.linkText} to={usage.slug}>
            link
          </Link>
        )}
      </TableDataWithStatus>

      <TableDataWithStatus status={style?.status!}>
        {style?.slug && (
          <Link className={progressStyle.linkText} to={style.slug}>
            link
          </Link>
        )}
      </TableDataWithStatus>

      <TableDataWithStatus status={react?.status!}>
        {react?.path && (
          <a
            href={react.path}
            className={progressStyle.linkText}
            target="_blank"
          >
            link
          </a>
        )}
      </TableDataWithStatus>

      <TableDataWithStatus status={ios?.status!}>
        {ios?.path && (
          <a href={ios.path} className={progressStyle.linkText} target="_blank">
            link
          </a>
        )}
      </TableDataWithStatus>

      <TableDataWithStatus status={android?.status!}>
        {android?.path && (
          <a
            href={android.path}
            className={progressStyle.linkText}
            target="_blank"
          >
            link
          </a>
        )}
      </TableDataWithStatus>
    </TableRow>
  );
};

const ComponentProgressBoardPage = ({
  data,
}: {
  data: GatsbyTypes.ComponentProgressBoardPageQuery;
}) => {
  const componentNodes = data.allComponentMetaJson.nodes;

  const specCount = componentNodes.length;
  const webCount = componentNodes.filter((node: any) => {
    return node?.platform?.react?.status === "done";
  }).length;
  const iosCount = componentNodes.filter((node: any) => {
    return node?.platform?.ios?.status === "done";
  }).length;
  const androidCount = componentNodes.filter((node: any) => {
    return node?.platform?.android?.status === "done";
  }).length;

  return (
    <article className={t.content}>
      <h1 className={progressStyle.title}>컴포넌트 현황판</h1>
      <p className={progressStyle.caption}>전체 컴포넌트의 현황을 파악합니다</p>

      <Table>
        <TableHead>
          <TableRow>
            <TableData>컴포넌트</TableData>
            <TableData>Overview</TableData>
            <TableData>Usage</TableData>
            <TableData>Style</TableData>
            <TableData>React</TableData>
            <TableData>iOS</TableData>
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
                  slug: node?.platform?.docs?.usage?.mdx?.childMdx?.frontmatter
                    ?.slug!,
                }}
                style={{
                  status: node?.platform?.docs?.style
                    ?.status! as ComponentStatus,
                  slug: node?.platform?.docs?.style?.mdx?.childMdx?.frontmatter
                    ?.slug!,
                }}
                overview={{
                  status: node?.platform?.docs?.overview
                    ?.status! as ComponentStatus,
                  slug: node?.platform?.docs?.overview?.mdx?.childMdx
                    ?.frontmatter?.slug!,
                }}
              />
            );
          })}
        </TableBody>
      </Table>

      <h2 className={progressStyle.subTitle}>커버리지</h2>
      <p className={progressStyle.caption}>
        선언된 컴포넌트의 구현 커버리지를 퍼센테이지로 나타냅니다
      </p>

      <Table>
        <TableHead>
          <TableRow>
            <TableData>Web (React)</TableData>
            <TableData>iOS</TableData>
            <TableData>Android</TableData>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableData>
              {Math.floor((webCount / specCount) * 1000) / 10}%
            </TableData>
            <TableData>
              {Math.floor((iosCount / specCount) * 1000) / 10}%
            </TableData>
            <TableData>
              {Math.floor((androidCount / specCount) * 1000) / 10}%
            </TableData>
          </TableRow>
        </TableBody>
      </Table>

      <h2 className={progressStyle.subTitle}>OKR 달성률</h2>
      <p className={progressStyle.caption}>OKR 달성률을 계산합니다</p>

      <Table>
        <TableHead>
          <TableRow>
            <TableData>1Q (50% 목표)</TableData>
            <TableData>1-2Q (100% 목표)</TableData>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableData>
              {okr({
                webComponentCount: webCount,
                iosComponentCount: iosCount,
                androidComponentCount: androidCount,
                totalSpecCount: specCount,
              }) * 2}
              %
            </TableData>
            <TableData>
              {okr({
                webComponentCount: webCount,
                iosComponentCount: iosCount,
                androidComponentCount: androidCount,
                totalSpecCount: specCount,
              })}
              %
            </TableData>
          </TableRow>
        </TableBody>
      </Table>
    </article>
  );
};

// TODO:
export const Head: HeadFC = () => {
  return (
    <SEO
      name={`Component Progress Board`}
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};

export default ComponentProgressBoardPage;

const okr = ({
  webComponentCount,
  iosComponentCount,
  totalSpecCount,
}: {
  webComponentCount: number;
  iosComponentCount: number;
  androidComponentCount: number;
  totalSpecCount: number;
}) => {
  const webCoverage = Math.max(webComponentCount / totalSpecCount);
  const iosCoverage = Math.max(iosComponentCount / totalSpecCount);

  return Math.floor(((webCoverage + iosCoverage) / 2) * 1000) / 10;
};
