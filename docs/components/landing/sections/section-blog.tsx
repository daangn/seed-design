import { IconChevronRightFill } from "@karrotmarket/react-monochrome-icon";
import { ActionButton, ImageFrame, SuffixIcon } from "@seed-design/react";
import { BLOG_DESCRIPTION, BLOG_HEADING, BLOG_POSTS, REGIONS, Z } from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

/**
 * Section 6 — Blog.
 * Gray-200 stage with a 20px bottom radius so the footer peeks through as this
 * layer lifts away. Text block fades in first (`data-blog-text`), then the post
 * carousel (`data-blog-cards`).
 */
export function SectionBlog() {
  return (
    <SectionLayer
      id="blog"
      z={Z.blog}
      regionVh={REGIONS.blog}
      panelClassName="rounded-b-[20px] bg-palette-gray-200"
      behindClassName="bg-palette-carrot-600"
    >
      <div className="flex h-full w-full flex-col justify-center gap-12">
        <div
          data-blog-text
          className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="flex flex-col items-start gap-4">
            <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-tight text-[#262626]">
              {BLOG_HEADING}
            </h2>
            <ActionButton variant="ghost">
              블로그 보러가기
              <SuffixIcon svg={<IconChevronRightFill />} />
            </ActionButton>
          </div>
          <p className="max-w-[420px] whitespace-pre-line text-fg-neutral-muted article-body">
            {BLOG_DESCRIPTION}
          </p>
        </div>

        <div data-blog-cards className="mx-auto w-full max-w-[1200px] px-6">
          <div className="flex snap-x gap-6 overflow-x-auto overscroll-x-contain pb-4">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.title}
                data-cursor="text"
                data-cursor-text={post.title}
                className="flex w-[300px] shrink-0 snap-start flex-col gap-3"
              >
                <ImageFrame
                  src={post.image}
                  alt=""
                  ratio={4 / 3}
                  borderRadius="r2"
                  className="w-full"
                />
                <div className="flex flex-col gap-1.5">
                  <span className="text-fg-neutral t4-medium">{post.tag}</span>
                  <h3 className="t7-bold text-[#262626]">{post.title}</h3>
                  <p className="text-fg-neutral-muted article-body">{post.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </SectionLayer>
  );
}
