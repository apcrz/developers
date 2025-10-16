import { DevelopersResponse } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getDevelopers(): Promise<DevelopersResponse> {
   const response = await fetch(`${BASE_URL}/developer`);
   if (!response.ok) {
       throw new Error("Failed to fetch developers");
   }
   return response.json();
}
