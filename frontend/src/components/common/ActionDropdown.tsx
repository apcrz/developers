import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface ActionOption {
   label: string;
   icon?: React.ReactNode;
   onClick: () => void;
   destructive?: boolean;
}

interface ActionDropdownProps {
   options: ActionOption[];
   disabled?: boolean;
}

export function ActionDropdown({ options, disabled }: ActionDropdownProps) {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button
               variant="ghost"
               className="h-10 w-10 p-0"
               disabled={disabled}
               aria-label="Abrir menu de ações"
            >
               <MoreHorizontal className="h-5 w-5" />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent
            align="end"
            className="w-44 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl p-1
                   animate-in fade-in zoom-in-75 data-[state=open]:animate-in data-[state=closed]:animate-out"
         >
            {options.map(({ label, icon, onClick, destructive }, idx) => (
               <DropdownMenuItem
                  key={idx}
                  onClick={onClick}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-white/20 ${destructive ? "text-destructive" : ""
                     }`}
               >
                  {icon}
                  <span>{label}</span>
               </DropdownMenuItem>
            ))}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
