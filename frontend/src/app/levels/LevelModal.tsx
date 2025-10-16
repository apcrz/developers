'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface LevelModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export function LevelModal({ open, onOpenChange }: LevelModalProps) {
   const [levelName, setLevelName] = useState('');

   const handleSubmit = () => {
      console.log('Novo nível:', levelName);
      setLevelName('');
      onOpenChange(false);
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogTrigger asChild>
            <Button variant="default" className="cursor-pointer">
               <Plus className="w-4 h-4 mr-2" />
               Novo
            </Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle>Novo Nível</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
               <div className="flex flex-col space-y-2">
                  <label htmlFor="level" className="text-sm font-medium">
                     Nome do Nível
                  </label>
                  <Input
                     id="level"
                     value={levelName}
                     onChange={(e) => setLevelName(e.target.value)}
                     placeholder="Ex: Júnior, Pleno, Sênior"
                  />
               </div>
            </div>

            <DialogFooter>
               <DialogClose asChild>
                  <Button type="button" variant="outline">
                     Cancelar
                  </Button>
               </DialogClose>
               <Button type="button" onClick={handleSubmit} disabled={!levelName.trim()}>
                  Salvar
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
