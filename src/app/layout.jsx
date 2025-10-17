import "@/styles/globals.css";
import "@/styles/_base.scss";
import Link from "next/link";
import Github from "@/components/github";
import { SubTitleProvider } from "@/components/sub-title-context";

export const metadata = {
  title: "wkd2ev 블로그",
  description: "wkd2ev 블로그",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        
        <header>
          <Link className="title" href="/">wkd2ev</Link>
          <Link href="https://github.com/dkpark10"><Github /></Link>
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
