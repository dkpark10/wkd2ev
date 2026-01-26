"use client";

import { useSubTitleList } from "@/provider/sub-title-context";
import clsx from "clsx";

export default function TableContent() {
  const { subTitleList, headingRefs } = useSubTitleList();

  /** @param {import("@/provider/sub-title-context").SubTitle} item */
  const onClick = (item) => {
    window.history.pushState(null, "", `#${item.slug}`);
    headingRefs.current.get(item.slug)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ul className="table_content">
      {subTitleList.map((item) => (
        <li
          key={item.slug}
          className={clsx(item.current && "selected", `level-${item.level}`)}
          onClick={() => onClick(item)}
        >
          {item.textContent}
        </li>
      ))}
    </ul>
  );
}
