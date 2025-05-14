import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {lightTheme, darkTheme} from './themes';

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
  theme: typeof lightTheme;
  themeType: ThemeType;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  themeType: 'light',
  toggleTheme: () => {},
  isDarkMode: false,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [themeType, setThemeType] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved theme from AsyncStorage
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setThemeType(savedTheme);
        }
      } catch (error) {
        console.warn('Failed to load theme', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = themeType === 'light' ? 'dark' : 'light';
    setThemeType(newTheme);

    try {
      await AsyncStorage.setItem('@theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  const theme = themeType === 'light' ? lightTheme : darkTheme;
  const isDarkMode = themeType === 'dark';

  if (isLoading) {
    return null; // Or return a loading indicator
  }

  return (
    <ThemeContext.Provider value={{theme, themeType, toggleTheme, isDarkMode}}>
      {children}
    </ThemeContext.Provider>
  );
};
