import "@/styles/globals.css";
import "@/styles/_base.scss";
import Link from "next/link";
import { SubTitleProvider } from "@/components/sub-title-context";
import DarkModeButton from "@/components/dark-mode-button";
import Image from "@/components/image";

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

          <div className="right">

            <DarkModeButton />

            <Link href="https://github.com/dkpark10" className="github-container">
              <Image src='/icons/github.svg' width={24} height={24} alt='깃허브 아이콘' />
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
