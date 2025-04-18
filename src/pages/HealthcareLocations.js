import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLocationDot, faHospital, faCircleInfo, faHouseMedical
} from '@fortawesome/free-solid-svg-icons';
// Import Leaflet CSS to ensure it's available
import 'leaflet/dist/leaflet.css';
// Import custom icons
import { hospitalIcon, locationIcon } from '../utils/LeafletUtils';
import {
    Box,
    Heading,
    Text,
    Flex,
    Button,
    Badge,
    SimpleGrid,
    VStack,
    HStack,
    Container,
    useToast,
    List,
    ListItem,
    Icon,
    Center,
    Spinner,
} from '@chakra-ui/react';
import { Card } from '../components/ui';
import MapComponent from '../components/MapComponent';

// Mock data for nearby medical facilities
// This will be replaced with dynamically generated data based on location
const defaultMedicalFacilities = [
    { id: 1, name: 'General Hospital', type: 'Hospital', distance: '0.8 miles' },
    { id: 2, name: 'Medical Center', type: 'Hospital', distance: '1.2 miles' },
    { id: 3, name: 'Health Sciences Clinic', type: 'Clinic', distance: '0.3 miles' },
    { id: 4, name: 'Research Hospital', type: 'Hospital', distance: '0.5 miles' },
    { id: 5, name: 'University Medical Center', type: 'Hospital', distance: '0.7 miles' },
];

const HealthcareLocations = () => {
    const [medicalFacilities, setMedicalFacilities] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [mapMarkers, setMapMarkers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    // Handle location change from map component
    const handleLocationChange = (location) => {
        setUserLocation(location);
        
        toast({
            title: "Location Updated",
            description: "Your location has been updated.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        
        // Find nearby medical facilities based on the location
        findNearbyMedicalCenters(location);
    };

    // Find nearby medical facilities based on location
    const findNearbyMedicalCenters = (location) => {
        setIsLoading(true);
        
        // In a real app, this would make an API call to a service like Google Places API
        // For this implementation, we'll simulate the API call with a timeout and mock data
        setTimeout(() => {
            // Generate 5-7 random medical facilities
            const numberOfFacilities = Math.floor(Math.random() * 3) + 5;
            const facilities = [];
            
            const facilityTypes = ['Hospital', 'Clinic', 'Medical Center', 'Emergency Room', 'Specialized Hospital'];
            const prefixes = ['City', 'General', 'Community', 'Central', 'University', 'Memorial', 'Regional'];
            
            for (let i = 0; i < numberOfFacilities; i++) {
                // Generate a random distance between 0.1 and 3.5 miles
                const distance = (Math.random() * 3.4 + 0.1).toFixed(1);
                const facilityType = facilityTypes[Math.floor(Math.random() * facilityTypes.length)];
                const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                
                facilities.push({
                    id: i + 1,
                    name: `${prefix} ${facilityType}`,
                    type: facilityType.includes('Hospital') ? 'Hospital' : 'Clinic',
                    distance: `${distance} miles`,
                    // Generate a random position near the user's location
                    location: {
                        latitude: location.latitude + (Math.random() * 0.02 - 0.01),
                        longitude: location.longitude + (Math.random() * 0.02 - 0.01)
                    }
                });
            }
            
            // Sort by distance
            facilities.sort((a, b) => {
                return parseFloat(a.distance) - parseFloat(b.distance);
            });
            
            setMedicalFacilities(facilities);
            
            // Create markers for the map
            const userMarker = {
                latitude: location.latitude,
                longitude: location.longitude,
                name: 'Your Location',
                iconType: 'user'
            };
            
            // Map the facilities to markers
            const facilityMarkers = facilities.map(facility => ({
                latitude: facility.location.latitude,
                longitude: facility.location.longitude,
                name: facility.name,
                iconType: facility.type === 'Hospital' ? 'hospital' : 'clinic'
            }));
            
            setMapMarkers([userMarker, ...facilityMarkers]);
            setIsLoading(false);
        }, 1500); // Simulate API delay
    };
    
    // Get directions to a medical facility
    const getDirections = (facilityName) => {
        if (userLocation) {
            const { latitude, longitude } = userLocation;
            // Create a Google Maps direction URL
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(facilityName)}`;
            window.open(googleMapsUrl, '_blank');
        } else {
            toast({
                title: "Location Required",
                description: "Please enable location services to get directions.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Flex align="center" mb={6}>
                <Heading as="h2" size="xl" color="gray.800">
                    Healthcare Locations
                </Heading>
                <Badge ml={3} colorScheme="blue" px={2.5} py={0.5} borderRadius="md">
                    Nearby Medical Centers
                </Badge>
            </Flex>

            <Text mb={6} color="gray.600">
                Find nearby hospitals, clinics and medical centers based on your current location.
                Enable location services to see medical facilities near you.
            </Text>

            {/* Map Component - Slightly smaller height for better desktop view */}
            <Card mb={6}>
                <Heading as="h3" size="md" color="gray.800" mb={4}>
                    Location Map
                </Heading>
                <Box mb={4}>
                    <MapComponent 
                        onLocationChange={handleLocationChange} 
                        height="400px"
                        additionalMarkers={mapMarkers}
                    />
                </Box>
                
                <Text fontSize="xs" color="gray.500" mt={2}>
                    Enable location services to see your current position and find nearby medical facilities.
                </Text>
            </Card>

            {/* Nearby Health Care Centers */}
            <Card>
                <Heading as="h3" size="md" mb={4} color="gray.800">
                    Nearby Health Care Centers
                </Heading>
                
                {!userLocation ? (
                    <Center py={10} px={4}>
                        <VStack spacing={3}>
                            <Box fontSize="xl" color="gray.400">
                                <FontAwesomeIcon icon={faCircleInfo} />
                            </Box>
                            <Text color="gray.500" textAlign="center">
                                Enable location services to find nearby medical facilities
                            </Text>
                            <Button 
                                colorScheme="blue" 
                                size="sm" 
                                leftIcon={<FontAwesomeIcon icon={faLocationDot} />}
                                onClick={() => {
                                    const mapComponent = document.querySelector('[data-testid="map-component"]');
                                    if (mapComponent) {
                                        mapComponent.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                Get My Location
                            </Button>
                        </VStack>
                    </Center>
                ) : isLoading ? (
                    <Center py={10} px={4}>
                        <VStack spacing={3}>
                            <Spinner size="xl" color="blue.500" />
                            <Text color="gray.500">Finding nearby medical facilities...</Text>
                        </VStack>
                    </Center>
                ) : (
                    <>
                        <Text mb={4} fontSize="sm" color="gray.600">
                            Showing medical facilities near your location:
                        </Text>
                        <VStack spacing={4} align="stretch">
                            {medicalFacilities.map(facility => (
                                <Flex 
                                    key={facility.id} 
                                    p={4} 
                                    borderRadius="md" 
                                    boxShadow="sm" 
                                    border="1px" 
                                    borderColor="gray.200"
                                    bg="white"
                                    align="center"
                                    justify="space-between"
                                >
                                    <Flex align="center">
                                        <Center 
                                            bg={facility.type === 'Hospital' ? "purple.100" : "blue.100"} 
                                            p={3} 
                                            borderRadius="full" 
                                            mr={4} 
                                            color={facility.type === 'Hospital' ? "purple.500" : "blue.500"}
                                        >
                                            <FontAwesomeIcon icon={facility.type === 'Hospital' ? faHospital : faHouseMedical} />
                                        </Center>
                                        <Box>
                                            <Text fontWeight="bold">{facility.name}</Text>
                                            <HStack mt={1}>
                                                <Badge colorScheme={facility.type === 'Hospital' ? 'purple' : 'blue'}>
                                                    {facility.type}
                                                </Badge>
                                                <Text fontSize="sm" color="gray.500">
                                                    {facility.distance}
                                                </Text>
                                            </HStack>
                                        </Box>
                                    </Flex>
                                    <Button 
                                        size="sm" 
                                        colorScheme="blue" 
                                        variant="outline"
                                        onClick={() => getDirections(facility.name)}
                                    >
                                        Directions
                                    </Button>
                                </Flex>
                            ))}
                        </VStack>
                        
                        <Text fontSize="xs" color="gray.500" mt={4}>
                            *Medical facility information is provided for reference only. Please call ahead to confirm services.
                        </Text>
                    </>
                )}
            </Card>
        </>
    );
};

export default HealthcareLocations; 