'use client';

import { useState } from 'react';
import { useLevels } from '@/hooks/use-level';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Terminal, Plus, Pencil, Trash } from 'lucide-react';
import { ActionDropdown } from '@/components/common/ActionDropdown';
import { LevelModal } from './LevelModal';
import { toast } from 'sonner';
export default function LevelsPage() {
   const { data, isLoading, error } = useLevels();
   const levels = data?.data;
   const [isModalOpen, setIsModalOpen] = useState(false);

   if (isLoading) {
      return (
         <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-40" />
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>ID</TableHead>
                     <TableHead>Nível</TableHead>
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
               <AlertDescription>Não foi possível carregar os níveis.</AlertDescription>
            </Alert>
         </div>
      );
   }

   return (
      <div className="p-6 space-y-4">
         <div className='flex justify-between items-center'>
            <h1 className="text-2xl font-semibold">Níveis</h1>
            <LevelModal open={isModalOpen} onOpenChange={setIsModalOpen} />
         </div>

         {levels?.length === 0 ? (
            <p className="text-muted-foreground">Nenhum nível encontrado.</p>
         ) : (
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="w-[100px] font-bold">ID</TableHead>
                     <TableHead className='font-bold'>Nível</TableHead>
                     <TableHead />
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {levels?.map((level) => {
                     const options = [
                        {
                           label: "Editar",
                           icon: <Pencil className="w-4 h-4" />,
                           onClick: () => {
                              console.log("Editar", level.id);
                           },
                        },
                        {
                           label: "Excluir",
                           icon: <Trash className="w-4 h-4" />,
                           onClick: () => {
                              console.log("Excluir", level.id);
                              toast('Funcionalidade ainda não implementada');

                           },
                           destructive: true,
                        },
                     ];

                     return (
                        <TableRow key={level.id}>
                           <TableCell>{level.id}</TableCell>
                           <TableCell>{level.level}</TableCell>
                           <TableCell className="text-right">
                              <ActionDropdown options={options} />
                           </TableCell>
                        </TableRow>
                     );
                  })}
               </TableBody>
            </Table>
         )}
      </div>

   );
}
