interface Developer {
   id: number;
   levelId: number;
   name: string;
   gender: string;
   birthDate: string;
   hobby: string;
   createdAt: string;
   updatedAt: string;
}

interface Meta {
   totalItems: number;
   totalPages: number;
   currentPage: number;
   perPage: number;
}

export interface DevelopersResponse {
   data: Developer[];
   meta: Meta;
}