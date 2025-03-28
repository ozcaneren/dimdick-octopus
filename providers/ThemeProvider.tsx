"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { initializeTheme } from "@/store/features/themeSlice";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { theme, isInitialized } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeTheme());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme, isInitialized]);

  return <>{children}</>;
}