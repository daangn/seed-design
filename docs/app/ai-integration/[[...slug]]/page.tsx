import { getAiIntegrationSource } from "@/app/sources/ai-integration-source";
import type { Metadata } from "next";
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/components/mdx-components";

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const aiIntegrationSource = await getAiIntegrationSource();
  const page = aiIntegrationSource.getPage(params.slug);
  if (!page) notFound();

  const { body: MDX, toc, lastModified } = await page.data.load();

  return (
    <DocsPage toc={toc} full={page.data.full} lastUpdate={lastModified}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody className="prose-p:break-keep prose-p:text-pretty prose-headings:text-balance">
        <MDX components={mdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  const aiIntegrationSource = await getAiIntegrationSource();
  return aiIntegrationSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const aiIntegrationSource = await getAiIntegrationSource();
  const page = aiIntegrationSource.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
