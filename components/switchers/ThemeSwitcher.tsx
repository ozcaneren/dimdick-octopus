"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/store/features/themeSlice";
import type { RootState } from "@/store/store";

export default function ThemeSwitcher() {
  const dispatch = useDispatch();
  const { theme, isInitialized } = useSelector((state: RootState) => state.theme);

  if (!isInitialized) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      sizeVariant="icon"
      onClick={() => dispatch(toggleTheme())}
      aria-label="Tema değiştir"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}