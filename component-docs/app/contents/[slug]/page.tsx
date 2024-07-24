import { allContents } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer2/hooks";

interface ContentPageProps {
  params: {
    slug: string;
  };
}

async function getContentFromParams({ params }: ContentPageProps) {
  const slug = params.slug;
  const doc = allContents.find((doc) => doc.slug === slug);

  if (!doc) {
    return null;
  }

  return doc;
}

export async function generateStaticParams(): Promise<ContentPageProps["params"][]> {
  return allContents.map((content) => ({
    slug: content.slug,
  }));
}

export default async function ContentPage({ params }: ContentPageProps) {
  const content = await getContentFromParams({ params });
  const MDXComponent = getMDXComponent(content?.body.code || "");

  if (!content) {
    return <div>Not found</div>;
  }

  return (
    <div className="max-w-xl py-8 mx-auto">
      <h1>{content?.title}</h1>
      <MDXComponent />
    </div>
  );
}
