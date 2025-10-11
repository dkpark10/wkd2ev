'use client';

import { useState, useEffect } from "react";

export default function PostLayout({ children }) {
  /** @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]} */
  const [indexList, setIndexList] = useState([]);

  useEffect(() => {
    document.querySelectorAll('h2').forEach((element) => {
      setIndexList((prev) => [...prev, element.textContent.slice(0, element.textContent.length - 1)]);
    })
  }, []);

  return (
    <>
      {children}
      <ul className="index_container">
        {indexList.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </>
  );
}
