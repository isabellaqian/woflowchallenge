import { createContext, useContext, useEffect, useState } from "react";
import React from "react";

const ThemeContext = createContext();

const getTheme = () => {
  const curr_theme = localStorage.getItem("theme");
  console.log("getting theme ", curr_theme);
  return curr_theme;
};

export const ThemeProvider = ({ theme, children }) => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  useEffect(() => {
    theme = ThemeContext._currentValue;
  }, [theme]);
};
