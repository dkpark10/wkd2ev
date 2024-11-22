import * as React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
import * as styles from "./layout.module.scss";
import { darkModeStore } from "../store/dark-mode";
import { useStore } from "../store";

deckDeckGoHighlightElement();

/**
 * @param {Object} props
 * @param {object} props.children
 * @param {string} props.title
 */
export default function Layout({ children, title }) {
  const [darkMode, setDarkMode]  = useStore(darkModeStore, (state) => state);

  const onClick = () => {
    setDarkMode(!darkMode);
  };

  return (
    <React.Fragment>
      <div className={styles["globalContainer"]}>
        <div className={styles["globalWrapper"]}>
          <header>
            <Link to="/">
              <h3>{title}</h3>
            </Link>
            <div className={styles["sub"]}>
              <Link target="blank" to="https://github.com/dkpark10">
                <StaticImage
                  width={32}
                  height={32}
                  src="../images/github-icon.png"
                  alt="https://github.com/dkpark10 주소"
                />
              </Link>
              {/* <button className={styles["darkMode"]} onClick={onClick}>
                다크모드
              </button> */}
            </div>
          </header>
          <hr />
          <main>{children}</main>
        </div>
      </div>
      <footer />
    </React.Fragment>
  );
}
