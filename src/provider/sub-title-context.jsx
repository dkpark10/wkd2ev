"use client";

import { useContext, createContext, useState, useRef } from "react";

/**
 * @typedef {{ slug: string; textContent: string; current: boolean; level: number }} SubTitle
 */

export const SubTitleContext = createContext({
  /** @type {Array<SubTitle>} */
  subTitleList: [],

  /** @type {React.Dispatch<React.SetStateAction<Array<SubTitle>>> | null} */
  setSubTitleList: null,

  /** @type {React.MutableRefObject<Map<string, HTMLElement>> | null} */
  headingRefs: null,
});

export const SubTitleProvider = ({ children }) => {
  /** @type {[SubTitle[], React.Dispatch<React.SetStateAction<SubTitle[]>>]} */
  const [subTitleList, setSubTitleList] = useState([]);

  /** @type {React.MutableRefObject<Map<string, HTMLElement>>} */
  const headingRefs = useRef(new Map());

  return (
    <SubTitleContext.Provider
      value={{
        subTitleList,
        setSubTitleList,
        headingRefs,
      }}
    >
      {children}
    </SubTitleContext.Provider>
  );
};

export const useSubTitleList = () => {
  const ctx = useContext(SubTitleContext);
  if (!ctx) throw new Error("useSubTitleList must be used within SubTitleProvider");
  return ctx;
};
