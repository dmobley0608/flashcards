import React, { createContext, useContext, useState } from "react";

interface LoaderContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return <LoaderContext.Provider value={{ isLoading, setIsLoading }}>{children}</LoaderContext.Provider>;
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
}
