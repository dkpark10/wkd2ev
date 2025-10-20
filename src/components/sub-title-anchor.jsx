'use client';

import { generateTitleSlug } from "@/utils/generate-title-slug";
import { useEffect, useRef } from "react";
import { useSubTitleList } from "@/components/sub-title-context";
import { useIntersectionObserver } from "@uidotdev/usehooks";

/** @param {{ subTitle: string }} */
export default function SubTitleAnchor({ subTitle }) {
  /** @type {React.RefObject<HTMLHeadElement | null>} */
  const refElement = useRef(null);

  const { setSubTitleElement, setCurrentContent } = useSubTitleList();

  const [targetRef, entry] = useIntersectionObserver({
    threshold: 0.9,
    root: null,
    rootMargin: '0px 0px -60% 0px',
  });

  const scrollAction = () => {
    if (refElement) {
      const rect = refElement.current.getBoundingClientRect();
      const absoluteY = window.scrollY + rect.top;

      window.scrollTo({ top: absoluteY - 93, behavior: 'smooth' });
    }
  }

  useEffect(() => {
    if (entry?.isIntersecting) {
      setCurrentContent(refElement.current);
    }
  }, [entry?.isIntersecting]);

  useEffect(() => {
    if (refElement) {
      setSubTitleElement((prev) => [...prev, refElement.current]);
    }

    const { hash } = window.location;

    // #{title} -> # 제거
    if (decodeURIComponent(hash).slice(1) === generateTitleSlug(subTitle)) {
      scrollAction();
    }

    return () => {
      setSubTitleElement([]);
    }
  }, [subTitle]);

  /** @param {MouseEventHandler<HTMLAnchorElement>} e */
  const onClick = (e) => {
    e.preventDefault();
    window.history.pushState(null, '', `#${generateTitleSlug(subTitle)}`);

    scrollAction();
  }

  return (
    <h2 className="sub_title" ref={(element) => {
      targetRef(element);
      refElement.current = element;
    }}>
      {subTitle}
      <a onClick={onClick} className="permalink">#</a>
    </h2>
  );
}
