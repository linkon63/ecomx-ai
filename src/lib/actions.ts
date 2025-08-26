"use server";

import { dataService } from "./dataService";

export const updateUser = async (formData: FormData) => {
  const id = formData.get("id") as string;
  const username = formData.get("username") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  console.log(username)

  try {
    // In a real app, this would update the user in the database
    // For now, we'll just log the update since we're using fake data
    console.log("User update request:", {
      id,
      firstName,
      lastName,
      email,
      phone,
      username
    });
    
    // Simulate successful update
    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, error: err };
  }
};
