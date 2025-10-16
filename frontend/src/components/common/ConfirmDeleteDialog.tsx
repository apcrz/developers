import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteDialogProps {
   children: React.ReactNode; // o botão ou trigger
   title?: string;
   description?: string;
   onConfirm: () => void;
}

export function ConfirmDeleteDialog({
   children,
   title = "Tem certeza?",
   description = "Essa ação não pode ser desfeita.",
   onConfirm,
}: ConfirmDeleteDialogProps) {
   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{title}</AlertDialogTitle>
            </AlertDialogHeader>
            <p className="text-sm text-muted-foreground">{description}</p>
            <AlertDialogFooter>
               <AlertDialogCancel>Cancelar</AlertDialogCancel>
               <AlertDialogAction onClick={onConfirm}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
