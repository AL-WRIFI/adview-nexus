
import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/theme-provider";

export function ThemeToggle({ variant = "outline", size = "icon" }: { variant?: "outline" | "ghost" | "default", size?: "icon" | "default" | "sm" | "lg" }) {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="dark:bg-dark-surface dark:border-dark-border dark:text-gray-300 dark:hover:bg-dark-muted">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">تبديل المظهر</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark:bg-dark-card dark:border-dark-border">
        <DropdownMenuItem onClick={() => setTheme("light")} className="dark:text-gray-200 dark:hover:bg-dark-muted dark:focus:bg-dark-muted">
          <Sun className="ml-2 h-4 w-4" />
          <span>فاتح</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="dark:text-gray-200 dark:hover:bg-dark-muted dark:focus:bg-dark-muted">
          <Moon className="ml-2 h-4 w-4" />
          <span>داكن</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="dark:text-gray-200 dark:hover:bg-dark-muted dark:focus:bg-dark-muted">
          <span>تلقائي</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
