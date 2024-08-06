import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-seed data-seed-scale-color="light" data-seed-scale-letter-spacing="ios">
      <Head>
        <meta name="color-scheme" content="light dark" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
