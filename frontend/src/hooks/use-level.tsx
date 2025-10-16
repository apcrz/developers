import { useQuery } from "@tanstack/react-query";
import { getLevels } from "@/lib/api";
import { LevelsResponse } from "@/lib/types";

export function useLevels() {
   return useQuery<LevelsResponse>({
      queryKey: ['levels'],
      queryFn: getLevels,
   })
}