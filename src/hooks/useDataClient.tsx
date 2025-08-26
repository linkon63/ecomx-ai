"use client";

import { DataClientContext } from "@/context/dataContext";
import { useContext } from "react";

export const useDataClient = () => {
  return useContext(DataClientContext);
};
