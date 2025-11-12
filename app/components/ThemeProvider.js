"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800"
      >
        {theme === "light" ? (
          <Moon className="h-6 w-6 text-gray-800 dark:text-white" />
        ) : (
          <Sun className="h-6 w-6 text-gray-800 dark:text-white" />
        )}
      </button>
      {children}
    </>
  );
};

export default ThemeProvider;
