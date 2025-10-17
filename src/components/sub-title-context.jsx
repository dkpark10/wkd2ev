'use client';

import { useContext, createContext, useState } from "react";

export const SubTitleContext = createContext({
  /** @type {HTMLHeadElement[]} */
  subTitleElement: [],

  /** @type {React.Dispatch<React.SetStateAction<HTMLHeadElement[]> | null>} */
  setSubTitleElement: null,
});

export const SubTitleProvider = ({ children }) => {
  /** @type {[HTMLHeadElement[], React.Dispatch<React.SetStateAction<HTMLHeadElement[]>>]} */
  const [subTitleElement, setSubTitleElement] = useState([]);

  return (
    <SubTitleContext.Provider value={{
      subTitleElement,
      setSubTitleElement,
    }}>
      {children}
    </SubTitleContext.Provider>
  )
}

export const useSubTitleList = () => {
  const ctx = useContext(SubTitleContext);
  if (!ctx) throw new Error("useRefContext must be used within RefProvider");
  return ctx;

}