'use client';

import { generateTitleSlug } from "@/utils/generate-title-slug";
import { useEffect, useRef } from "react";

/** @param {{ subTitle: string }} */
export default function SubTitleAnchor({ subTitle }) {
  const refElement = useRef(null);

  const scrollAction = () => {
    if (refElement) {
      refElement.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  useEffect(() => {
    const { hash } = window.location;

    // #{title} -> # 제거
    if (decodeURIComponent(hash).slice(1) === generateTitleSlug(subTitle)) {
      scrollAction();
    }
  }, [subTitle]);

  /** @param {MouseEventHandler<HTMLAnchorElement>} e */
  const onClick = (e) => {
    e.preventDefault();
    window.history.pushState(null, '', `#${generateTitleSlug(subTitle)}`);
    
    scrollAction();
  }

  return (
    <h2 className="sub_title" ref={refElement}>
      {subTitle}
      <a onClick={onClick} className="permalink">#</a>
    </h2>
  );
}
