'use client';

import { useContext, createContext, useState } from "react";

export const SubTitleContext = createContext({
  /** @type {HTMLHeadElement[]} */
  subTitleElement: [],

  /** @type {React.Dispatch<React.SetStateAction<HTMLHeadElement[]> | null>} */
  setSubTitleElement: null,

  /** @type {HTMLHeadElement} */
  currentContent: null,

  /** @type {React.Dispatch<React.SetStateAction<number> | null>} */
  setCurrentContent: null
});

export const SubTitleProvider = ({ children }) => {
  /** @type {[HTMLHeadElement[], React.Dispatch<React.SetStateAction<HTMLHeadElement[]>>]} */
  const [subTitleElement, setSubTitleElement] = useState([]);
  
  /** @type {[HTMLHeadElement | null, React.Dispatch<React.SetStateAction<HTMLHeadElement>>]} */
  const [currentContent, setCurrentContent] = useState(null);

  return (
    <SubTitleContext.Provider value={{
      subTitleElement,
      setSubTitleElement,
      currentContent,
      setCurrentContent,
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