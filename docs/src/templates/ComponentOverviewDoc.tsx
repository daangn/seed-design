import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";

import ComponentDocumentTopContent from "../components/ComponentDocumentTopContent";
import Iframe from "../components/Iframe";
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
            storybook {
              path
              height
            }
            mdx {
              childMdx {
                tableOfContents
              }
            }
          }
        }
      }
      primitive {
        childPrimitiveMetaJson {
          primitive {
            childMdx {
              frontmatter {
                slug
              }
            }
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
  const { name, description, platform, primitive } = data.componentMetaJson!;
  const tableOfContents =
    platform?.docs?.overview?.mdx?.childMdx?.tableOfContents!;
  const reactStatus = platform?.react?.status!;
  const iosStatus = platform?.ios?.status!;
  const androidStatus = platform?.android?.status!;

  const storybookPath = platform?.docs?.overview?.storybook?.path!;
  const storybookHeight = platform?.docs?.overview?.storybook?.height!;
  const primitiveLink =
    primitive?.childPrimitiveMetaJson?.primitive?.childMdx?.frontmatter?.slug!;

  return (
    <>
      <article className={style.content}>
        <ComponentDocumentTopContent
          title={name!}
          description={description!}
          path={path}
          primitiveLink={primitiveLink}
        />
        <h2 className={style.subTitle}>개발 현황</h2>
        <div className={style.progressContainer}>
          <Progress
            name="React"
            status={reactStatus as ProgressStatus}
            href={platform?.react?.path!}
          />
          <Progress
            name="iOS"
            status={iosStatus as ProgressStatus}
            href={platform?.ios?.path!}
          />
          <Progress
            name="Android"
            status={androidStatus as ProgressStatus}
            href={platform?.android?.path!}
          />
        </div>

        {storybookPath && (
          <>
            <h2 className={style.subTitle}>컴포넌트 미리보기</h2>
            <Iframe src={storybookPath} height={storybookHeight} />
          </>
        )}

        <div>{children}</div>
      </article>
      <TableOfContents tableOfContents={tableOfContents} />
    </>
  );
};

const Progress = ({
  name,
  status,
  href,
}: {
  name: string;
  status: ProgressStatus;
  href?: string;
}) => {
  return (
    <a
      className={style.progress({
        disabled: status === "todo",
      })}
      href={href}
      target="_blank"
    >
      <div className={style.progressLeft}>
        <div className={style.progressName}>{name}</div>
        <div className={style.progressStatus}>
          {status === "done" && (
            <span className={style.progressStatusDone}>Done</span>
          )}
          {status === "in-progress" && (
            <span className={style.progressStatusInProgress}>In Progress</span>
          )}
          {status === "todo" && <span className={style.progressStatusTodo} />}
        </div>
      </div>
      <svg
        className={style.progressIcon({
          disabled: status === "todo",
        })}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.2498 17.5H3.74976C3.41837 17.4996 3.10069 17.3677 2.86637 17.1334C2.63204 16.8991 2.5002 16.5814 2.49976 16.25V3.75C2.5002 3.41862 2.63204 3.10093 2.86637 2.86661C3.10069 2.63229 3.41837 2.50045 3.74976 2.5H9.99976V3.75H3.74976V16.25H16.2498V10H17.4998V16.25C17.4993 16.5814 17.3675 16.8991 17.1331 17.1334C16.8988 17.3677 16.5811 17.4996 16.2498 17.5Z"
          fill="currentcolor"
        />
        <path
          d="M12.4998 1.25V2.5H16.616L11.2498 7.86625L12.1335 8.75L17.4998 3.38375V7.5H18.7498V1.25H12.4998Z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
};

export const Head: HeadFC<GatsbyTypes.ComponentOverviewQuery> = ({ data }) => {
  const { name, description } = data.componentMetaJson!;
  return <SEO name={`${name}`} description={`${description}`} />;
};

export default DocsTemplate;
