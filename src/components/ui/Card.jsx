import React from 'react';
import { Box, Heading, Flex, useColorModeValue } from '@chakra-ui/react';

/**
 * Reusable Card component with consistent styling
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.title - Optional card title
 * @param {React.ReactNode} props.action - Optional action component (button, link)
 * @param {string} props.variant - Card style variant (default, outline, elevated)
 * @param {Object} props.props - Other Chakra Box props
 */
const Card = ({ 
  children, 
  title,
  action,
  variant = 'default',
  ...props 
}) => {
  // Get theme-aware colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const titleColor = useColorModeValue('gray.800', 'white');
  
  // Different card style variants
  const cardStyles = {
    default: {
      bg: bgColor,
      boxShadow: 'md',
      borderRadius: 'lg',
    },
    outline: {
      bg: bgColor,
      border: '1px solid',
      borderColor: borderColor,
      borderRadius: 'lg',
    },
    elevated: {
      bg: bgColor,
      boxShadow: 'xl',
      borderRadius: 'lg',
    },
    soft: {
      bg: useColorModeValue('gray.50', 'gray.900'),
      border: '1px solid',
      borderColor: borderColor,
      borderRadius: 'lg',
    }
  };

  return (
    <Box 
      p={5}
      {...cardStyles[variant]}
      {...props}
    >
      {(title || action) && (
        <Flex justify="space-between" align="center" mb={4}>
          {title && (
            <Heading
              size="md"
              fontWeight="semibold"
              color={titleColor}
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