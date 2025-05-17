"use client";

import { useState, useEffect, useCallback } from "react";

// Simple SVG icons (replace with your preferred icons or import from a library)
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v1m0 16v1m8.66-15.66l-.707.707M4.04 19.96l-.707.707M21 12h-1M4 12H3m15.66 8.66l-.707-.707M4.04 4.04l-.707-.707"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

export function ThemeToggleButton() {
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    // This effect runs once on mount to set the initial theme
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setCurrentTheme(storedTheme);
    } else {
      // If no theme is stored, check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setCurrentTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    // This effect applies the theme to the HTML element and localStorage
    if (currentTheme === undefined) return; // Don't do anything until initial theme is determined

    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = useCallback(() => {
    setCurrentTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  }, []);

  if (currentTheme === undefined) {
    // Avoid rendering the button until the theme is determined to prevent icon flicker
    // You could return a placeholder or null
    return <div className="h-9 w-9" />; // Placeholder with same size as button
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      aria-label={`Switch to ${
        currentTheme === "light" ? "dark" : "light"
      } mode`}
    >
      {currentTheme === "light" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
