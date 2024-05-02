import * as React from "react";
import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image"
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
deckDeckGoHighlightElement();

export default function Layout({ children, title }) {
  return (
    <div className="global-container">
      <div className="global-wrapper">
        <header>
          <Link to="/">
            <h3>{title}</h3>
          </Link>
          <div className="sub">
            <Link target="blank" to="https://github.com/dkpark10">
              <StaticImage width={32} height={32} src="../images/github-icon.png" alt="https://github.com/dkpark10 주소" />
            </Link>
            {/* <input type="checkbox"></input> */}
          </div>
        </header>
        <hr />
        <div>{children}</div>
        <footer />
      </div>
    </div>
  );
}
