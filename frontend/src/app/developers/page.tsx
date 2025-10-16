'use client';

import { useDevelopers } from "@/hooks/use-developer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DevelopersPage() {
   const { data, isLoading, error } = useDevelopers();
   const developers = data?.data;

   if (isLoading) {
      return (
         <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-40" />
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>ID</TableHead>
                     <TableHead>Nome</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {[...Array(6)].map((_, i) => (
                     <TableRow key={i}>
                        <TableCell>
                           <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell>
                           <Skeleton className="h-4 w-24" />
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      );
   }

   if (error) {
      return (
         <div className="p-6">
            <Alert variant="destructive">
               <Terminal className="h-4 w-4" />
               <AlertTitle>Erro</AlertTitle>
               <AlertDescription>Não foi possível carregar os desenvolvedores.</AlertDescription>
            </Alert>
         </div>
      );
   }

   return (
      <div className="p-6 space-y-4">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Desenvolvedores</h1>
            <Button variant='default' className="cursor-pointer">
               <Plus className="w-4 h-4 mr-2" />
               Novo
            </Button>
         </div>
         {developers?.length === 0 ? (
            <p className="text-muted-foreground">Nenhum desenvolvedor encontrado.</p>
         ) : (
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="w-[100px] font-bold">ID</TableHead>
                     <TableHead className='font-bold'>Nome</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {developers?.map((developer) => {
                     return (
                        <TableRow key={developer.id}>
                           <TableCell>{developer.id}</TableCell>
                           <TableCell>{developer.name}</TableCell>
                        </TableRow>
                     );
                  })}
               </TableBody>
            </Table>
         )}
      </div>
   )
}