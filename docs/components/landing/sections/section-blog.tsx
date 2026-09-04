import { IconSeedArrow } from "@/components/icon-seed-arrow";
import { clsx } from "cn";
import Image from "next/image";
import Link from "next/link";
import { RevealText } from "../components/reveal-text";
import { BLOG_HEADING, BLOG_POSTS, REGIONS, Z } from "../lib/landing-content";
import { SectionLayer } from "../section-layer";

/**
 * Section 6 — Blog.
 * Dark (#121212, matches Values / 04) stage with a 20px bottom radius so the footer
 * peeks through as this layer lifts away. The heading reveals word-by-word; three
 * fixed cards cascade left→right — thumbnail dissolves up, text words rise (see
 * `createBlogReveal`). Each card links to its post — an internal /updates page
 * (same tab, → arrow) or the external team blog (new tab, ↗ arrow), per
 * `BLOG_POSTS[].external`. It zooms its image on hover while the container stays fixed
 * (overflow-hidden); the cursor shows a fixed "더보기" with the matching arrow, and on
 * touch (no cursor) the matching chevron sits beside the title. Mobile stacks with top padding.
 */
export function SectionBlog() {
  return (
    <SectionLayer
      id="blog"
      z={Z.blog}
      regionVh={REGIONS.blog}
      // Page bg is dark, so this section has no `behindClassName` (a carrot behind would
      // leak orange at the Showcase seam). A carrot strip sits only at the BOTTOM
      // (bottomAccentClassName, h-5 = the rounded-b radius): the rounded corners reveal it
      // as the footer color, while the flat top/side seams stay on the dark page bg — so
      // the corner reads orange without any sub-pixel seam leaking orange elsewhere.
      panelClassName="rounded-b-[20px] bg-[#121212]"
      bottomAccentClassName="bg-palette-carrot-600"
      mobileStack
      // 태블릿(768–1023)에선 카드가 1열(lg:grid-cols-3)이라 콘텐츠가 100dvh를 넘긴다.
      // pinFrom="lg"로 태블릿은 자연 높이로 흘리고(핀·h-dvh·클립은 lg부터) 위아래 잘림을 없앤다.
      // 02 Bento와 동일 처방.
      pinFrom="lg"
    >
      <div className="flex h-full w-full flex-col justify-center gap-[40px] pt-[100px] pb-[60px] lg:gap-[70px] lg:pt-0 lg:pb-0">
        <div
          data-blog-text
          className="mx-auto flex w-full max-w-[1200px] flex-col gap-[30px] px-[30px] lg:flex-row lg:items-start lg:justify-between lg:px-6"
        >
          <div data-blog-title>
            <RevealText
              as="h2"
              text={BLOG_HEADING}
              className="text-[28px] font-bold leading-[1.3] text-white lg:text-[52px] lg:leading-[1.2] lg:tracking-tight"
            />
          </div>
        </div>

        <div data-blog-cards className="mx-auto w-full max-w-[1200px] px-[30px] lg:px-6">
          <div className="grid grid-cols-1 gap-[40px] lg:grid-cols-3 lg:gap-5">
            {BLOG_POSTS.map((post) => {
              // 내부 글은 → (같은 탭), 외부 팀블로그는 ↗ (새 탭). reveal/zoom 구조는 공유하고
              // 링크 wrapper·커서 화살표·터치 chevron만 링크 종류에 맞게 바꾼다.
              const className = "group flex w-full flex-col gap-5 lg:gap-6";
              const inner = (
                <>
                  <div className="relative aspect-video w-full overflow-hidden rounded-r2_5 lg:rounded-r3">
                    {/* Zoom layer: the container stays fixed, only the image scales on
                        hover. Kept separate from the Image so the CSS scale doesn't fight
                        GSAP's reveal transform on [data-reveal]. */}
                    <div className="relative size-full motion-safe:transition-transform motion-safe:duration-[600ms] motion-safe:ease-out motion-safe:group-hover:[transform:scale(1.05)]">
                      <Image
                        data-reveal
                        src={post.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover will-change-transform"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-[10px] lg:gap-2">
                    {/* Title + link chevron. Chevron shows only on coarse pointers
                        (touch): on desktop the custom "더보기" cursor already signals the
                        link, so it's hidden via [@media(pointer:fine)]. On touch it fades in
                        synced to the title's reveal (data-blog-arrow, see createMobileReveals). */}
                    <div className="flex items-start gap-1.5">
                      <RevealText as="h3" text={post.title} className="t7-bold text-white" />
                      <IconSeedArrow
                        external={post.external}
                        data-blog-arrow
                        className={clsx(
                          "mt-1 size-5 text-white [@media(pointer:fine)]:hidden",
                          post.external && "-translate-y-[0.5px]",
                        )}
                      />
                    </div>
                    <RevealText
                      as="p"
                      text={post.description}
                      className="t5-regular text-white/70 lg:article-body"
                    />
                  </div>
                </>
              );

              return post.external ? (
                <a
                  key={post.title}
                  href={post.href}
                  target="_blank"
                  rel="noreferrer"
                  data-blog-card
                  data-cursor="text"
                  data-cursor-text="더보기"
                  data-cursor-arrow="up-right"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <Link
                  key={post.title}
                  href={post.href}
                  data-blog-card
                  data-cursor="text"
                  data-cursor-text="더보기"
                  data-cursor-arrow="right"
                  className={className}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </SectionLayer>
  );
}
