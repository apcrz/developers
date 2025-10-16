import { LevelsResponse } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getLevels(): Promise<LevelsResponse> {
   const response = await fetch(`${BASE_URL}/level`);
   if (!response.ok) {
       throw new Error("Failed to fetch levels");
   }
   return response.json();
}