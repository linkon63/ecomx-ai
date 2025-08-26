"use client";

import { createContext, ReactNode } from "react";
import { dataService } from "@/lib/dataService";

export type DataClient = typeof dataService;

export const DataClientContext = createContext<DataClient>(dataService);

export const DataClientContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <DataClientContext.Provider value={dataService}>
      {children}
    </DataClientContext.Provider>
  );
};
