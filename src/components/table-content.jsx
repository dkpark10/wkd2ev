"use client";

import { useSubTitleList } from "@/provider/sub-title-context";
import { generateTitleSlug } from "@/utils/generate-title-slug";
import clsx from "clsx";

export default function TableContent() {
  const { subTitleList } = useSubTitleList();

  /** @param {SubTitle} item */
  const onClick = (item) => {
    window.history.pushState(
      null,
      "",
      `#${generateTitleSlug(item.textContent)}`
    );

    window.scrollTo({ top: item.scrollTop - 10, behavior: "smooth" });
  };

  return (
    <ul className="table_content">
      {subTitleList.map((item) => (
        <li
          key={item.idx}
          className={clsx(item.current && "selected")}
          onClick={() => onClick(item)}
        >
          {item.textContent}
        </li>
      ))}
    </ul>
  );
}
