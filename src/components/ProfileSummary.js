import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faVenusMars,
  faWeight,
  faDroplet,
  faUserMd,
  faAllergies,
  faCheckCircle,
  faSync,
  faShieldAlt,
  faIdCard,
  faCalendarAlt,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  Link,
  Badge,
  Divider,
  Tooltip,
  IconButton,
  Button,
  Avatar,
  AvatarBadge,
  useColorModeValue,
  Skeleton,
  ScaleFade,
  SlideFade
} from '@chakra-ui/react';
import { useUserProfile } from '../context/UserProfileContext';
import { motion } from 'framer-motion';

// Create motion components
const MotionBox = motion(Box);

// Animation variants
const pulseAnimation = {
  scale: [1, 1.03, 1],
  transition: { 
    duration: 3, 
    repeat: Infinity,
    repeatType: "reverse"
  }
};

const ProfileSummary = ({ userProfile, profileCompletion }) => {
  // Local state to track if we're refreshing
  const [refreshing, setRefreshing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Get the fetchProfile function from the context
  const { fetchProfile } = useUserProfile();
  
  // Check if profile is fully completed
  const isProfileComplete = profileCompletion === 100;
  
  // Handle refresh click
  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfile().finally(() => {
      setTimeout(() => setRefreshing(false), 500);
    });
  };
  
  // Format weight with unit
  const formatWeight = (weight) => {
    if (!weight) return null;
    return `${weight} kg`;
  };
  
  // Format capitalized text
  const formatCapitalized = (text) => {
    if (!text) return null;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  
  // Auto-refresh profile data periodically
  useEffect(() => {
    // Refresh profile data every 30 seconds
    const intervalId = setInterval(() => {
      fetchProfile();
    }, 30000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchProfile]);
  
  // Calculate user initials for avatar
  const getInitials = () => {
    if (!userProfile?.fullName) return '?';
    return userProfile.fullName.split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2); // Max 2 initials
  };
  
  // Custom colors and gradients
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('purple.200', 'purple.700');
  const progressBg = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const subTextColor = useColorModeValue('gray.600', 'gray.400');
  const subtleGradient = useColorModeValue(
    'linear(to-br, purple.50, blue.50)',
    'linear(to-br, purple.900, blue.900)'
  );
  const shadowColor = useColorModeValue(
    '0 4px 6px rgba(160, 174, 192, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    '0 4px 6px rgba(0, 0, 0, 0.4)'
  );
  
  // Render profile completion progress
  const renderProfileProgress = () => (
    <VStack align="stretch" spacing={2} mt={4}>
      <HStack justifyContent="space-between">
        <Text fontSize="sm" fontWeight="medium">{profileCompletion}% complete</Text>
        <Badge colorScheme="purple" variant="subtle">Incomplete</Badge>
      </HStack>
      <Progress 
        value={profileCompletion} 
        size="sm" 
        colorScheme="purple" 
        borderRadius="full"
        bg={progressBg}
        hasStripe
        isAnimated
      />
      <Button
        as={RouterLink}
        to="/profile"
        size="sm"
        colorScheme="purple"
        variant="outline"
        leftIcon={<FontAwesomeIcon icon={faEdit} />}
        mt={2}
        width="full"
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: 'md',
        }}
        transition="all 0.2s"
      >
        Complete Profile
      </Button>
    </VStack>
  );
  
  // Render complete profile data
  const renderCompleteProfile = () => (
    <>
      <VStack align="stretch" spacing={3} mt={4}>
        <ScaleFade in={true} initialScale={0.9}>
          {/* Blood Group */}
          {userProfile.bloodGroup && (
            <HStack 
              spacing={3} 
              bg={useColorModeValue('gray.50', 'gray.700')} 
              p={2}
              borderRadius="md"
              _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
              transition="all 0.2s"
            >
              <Box 
                color="red.500" 
                bg={useColorModeValue('red.50', 'red.900')} 
                borderRadius="md"
                p={1.5}
                w="28px"
                h="28px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FontAwesomeIcon icon={faDroplet} />
              </Box>
              <Text fontSize="sm" fontWeight="medium">Blood: {userProfile.bloodGroup}</Text>
            </HStack>
          )}
        </ScaleFade>
        
        <ScaleFade in={true} initialScale={0.9} delay={0.1}>
          {/* Gender */}
          {userProfile.gender && (
            <HStack 
              spacing={3} 
              bg={useColorModeValue('gray.50', 'gray.700')} 
              p={2}
              borderRadius="md"
              _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
              transition="all 0.2s"
            >
              <Box 
                color="purple.500" 
                bg={useColorModeValue('purple.50', 'purple.900')}
                borderRadius="md"
                p={1.5}
                w="28px"
                h="28px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FontAwesomeIcon icon={faVenusMars} />
              </Box>
              <Text fontSize="sm" fontWeight="medium">Gender: {formatCapitalized(userProfile.gender)}</Text>
            </HStack>
          )}
        </ScaleFade>
        
        <ScaleFade in={true} initialScale={0.9} delay={0.2}>
          {/* Weight */}
          {userProfile.weight && (
            <HStack 
              spacing={3} 
              bg={useColorModeValue('gray.50', 'gray.700')} 
              p={2}
              borderRadius="md"
              _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
              transition="all 0.2s"
            >
              <Box 
                color="blue.500" 
                bg={useColorModeValue('blue.50', 'blue.900')}
                borderRadius="md"
                p={1.5}
                w="28px"
                h="28px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FontAwesomeIcon icon={faWeight} />
              </Box>
              <Text fontSize="sm" fontWeight="medium">Weight: {formatWeight(userProfile.weight)}</Text>
            </HStack>
          )}
        </ScaleFade>
      </VStack>
      
      <SlideFade in={true} offsetY={20}>
        <Flex mt={4} justify="space-between" align="center">
          <Badge colorScheme="green" variant="subtle" px={2} py={1}>
            <HStack spacing={1}>
              <FontAwesomeIcon icon={faCheckCircle} />
              <Text>Complete</Text>
            </HStack>
          </Badge>
          <Button
            as={RouterLink}
            to="/profile"
            size="xs"
            variant="ghost"
            colorScheme="purple"
            rightIcon={<FontAwesomeIcon icon={faEdit} />}
            _hover={{
              transform: 'translateY(-1px)',
            }}
            transition="all 0.2s"
          >
            Edit Profile
          </Button>
        </Flex>
      </SlideFade>
    </>
  );

  return (
    <MotionBox
      bg={useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.8)')}
      backdropFilter="blur(8px)"
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      p={5}
      boxShadow={shadowColor}
      position="relative"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-3px)',
        boxShadow: 'lg',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={isProfileComplete ? {} : pulseAnimation}
    >
      {/* Background gradient */}
      <Box
        position="absolute"
        top="0"
        right="0"
        bottom="0"
        left="0"
        bgGradient={subtleGradient}
        opacity="0.5"
        zIndex="0"
      />
      
      {/* Header */}
      <Flex 
        align="center" 
        justify="space-between" 
        position="relative" 
        zIndex="1"
      >
        <HStack spacing={3}>
          <Avatar 
            size="md" 
            name={userProfile.fullName} 
            bg="purple.500"
            color="white"
            boxShadow="md"
            border="2px solid"
            borderColor={useColorModeValue('white', 'gray.700')}
          >
            {profileCompletion < 100 && (
              <AvatarBadge boxSize='1.25em' bg='yellow.500' />
            )}
            {profileCompletion === 100 && (
              <AvatarBadge boxSize='1.25em' bg='green.500'>
                <FontAwesomeIcon icon={faCheckCircle} size="2xs" />
              </AvatarBadge>
            )}
          </Avatar>
          <VStack align="flex-start" spacing={0}>
            <Heading 
              size="sm" 
              fontWeight="semibold" 
              color={textColor}
              noOfLines={1}
            >
              {userProfile.fullName || "Guest User"}
            </Heading>
            <HStack spacing={3} mt={0.5}>
              {userProfile.age && (
                <Text fontSize="xs" color={subTextColor}>
                  <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '4px' }} />
                  {userProfile.age} years
                </Text>
              )}
              {userProfile.patientId && (
                <Text fontSize="xs" color={subTextColor}>
                  <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '4px' }} />
                  ID: {userProfile.patientId}
                </Text>
              )}
            </HStack>
          </VStack>
        </HStack>
        
        <IconButton
          aria-label="Refresh profile"
          icon={<FontAwesomeIcon icon={faSync} spin={refreshing} />}
          size="sm"
          variant="ghost"
          colorScheme="purple"
          onClick={handleRefresh}
          isLoading={refreshing}
          position="relative"
          zIndex="1"
          _hover={{
            transform: 'rotate(180deg)',
            transition: 'transform 0.5s ease-in-out',
          }}
        />
      </Flex>
      
      {/* Content */}
      <Box position="relative" zIndex="1">
        {/* Conditionally render based on completion status */}
        {isProfileComplete ? renderCompleteProfile() : renderProfileProgress()}
      </Box>
    </MotionBox>
  );
};

export default ProfileSummary; 