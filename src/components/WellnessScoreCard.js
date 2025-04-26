import React, { useState } from 'react';
import { 
  Box, 
  Text, 
  Flex, 
  Heading, 
  useColorModeValue,
  CircularProgress,
  CircularProgressLabel,
  VStack,
  HStack,
  Badge,
  Progress,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
  Divider,
  Button,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  SlideFade,
  ScaleFade,
  Collapse,
  chakra,
  Icon
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeartPulse, 
  faChevronDown, 
  faChevronUp, 
  faInfoCircle, 
  faExclamationTriangle,
  faPills,
  faUserMd,
  faPercent,
  faArrowUp,
  faArrowDown,
  faQuestionCircle,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { useWellnessScore } from '../hooks/useWellnessScore';
import { motion } from 'framer-motion';

// Create motion components
const MotionBox = chakra(motion.div);
const MotionFlex = chakra(motion.div, {
  baseStyle: {
    display: 'flex',
  },
});

// Animation variants
const pulseAnimation = {
  scale: [1, 1.03, 1],
  transition: { 
    duration: 3, 
    repeat: Infinity,
    repeatType: "reverse"
  }
};

const WellnessScoreCard = () => {
  const [expanded, setExpanded] = useState(false);
  const [showFactorDetails, setShowFactorDetails] = useState(false);
  const wellnessData = useWellnessScore();
  const { wellnessScore, componentScores, insights } = wellnessData;

  // Determine status description based on score
  const getWellnessStatus = (score) => {
    if (score >= 80) return { description: 'Excellent condition', status: 'success' };
    if (score >= 60) return { description: 'Good condition', status: 'success' };
    if (score >= 40) return { description: 'Fair condition', status: 'warning' };
    return { description: 'Needs attention', status: 'error' };
  };
  
  const wellnessStatus = getWellnessStatus(wellnessScore);

  // Component score icons
  const componentIcons = {
    symptomScore: faHeartPulse,
    medicationScore: faPills, 
    doctorFeedbackScore: faUserMd
  };

  // Colors based on status
  const statusColors = {
    normal: {
      bg: useColorModeValue('blue.50', 'blue.900'),
      color: useColorModeValue('blue.500', 'blue.200'),
      borderColor: useColorModeValue('blue.200', 'blue.700'),
      progressColor: 'blue',
      gradientStart: useColorModeValue('blue.400', 'blue.700'),
      gradientEnd: useColorModeValue('cyan.400', 'cyan.800'),
    },
    warning: {
      bg: useColorModeValue('orange.50', 'orange.900'),
      color: useColorModeValue('orange.500', 'orange.200'),
      borderColor: useColorModeValue('orange.200', 'orange.700'),
      progressColor: 'orange',
      gradientStart: useColorModeValue('orange.400', 'orange.700'),
      gradientEnd: useColorModeValue('yellow.400', 'yellow.800'),
    },
    error: {
      bg: useColorModeValue('red.50', 'red.900'),
      color: useColorModeValue('red.500', 'red.200'),
      borderColor: useColorModeValue('red.200', 'red.700'),
      progressColor: 'red',
      gradientStart: useColorModeValue('red.400', 'red.700'),
      gradientEnd: useColorModeValue('pink.400', 'pink.800'),
    },
    success: {
      bg: useColorModeValue('green.50', 'green.900'),
      color: useColorModeValue('green.500', 'green.200'),
      borderColor: useColorModeValue('green.200', 'green.700'),
      progressColor: 'green',
      gradientStart: useColorModeValue('green.400', 'green.700'),
      gradientEnd: useColorModeValue('teal.400', 'teal.800'),
    },
  };

  const colors = statusColors[wellnessStatus.status] || statusColors.normal;

  // Get status color for component scores
  const getComponentScoreColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const getFactorImpactIcon = (score) => {
    if (score >= 80) return faArrowUp;
    if (score <= 40) return faArrowDown;
    return faInfoCircle;
  };

  const getFactorImpactColor = (score) => {
    if (score >= 80) return 'green.500';
    if (score <= 40) return 'red.500';
    return 'blue.500';
  };

  return (
    <MotionBox
      bg={useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.8)')}
      backdropFilter="blur(10px)"
      p={5}
      borderRadius="xl"
      border="1px solid"
      borderColor={colors.borderColor}
      boxShadow="lg"
      position="relative"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-3px)',
        boxShadow: 'xl',
      }}
      animate={pulseAnimation}
    >
      {/* Background gradient effects */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="100%"
        bgGradient={`linear(to-br, ${colors.gradientStart}, ${colors.gradientEnd})`}
        opacity="0.15"
        borderRadius="inherit"
      />
      
      <Box
        position="absolute"
        top="-50px"
        right="-50px"
        width="200px"
        height="200px"
        borderRadius="full"
        bg={useColorModeValue('white', 'gray.800')}
        opacity="0.1"
      />
      
      {/* Header */}
      <Flex alignItems="center" mb={3} position="relative" zIndex="1">
        <Box 
          color={colors.color} 
          bg={useColorModeValue('white', 'gray.700')}
          p={2}
          borderRadius="md"
          mr={3}
          boxShadow="sm"
        >
          <FontAwesomeIcon icon={faShieldAlt} />
        </Box>
        <Text fontWeight="semibold" color={useColorModeValue('gray.700', 'white')}>
          Wellness Score
        </Text>
      </Flex>

      {/* Score Display */}
      <Flex 
        alignItems="center" 
        justifyContent="space-between"
        mt={4}
        mb={4}
        position="relative"
        zIndex="1"
      >
        <Box>
          <Flex alignItems="baseline">
            <Heading size="2xl" color={colors.color} fontWeight="bold">
              {wellnessScore}
            </Heading>
            <Text ml={1} color="gray.500" fontSize="md">
              /100
            </Text>
          </Flex>
          <HStack mt={1} spacing={2}>
            <Badge colorScheme={colors.progressColor} borderRadius="full" px={2}>
              {wellnessStatus.description}
            </Badge>
          </HStack>
        </Box>

        <CircularProgress 
          value={wellnessScore} 
          color={`${colors.progressColor}.500`}
          size="80px"
          thickness="10px"
          trackColor={useColorModeValue('gray.100', 'gray.700')}
          capIsRound
        >
          <CircularProgressLabel fontWeight="bold" fontSize="lg">
            {wellnessScore}%
          </CircularProgressLabel>
        </CircularProgress>
      </Flex>

      {/* Toggle Details Button */}
      <Button 
        size="sm" 
        variant="ghost" 
        width="full" 
        onClick={() => setExpanded(!expanded)}
        rightIcon={
          <FontAwesomeIcon 
            icon={expanded ? faChevronUp : faChevronDown} 
            size="xs" 
          />
        }
        color={colors.color}
        mb={expanded ? 3 : 0}
        position="relative"
        zIndex="1"
        _hover={{
          bg: useColorModeValue('whiteAlpha.500', 'blackAlpha.300'),
        }}
      >
        {expanded ? "Hide Details" : "View Breakdown"}
      </Button>

      {/* Expanded Details */}
      <Collapse in={expanded} animateOpacity>
        <Box mt={3} position="relative" zIndex="1">
          <Divider mb={4} />
          
          {/* Component Scores */}
          <VStack spacing={4} align="stretch">
            {Object.entries(componentScores).map(([key, score]) => (
              <ScaleFade key={key} in={expanded} initialScale={0.9}>
                <Box>
                  <Flex justify="space-between" align="center" mb={1}>
                    <HStack>
                      <Box color={getComponentScoreColor(score.value)} fontSize="sm">
                        <FontAwesomeIcon icon={componentIcons[key] || faInfoCircle} />
                      </Box>
                      <Text fontSize="sm" fontWeight="medium">
                        {score.label}
                      </Text>
                      <Tooltip label={`${Math.round(score.weight * 100)}% of total score`} placement="top">
                        <Badge variant="outline" size="sm" colorScheme={colors.progressColor}>
                          {Math.round(score.weight * 100)}%
                        </Badge>
                      </Tooltip>
                    </HStack>
                    <Text fontWeight="bold" fontSize="sm">
                      {score.value}/100
                    </Text>
                  </Flex>
                  <Progress 
                    value={score.value} 
                    size="sm" 
                    colorScheme={getComponentScoreColor(score.value)} 
                    borderRadius="full"
                    bg={useColorModeValue('gray.100', 'gray.700')}
                    hasStripe
                    isAnimated={score.value > 40}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {score.description}
                  </Text>
                </Box>
              </ScaleFade>
            ))}
          </VStack>

          {/* Factors Button */}
          <Button 
            size="xs" 
            variant="outline" 
            width="full" 
            mt={4}
            onClick={() => setShowFactorDetails(!showFactorDetails)}
            rightIcon={
              <FontAwesomeIcon 
                icon={showFactorDetails ? faChevronUp : faChevronDown} 
                size="xs" 
              />
            }
            borderColor={colors.borderColor}
            color={colors.color}
          >
            {showFactorDetails ? "Hide Factors" : "What Affects My Score?"}
          </Button>

          {/* Factors Explanation */}
          <Collapse in={showFactorDetails}>
            <Box 
              mt={3} 
              p={3} 
              bg={useColorModeValue('gray.50', 'gray.700')} 
              borderRadius="md" 
              fontSize="xs"
              boxShadow="sm"
            >
              <Text fontWeight="medium" mb={2}>Your wellness score is calculated from:</Text>
              <SimpleGrid columns={1} spacing={2}>
                {Object.entries(componentScores).map(([key, score]) => (
                  <Box 
                    key={`factor-${key}`} 
                    p={3} 
                    bg={useColorModeValue('white', 'gray.600')} 
                    borderRadius="md" 
                    boxShadow="sm"
                  >
                    <Flex align="center" mb={1}>
                      <Box color={getFactorImpactColor(score.value)} mr={1}>
                        <FontAwesomeIcon icon={getFactorImpactIcon(score.value)} size="xs" />
                      </Box>
                      <Text fontWeight="medium">{score.label}</Text>
                    </Flex>
                    <Text fontSize="xs" color="gray.500">{score.factors}</Text>
                  </Box>
                ))}
              </SimpleGrid>
              
              {/* Health Insights */}
              {insights && insights.length > 0 && (
                <Box mt={3}>
                  <Text fontWeight="medium" mb={2}>Insights:</Text>
                  <List spacing={1}>
                    {insights.map((insight, idx) => (
                      <ListItem key={idx} display="flex" alignItems="flex-start">
                        <ListIcon as={FontAwesomeIcon} icon={faInfoCircle} color="blue.500" mt={1} />
                        <Text>{insight}</Text>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Collapse>
        </Box>
      </Collapse>
    </MotionBox>
  );
};

export default WellnessScoreCard; 