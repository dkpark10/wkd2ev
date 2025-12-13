"use client";

import { generateTitleSlug } from "@/utils/generate-title-slug";
import { useEffect, useRef } from "react";
import { useSubTitleList } from "@/provider/sub-title-context";
import { useIntersectionObserver } from "@uidotdev/usehooks";

const HEADER_HEIGHT = 93;

/** @param {{ subTitle: string }} */
export default function SubTitleAnchor({ subTitle }) {
  /** @type {React.RefObject<HTMLHeadElement | null>} */
  const refElement = useRef(null);

  /** @type {React.RefObject<number | null>} */
  const id = useRef(null);

  const { subTitleList, setSubTitleList } = useSubTitleList();

  const [targetRef, entry] = useIntersectionObserver({
    threshold: 0.9,
    root: null,
    rootMargin: "0px 0px -60% 0px",
  });

  const scrollAction = () => {
    if (refElement) {
      const absoluteY = subTitleList.find(
        (item) => item.idx === id.current
      )?.scrollTop;

      if (absoluteY) {
        window.scrollTo({ top: absoluteY - 10, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (entry?.isIntersecting) {
      setSubTitleList((prev) =>
        prev.map((item) => ({
          ...item,
          current: item.idx === id.current,
        }))
      );
    }
  }, [entry?.isIntersecting]);

  useEffect(() => {
    if (refElement) {
      const rect = refElement.current.getBoundingClientRect();
      const absoluteY = window.scrollY + rect.top - HEADER_HEIGHT;

      setSubTitleList((prev) => {
        id.current = prev.length + 1;
        return [
          ...prev,
          {
            idx: id.current,
            textContent: subTitle,
            current: id.current === 1,
            scrollTop: absoluteY,
          },
        ];
      });
    }

    const { hash } = window.location;

    // #{title} -> # 제거
    if (decodeURIComponent(hash).slice(1) === generateTitleSlug(subTitle)) {
      scrollAction();
    }

    // 페이지 이탈 시 초기화
    return () => {
      setSubTitleList([]);
    };
  }, [subTitle, JSON.stringify(subTitleList.map((item) => item.textContent).join(''))]);

  /** @param {MouseEventHandler<HTMLAnchorElement>} e */
  const onClick = (e) => {
    e.preventDefault();
    window.history.pushState(null, "", `#${generateTitleSlug(subTitle)}`);

    scrollAction();
  };

  return (
    <h2
      className="sub_title"
      ref={targetRef}
    >
      {subTitle}
      <a ref={refElement} onClick={onClick} className="permalink">
        #
      </a>
    </h2>
  );
}
