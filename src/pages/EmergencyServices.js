import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTriangleExclamation, faLocationDot, faRotate, faPhone, faHeadSideMask, faBrain,
    faUser, faMessage, faPlus, faHospital, faMapLocationDot, faEdit, faTrash, faHouseMedical,
    faCircleInfo, faAmbulance, faStethoscope
} from '@fortawesome/free-solid-svg-icons';
import {
    Box,
    Heading,
    Text,
    Flex,
    Button,
    IconButton,
    Badge,
    SimpleGrid,
    VStack,
    HStack,
    Link,
    Stack,
    Divider,
    Center,
    useToast,
    List,
    ListItem,
    Container,
    Spinner,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from '@chakra-ui/react';
import { Card, StatusBadge } from '../components/ui';
import MapComponent from '../components/MapComponent';
import { useHospitalLocation } from '../context/HospitalLocationContext';

// Mock data for emergency contacts
const initialEmergencyContacts = [
    { id: 1, name: 'Dr. Sarah Johnson', relationship: 'Primary Care Physician', phone: '5551234567' },
    { id: 2, name: 'John Smith', relationship: 'Emergency Contact (Family)', phone: '5559876543' },
];

// Hospital name prefixes and suffixes for dynamic generation
const hospitalPrefixes = ['General', 'Community', 'Memorial', 'University', 'St. Mary\'s', 'Regional', 'County', 'City', 'Metro'];
const hospitalSuffixes = ['Hospital', 'Medical Center', 'Emergency Center', 'Healthcare Center', 'Trauma Center'];
const emergencyTypes = ['24/7 Emergency', 'Trauma Center', 'Emergency & Urgent Care', 'Critical Care'];

const EmergencyServices = () => {
    // Use hospital location context for shared state
    const { 
        userLocation, 
        nearbyHospitals, 
        currentAddress, 
        isLoading, 
        updateUserLocation,
        getDirectionsUrl
    } = useHospitalLocation();
    
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [medicalFacilities, setMedicalFacilities] = useState([]);
    const [mapMarkers, setMapMarkers] = useState([]);
    const toast = useToast();

    // Load emergency contacts from localStorage
    useEffect(() => {
        const storedContacts = localStorage.getItem('emergencyContacts');
        setEmergencyContacts(storedContacts ? JSON.parse(storedContacts) : initialEmergencyContacts);
    }, []);

    // Save emergency contacts to localStorage when they change
    useEffect(() => {
        localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
    }, [emergencyContacts]);

    // Create map markers when user location or nearby hospitals change
    useEffect(() => {
        if (userLocation) {
            const markers = [];
            
            // Add user marker
            markers.push({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                name: 'Your Location',
                iconType: 'user'
            });
            
            // Add hospital markers
            nearbyHospitals.forEach(hospital => {
                markers.push({
                    latitude: hospital.location.latitude,
                    longitude: hospital.location.longitude,
                    name: hospital.name,
                    iconType: 'hospital'
                });
            });
            
            // Add any additional medical facility markers
            medicalFacilities.forEach(facility => {
                if (facility.type !== 'Hospital') { // Only add non-hospital facilities to avoid duplication
                    markers.push({
                        latitude: facility.location.latitude,
                        longitude: facility.location.longitude,
                        name: facility.name,
                        iconType: facility.type === 'Hospital' ? 'hospital' : 'clinic'
                    });
                }
            });
            
            setMapMarkers(markers);
        }
    }, [userLocation, nearbyHospitals, medicalFacilities]);

    // Handle location change from map component
    const handleLocationChange = (location) => {
        // Update location in the shared context
        updateUserLocation(location);
        
        // Find nearby medical facilities (this part remains local to this component)
        findNearbyMedicalCenters(location);
        
        toast({
            title: "Location Updated",
            description: "Your location has been updated and nearby facilities refreshed.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    // Find nearby medical facilities based on location (non-hospital facilities)
    const findNearbyMedicalCenters = (location) => {
        // In a real app, this would make an API call to a service like Google Places API
        // For this implementation, we'll simulate the API call with a timeout and mock data
        setTimeout(() => {
            // Generate 3-5 random medical facilities (clinics, not hospitals)
            const numberOfFacilities = Math.floor(Math.random() * 3) + 3;
            const facilities = [];
            
            const facilityTypes = ['Clinic', 'Medical Center', 'Urgent Care'];
            const prefixes = ['City', 'General', 'Community', 'Central', 'University', 'Memorial', 'Regional'];
            
            for (let i = 0; i < numberOfFacilities; i++) {
                // Generate a random distance between 0.1 and 3.5 miles
                const distance = (Math.random() * 3.4 + 0.1).toFixed(1);
                const facilityType = facilityTypes[Math.floor(Math.random() * facilityTypes.length)];
                const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                
                facilities.push({
                    id: i + 1,
                    name: `${prefix} ${facilityType}`,
                    type: 'Clinic', // Only clinics here, hospitals come from context
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
        }, 1500); // Simulate API delay
    };

    const handleAddContact = () => {
        // In a production app, you would use a modal form for this
        const newContact = {
            id: Date.now(),
            name: prompt("Enter contact name:", "Jane Doe"),
            relationship: prompt("Enter relationship:", "Friend"),
            phone: prompt("Enter phone number:", "5551112222")
        };
        if (newContact.name && newContact.phone) {
            setEmergencyContacts([...emergencyContacts, newContact]);
            
            toast({
                title: "Contact Added",
                description: "The emergency contact has been added.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDeleteContact = (idToDelete) => {
        if (window.confirm("Are you sure you want to delete this emergency contact?")) {
            setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== idToDelete));
            
            toast({
                title: "Contact Deleted",
                description: "The emergency contact has been removed.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleGetDirections = (hospital) => {
        // Get directions URL from context
        const directionsUrl = getDirectionsUrl(hospital);
        
        if (directionsUrl) {
            // Open in a new tab
            window.open(directionsUrl, '_blank');
            
            toast({
                title: "Opening Directions",
                description: `Opening directions to ${hospital.name}`,
                status: "info",
                duration: 3000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Location Required",
                description: "Please allow location access to get directions.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            {/* Emergency Banner */}
            <Box 
                bg="red.600" 
                color="white" 
                py={2} 
                px={4} 
                mb={6} 
                mx={-4} 
                mt="-1.5rem"
            >
                <Container maxW="container.xl">
                    <Flex 
                        flexWrap="wrap" 
                        justifyContent="space-between" 
                        alignItems="center"
                    >
                        <Flex alignItems="center" mb={{ base: 1, sm: 0 }}>
                            <Box mr={2}>
                                <FontAwesomeIcon icon={faTriangleExclamation} />
                            </Box>
                            <Text fontWeight="medium">
                                For immediate life-threatening emergencies, call <strong>999</strong>
                            </Text>
                        </Flex>
                        <Link 
                            href="tel:999" 
                            bg="white" 
                            color="red.600" 
                            px={4} 
                            py={1} 
                            borderRadius="md" 
                            fontWeight="bold" 
                            _hover={{ bg: 'gray.100' }}
                            transition="colors 0.2s"
                        >
                            Call 999
                        </Link>
                    </Flex>
                </Container>
            </Box>

            <Flex align="center" mb={6}>
                <Heading as="h2" size="xl" color="gray.800">
                    Emergency & Healthcare Services
                </Heading>
                <Badge ml={3} colorScheme="red" px={2.5} py={0.5} borderRadius="md">
                    Critical Care
                </Badge>
            </Flex>

            {/* Current Location Card with Map */}
            <Card mb={6}>
                <Heading as="h3" size="md" color="gray.800" mb={4}>
                    Your Current Location
                </Heading>
                
                <Box bg="gray.50" p={4} borderRadius="md" mb={4}>
                    <Flex alignItems="center">
                        <Box color="red.500" mr={3} fontSize="xl" flexShrink={0}>
                            <FontAwesomeIcon icon={faLocationDot} />
                        </Box>
                        <Box>
                            <Text fontWeight="medium">{currentAddress}</Text>
                            <Text fontSize="sm" color="gray.500">
                                This location is used to find nearby healthcare and emergency services
                            </Text>
                        </Box>
                    </Flex>
                </Box>
                
                {/* Map Component */}
                <Box mb={4}>
                    <MapComponent 
                        onLocationChange={handleLocationChange} 
                        height="400px" 
                        additionalMarkers={mapMarkers}
                    />
                </Box>
            </Card>

            {/* Tabs for Emergency and Healthcare services */}
            <Tabs colorScheme="red" mb={8}>
                <TabList>
                    <Tab fontWeight="medium">
                        <Box mr={2}>
                            <FontAwesomeIcon icon={faAmbulance} />
                        </Box>
                        Emergency Services
                    </Tab>
                    <Tab fontWeight="medium">
                        <Box mr={2}>
                            <FontAwesomeIcon icon={faHospital} />
                        </Box>
                        Nearby Hospitals
                    </Tab>
                    <Tab fontWeight="medium">
                        <Box mr={2}>
                            <FontAwesomeIcon icon={faStethoscope} />
                        </Box>
                        Medical Facilities
                    </Tab>
                </TabList>

                <TabPanels>
                    {/* Emergency Contacts Tab */}
                    <TabPanel px={0}>
                        <Card>
                            <Flex justify="space-between" align="center" mb={4}>
                                <Heading as="h3" size="md" color="gray.800">
                                    Emergency Contacts
                                </Heading>
                                <Button 
                                    size="sm"
                                    leftIcon={<FontAwesomeIcon icon={faPlus} />}
                                    colorScheme="blue"
                                    onClick={handleAddContact}
                                >
                                    Add Contact
                                </Button>
                            </Flex>
                            
                            {emergencyContacts.length === 0 ? (
                                <Center py={4}>
                                    <Text color="gray.500">No emergency contacts added yet.</Text>
                                </Center>
                            ) : (
                                <VStack spacing={4} align="stretch">
                                    {emergencyContacts.map(contact => (
                                        <Box 
                                            key={contact.id} 
                                            p={4} 
                                            borderRadius="md" 
                                            bg="gray.50"
                                            border="1px"
                                            borderColor="gray.200"
                                        >
                                            <Flex justify="space-between">
                                                <Box>
                                                    <Heading as="h4" size="sm" fontWeight="semibold">
                                                        {contact.name}
                                                    </Heading>
                                                    <Text fontSize="sm" color="gray.600">
                                                        {contact.relationship}
                                                    </Text>
                                                </Box>
                                                <HStack>
                                                    <Link 
                                                        href={`tel:${contact.phone}`}
                                                        bg="green.100"
                                                        color="green.800"
                                                        p={2}
                                                        borderRadius="md"
                                                        _hover={{ bg: 'green.200' }}
                                                    >
                                                        <FontAwesomeIcon icon={faPhone} />
                                                    </Link>
                                                    <IconButton
                                                        aria-label="Delete contact"
                                                        icon={<FontAwesomeIcon icon={faTrash} />}
                                                        size="sm"
                                                        colorScheme="red"
                                                        variant="ghost"
                                                        onClick={() => handleDeleteContact(contact.id)}
                                                    />
                                                </HStack>
                                            </Flex>
                                            <Text mt={2} fontWeight="medium">
                                                {contact.phone}
                                            </Text>
                                        </Box>
                                    ))}
                                </VStack>
                            )}
                        </Card>
                    </TabPanel>

                    {/* Nearby Hospitals Tab */}
                    <TabPanel px={0}>
                        <Card>
                            <Heading as="h3" size="md" color="gray.800" mb={4}>
                                Nearby Hospitals
                            </Heading>
                            
                            {isLoading ? (
                                <Center py={8}>
                                    <Spinner size="lg" color="red.500" thickness="3px" />
                                </Center>
                            ) : nearbyHospitals.length === 0 ? (
                                <Center py={4}>
                                    <Text color="gray.500">
                                        No nearby hospitals found. Please update your location.
                                    </Text>
                                </Center>
                            ) : (
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {nearbyHospitals.map(hospital => (
                                        <Box 
                                            key={hospital.id} 
                                            p={4}
                                            borderRadius="md" 
                                            bg={hospital.isOpen ? "white" : "gray.50"} 
                                            border="1px"
                                            borderColor={hospital.isOpen ? "green.200" : "gray.200"}
                                            position="relative"
                                        >
                                            {hospital.emergencyServices.traumaLevel === 1 && (
                                                <Badge 
                                                    position="absolute"
                                                    top={2}
                                                    right={2}
                                                    colorScheme="red"
                                                >
                                                    Level 1 Trauma
                                                </Badge>
                                            )}
                                            
                                            <Flex mb={3} alignItems="center">
                                                <Box 
                                                    color="purple.500" 
                                                    bg="purple.50" 
                                                    p={2} 
                                                    borderRadius="md"
                                                    mr={3}
                                                >
                                                    <FontAwesomeIcon icon={faHospital} />
                                                </Box>
                                                <Box>
                                                    <Heading as="h4" size="sm" fontWeight="semibold">
                                                        {hospital.name}
                                                    </Heading>
                                                    <Text fontSize="sm" color="gray.600">
                                                        {hospital.distance} from your location
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            
                                            <Text fontSize="sm" mb={2}>{hospital.address}</Text>
                                            
                                            <Flex justifyContent="space-between" alignItems="center" mb={2}>
                                                <Link href={`tel:${hospital.phone}`} fontWeight="medium">
                                                    {hospital.phone}
                                                </Link>
                                                <Badge colorScheme={hospital.isOpen ? "green" : "red"}>
                                                    {hospital.isOpen ? "Open" : "Closed"}
                                                </Badge>
                                            </Flex>
                                            
                                            <Badge mb={3} colorScheme="blue">{hospital.emergencyType}</Badge>
                                            
                                            <HStack spacing={3} mt={2}>
                                                <Button
                                                    size="sm"
                                                    leftIcon={<FontAwesomeIcon icon={faMapLocationDot} />}
                                                    colorScheme="blue"
                                                    variant="outline"
                                                    onClick={() => handleGetDirections(hospital)}
                                                    flex="1"
                                                >
                                                    Get Directions
                                                </Button>
                                                <Link 
                                                    href={`tel:${hospital.phone}`}
                                                    bg="green.100"
                                                    color="green.800"
                                                    p={2}
                                                    borderRadius="md"
                                                    _hover={{ bg: 'green.200' }}
                                                >
                                                    <FontAwesomeIcon icon={faPhone} />
                                                </Link>
                                            </HStack>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            )}
                        </Card>
                    </TabPanel>

                    {/* Medical Facilities Tab */}
                    <TabPanel px={0}>
                        <Card>
                            <Heading as="h3" size="md" color="gray.800" mb={4}>
                                Other Medical Facilities
                            </Heading>
                            
                            {medicalFacilities.length === 0 ? (
                                <Center py={4}>
                                    <Text color="gray.500">
                                        No additional medical facilities found. Please update your location.
                                    </Text>
                                </Center>
                            ) : (
                                <VStack spacing={3} align="stretch">
                                    {medicalFacilities.map(facility => (
                                        <Flex 
                                            key={facility.id} 
                                            p={4} 
                                            borderRadius="md" 
                                            bg="gray.50"
                                            border="1px"
                                            borderColor="gray.200"
                                            justify="space-between"
                                            align="center"
                                        >
                                            <Flex align="center">
                                                <Box 
                                                    color="blue.500" 
                                                    bg="blue.50" 
                                                    p={2} 
                                                    borderRadius="md"
                                                    mr={3}
                                                >
                                                    <FontAwesomeIcon icon={faHouseMedical} />
                                                </Box>
                                                <Box>
                                                    <Text fontWeight="semibold">{facility.name}</Text>
                                                    <Text fontSize="sm" color="gray.600">
                                                        {facility.distance} • {facility.type}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                            <Button
                                                size="sm"
                                                colorScheme="blue"
                                                variant="outline"
                                                leftIcon={<FontAwesomeIcon icon={faCircleInfo} />}
                                                onClick={() => {
                                                    alert(`Feature not implemented for: ${facility.name}`);
                                                }}
                                            >
                                                Details
                                            </Button>
                                        </Flex>
                                    ))}
                                </VStack>
                            )}
                        </Card>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            
            <Card mb={8}>
                <Heading as="h3" size="md" color="gray.800" mb={4}>
                    Additional Emergency Resources
                </Heading>
                
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Box p={4} borderRadius="md" bg="blue.50" borderColor="blue.200" borderWidth={1}>
                        <Flex mb={2} align="center">
                            <Box mr={2} color="blue.500">
                                <FontAwesomeIcon icon={faBrain} />
                            </Box>
                            <Heading as="h4" size="sm">Mental Health Crisis</Heading>
                        </Flex>
                        <Text fontSize="sm">
                            If you or someone you know is experiencing a mental health crisis
                        </Text>
                        <Link 
                            display="block" 
                            mt={3} 
                            fontWeight="bold" 
                            color="blue.600"
                            href="tel:116123"
                        >
                            Call: 116 123
                        </Link>
                    </Box>
                    
                    <Box p={4} borderRadius="md" bg="green.50" borderColor="green.200" borderWidth={1}>
                        <Flex mb={2} align="center">
                            <Box mr={2} color="green.500">
                                <FontAwesomeIcon icon={faHeadSideMask} />
                            </Box>
                            <Heading as="h4" size="sm">NHS Medical Advice</Heading>
                        </Flex>
                        <Text fontSize="sm">
                            For non-emergency medical advice and information
                        </Text>
                        <Link 
                            display="block" 
                            mt={3} 
                            fontWeight="bold" 
                            color="green.600"
                            href="tel:111"
                        >
                            Call: 111
                        </Link>
                    </Box>
                    
                    <Box p={4} borderRadius="md" bg="purple.50" borderColor="purple.200" borderWidth={1}>
                        <Flex mb={2} align="center">
                            <Box mr={2} color="purple.500">
                                <FontAwesomeIcon icon={faMessage} />
                            </Box>
                            <Heading as="h4" size="sm">Text Crisis Support</Heading>
                        </Flex>
                        <Text fontSize="sm">
                            If you prefer to text rather than call for support
                        </Text>
                        <Text mt={3} fontWeight="bold" color="purple.600">
                            Text "SHOUT" to 85258
                        </Text>
                    </Box>
                </SimpleGrid>
            </Card>
        </>
    );
};

export default EmergencyServices; 