import * as React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
import { useSafeContext } from "../hooks/use-safe-context";
import { DarkModeContext } from "../context/dark-mode";
import * as styles from './layout.module.scss';

deckDeckGoHighlightElement();

/**
 * @param {Object} props
 * @param {object} props.children
 * @param {string} props.title
 */
export default function Layout({ children, title }) {
  const { isDarkMode, setIsDarkMode } = useSafeContext(DarkModeContext);

  return (
    <React.Fragment>
      <div className={styles['globalContainer']}>
        <div className={styles['globalWrapper']}>
          <header>
            <Link to="/">
              <h3>{title}</h3>
            </Link>
            <div className={styles['sub']}>
              <Link target="blank" to="https://github.com/dkpark10">
                <StaticImage
                  width={32}
                  height={32}
                  src="../images/github-icon.png"
                  alt="https://github.com/dkpark10 주소"
                />
              </Link>
            </div>
          </header>
          <hr />
          <main>{children}</main>
        </div>
      </div>
      <footer/>
    </React.Fragment>
  );
}
