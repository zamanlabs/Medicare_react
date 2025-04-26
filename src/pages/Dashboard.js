import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine,
    faHeartPulse,
    faUser,
    faPills,
    faCapsules,
    faDroplet,
    faPhone,
    faHospital,
    faCommentMedical,
    faAmbulance,
    faThermometerHalf,
    faHeadSideCough,
    faLightbulb,
    faSync,
    faLocationArrow,
    faMapLocationDot,
    faChevronRight,
    faShieldAlt,
    faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import {
    Box,
    Grid,
    Heading,
    Text,
    Link,
    Flex,
    Progress,
    SimpleGrid,
    useColorModeValue,
    Button,
    VStack,
    HStack,
    IconButton,
    Badge,
    Divider,
    Spinner,
    Alert,
    AlertIcon,
    SlideFade,
    ScaleFade,
    Fade,
    useDisclosure,
    Tooltip,
    useColorMode,
    Image,
    Tabs,
} from '@chakra-ui/react';
import { Card, StatusBadge, MetricCard } from '../components/ui';
import { useSymptoms } from '../context/SymptomContext';
import { useMedications } from '../context/MedicationContext';
import { useHospitalLocation } from '../context/HospitalLocationContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useWellnessScore } from '../hooks/useWellnessScore';
import { fetchHealthTip } from '../utils/geminiApi';
import CompactMap from '../components/CompactMap';
import ProfileSummary from '../components/ProfileSummary';
import WellnessScoreCard from '../components/WellnessScoreCard';
import SymptomSummary from '../components/SymptomSummary';
import { motion } from 'framer-motion';

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Helper function to get severity color
const getSeverityColor = (value) => {
    if (!value) return 'gray';
    if (value <= 3) return 'green';
    if (value <= 7) return 'yellow';
    return 'red';
};

// Helper function to format date concisely for dashboard
const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
        return dateString.split('T')[0]; // Basic fallback
    }
};

// Staggered animation variants for lists
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

// Subtle animation for dashboard elements
const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: { 
        duration: 2, 
        repeat: Infinity,
        repeatType: "reverse"
    }
};

const Dashboard = () => {
    // Get data from context
    const { symptoms } = useSymptoms();
    const { medications, calculateAdherenceScore } = useMedications();
    const { userLocation, nearbyHospitals, isLoading, updateUserLocation, getDirectionsUrl } = useHospitalLocation();
    const { userProfile, profileCompletion } = useUserProfile();
    const wellnessData = useWellnessScore();
    const wellnessScore = wellnessData.wellnessScore;
    const { colorMode } = useColorMode();

    // Get the latest 3 symptoms (context already sorts them)
    const latestSymptoms = symptoms.slice(0, 3);

    // State for health tips
    const [currentTip, setCurrentTip] = useState('Loading health tip...');
    const [isLoadingTip, setIsLoadingTip] = useState(true);
    const [tipError, setTipError] = useState(null);
    const [tipChanging, setTipChanging] = useState(false);
    
    // Animation disclosure hooks
    const heroDisc = useDisclosure({ defaultIsOpen: true });
    const recentDisc = useDisclosure({ defaultIsOpen: true });
    const mapDisc = useDisclosure({ defaultIsOpen: true });
    
    // Reference for IntersectionObserver
    const observerRefs = {
        metricsRef: useRef(null),
        medicationRef: useRef(null),
        mapRef: useRef(null)
    };
    
    // Animation states for on-scroll reveal
    const [visibleSections, setVisibleSections] = useState({
        metrics: false,
        medication: false,
        map: false
    });

    // Set up intersection observer for animations
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.dataset.section;
                    if (sectionId) {
                        setVisibleSections(prev => ({
                            ...prev,
                            [sectionId]: true
                        }));
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, options);
        
        // Observe each ref if it exists
        Object.entries(observerRefs).forEach(([key, ref]) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            // Cleanup observer
            Object.entries(observerRefs).forEach(([key, ref]) => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, []);

    // Function to fetch a new tip
    const getNewTip = useCallback(async () => {
        setTipChanging(true);
        setIsLoadingTip(true);
        setTipError(null);
        try {
            const tip = await fetchHealthTip();
            setTimeout(() => {
            setCurrentTip(tip);
                setTipChanging(false);
                setIsLoadingTip(false);
            }, 500); // Add slight delay for animation
        } catch (error) {
            console.error("Dashboard: Failed to get health tip", error);
            setTipError(error.message || "Could not fetch health tip.");
            setCurrentTip("Could not load tip at this moment."); // Fallback message
            setTipChanging(false);
            setIsLoadingTip(false);
        }
    }, []);

    // Effect for initial load and interval fetching
    useEffect(() => {
        getNewTip(); // Fetch initial tip

        const intervalId = setInterval(() => {
            getNewTip();
        }, 60000); // Fetch every 1 minute (60000 ms)

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [getNewTip]); // Rerun if getNewTip changes (due to useCallback dependencies, though none here)

    const handleRefreshTip = () => {
        getNewTip(); // Manually trigger fetch
    };

    // Get user location if not already set
    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    updateUserLocation(newLocation);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    // If we don't have user location, try to get it on page load
    useEffect(() => {
        if (!userLocation) {
            handleGetLocation();
        }
    }, [userLocation]);

    // Take the first 2 medications for the dashboard preview
    const medicationPreview = medications.slice(0, 2);

    // Get the nearest hospital
    const nearestHospital = nearbyHospitals.length > 0 ? nearbyHospitals[0] : null;

    // Handle getting directions to the nearest hospital
    const handleGetDirections = () => {
        if (nearestHospital) {
            const directionsUrl = getDirectionsUrl(nearestHospital);
            if (directionsUrl) {
                window.open(directionsUrl, '_blank');
            }
        }
    };

    // Determine status description based on score
    const getWellnessStatus = (score) => {
        if (score >= 80) return { description: 'Excellent condition', status: 'success' };
        if (score >= 60) return { description: 'Good condition', status: 'success' };
        if (score >= 40) return { description: 'Fair condition', status: 'warning' };
        return { description: 'Needs attention', status: 'error' };
    };
    const wellnessStatus = getWellnessStatus(wellnessScore);

    // Custom gradients and colors
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const highlightGradient = useColorModeValue(
        'linear(to-r, brand.500, accent.400)',
        'linear(to-r, brand.700, accent.600)'
    );
    const shadowColor = useColorModeValue(
        '0 4px 6px rgba(49, 130, 206, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        '0 4px 6px rgba(0, 0, 0, 0.4)'
    );

    return (
        <>
            {/* Welcome Hero Section */}
            <ScaleFade in={heroDisc.isOpen} initialScale={0.95}>
                <MotionBox
                    animate={pulseAnimation}
                    mb={6}
                    overflow="hidden"
                    borderRadius="xl"
                    boxShadow={shadowColor}
                    position="relative"
                    bgGradient={highlightGradient}
                    color="white"
                >
                    <Box 
                        position="absolute" 
                        top="0" 
                        right="0" 
                        bottom="0" 
                        left="0" 
                        bg="url('/images/pattern.svg')" 
                        opacity="0.1" 
                        zIndex="0" 
                    />
                    <Flex 
                        p={6} 
                        direction={{ base: "column", md: "row" }} 
                        align="center" 
                        justify="space-between"
                        position="relative"
                        zIndex="1"
                    >
                        <VStack align="flex-start" spacing={2} mb={{ base: 4, md: 0 }}>
                            <Heading as="h1" size="xl" fontWeight="bold">
                                {userProfile?.fullName ? `Welcome back, ${userProfile.fullName.split(' ')[0]}!` : 'Welcome to Zentorra Medicare'}
                            </Heading>
                            <Text fontSize="lg">
                                Your personal health dashboard is ready
                                </Text>
                            <HStack spacing={4} mt={2}>
                                <Button 
                            as={RouterLink}
                            to="/symptom-tracker"
                                    colorScheme="whiteAlpha"
                            size="md" 
                                    leftIcon={<FontAwesomeIcon icon={faChartLine} />}
                                    _hover={{ transform: 'translateY(-2px)', bg: 'whiteAlpha.300' }}
                                    transition="all 0.2s"
                                >
                                    Track Symptoms
                                </Button>
                                {/* Quick start menu */}
                                <Button 
                                    as={RouterLink}
                                    to="/chat"
                                    variant="solid"
                                    colorScheme="blue"
                                    size="md"
                                    leftIcon={<FontAwesomeIcon icon={faCommentMedical} />}
                                    bg={useColorModeValue("blue.500", "blue.400")}
                                    color="white"
                                    boxShadow="0 0 10px rgba(66, 153, 225, 0.5)"
                                    borderWidth="1px"
                                    borderColor={useColorModeValue("blue.600", "blue.300")}
                                    _hover={{ 
                                        transform: 'translateY(-2px)', 
                                        bg: useColorModeValue("blue.600", "blue.300"),
                                        boxShadow: "0 0 15px rgba(66, 153, 225, 0.8)" 
                                    }}
                                    transition="all 0.3s"
                                    fontWeight="bold"
                                >
                                    AI Health Assistant
                                </Button>
                            </HStack>
                    </VStack>
                        
                        {/* Health tip card */}
                        <Box 
                            bg={useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.8)')} 
                            p={4} 
                            borderRadius="lg" 
                            boxShadow="md"
                            backdropFilter="blur(10px)"
                            maxW={{ base: "100%", md: "350px" }}
                            width="100%"
                            border="1px solid"
                            borderColor="whiteAlpha.300"
                        >
                            <Flex align="center" mb={2}>
                                <Box color="yellow.400" mr={2}>
                               <FontAwesomeIcon icon={faLightbulb} />
                           </Box>
                                <Text 
                                    fontWeight="medium" 
                                    color={useColorModeValue('gray.700', 'white')}
                            >
                                Health Tip
                                </Text>
                        <IconButton
                            aria-label="Refresh health tip"
                                    icon={<FontAwesomeIcon icon={faSync} spin={isLoadingTip} />}
                            size="sm"
                                    ml="auto"
                            onClick={handleRefreshTip}
                            isDisabled={isLoadingTip}
                                    variant="ghost"
                                    color={useColorModeValue('gray.600', 'gray.300')}
                        />
                    </Flex>
                            <Box h="70px" display="flex" alignItems="center">
                                <Fade in={!tipChanging} unmountOnExit>
                                    <Text 
                                        fontSize="sm" 
                                        color={useColorModeValue('gray.700', 'gray.200')}
                                    >
                        {tipError ? (
                                            <Alert status="warning" variant="left-accent" borderRadius="md">
                                <AlertIcon />
                                                {currentTip}
                            </Alert>
                        ) : (
                                            currentTip
                                        )}
                            </Text>
                                </Fade>
                        </Box>
                        </Box>
                    </Flex>
                </MotionBox>
            </ScaleFade>

            {/* Main Dashboard Grid - Full width on mobile, 2/3 - 1/3 on desktop */}
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                {/* Left Column - Metrics */}
                <Box>
                    {/* Dashboard Health Metrics */}
                    <MotionBox
                        ref={observerRefs.metricsRef}
                        data-section="metrics"
                        mb={6}
                    >
                        <SlideFade in={visibleSections.metrics} offsetY="30px">
                            <Card 
                                mb={6} 
                                variant="gradient" 
                                colorScheme="brand"
                                boxShadow={shadowColor}
                            >
                                <Heading 
                                    size="md" 
                                    mb={6}
                                    fontWeight="semibold"
                                    color={useColorModeValue('gray.800', 'white')}
                                >
                                    Health Metrics
                                </Heading>
                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                                    {/* WellnessScore Card */}
                                    <Box>
                                        <WellnessScoreCard />
                                    </Box>

                                    {/* Symptom Tracker Card */}
                                    <MetricCard
                                        title="Recent Symptoms"
                                        value={latestSymptoms.length > 0 ? latestSymptoms[0]?.name || "None" : "No symptoms"}
                                        description={latestSymptoms.length > 0 ? `Last tracked on ${formatShortDate(latestSymptoms[0]?.date || latestSymptoms[0]?.timestamp)}` : "Track your first symptom"}
                                        icon={faHeadSideCough}
                                        status={latestSymptoms.length > 0 ? getSeverityColor(latestSymptoms[0]?.severity) : "normal"}
                                        isGlassomorphic={true}
                                    />

                                    {/* Medication Adherence Card */}
                                    <MetricCard
                                        title="Medication Adherence"
                                        value={calculateAdherenceScore()}
                                        unit="%"
                                        description={medications.length > 0 ? `Based on ${medications.length} medications` : "No medications added"}
                                        icon={faPills}
                                        status={calculateAdherenceScore() >= 80 ? "success" : calculateAdherenceScore() >= 50 ? "normal" : "warning"}
                                        showProgress={true}
                                        isGlassomorphic={true}
                                    />
                                </SimpleGrid>
                            </Card>
                        </SlideFade>
                    </MotionBox>

                    {/* Recent Activity Section */}
                    <Box mb={6} ref={observerRefs.medicationRef} data-section="medication">
                        <SlideFade in={visibleSections.medication} offsetY="30px">
                            <SymptomSummary />
                        </SlideFade>
                    </Box>
                </Box>

                {/* Right Column - Profile & Essential Services */}
                <VStack spacing={6} align="stretch">
                    {/* Profile Summary */}
                    <ScaleFade in={heroDisc.isOpen} initialScale={0.95} delay={0.2}>
                        <ProfileSummary 
                            userProfile={userProfile} 
                            profileCompletion={profileCompletion}
                        />
                    </ScaleFade>

                    {/* Quick Access Services */}
                    <Card variant="outline" boxShadow={shadowColor} title="Quick Access">
                        <SimpleGrid columns={{ base: 2 }} spacing={4} mb={2}>
                            <Box 
                                as={RouterLink} 
                                to="/emergency-services"
                                p={4}
                                bg={useColorModeValue('red.50', 'red.900')}
                                color={useColorModeValue('red.600', 'red.200')}
                                borderRadius="lg"
                                textAlign="center"
                                transition="all 0.2s"
                                _hover={{
                                    transform: 'translateY(-3px)',
                                    boxShadow: 'md',
                                }}
                            >
                                <Box fontSize="2xl" mb={2}><FontAwesomeIcon icon={faAmbulance} /></Box>
                                <Text fontWeight="medium">Emergency</Text>
                            </Box>
                            <Box 
                                as={RouterLink} 
                                to="/telemedicine"
                                p={4}
                                bg={useColorModeValue('green.50', 'green.900')}
                                color={useColorModeValue('green.600', 'green.200')}
                                borderRadius="lg"
                                textAlign="center"
                                transition="all 0.2s"
                                _hover={{
                                    transform: 'translateY(-3px)',
                                    boxShadow: 'md',
                                }}
                            >
                                <Box fontSize="2xl" mb={2}><FontAwesomeIcon icon={faPhone} /></Box>
                                <Text fontWeight="medium">Telemedicine</Text>
                            </Box>
                            <Box 
                                as={RouterLink} 
                                to="/medication"
                                p={4}
                                bg={useColorModeValue('blue.50', 'blue.900')}
                                color={useColorModeValue('blue.600', 'blue.200')}
                                borderRadius="lg"
                                textAlign="center"
                                transition="all 0.2s"
                                _hover={{
                                    transform: 'translateY(-3px)',
                                    boxShadow: 'md',
                                }}
                            >
                                <Box fontSize="2xl" mb={2}><FontAwesomeIcon icon={faPills} /></Box>
                                <Text fontWeight="medium">Medications</Text>
                            </Box>
                            <Box 
                                as={RouterLink}
                                to="/chat"
                                p={4}
                                bg={useColorModeValue('purple.50', 'purple.900')}
                                color={useColorModeValue('purple.600', 'purple.200')}
                                borderRadius="lg"
                                textAlign="center"
                                transition="all 0.2s"
                                _hover={{
                                    transform: 'translateY(-3px)',
                                    boxShadow: 'md',
                                }}
                            >
                                <Box fontSize="2xl" mb={2}><FontAwesomeIcon icon={faCommentMedical} /></Box>
                                <Text fontWeight="medium">AI Health Assistant</Text>
                            </Box>
                        </SimpleGrid>
                    </Card>

                    {/* Nearest Hospital */}
                    <SlideFade in={mapDisc.isOpen} offsetY="20px">
                        <Box ref={observerRefs.mapRef} data-section="map">
                            <SlideFade in={visibleSections.map} offsetY="30px">
                                <Card title="Nearest Hospital" variant="outline" boxShadow={shadowColor}>
                                    {isLoading ? (
                                        <Flex justify="center" align="center" p={4}>
                                            <Spinner color="brand.500" mr={3} />
                                            <Text>Finding nearby hospitals...</Text>
                                        </Flex>
                                    ) : nearestHospital ? (
                                        <VStack align="stretch" spacing={3}>
                                            <Box height="150px" position="relative" overflow="hidden" borderRadius="lg">
                                                <CompactMap 
                                                    userLocation={userLocation} 
                                                    hospital={nearestHospital}
                                                    height="150px" 
                                                />
                                            </Box>
                                            
                                            <Box p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                                                <Flex align="center" mb={1}>
                                                    <Box color="red.500" mr={2}>
                                                        <FontAwesomeIcon icon={faHospital} />
                                                    </Box>
                                                    <Text fontWeight="medium">{nearestHospital.name}</Text>
                                                </Flex>
                                                <Text fontSize="sm" color="gray.500" mb={2}>
                                                    {nearestHospital.address}
                                                </Text>
                                                <Button 
                                                    leftIcon={<FontAwesomeIcon icon={faLocationArrow} />}
                                                    colorScheme="brand"
                                                    size="sm"
                                                    onClick={handleGetDirections}
                                                    isFullWidth
                                                >
                                                    Get Directions
                                                </Button>
                                            </Box>
                                        </VStack>
                                    ) : !userLocation ? (
                                        <VStack p={4} spacing={3}>
                                            <Text>We need your location to find nearby hospitals.</Text>
                                            <Button 
                                                leftIcon={<FontAwesomeIcon icon={faLocationArrow} />}
                                                colorScheme="brand"
                                                onClick={handleGetLocation}
                                                size="sm"
                                            >
                                                Share Location
                                            </Button>
                                        </VStack>
                                    ) : (
                                        <Box p={4} textAlign="center">
                                            <Text mb={2}>No hospitals found nearby.</Text>
                                            <Link 
                        as={RouterLink}
                        to="/emergency-services"
                                                color="brand.500"
                                            >
                                                View all healthcare locations
                                            </Link>
                                        </Box>
                                    )}
                                </Card>
                            </SlideFade>
                        </Box>
                    </SlideFade>
                </VStack>
            </Grid>

            {/* Reminder Section */}
            <Card 
                mt={6} 
                p={5} 
                variant="gradient" 
                colorScheme="accent" 
                boxShadow={shadowColor}
            >
                <Flex 
                    direction={{ base: "column", md: "row" }} 
                    justify="space-between" 
                    align={{ base: "stretch", md: "center" }}
                >
                    <HStack spacing={4} mb={{ base: 4, md: 0 }}>
                        <Box 
                            color={useColorModeValue('accent.500', 'accent.200')} 
                            bg={useColorModeValue('white', 'gray.700')} 
                            p={3} 
                            borderRadius="full"
                            boxShadow="md"
                        >
                            <FontAwesomeIcon icon={faCalendarCheck} size="lg" />
            </Box>
                        <VStack align="flex-start" spacing={0}>
                            <Heading size="md" color={useColorModeValue('gray.800', 'white')}>
                                Stay on track with your health
                            </Heading>
                            <Text color={useColorModeValue('gray.600', 'gray.300')}>
                                Track symptoms, medications, and appointments regularly
                            </Text>
                        </VStack>
                    </HStack>
                    <HStack spacing={3}>
                        <Button 
                            as={RouterLink}
                            to="/symptom-tracker"
                            colorScheme="blue"
                            boxShadow="md"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                            transition="all 0.2s"
                        >
                            Track Symptoms
                        </Button>
                        <Button 
                            as={RouterLink}
                            to="/medication"
                            variant="outline"
                            bg={useColorModeValue('whiteAlpha.900', 'transparent')}
                            borderColor={useColorModeValue('gray.200', 'whiteAlpha.300')}
                            _hover={{ 
                                transform: 'translateY(-2px)', 
                                boxShadow: 'md',
                                bg: useColorModeValue('white', 'whiteAlpha.100') 
                            }}
                            transition="all 0.2s"
                        >
                            View Medications
                        </Button>
                    </HStack>
                </Flex>
            </Card>
        </>
    );
};

export default Dashboard; 