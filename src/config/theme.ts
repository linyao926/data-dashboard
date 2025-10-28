export const lightTheme = {
  // Background colors
  bg: {
    primary: 'bg-white',
    secondary: 'bg-gray-50',
    tertiary: 'bg-gray-100',
    card: 'bg-white',
  },

  // Text colors
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    tertiary: 'text-gray-500',
    inverse: 'text-white',
  },

  // Border colors
  border: {
    primary: 'border-gray-200',
    secondary: 'border-gray-300',
  },

  // Hover states
  hover: {
    bg: 'hover:bg-gray-50',
    text: 'hover:text-gray-900',
  },

  // Brand colors
  brand: {
    primary: 'bg-blue-600 text-white',
    primaryHover: 'hover:bg-blue-700',
    secondary: 'bg-blue-50 text-blue-600',
  },
};

export const darkTheme = {
  // Background colors
  bg: {
    primary: 'bg-gray-900',
    secondary: 'bg-gray-800',
    tertiary: 'bg-gray-700',
    card: 'bg-gray-800',
  },

  // Text colors
  text: {
    primary: 'text-white',
    secondary: 'text-gray-300',
    tertiary: 'text-gray-400',
    inverse: 'text-gray-900',
  },

  // Border colors
  border: {
    primary: 'border-gray-700',
    secondary: 'border-gray-600',
  },

  // Hover states
  hover: {
    bg: 'hover:bg-gray-700',
    text: 'hover:text-white',
  },

  // Brand colors (same as light)
  brand: {
    primary: 'bg-blue-600 text-white',
    primaryHover: 'hover:bg-blue-700',
    secondary: 'bg-blue-900 text-blue-300',
  },
};

// Theme type
export type Theme = typeof lightTheme;

// Helper to get theme classes
export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};

/* 
USAGE:

// In component:
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`${theme.bg.card} ${theme.text.primary}`}>
      Content
    </div>
  );
};
*/
