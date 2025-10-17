'use client';

import { generateTitleSlug } from "@/utils/generate-title-slug";
import { useEffect, useRef } from "react";
import { useSubTitleList } from "@/components/sub-title-context";
import { useIntersectionObserver } from "@uidotdev/usehooks";

/** @param {{ subTitle: string }} */
export default function SubTitleAnchor({ subTitle }) {
  const refElement = useRef(null);

  const { setSubTitleElement, setCurrentContent } = useSubTitleList();

  const [targetRef, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  const scrollAction = () => {
    if (refElement) {
      refElement.current.scrollIntoView({ behavior: 'smooth' });
    }    
  }

  useEffect(() => {
    setCurrentContent(refElement.current);
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
