import React from 'react';
import { 
  Box, 
  Text, 
  Flex, 
  Heading, 
  useColorModeValue,
  CircularProgress,
  CircularProgressLabel,
  Badge,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Enhanced MetricCard component for displaying health and medical metrics
 * 
 * @param {Object} props
 * @param {string} props.title - Metric title
 * @param {string|number} props.value - Metric value
 * @param {string} props.unit - Optional unit (%, bpm, etc)
 * @param {string} props.status - Status (normal, warning, critical, success)
 * @param {Object} props.icon - FontAwesome icon
 * @param {boolean} props.showProgress - Whether to show circular progress
 * @param {number} props.max - Maximum value for progress (default 100)
 * @param {string} props.description - Optional description text
 * @param {boolean} props.isGlassomorphic - Use glassmorphism style
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
  isGlassomorphic = false,
  ...props
}) => {
  // Define color schemes based on status
  const statusColors = {
    normal: {
      bg: useColorModeValue('blue.50', 'blue.900'),
      color: useColorModeValue('blue.500', 'blue.200'),
      gradientStart: useColorModeValue('blue.400', 'blue.700'),
      gradientEnd: useColorModeValue('cyan.400', 'cyan.800'),
      borderColor: useColorModeValue('blue.200', 'blue.700'),
      progressColor: 'blue',
      hoverBg: useColorModeValue('blue.100', 'blue.800'),
    },
    warning: {
      bg: useColorModeValue('orange.50', 'orange.900'),
      color: useColorModeValue('orange.500', 'orange.200'),
      gradientStart: useColorModeValue('orange.400', 'orange.700'),
      gradientEnd: useColorModeValue('yellow.400', 'yellow.800'),
      borderColor: useColorModeValue('orange.200', 'orange.700'),
      progressColor: 'orange',
      hoverBg: useColorModeValue('orange.100', 'orange.800'),
    },
    critical: {
      bg: useColorModeValue('red.50', 'red.900'),
      color: useColorModeValue('red.500', 'red.200'),
      gradientStart: useColorModeValue('red.400', 'red.700'),
      gradientEnd: useColorModeValue('pink.400', 'pink.800'),
      borderColor: useColorModeValue('red.200', 'red.700'),
      progressColor: 'red',
      hoverBg: useColorModeValue('red.100', 'red.800'),
    },
    success: {
      bg: useColorModeValue('green.50', 'green.900'),
      color: useColorModeValue('green.500', 'green.200'),
      gradientStart: useColorModeValue('green.400', 'green.700'),
      gradientEnd: useColorModeValue('teal.400', 'teal.800'),
      borderColor: useColorModeValue('green.200', 'green.700'),
      progressColor: 'green',
      hoverBg: useColorModeValue('green.100', 'green.800'),
    },
  };

  const colors = statusColors[status] || statusColors.normal;
  const numericValue = Number(value) || 0;
  const percentage = (numericValue / max) * 100;

  // Apply glassmorphism style if enabled
  const glassmorphicStyle = isGlassomorphic ? {
    bg: useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)'),
    backdropFilter: 'blur(10px)',
    border: '1px solid',
    borderColor: useColorModeValue('rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)'),
  } : {};

  return (
    <Box 
      bg={isGlassomorphic ? glassmorphicStyle.bg : colors.bg}
      bgGradient={!isGlassomorphic && `linear(to-br, ${colors.gradientStart}, ${colors.gradientEnd})`}
      p={5}
      borderRadius="xl"
      border="1px solid"
      borderColor={isGlassomorphic ? glassmorphicStyle.borderColor : colors.borderColor}
      boxShadow={isGlassomorphic ? 'xl' : 'md'}
      position="relative"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-3px)',
        boxShadow: 'lg',
      }}
      {...(isGlassomorphic ? { backdropFilter: glassmorphicStyle.backdropFilter } : {})}
      {...props}
    >
      {/* Decorative elements */}
      <Box
        position="absolute"
        top="-20px"
        right="-20px"
        width="100px"
        height="100px"
        borderRadius="full"
        bg={useColorModeValue('white', 'gray.800')}
        opacity="0.1"
      />
      
      {/* Header */}
      <Flex alignItems="center" mb={3} position="relative" zIndex="1">
        {icon && (
          <Box 
            color={isGlassomorphic ? colors.color : 'white'} 
            mr={3}
            w="1.5rem"
            h="1.5rem"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="md"
            bg={isGlassomorphic ? 'transparent' : 'rgba(255, 255, 255, 0.2)'}
            boxShadow={isGlassomorphic ? 'none' : 'inner'}
          >
            <FontAwesomeIcon icon={icon} size="lg" />
          </Box>
        )}
        <Text 
          fontWeight="semibold" 
          color={isGlassomorphic ? useColorModeValue('gray.700', 'white') : 'white'}
        >
          {title}
        </Text>
        
        {/* Status Badge - show only if we have a status */}
        {status && (
          <Badge 
            ml="auto" 
            colorScheme={colors.progressColor}
            variant={isGlassomorphic ? 'solid' : 'subtle'}
            fontSize="xs"
            borderRadius="full"
            px={2}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )}
      </Flex>

      {/* Content */}
      <Flex 
        alignItems={description ? "flex-start" : "center"} 
        justifyContent={showProgress ? "space-between" : "flex-start"}
        mt={4}
        position="relative"
        zIndex="1"
        flexDirection={description && showProgress ? "column" : "row"}
      >
        <Box>
          <Flex alignItems="baseline">
            <Heading 
              size="xl" 
              color={isGlassomorphic ? colors.color : 'white'} 
              fontWeight="bold"
            >
              {value}
            </Heading>
            {unit && (
              <Text ml={1} color={isGlassomorphic ? 'gray.500' : 'whiteAlpha.800'} fontSize="md">
                {unit}
              </Text>
            )}
          </Flex>
          {description && (
            <Text 
              fontSize="sm" 
              color={isGlassomorphic ? 'gray.500' : 'whiteAlpha.800'} 
              mt={1}
              maxW="80%"
            >
              {description}
            </Text>
          )}
        </Box>

        {showProgress && (
          <Box mt={description ? 4 : 0}>
            <CircularProgress 
              value={percentage} 
              color={`${colors.progressColor}.${isGlassomorphic ? '500' : '200'}`}
              trackColor={isGlassomorphic ? 'gray.200' : 'whiteAlpha.300'}
              size="70px"
              thickness="8px"
            >
              <CircularProgressLabel 
                fontWeight="bold"
                color={isGlassomorphic ? colors.color : 'white'}
              >
                {Math.round(percentage)}%
              </CircularProgressLabel>
            </CircularProgress>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default MetricCard; 