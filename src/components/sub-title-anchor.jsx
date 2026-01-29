"use client";

import { generateTitleSlug } from "@/utils/generate-title-slug";
import { useEffect, useCallback } from "react";
import { useSubTitleList } from "@/provider/sub-title-context";
import { useIntersectionObserver } from "@uidotdev/usehooks";

/** @param {{ subTitle: string; as?: "h2" | "h3" | "h4" | "h5" | "h6" }} */
export default function SubTitleAnchor({ subTitle, as: Tag = "h2" }) {
  const slug = generateTitleSlug(subTitle);
  const level = Tag ? parseInt(Tag.charAt(1), 10) : 2;
  const { setSubTitleList, headingRefs } = useSubTitleList();

  const [observerRef, entry] = useIntersectionObserver({
    threshold: 0.9,
    root: null,
    rootMargin: "0px 0px -60% 0px",
  });

  const setRefs = useCallback(
    (node) => {
      observerRef(node);
      if (node) {
        headingRefs.current.set(slug, node);
      }
    },
    [observerRef, headingRefs, slug]
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      setSubTitleList((prev) =>
        prev.map((item) => ({
          ...item,
          current: item.slug === slug,
        }))
      );
    }
  }, [entry?.isIntersecting, slug, setSubTitleList]);

  useEffect(() => {
    setSubTitleList((prev) => {
      if (prev.some((item) => item.slug === slug)) return prev;
      return [
        ...prev,
        {
          slug,
          textContent: subTitle,
          current: prev.length === 0,
          level,
        },
      ];
    });

    return () => {
      setSubTitleList([]);
    };
  }, [slug, subTitle, setSubTitleList]);

  /** @param {React.MouseEvent<HTMLAnchorElement>} e */
  const onClick = (e) => {
    e.preventDefault();
    window.history.pushState(null, "", `#${slug}`);
    headingRefs.current.get(slug)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Tag id={slug} className="group" ref={setRefs}>
      {subTitle}
      <a
        href={`#${slug}`}
        onClick={onClick}
        className="ml-0.5 cursor-pointer text-primary opacity-0 group-hover:opacity-100"
      >
        #
      </a>
    </Tag>
  );
}
