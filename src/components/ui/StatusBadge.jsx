import React from 'react';
import { Badge, Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Status badge component for health metrics, alerts, etc.
 * 
 * @param {Object} props
 * @param {string} props.status - Status type (normal, warning, critical, success)
 * @param {React.ReactNode} props.label - Text to display
 * @param {Object} props.icon - FontAwesome icon
 * @param {Object} props.props - Other Chakra Badge props
 */
const StatusBadge = ({
  status = 'normal',
  label,
  icon,
  ...props
}) => {
  // Define color schemes based on status
  const statusStyles = {
    normal: {
      bg: useColorModeValue('gray.100', 'gray.700'),
      color: useColorModeValue('gray.800', 'white'),
      iconColor: useColorModeValue('gray.500', 'gray.400'),
    },
    warning: {
      bg: useColorModeValue('orange.100', 'orange.900'),
      color: useColorModeValue('orange.800', 'orange.200'),
      iconColor: useColorModeValue('orange.500', 'orange.300'),
    },
    critical: {
      bg: useColorModeValue('red.100', 'red.900'),
      color: useColorModeValue('red.800', 'red.200'),
      iconColor: useColorModeValue('red.500', 'red.300'),
    },
    success: {
      bg: useColorModeValue('green.100', 'green.900'),
      color: useColorModeValue('green.800', 'green.200'),
      iconColor: useColorModeValue('green.500', 'green.300'),
    },
    info: {
      bg: useColorModeValue('blue.100', 'blue.900'),
      color: useColorModeValue('blue.800', 'blue.200'),
      iconColor: useColorModeValue('blue.500', 'blue.300'),
    },
  };

  const style = statusStyles[status] || statusStyles.normal;

  return (
    <Badge
      px={3}
      py={1}
      borderRadius="full"
      {...style}
      {...props}
    >
      <Flex align="center">
        {icon && (
          <Box mr={2} color={style.iconColor}>
            <FontAwesomeIcon icon={icon} />
          </Box>
        )}
        {label}
      </Flex>
    </Badge>
  );
};

export default StatusBadge; 