import React, { createContext, useContext, useState, useEffect } from "react";

const PopUpContext = createContext(null);

export const PopUpProvider = ({ children }) => {
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [PopUpContent, setPopUpContent] = useState(null);

  const closePopUp = () => {
    setIsPopUpOpen(false);
  };

  const openPopUp = () => {
    setIsPopUpOpen(true);
  };

  return (
    <PopUpContext.Provider
      value={{
        isPopUpOpen,
        PopUpContent,
        closePopUp,
        openPopUp,
      }}
    >
      {children}
    </PopUpContext.Provider>
  );
};

export function usePopUpContext() {
  return useContext(PopUpContext);
}
