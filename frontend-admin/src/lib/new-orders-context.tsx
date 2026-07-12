"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface NewOrdersContextValue {
  newCount: number;
  setNewCount: (n: number) => void;
}

const NewOrdersContext = createContext<NewOrdersContextValue>({
  newCount: 0,
  setNewCount: () => {},
});

export function NewOrdersProvider({ children }: { children: ReactNode }) {
  const [newCount, setNewCount] = useState(0);
  return (
    <NewOrdersContext.Provider value={{ newCount, setNewCount }}>
      {children}
    </NewOrdersContext.Provider>
  );
}

export const useNewOrders = () => useContext(NewOrdersContext);
