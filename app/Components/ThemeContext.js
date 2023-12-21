import React, {createContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({children, theme, setTheme, systemTheme}) => {

  useEffect(() => {
    // set theme to system selected theme
    if (systemTheme) {
      setTheme(systemTheme);
    }
  }, [systemTheme]);


  const toggleTheme = newTheme => {
    setTheme(newTheme);
    // Save selected theme to storage
    AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeContext;