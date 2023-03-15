import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";

import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableRow,
} from "../../components/mdx/Table";
import ProgressBoardRow from "../../components/progress-board/ProgressBoardRow";
import type { ProgressStatus } from "../../components/progress-board/types";
import SEO from "../../components/SEO";
import * as progressStyle from "../../styles/page-styles/progress-board.page.css";

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
          figma {
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

const ComponentProgressBoardPage = ({
  data,
}: {
  data: GatsbyTypes.ComponentProgressBoardPageQuery;
}) => {
  const componentNodes = data.allComponentMetaJson.nodes;

  const specCount = componentNodes.length;
  const webCount = componentNodes.filter((node) => {
    return node?.platform?.react?.status === "done";
  }).length;
  const iosCount = componentNodes.filter((node) => {
    return node?.platform?.ios?.status === "done";
  }).length;
  const androidCount = componentNodes.filter((node) => {
    return node?.platform?.android?.status === "done";
  }).length;

  return (
    <article className={progressStyle.content}>
      <h1 className={progressStyle.title}>컴포넌트 현황판</h1>
      <p className={progressStyle.captionWithMargin}>
        전체 컴포넌트의 현황을 파악합니다
      </p>

      <Table>
        <TableHead>
          <TableRow>
            <TableData>컴포넌트</TableData>
            <TableData>Spec</TableData>
            <TableData>Overview</TableData>
            <TableData>Usage</TableData>
            <TableData>React</TableData>
            <TableData>iOS</TableData>
            <TableData>Figma</TableData>
            <TableData>Android</TableData>
          </TableRow>
        </TableHead>
        <TableBody>
          {componentNodes?.map((node) => {
            return (
              <ProgressBoardRow
                key={node?.name}
                title={node?.name!}
                overview={{
                  status: node?.platform?.docs?.overview
                    ?.status! as ProgressStatus,
                  slug: node?.platform?.docs?.overview?.mdx?.childMdx
                    ?.frontmatter?.slug!,
                }}
                usage={{
                  status: node?.platform?.docs?.usage
                    ?.status! as ProgressStatus,
                  slug: node?.platform?.docs?.usage?.mdx?.childMdx?.frontmatter
                    ?.slug!,
                }}
                style={{
                  status: node?.platform?.docs?.style
                    ?.status! as ProgressStatus,
                  slug: node?.platform?.docs?.style?.mdx?.childMdx?.frontmatter
                    ?.slug!,
                }}
                react={{
                  status: node?.platform?.react?.status! as ProgressStatus,
                  path: node?.platform?.react?.path!,
                }}
                ios={{
                  status: node?.platform?.ios?.status! as ProgressStatus,
                  alias: node?.platform?.ios?.alias!,
                  path: node?.platform?.ios?.path!,
                }}
                figma={{
                  status: node?.platform?.figma?.status! as ProgressStatus,
                  path: node?.platform?.figma?.path!,
                }}
                android={{
                  status: node?.platform?.android?.status! as ProgressStatus,
                  path: node?.platform?.android?.path!,
                }}
              />
            );
          })}
        </TableBody>
      </Table>

      <h2 className={progressStyle.subTitle}>커버리지</h2>
      <p className={progressStyle.captionNoMargin}>
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
      <p className={progressStyle.captionNoMargin}>OKR 달성률을 계산합니다</p>

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

export const Head: HeadFC = () => {
  return (
    <SEO
      name={`Component Progress Board`}
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};

export default ComponentProgressBoardPage;
