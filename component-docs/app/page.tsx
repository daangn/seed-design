import { allContents, type Content } from "contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";
import { getMDXComponent } from "next-contentlayer/hooks";
import Link from "next/link";

function ContentCard(content: Content) {
  const Content = getMDXComponent(content.body.code);

  return (
    <div className="mb-8">
      <h2 className="text-xl">
        <Link href={content.url} className="text-blue-700 hover:text-blue-900" legacyBehavior>
          {content.title}
        </Link>
      </h2>
      <time dateTime={content.date} className="block mb-2 text-xs text-gray-600">
        {format(parseISO(content.date), "LLLL d, yyyy")}
      </time>
      <div className="text-sm">
        <Content />
      </div>
    </div>
  );
}

export default function Home() {
  const contents = allContents.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <div className="max-w-xl py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">Next.js Example</h1>

      {contents.map((content) => (
        <ContentCard key={content._id} {...content} />
      ))}
    </div>
  );
}
