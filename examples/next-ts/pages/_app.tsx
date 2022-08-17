import "@seed-design/stylesheet/global.css";
import "./reset.css"

import { dataAttr } from "@zag-js/dom-utils";
import { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";

const routesData = [
  {
    path: "/menu",
    label: "menu",
  },
  {
    path: "/bottom-sheet",
    label: "bottom-sheet",
  },
];

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <div className="page">
      <Head>
        <title>React Machines</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <aside className="nav">
        <header>Zagjs</header>
        {routesData.map((route) => {
          const active = router.pathname === route.path;
          return (
            <Link href={route.path} key={route.label} passHref>
              <a data-active={dataAttr(active)}>{route.label}</a>
            </Link>
          );
        })}
      </aside>
      <Component {...pageProps} />
    </div>
  );
}
