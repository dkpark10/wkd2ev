import "@/styles/globals.css";
import "@/styles/_base.scss";
import Link from "next/link";
import { SubTitleProvider } from "@/provider/sub-title-context";
import DarkModeButton from "@/components/dark-mode-button";

export const metadata = {
  title: "wkd2ev 블로그",
  description: "wkd2ev 블로그",
};

export default function RootLayout({ children }) {
  const themeInitScript = `
    (function() {
      try {
        const theme = localStorage.getItem('THEME');
        document.body.dataset.theme = theme || 'light';
      } catch (e) {}
    })();
  `;

  return (
    <html lang="ko">
      <body suppressHydrationWarning>

        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />

        <header>
          <Link className="title" href="/">wkd2ev</Link>

          <div className="right">

            <DarkModeButton />

            <Link href="https://github.com/dkpark10">
              <div role="img" className="github" />
            </Link>
          </div>
        </header>

        <div className="container">
          <div className="inner">
            <main>
              <SubTitleProvider>
                {children}
              </SubTitleProvider>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
