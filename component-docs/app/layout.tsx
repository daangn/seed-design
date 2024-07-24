import "../styles/globals.css";

import { Header } from "../components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head />
      <body>
        <Header />
        <div className="px-6">{children}</div>
      </body>
    </html>
  );
}
