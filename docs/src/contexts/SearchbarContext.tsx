import React, { createContext, useContext, useState } from "react";

interface SearchbarProps {
  open: boolean;
  openSearchbar: () => void;
  closeSearchbar: () => void;
}

const SearchbarContext = createContext<SearchbarProps | null>(null);

export function SearchbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);

  const closeSearchbar = () => {
    setOpen(false);
    document.body.style.overflowY = "auto";
  };

  const openSearchbar = () => {
    document.body.style.overflowY = "hidden";
    setOpen(true);
  };

  return (
    <SearchbarContext.Provider value={{ open, openSearchbar, closeSearchbar }}>
      {children}
    </SearchbarContext.Provider>
  );
}

export const useSearchbarState = () => {
  const state = useContext(SearchbarContext);
  if (!state) throw new Error("Cannot find SearchbarContext Provider");
  return state;
};
