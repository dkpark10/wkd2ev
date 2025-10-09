'use client';

import { generateTitleSlug } from "@/utils/generate-title-slug";

/** @param {{ subTitle: string }} */
export default function SubTitleAnchor({ subTitle }) {

  /** @param {MouseEventHandler<HTMLAnchorElement>} e */
  const onClick = (e) => {
    e.preventDefault();
    window.history.pushState(null, '', `#${generateTitleSlug(subTitle)}`);
  }

  return (
    <h2 className="sub_title">
      {subTitle}
      <a onClick={onClick} className="permalink">#</a>
    </h2>
  );
}
