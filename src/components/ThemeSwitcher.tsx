"use client";
import { useHydrated } from "@debbl/ahooks";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const { isHydrated } = useHydrated();

  if (!isHydrated) {
    return null;
  }

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
}
