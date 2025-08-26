"use client";

import { DataClientContext } from "@/context/wixContext";
import { useContext } from "react";

export const useDataClient = () => {
  return useContext(DataClientContext);
};

// Keep the old name for backward compatibility
export const useWixClient = useDataClient;
