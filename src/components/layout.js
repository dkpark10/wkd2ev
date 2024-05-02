import * as React from "react";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
deckDeckGoHighlightElement();

export default function Layout({ children }) {
  return (
    <div className="global-container">
      <div className="global-wrapper">
        <div>{children}</div>
        <footer />
      </div>
    </div>
  );
}
