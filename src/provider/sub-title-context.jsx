"use client";

import { useContext, createContext, useState } from "react";

/**
 * @typedef {{ idx: number; textContent: string; current: boolean; scrollTop: number }} SubTitle
 */

export const SubTitleContext = createContext({
  /** @type {Array<SubTitle>} */
  subTitleList: [],

  /** @type {React.Dispatch<React.SetStateAction<Array<SubTitle>> | null>} */
  setSubTitleList: null,
});

export const SubTitleProvider = ({ children }) => {
  /** @type {[SubTitle[], React.Dispatch<React.SetStateAction<SubTitle[]>>]} */
  const [subTitleList, setSubTitleList] = useState([]);

  return (
    <SubTitleContext.Provider
      value={{
        subTitleList,
        setSubTitleList,
      }}
    >
      {children}
    </SubTitleContext.Provider>
  );
};

export const useSubTitleList = () => {
  const ctx = useContext(SubTitleContext);
  if (!ctx) throw new Error("useRefContext must be used within RefProvider");
  return ctx;
};
