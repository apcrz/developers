interface Level {
   id: number;
   level: string;
   createdAt: string;
   updatedAt: string;
}

interface Meta {
   totalItems: number;
   totalPages: number;
   currentPage: number;
   perPage: number;
}

export interface LevelsResponse {
   data: Level[];
   meta: Meta;
}