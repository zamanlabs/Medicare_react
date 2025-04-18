import React, { useState, useEffect, useCallback } from 'react';
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
    faMapLocationDot
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
} from '@chakra-ui/react';
import { Card, StatusBadge, MetricCard } from '../components/ui';
import { useSymptoms } from '../context/SymptomContext';
import { useMedications } from '../context/MedicationContext';
import { useHospitalLocation } from '../context/HospitalLocationContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useWellnessScore } from '../hooks/useWellnessScore';
import { fetchHealthTip } from '../utils/geminiApi';
import CompactMap from '../components/CompactMap';

// Helper function to get severity color (can be shared or duplicated)
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

const Dashboard = () => {
    // Get symptoms from context
    const { symptoms } = useSymptoms();
    const { medications, calculateAdherenceScore } = useMedications();
    const { userLocation, nearbyHospitals, isLoading, updateUserLocation, getDirectionsUrl } = useHospitalLocation();
    const { userProfile, profileCompletion } = useUserProfile();
    const wellnessScore = useWellnessScore();

    // Get the latest 3 symptoms (context already sorts them)
    const latestSymptoms = symptoms.slice(0, 3);

    // State for health tips
    const [currentTip, setCurrentTip] = useState('Loading health tip...');
    const [isLoadingTip, setIsLoadingTip] = useState(true);
    const [tipError, setTipError] = useState(null);

    // Function to fetch a new tip
    const getNewTip = useCallback(async () => {
        setIsLoadingTip(true);
        setTipError(null);
        try {
            const tip = await fetchHealthTip();
            setCurrentTip(tip);
        } catch (error) {
            console.error("Dashboard: Failed to get health tip", error);
            setTipError(error.message || "Could not fetch health tip.");
            setCurrentTip("Could not load tip at this moment."); // Fallback message
        }
        setIsLoadingTip(false);
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

    return (
        <>
            {/* Dashboard Health Metrics */}
            <Card mb={6}>
                <Heading 
                    size="md" 
                    mb={4} 
                    pb={2} 
                    borderBottom="1px" 
                    borderColor="gray.200"
                    bgGradient="linear(to-r, brand.500, green.500)"
                    bgClip="text"
                >
                    Health Dashboard
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    {/* Symptom Tracker Card */}
                    <Box
                        bg="blue.50"
                        p={4}
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="blue.200"
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                    >
                        <Box>
                            <Flex align="center" mb={3}>
                                <Box color="blue.500" mr={2}>
                                    <FontAwesomeIcon icon={faChartLine} />
                                </Box>
                                <Heading size="sm" fontWeight="medium">Recent Symptoms</Heading>
                            </Flex>
                            {latestSymptoms.length > 0 ? (
                                <VStack spacing={2} align="stretch" mb={3}>
                                    {latestSymptoms.map(symptom => (
                                        <HStack key={symptom.id} justify="space-between" fontSize="sm">
                                            <Text isTruncated maxW="120px" title={symptom.name}>{symptom.name}</Text>
                                            <Badge colorScheme={getSeverityColor(symptom.severity)}>
                                                {symptom.severity}/10
                                            </Badge>
                                            <Text color="gray.500">{formatShortDate(symptom.date || symptom.timestamp)}</Text>
                                        </HStack>
                                    ))}
                                </VStack>
                            ) : (
                                <Text fontSize="sm" color="gray.600" mb={3}>
                                    No recent symptoms logged. Track your symptoms regularly!
                                </Text>
                            )}
                        </Box>
                        <Link
                            as={RouterLink}
                            to="/symptom-tracker"
                            color="blue.500"
                            fontSize="sm"
                            fontWeight="medium"
                            mt={2}
                        >
                            View All Symptoms →
                        </Link>
                    </Box>

                    {/* Wellness Score Card */}
                    <MetricCard
                        title="Wellness Score"
                        value={wellnessScore}
                        unit="/100"
                        icon={faHeartPulse}
                        status={wellnessStatus.status}
                        showProgress={true}
                        description={wellnessStatus.description}
                    />

                    {/* Profile Summary Card */}
                    <Box 
                        bg="purple.50" 
                        p={4} 
                        borderRadius="lg" 
                        border="1px solid"
                        borderColor="purple.200"
                    >
                        <Flex align="center" mb={2}>
                            <Box color="purple.500" mr={2}>
                                <FontAwesomeIcon icon={faUser} />
                            </Box>
                            <Heading size="sm" fontWeight="medium">Profile</Heading>
                        </Flex>
                        
                        {/* Show profile highlights */}
                        <VStack align="stretch" spacing={1} mt={2} mb={3}>
                            <Text fontSize="sm" fontWeight="medium">{userProfile.fullName}</Text>
                            <HStack spacing={4} fontSize="xs" color="gray.600">
                                {userProfile.age && <Text>{userProfile.age} years</Text>}
                                {userProfile.bloodGroup && <Text>Blood: {userProfile.bloodGroup}</Text>}
                            </HStack>
                        </VStack>
                        
                        <Box mt={2}>
                            <Progress 
                                value={profileCompletion} 
                                size="sm" 
                                colorScheme="purple" 
                                borderRadius="full"
                                mb={1}
                            />
                            <Flex justify="space-between">
                                <Text fontSize="xs" color="gray.500">{profileCompletion}% complete</Text>
                                <Link as={RouterLink} to="/profile" fontSize="xs" color="purple.500">Edit</Link>
                            </Flex>
                        </Box>
                    </Box>
                </SimpleGrid>
            </Card>

            {/* Preview Sections */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                {/* Medication Reminders */}
                <Card>
                    <Flex justify="space-between" align="center" mb={4}>
                        <Heading 
                            size="md" 
                            fontWeight="semibold" 
                            bgGradient="linear(to-r, brand.500, green.500)"
                            bgClip="text"
                        >
                            Medication Reminders
                        </Heading>
                        <Link as={RouterLink} to="/medication" color="blue.500" fontSize="sm">
                            See All
                        </Link>
                    </Flex>
                    <VStack spacing={3} align="stretch">
                        {medicationPreview.length > 0 ? (
                            medicationPreview.map(med => (
                                <Flex 
                                    key={med.id} 
                                    justify="space-between" 
                                    align="center" 
                                    p={3} 
                                    bg="gray.50" 
                                    borderRadius="md"
                                >
                                    <Flex align="center">
                                        <Box 
                                            borderRadius="full" 
                                            bg={med.bgColor} 
                                            p={2} 
                                            mr={3}
                                            color={med.iconColor}
                                        >
                                            <FontAwesomeIcon icon={med.icon} />
                                        </Box>
                                        <Box>
                                            <Text fontWeight="medium">{med.name}</Text>
                                            <Text fontSize="xs" color="gray.500">{med.dosage}</Text>
                                        </Box>
                                    </Flex>
                                    <Text fontSize="sm" fontWeight="medium">{med.scheduleTime}</Text>
                                </Flex>
                            ))
                        ) : (
                            <Box p={4} textAlign="center">
                                <Text color="gray.500">No medications added</Text>
                                <Button 
                                    as={RouterLink}
                                    to="/medication"
                                    size="sm"
                                    colorScheme="blue"
                                    variant="outline"
                                    mt={2}
                                >
                                    Add Medication
                                </Button>
                            </Box>
                        )}
                    </VStack>
                </Card>

                {/* Health Tips Section */}
                <Card>
                    <Flex justify="space-between" align="center" mb={4}>
                        <HStack>
                           <Box color="yellow.500">
                               <FontAwesomeIcon icon={faLightbulb} />
                           </Box>
                            <Heading
                                size="md"
                                fontWeight="semibold"
                                bgGradient="linear(to-r, brand.500, green.500)"
                                bgClip="text"
                            >
                                Health Tip
                            </Heading>
                         </HStack>
                        <IconButton
                            aria-label="Refresh health tip"
                            icon={<FontAwesomeIcon icon={faSync} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={handleRefreshTip}
                            isLoading={isLoadingTip}
                            isDisabled={isLoadingTip}
                        />
                    </Flex>
                    <Box p={3} bg="gray.50" borderRadius="md" minH="80px" display="flex" alignItems="center">
                        {tipError ? (
                            <Alert status="error" borderRadius="md">
                                <AlertIcon />
                                {tipError}
                            </Alert>
                        ) : isLoadingTip && currentTip === 'Loading health tip...' ? (
                            <Spinner size="md" color="blue.500" />
                        ) : (
                             <Text fontSize="sm" color="gray.700">
                                {currentTip}
                            </Text>
                        )}
                    </Box>
                </Card>
            </SimpleGrid>

            {/* Emergency Contacts Preview */}
            <Card mb={6}>
                <Flex justify="space-between" align="center" mb={4}>
                    <Heading 
                        size="md" 
                        fontWeight="semibold"
                        bgGradient="linear(to-r, brand.500, green.500)"
                        bgClip="text"
                    >
                        Emergency Services
                    </Heading>
                    <Link as={RouterLink} to="/emergency-services" color="blue.500" fontSize="sm">
                        See All
                    </Link>
                </Flex>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {/* Emergency Services Card */}
                    <Flex 
                        align="center" 
                        p={3} 
                        bg="red.50" 
                        borderRadius="md" 
                        border="1px solid" 
                        borderColor="red.100"
                    >
                        <Box borderRadius="full" bg="red.100" p={3} mr={4} color="red.500">
                            <FontAwesomeIcon icon={faPhone} />
                        </Box>
                        <Box>
                            <Text fontWeight="medium">Emergency Services</Text>
                            <Text fontSize="xl" fontWeight="bold" color="red.500">999</Text>
                        </Box>
                    </Flex>
                    
                    {/* Nearest Hospital Card */}
                    <Box 
                        p={3} 
                        bg="blue.50" 
                        borderRadius="md" 
                        border="1px solid" 
                        borderColor="blue.100"
                    >
                        <Flex justify="space-between" mb={2}>
                            <Flex align="center">
                                <Box color="blue.500" mr={2}>
                                    <FontAwesomeIcon icon={faHospital} />
                                </Box>
                                <Text fontWeight="medium">Nearest Hospital</Text>
                            </Flex>
                            {!userLocation && (
                                <Button 
                                    size="xs" 
                                    leftIcon={<FontAwesomeIcon icon={faLocationArrow} />} 
                                    colorScheme="blue"
                                    variant="outline"
                                    onClick={handleGetLocation}
                                >
                                    Get Location
                                </Button>
                            )}
                        </Flex>
                        
                        {isLoading ? (
                            <Spinner size="sm" color="blue.500" />
                        ) : nearestHospital ? (
                            <>
                                <Text fontSize="sm" fontWeight="medium" mb={1}>{nearestHospital.name}</Text>
                                <Text fontSize="xs" color="gray.600">{nearestHospital.distance}</Text>
                                
                                <HStack mt={2}>
                                    <CompactMap 
                                        userLocation={userLocation} 
                                        hospital={nearestHospital} 
                                        height="80px"
                                    />
                                </HStack>
                                
                                <Button 
                                    mt={2}
                                    size="xs" 
                                    width="full"
                                    colorScheme="blue" 
                                    leftIcon={<FontAwesomeIcon icon={faMapLocationDot} />}
                                    onClick={handleGetDirections}
                                >
                                    Get Directions
                                </Button>
                            </>
                        ) : (
                            <Text fontSize="sm" color="gray.500">
                                {userLocation ? "No hospitals found nearby" : "Enable location to find hospitals"}
                            </Text>
                        )}
                    </Box>
                </SimpleGrid>
            </Card>

            {/* Floating Action Buttons */}
            <Box position="fixed" bottom={6} right={6} zIndex={30}>
                <VStack spacing={4}>
                    <IconButton
                        as={RouterLink}
                        to="/chat"
                        aria-label="AI Health Assistant"
                        icon={<FontAwesomeIcon icon={faCommentMedical} />}
                        bg="blue.500"
                        color="white"
                        size="lg"
                        h="56px"
                        w="56px"
                        borderRadius="full"
                        boxShadow="lg"
                        _hover={{ 
                            bg: 'blue.600',
                            transform: 'scale(1.1)',
                        }}
                        transition="all 0.3s"
                    />
                    <IconButton
                        as={RouterLink}
                        to="/emergency-services"
                        aria-label="Emergency Services"
                        icon={<FontAwesomeIcon icon={faAmbulance} />}
                        bg="red.500"
                        color="white"
                        size="lg"
                        h="56px"
                        w="56px"
                        borderRadius="full"
                        boxShadow="lg"
                        _hover={{ 
                            bg: 'red.600',
                            transform: 'scale(1.1)',
                        }}
                        transition="all 0.3s"
                    />
                </VStack>
            </Box>
        </>
    );
};

export default Dashboard; 