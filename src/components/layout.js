import * as React from "react";
import { Link } from "gatsby";

export default function Layout({ title, children }) {
  return (
    <div className="global-container">
      <div className="global-wrapper">
        <header>
          <Link to="/">
            <h3>{title}</h3>
          </Link>
        </header>
        <div>{children}</div>
        <footer />
      </div>
    </div>
  );
}
