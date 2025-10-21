import "@/styles/globals.css";
import "@/styles/_base.scss";
import Link from "next/link";
import { SubTitleProvider } from "@/components/sub-title-context";
import DarkModeButton, { THEME_KEY } from "@/components/dark-mode-button";
import { cookies } from 'next/headers'

export const metadata = {
  title: "wkd2ev 블로그",
  description: "wkd2ev 블로그",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const theme = cookieStore.get('wkd2ev_theme')?.value || 'light';

  return (
    <html lang="ko">
      <body data-theme={theme}>

        <header>
          <Link className="title" href="/">wkd2ev</Link>

          <div className="right">

            <DarkModeButton initTheme={theme} key={theme} />

            <Link href="https://github.com/dkpark10" className="github-container">
              <img src='/icons/github.svg' width={24} height={24} alt='깃허브 아이콘' />
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
