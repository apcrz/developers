import { useQuery } from "@tanstack/react-query";
import { getDevelopers } from "@/lib/api";
import { DevelopersResponse } from "@/lib/types";

export function useDevelopers() {
   return useQuery<DevelopersResponse>({
      queryKey: ['developers'],
      queryFn: getDevelopers,
   })
}