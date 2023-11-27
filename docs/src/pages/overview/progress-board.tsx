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

  const totalSpecCount = componentNodes.length;

  const figmaComponentCount = componentNodes.filter((node) => {
    return node?.platform?.figma?.status === "done";
  }).length;
  const reactComponentCount = componentNodes.filter((node) => {
    return node?.platform?.react?.status === "done";
  }).length;
  const iosComponentCount = componentNodes.filter((node) => {
    return node?.platform?.ios?.status === "done";
  }).length;
  const androidComponentCount = componentNodes.filter((node) => {
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
            <TableData>Figma v2</TableData>
            <TableData>React</TableData>
            <TableData>iOS</TableData>
            <TableData>Android</TableData>
          </TableRow>
        </TableHead>
        <TableBody>
          {componentNodes?.map((node) => {
            return (
              <ProgressBoardRow
                key={node?.name}
                title={node?.name!}
                figma={{
                  status: node?.platform?.figma?.status! as ProgressStatus,
                  path: node?.platform?.figma?.path!,
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
            <TableData>Figma v2</TableData>
            <TableData>React</TableData>
            <TableData>iOS</TableData>
            <TableData>Android</TableData>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableData>
              {Math.floor((figmaComponentCount / totalSpecCount) * 1000) / 10}%
            </TableData>
            <TableData>
              {Math.floor((reactComponentCount / totalSpecCount) * 1000) / 10}%
            </TableData>
            <TableData>
              {Math.floor((iosComponentCount / totalSpecCount) * 1000) / 10}%
            </TableData>
            <TableData>
              {Math.floor((androidComponentCount / totalSpecCount) * 1000) / 10}
              %
            </TableData>
          </TableRow>
        </TableBody>
      </Table>
      {/* 
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
                figmaComponentCount,
                reactComponentCount,
                iosComponentCount,
                androidComponentCount,
                totalSpecCount,
              }) * 2}
              %
            </TableData>
            <TableData>
              {okr({
                figmaComponentCount,
                reactComponentCount,
                iosComponentCount,
                androidComponentCount,
                totalSpecCount,
              })}
              %
            </TableData>
          </TableRow>
        </TableBody>
      </Table> */}
    </article>
  );
};

// const okr = ({
//   figmaComponentCount,
//   reactComponentCount,
//   iosComponentCount,
//   androidComponentCount,
//   totalSpecCount,
// }: {
//   figmaComponentCount: number;
//   reactComponentCount: number;
//   iosComponentCount: number;
//   androidComponentCount: number;
//   totalSpecCount: number;
// }) => {
//   const reactCoverage = Math.max(reactComponentCount / totalSpecCount);
//   const iosCoverage = Math.max(iosComponentCount / totalSpecCount);
//   const figmaCoverage = Math.max(figmaComponentCount / totalSpecCount);
//   const androidCoverage = Math.max(androidComponentCount / totalSpecCount);

//   return (
//     Math.floor(
//       ((reactCoverage + iosCoverage + figmaCoverage + androidCoverage) / 4) *
//         1000,
//     ) / 10
//   );
// };

export const Head: HeadFC = () => {
  return (
    <SEO
      name={`Component Progress Board`}
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};

export default ComponentProgressBoardPage;
