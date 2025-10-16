"use client";

import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function AppTopbar() {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   const Icon = !mounted
      ? Sun
      : theme === "light"
         ? Moon
         : Sun;

   return (
      <header className="h-14 border-b-0 flex items-center justify-between px-4 bg-background">
         <div className="flex items-center gap-2">
            <SidebarTrigger />
         </div>

         <div className="flex items-center gap-2">
            <Button
               size="icon"
               variant="ghost"
               onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
               <Icon className="h-4 w-4" />
            </Button>

         </div>
      </header>
   );
}
