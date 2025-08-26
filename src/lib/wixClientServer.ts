import { dataService } from "./dataService";

export const dataClientServer = async () => {
  // No authentication needed for local data
  return dataService;
};

// Keep the old name for backward compatibility
export const wixClientServer = dataClientServer;
