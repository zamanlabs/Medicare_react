import { extendTheme } from '@chakra-ui/react';

// Theme with color mode support, enhanced aesthetics and animations
const theme = extendTheme({
  // Set up CSS variables for dark mode support
  styles: {
    global: (props) => ({
      ':root': {
        '--color-bg-primary': props.colorMode === 'dark' ? '#1A202C' : '#FFFFFF',
        '--color-bg-secondary': props.colorMode === 'dark' ? '#2D3748' : '#F7FAFC',
        '--color-text-primary': props.colorMode === 'dark' ? '#FFFFFF' : '#1A202C',
        '--color-text-secondary': props.colorMode === 'dark' ? '#CBD5E0' : '#4A5568',
        '--color-accent-primary': props.colorMode === 'dark' ? '#63B3ED' : '#3182CE',
        '--color-accent-secondary': props.colorMode === 'dark' ? '#4FD1C5' : '#38B2AC',
      },
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        transition: 'background-color 0.2s, color 0.2s',
      },
      '*::selection': {
        bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.200',
      }
    }),
  },
  fonts: {
    heading: `'Inter', 'Segoe UI', sans-serif`,
    body: `'Inter', 'Segoe UI', sans-serif`,
  },
  colors: {
    brand: {
      50: '#e6f5ff',
      100: '#c6e4ff',
      200: '#a3d2ff',
      300: '#7ebdff',
      400: '#5aa7ff',
      500: '#3182CE', // Primary brand color
      600: '#2b6cb0',
      700: '#1e4e8c',
      800: '#153e75',
      900: '#0c2f5b',
    },
    accent: {
      50: '#e6fffa',
      100: '#b2f5ea',
      200: '#81e6d9',
      300: '#4fd1c5',
      400: '#38b2ac',
      500: '#319795',
      600: '#2c7a7b',
      700: '#285e61',
      800: '#234e52',
      900: '#1d4044',
    },
  },
  shadows: {
    // Enhanced shadows for more depth
    outline: '0 0 0 3px rgba(49, 130, 206, 0.6)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    cardHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'lg',
        _hover: {
          transform: 'translateY(-1px)',
          boxShadow: 'lg',
        },
        _active: {
          transform: 'translateY(0)',
        },
        transition: 'all 0.2s',
      },
      variants: {
        primary: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        secondary: {
          bg: 'accent.400',
          color: 'white',
          _hover: {
            bg: 'accent.500',
          },
        },
        ghost: {
          _hover: {
            bg: 'blackAlpha.50',
            transform: 'none',
            boxShadow: 'none',
          },
        },
      },
    },
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: 'none',
        },
        transition: 'color 0.2s',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: 'card',
          _hover: {
            boxShadow: 'cardHover',
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 3,
        py: 1,
        fontWeight: 'medium',
      },
    },
    Drawer: {
      baseStyle: {
        dialog: {
          borderRightRadius: 'lg',
          boxShadow: 'xl',
        },
      },
    },
  },
  transition: {
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    duration: {
      fastest: '50ms',
      faster: '100ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '400ms',
      slowest: '500ms',
    },
  },
  radii: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
});

export default theme; 