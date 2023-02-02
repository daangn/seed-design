import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";

import ComponentDocumentCategoryNav from "../components/ComponentDocumentCategoryNav";
import EditLink from "../components/EditLink";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableRow,
} from "../components/mdx/Table";
import ProgressBoardRow from "../components/progress-board/ProgressBoardRow";
import type { ProgressStatus } from "../components/progress-board/types";
import SEO from "../components/SEO";
import TableOfContents from "../components/TableOfContents";
import * as style from "./ComponentCommon.css";

export const query = graphql`
  query ComponentOverview($id: String) {
    componentMetaJson(id: { eq: $id }) {
      name
      description
      platform {
        ios {
          path
          status
        }
        android {
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
                tableOfContents
              }
            }
          }
          usage {
            status
          }
          style {
            status
          }
        }
      }
    }
  }
`;

const DocsTemplate: React.FC<PageProps<GatsbyTypes.ComponentOverviewQuery>> = ({
  data,
  path,
  children,
}) => {
  const { name, description, platform } = data.componentMetaJson!;
  const tableOfContents =
    platform?.docs?.overview?.mdx?.childMdx?.tableOfContents!;
  const overviewStatus = platform?.docs?.overview?.status!;
  const usageStatus = platform?.docs?.usage?.status!;
  const styleStatus = platform?.docs?.style?.status!;
  const reactStatus = platform?.react?.status!;
  const iosStatus = platform?.ios?.status!;
  const androidStatus = platform?.android?.status!;

  return (
    <>
      <article className={style.content}>
        <h1 className={style.title}>{name}</h1>
        <p className={style.titleDescription}>{description}</p>
        <ComponentDocumentCategoryNav
          path={path}
          overviewStatus={overviewStatus}
          usageStatus={usageStatus}
          styleStatus={styleStatus}
        />

        <Table>
          <TableHead>
            <TableRow>
              <TableData>Overview</TableData>
              <TableData>Usage</TableData>
              <TableData>Style</TableData>
              <TableData>React</TableData>
              <TableData>iOS</TableData>
              <TableData>Android</TableData>
            </TableRow>
          </TableHead>
          <TableBody>
            <ProgressBoardRow
              overview={{
                status: overviewStatus as ProgressStatus,
              }}
              usage={{
                status: usageStatus as ProgressStatus,
              }}
              style={{
                status: styleStatus as ProgressStatus,
              }}
              react={{
                status: reactStatus as ProgressStatus,
                path: platform?.react?.path!,
              }}
              ios={{
                status: iosStatus as ProgressStatus,
                path: platform?.ios?.path!,
              }}
              android={{
                status: androidStatus as ProgressStatus,
                path: platform?.android?.path!,
              }}
            />
          </TableBody>
        </Table>

        <div>{children}</div>
        <EditLink slug={path} />
      </article>
      <TableOfContents tableOfContents={tableOfContents} />
    </>
  );
};

export const Head: HeadFC<GatsbyTypes.ComponentOverviewQuery> = ({ data }) => {
  const { name, description } = data.componentMetaJson!;
  return <SEO name={`${name}`} description={`${description}`} />;
};

export default DocsTemplate;
