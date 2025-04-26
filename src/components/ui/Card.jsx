import React from 'react';
import { Box, Heading, Flex, useColorModeValue } from '@chakra-ui/react';

/**
 * Reusable Card component with consistent styling and animation
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Optional card title
 * @param {React.ReactNode} props.action - Optional action component (button, link)
 * @param {string} props.variant - Card style variant (default, outline, elevated, soft, gradient)
 * @param {string} props.colorScheme - Optional color scheme for gradient variant (brand, accent, gray)
 * @param {boolean} props.isHoverable - Whether card should have hover effects
 * @param {Object} props.props - Other Chakra Box props
 */
const Card = ({ 
  children, 
  title,
  action,
  variant = 'default',
  colorScheme = 'brand',
  isHoverable = true,
  ...props 
}) => {
  // Get theme-aware colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const titleColor = useColorModeValue('gray.800', 'white');
  
  // Color scheme mapping
  const colorSchemes = {
    brand: {
      light: 'linear(to-br, brand.50, blue.50)',
      dark: 'linear(to-br, gray.800, blue.900)',
      border: useColorModeValue('brand.200', 'blue.800')
    },
    accent: {
      light: 'linear(to-br, accent.50, green.50)', 
      dark: 'linear(to-br, gray.800, green.900)',
      border: useColorModeValue('accent.200', 'green.800')
    },
    gray: {
      light: 'linear(to-br, gray.50, gray.100)',
      dark: 'linear(to-br, gray.800, gray.900)', 
      border: useColorModeValue('gray.200', 'gray.700')
    }
  };
  
  const selectedScheme = colorSchemes[colorScheme] || colorSchemes.brand;
  
  // Different card style variants
  const cardStyles = {
    default: {
      bg: bgColor,
      boxShadow: 'md',
      borderRadius: 'xl',
      border: '1px solid',
      borderColor: 'transparent',
      _hover: isHoverable ? {
        boxShadow: 'lg',
        transform: 'translateY(-2px)',
      } : {},
    },
    outline: {
      bg: bgColor,
      border: '1px solid',
      borderColor: borderColor,
      borderRadius: 'xl',
      _hover: isHoverable ? {
        boxShadow: 'sm',
        borderColor: useColorModeValue('gray.300', 'gray.600'),
        transform: 'translateY(-2px)',
      } : {},
    },
    elevated: {
      bg: bgColor,
      boxShadow: 'xl',
      borderRadius: 'xl',
      _hover: isHoverable ? {
        boxShadow: '2xl',
        transform: 'translateY(-3px)',
      } : {},
    },
    soft: {
      bg: useColorModeValue('gray.50', 'gray.900'),
      border: '1px solid',
      borderColor: borderColor,
      borderRadius: 'xl',
      _hover: isHoverable ? {
        bg: useColorModeValue('gray.100', 'gray.800'),
      } : {},
    },
    gradient: {
      bgGradient: useColorModeValue(selectedScheme.light, selectedScheme.dark),
      border: '1px solid',
      borderColor: selectedScheme.border,
      borderRadius: 'xl',
      boxShadow: 'md',
      _hover: isHoverable ? {
        boxShadow: 'lg',
        transform: 'translateY(-2px)',
      } : {},
    }
  };

  return (
    <Box 
      p={5}
      {...cardStyles[variant]}
      transition="all 0.3s ease"
      overflow="hidden"
      {...props}
    >
      {(title || action) && (
        <Flex 
          justify="space-between" 
          align="center" 
          mb={4}
          pb={title ? 2 : 0}
          borderBottom={title ? '1px solid' : 'none'}
          borderColor="gray.200"
        >
          {title && (
            <Heading
              size="md"
              fontWeight="semibold"
              color={titleColor}
              letterSpacing="tight"
              bgGradient={variant === 'gradient' ? useColorModeValue('linear(to-r, brand.500, accent.500)', 'linear(to-r, brand.300, accent.300)') : 'none'}
              bgClip={variant === 'gradient' ? 'text' : 'unset'}
            >
              {title}
            </Heading>
          )}
          {action && action}
        </Flex>
      )}
      {children}
    </Box>
  );
};

export default Card; 