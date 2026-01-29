import "@/styles/globals.css";
import Link from "next/link";
import { SubTitleProvider } from "@/provider/sub-title-context";
import { ThemeProvider } from "@/provider/theme-provider";
import DarkModeButton from "@/components/dark-mode-button";

export const metadata = {
  title: "wkd2ev 블로그",
  description: "wkd2ev 블로그",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <header className="sticky top-0 z-10 flex h-[93px] w-full items-center justify-between border-b border-border bg-background px-8 transition-colors duration-200 max-xs:h-auto max-xs:px-5 max-xs:py-4">
            <Link
              href="/"
              className="text-2xl font-bold text-card-foreground max-xs:text-xl"
            >
              wkd2ev
            </Link>

            <div className="flex items-center gap-[22px] max-xs:gap-3">
              <DarkModeButton />
              <Link
                href="https://github.com/dkpark10"
                className="block h-6 w-6 bg-contain bg-center bg-no-repeat [background-image:var(--github-icon)]"
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
          </header>

          <div className="flex justify-center pt-[22px]">
            <div className="w-full mㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷax-w-[874px] has-[.post-layout]:max-w-none">
              <main>
                <SubTitleProvider>{children}</SubTitleProvider>
              </main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
