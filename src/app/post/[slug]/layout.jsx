'use client';

import { useSubTitleList } from "@/components/sub-title-context";
import { generateTitleSlug } from "@/utils/generate-title-slug";
import clsx from 'clsx';

export default function PostLayout({ children }) {
  const { subTitleElement, currentContent } = useSubTitleList();

  /** @param {string} str */
  const sliceLastString = (str) => str.slice(0, str.length - 1);

  /** @param {HTMLHeadElement} htmlHeadingElement */
  const onClick = (htmlHeadingElement) => {
    window.history.pushState(null, '', `#${generateTitleSlug(htmlHeadingElement.textContent)}`);

    const rect = htmlHeadingElement.getBoundingClientRect();
    const absoluteY = window.scrollY + rect.top;

    window.scrollTo({ top: absoluteY - 93, behavior: 'smooth' });
  }

  return (
    <>
      {children}
      <ul className="table_content">
        {subTitleElement.map((item, idx) =>
          <li
            key={idx}
            className={clsx(item.isSameNode(currentContent) && 'selected')}
            onClick={() => onClick(item)}>{sliceLastString(item.textContent)}
          </li>
        )}
      </ul>
    </>
  );
}
