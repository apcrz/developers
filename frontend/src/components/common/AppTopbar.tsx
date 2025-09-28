"use client";

import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function AppTopbar() {
   const { setTheme, theme } = useTheme();

   return (
      <header className="w-full bg-background border-b p-4 flex justify-between items-center">
         <h1 className="text-xl font-bold">Gazin Test Dashboard</h1>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="outline" size="icon" aria-label="Mudar tema">
                  {theme === "light" ? (
                     <Sun className="h-5 w-5" />
                  ) : (
                     <Moon className="h-5 w-5" />
                  )}
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuItem onClick={() => setTheme("light")}>
                  Claro
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Escuro
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setTheme("system")}>
                  Sistema
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </header>
   );
}