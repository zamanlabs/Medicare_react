import React from 'react';
import { 
  Box, 
  Text, 
  Flex, 
  Heading, 
  useColorModeValue,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * MetricCard component for displaying health and medical metrics
 * 
 * @param {Object} props
 * @param {string} props.title - Metric title
 * @param {string|number} props.value - Metric value
 * @param {string} props.unit - Optional unit (%, bpm, etc)
 * @param {string} props.status - Status (normal, warning, critical)
 * @param {Object} props.icon - FontAwesome icon
 * @param {boolean} props.showProgress - Whether to show circular progress
 * @param {number} props.max - Maximum value for progress (default 100)
 * @param {string} props.description - Optional description text
 * @param {Object} props.props - Other Chakra Box props
 */
const MetricCard = ({
  title,
  value,
  unit,
  status = 'normal',
  icon,
  showProgress = false,
  max = 100,
  description,
  ...props
}) => {
  // Define color schemes based on status
  const statusColors = {
    normal: {
      bg: useColorModeValue('blue.50', 'blue.900'),
      color: useColorModeValue('blue.500', 'blue.200'),
      borderColor: useColorModeValue('blue.200', 'blue.700'),
      progressColor: 'blue',
    },
    warning: {
      bg: useColorModeValue('orange.50', 'orange.900'),
      color: useColorModeValue('orange.500', 'orange.200'),
      borderColor: useColorModeValue('orange.200', 'orange.700'),
      progressColor: 'orange',
    },
    critical: {
      bg: useColorModeValue('red.50', 'red.900'),
      color: useColorModeValue('red.500', 'red.200'),
      borderColor: useColorModeValue('red.200', 'red.700'),
      progressColor: 'red',
    },
    success: {
      bg: useColorModeValue('green.50', 'green.900'),
      color: useColorModeValue('green.500', 'green.200'),
      borderColor: useColorModeValue('green.200', 'green.700'),
      progressColor: 'green',
    },
  };

  const colors = statusColors[status] || statusColors.normal;
  const numericValue = Number(value) || 0;
  const percentage = (numericValue / max) * 100;

  return (
    <Box 
      bg={colors.bg}
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor={colors.borderColor}
      {...props}
    >
      <Flex alignItems="center" mb={2}>
        {icon && (
          <Box 
            color={colors.color} 
            mr={3}
            w="1.5rem"
            textAlign="center"
          >
            <FontAwesomeIcon icon={icon} size="lg" />
          </Box>
        )}
        <Text fontWeight="medium" color="gray.700">{title}</Text>
      </Flex>

      <Flex 
        alignItems="center" 
        justifyContent={showProgress ? "space-between" : "flex-start"}
        mt={3}
      >
        <Box>
          <Flex alignItems="baseline">
            <Heading size="lg" color={colors.color} fontWeight="bold">
              {value}
            </Heading>
            {unit && (
              <Text ml={1} color="gray.500" fontSize="sm">
                {unit}
              </Text>
            )}
          </Flex>
          {description && (
            <Text fontSize="sm" color="gray.500" mt={1}>
              {description}
            </Text>
          )}
        </Box>

        {showProgress && (
          <CircularProgress 
            value={percentage} 
            color={`${colors.progressColor}.500`}
            size="60px"
            thickness="8px"
          >
            <CircularProgressLabel fontWeight="bold">
              {Math.round(percentage)}%
            </CircularProgressLabel>
          </CircularProgress>
        )}
      </Flex>
    </Box>
  );
};

export default MetricCard; 