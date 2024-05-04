import * as React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
import { useSafeContext } from "../hooks/use-safe-context";
import { DarkModeContext } from "../context/dark-mode";

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
      <div className="global-container">
        <div className="global-wrapper">
          <header>
            <Link to="/">
              <h3>{title}</h3>
            </Link>
            <div className="sub">
              <a target="blank" to="https://github.com/dkpark10">
                <StaticImage
                  width={32}
                  height={32}
                  src="../images/github-icon.png"
                  alt="https://github.com/dkpark10 주소"
                />
              </a>
              <input
                type="checkbox"
                onChange={() => {
                  setIsDarkMode(!isDarkMode);
                }}
              ></input>
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
