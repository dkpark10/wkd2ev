'use client';

import { useSubTitleList } from "@/components/sub-title-context";
import { generateTitleSlug } from "@/utils/generate-title-slug";

export default function PostLayout({ children }) {
  const { subTitleElement } = useSubTitleList();

  /** @param {string} str */
  const sliceLastString = (str) => str.slice(0, str.length - 1);

  /** @param {HTMLHeadElement} htmlHeadingElement */
  const onClick = (htmlHeadingElement) => {
    window.history.pushState(null, '', `#${generateTitleSlug(htmlHeadingElement.textContent)}`);

    htmlHeadingElement.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      {children}
      <ul className="table_content">
        {subTitleElement.map((item, idx) =>
          <li key={idx} onClick={() => onClick(item)}>{sliceLastString(item.textContent)}</li>)}
      </ul>
    </>
  );
}
