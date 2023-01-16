import { AnimatePresence, motion } from "framer-motion";
import type { GatsbyLinkProps } from "gatsby";
import { graphql, Link, useStaticQuery } from "gatsby";

import { useSidebarState } from "../contexts/SidebarContext";
import Logo from "./Logo";
import Portal from "./Portal";
import * as style from "./Sidebar.css";

type Status = "done" | "in-progress" | "todo";
interface SidebarItemProps {
  /**
   * sidebar에 같은 이름으로 존재하는 컴포넌트가 있기 때문에 상위 카테고리로 구별해서 하이라이팅 해줌.
   */
  title: "component" | "primitive" | "foundation" | "overview";

  itemName: string;

  currentPath: string;

  status?: Status;
}

const SidebarItem = ({
  currentPath,
  itemName,
  title,
  status,
  to,
  onClick,
  onMouseEnter,
}: GatsbyLinkProps<{}> & SidebarItemProps) => {
  const pathComponentName = currentPath.split("/")[2];
  const docsComponentName = itemName.replaceAll(" ", "-").toLowerCase();
  const active =
    pathComponentName === docsComponentName && currentPath.includes(title);

  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={style.sidebarItemLink({ disable: status === "todo" })}
    >
      <div
        className={style.sidebarItem({
          disable: status === "todo",
          highlight: active,
        })}
      >
        <span>{itemName}</span>
      </div>
    </Link>
  );
};

const SidebarTitle = ({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) => {
  const firstLetterTitle = title[0].toUpperCase();
  const restLetterTitle = title.slice(1);
  return (
    <Link to={`/${title}`} onClick={onClick}>
      <h1 className={style.sidebarTitle1}>
        {firstLetterTitle + restLetterTitle}
      </h1>
    </Link>
  );
};

const SidebarItemContainer = ({ logo }: { logo?: boolean }) => {
  const { closeSidebar } = useSidebarState();
  const data = useStaticQuery<Queries.SidebarQuery>(graphql`
    query Sidebar {
      allAllComponentMetaJson(sort: { name: ASC }) {
        nodes {
          name
          platform {
            docs {
              usage {
                status
                mdx {
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
      }

      allAllPrimitiveMetaJson(sort: { name: ASC }) {
        nodes {
          name
          description
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
  `);

  const currentPath = typeof window !== "undefined" ? location.pathname : "";
  const componentData = data.allAllComponentMetaJson.nodes;
  const primitiveData = data.allAllPrimitiveMetaJson.nodes;

  return (
    <div className={style.sidebarItemContainer}>
      {logo && (
        <div className={style.sidebarLogo}>
          <Logo to="/" onClick={closeSidebar} />
        </div>
      )}

      <SidebarTitle title="overview" onClick={closeSidebar} />

      <SidebarItem
        currentPath={currentPath}
        to="/overview/progress-board"
        itemName="Progress Board"
        title="overview"
        onClick={closeSidebar}
      />
      <SidebarTitle title="foundation" onClick={closeSidebar} />

      <SidebarItem
        currentPath={currentPath}
        to="/foundation/color"
        itemName="Color"
        title="foundation"
        onClick={closeSidebar}
      />
      <SidebarItem
        currentPath={currentPath}
        to="/foundation/typography"
        itemName="Typography"
        title="foundation"
        onClick={closeSidebar}
      />

      <SidebarTitle title="component" onClick={closeSidebar} />

      {componentData!.map((node) => {
        // if (node?.items?.length! >= 2) {
        //   return (
        //     <div className={style.sidebarGroupContainer}>
        //       <div className={style.sidebarGroupTitle}>{node.title}</div>
        //       {node.items?.map((item) => {
        //         if (item?.platform?.docs?.usage?.status! === "todo") {
        //           return (
        //             <SidebarItem
        //               key={`${item?.name!.replaceAll(
        //                 " ",
        //                 "-",
        //               )}-component-group-todo`}
        //               currentPath={currentPath}
        //               to={item?.name!}
        //               itemName={item?.name!}
        //               title="component"
        //               onClick={closeSidebar}
        //               status={item?.platform?.docs?.usage?.status!}
        //             />
        //           );
        //         }

        //         const name = item?.name;
        //         const path =
        //           item?.platform?.docs?.usage?.mdx?.childMdx?.frontmatter?.slug;

        //         return (
        //           <SidebarItem
        //             key={path!}
        //             currentPath={currentPath}
        //             to={path!}
        //             itemName={name!}
        //             title="component"
        //             onClick={closeSidebar}
        //             status={item?.platform?.docs?.usage?.status! as Status}
        //           />
        //         );
        //       })}
        //     </div>
        //   );
        // }

        if (!node?.platform?.docs?.usage?.mdx) {
          return (
            <SidebarItem
              key={`${node?.name!.replaceAll(" ", "-")}-component-todo`}
              currentPath={currentPath}
              to={node?.name!}
              itemName={node?.name!}
              title="component"
              onClick={closeSidebar}
              status={node?.platform?.docs?.usage?.status! as Status}
            />
          );
        }

        const name = node?.name;
        const slug =
          node?.platform?.docs?.usage?.mdx?.childMdx?.frontmatter?.slug;

        return (
          <SidebarItem
            key={slug!}
            currentPath={currentPath}
            to={slug!}
            itemName={name!}
            title="component"
            onClick={closeSidebar}
            status={node?.platform?.docs?.usage?.status! as Status}
          />
        );
      })}

      <SidebarTitle title="primitive" onClick={closeSidebar} />

      {primitiveData!.map((node) => {
        const name = node.name!;
        const slug = node?.primitive?.childMdx?.frontmatter?.slug;

        return (
          <SidebarItem
            key={`${name!}-primitive-done-or-in-progress`}
            currentPath={currentPath}
            to={slug!}
            itemName={name!}
            title="primitive"
            onClick={closeSidebar}
          />
        );
      })}
    </div>
  );
};

const Sidebar = () => {
  const { open, closeSidebar } = useSidebarState();

  // TODO: sidebar가 두 개 있어서 공통된 로직이 있을 듯
  return (
    <>
      <Portal>
        <AnimatePresence>
          {open && (
            <motion.div>
              <motion.nav
                className={style.sidebar}
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0, x: -80 }}
              >
                <SidebarItemContainer logo />
              </motion.nav>
              <motion.div
                className={style.overlay}
                onClick={closeSidebar}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0, y: -10 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>

      {/* 페이지 고정 사이드바 */}
      <nav className={style.sidebarDesktop}>
        <SidebarItemContainer />
      </nav>
    </>
  );
};

export default Sidebar;
