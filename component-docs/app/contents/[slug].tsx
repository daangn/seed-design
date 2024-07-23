import type { InferGetStaticPropsType } from "next";
import { useMDXComponent } from "next-contentlayer/hooks";
import { allContents } from "contentlayer/generated";

const ContentDetailPage = ({ content }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const MDXComponent = useMDXComponent(content?.body.code || "");

  return (
    <div>
      <h1>{content?.title}</h1>
      <MDXComponent />
    </div>
  );
};

export default ContentDetailPage;

// SSG 렌더링을 사용하기 위한 getStaticPaths 함수 사용
export const getStaticPaths = async () => {
  const paths = allContents.map((content) => ({ params: { slug: content._raw.flattenedPath } }));
  return { paths, fallback: false };
};

// SSG 렌더링을 사용하기 위한 getStaticProps 함수 사용
export const getStaticProps = ({ params: { slug } }) => {
  const content = allContents.find((content) => content._raw.flattenedPath === slug);
  return { props: { content } };
};
