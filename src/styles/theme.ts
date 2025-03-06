export const theme = {
  colors: {
    primary: '#4F46E5', // Indigo
    secondary: '#10B981', // Emerald
    accent: '#F59E0B', // Amber
    dark: '#111827', // Dark gray
    light: '#F9FAFB', // Light gray
    white: '#FFFFFF',
    black: '#000000',
    background: '#0F172A', // Dark blue/slate
    card: '#1E293B', // Lighter blue/slate
    text: {
      primary: '#F9FAFB',
      secondary: '#94A3B8',
      accent: '#4F46E5',
    },
    gradient: {
      primary: 'linear-gradient(90deg, #4F46E5 0%, #10B981 100%)',
      secondary: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)',
    },
  },
  fonts: {
    primary: "'Inter', sans-serif",
    secondary: "'Poppins', sans-serif",
    code: "'Fira Code', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  zIndices: {
    base: 0,
    overlay: 10,
    modal: 20,
    tooltip: 30,
  },
};

export type Theme = typeof theme;
