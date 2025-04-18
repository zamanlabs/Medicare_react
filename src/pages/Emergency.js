import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTriangleExclamation, faLocationDot, faRotate, faPhone, faHeadSideMask, faBrain,
    faUser, faMessage, faPlus, faHospital, faMapLocationDot, faEdit, faTrash
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
    Container,
    Stack,
    Divider,
    Center,
    useToast,
    List,
    ListItem,
} from '@chakra-ui/react';
import { Card, StatusBadge } from '../components/ui';
import MapComponent from '../components/MapComponent';

// Mock data for emergency contacts and nearby hospitals
const initialEmergencyContacts = [
    { id: 1, name: 'Dr. Sarah Johnson', relationship: 'Primary Care Physician', phone: '5551234567' },
    { id: 2, name: 'John Smith', relationship: 'Emergency Contact (Family)', phone: '5559876543' },
];

const initialNearbyHospitals = [
    { id: 1, name: 'Mercy General Hospital', address: '123 Medical Center Dr, Cityville', distance: '1.2 miles', phone: '5551234567', isOpen: true },
    { id: 2, name: 'City Medical Center', address: '456 Health Blvd, Cityville', distance: '2.8 miles', phone: '5559876543', isOpen: true },
    { id: 3, name: 'University Hospital', address: '789 Research Way, Cityville', distance: '3.5 miles', phone: '5554567890', isOpen: true },
];

const Emergency = () => {
    const [currentAddress, setCurrentAddress] = useState('Fetching location...');
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [nearbyHospitals, setNearbyHospitals] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const toast = useToast();

    // Load emergency contacts from localStorage
    useEffect(() => {
        const storedContacts = localStorage.getItem('emergencyContacts');
        setEmergencyContacts(storedContacts ? JSON.parse(storedContacts) : initialEmergencyContacts);
        
        // Set default hospitals until we get real location
        setNearbyHospitals(initialNearbyHospitals);
    }, []);

    // Save emergency contacts to localStorage when they change
    useEffect(() => {
        localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
    }, [emergencyContacts]);

    // Handle location change from map component
    const handleLocationChange = (location) => {
        setUserLocation(location);
        
        // Get address from coordinates using reverse geocoding
        fetchAddressFromCoordinates(location.latitude, location.longitude);
        
        // In a real app, we would fetch nearby hospitals based on the coordinates
        // For now, we'll simulate that by updating the mock data with random distances
        updateNearbyHospitals(location);
    };

    // Simulate reverse geocoding (in a real app, this would call a geocoding API)
    const fetchAddressFromCoordinates = (lat, lng) => {
        // Simulate API call delay
        setTimeout(() => {
            // Format coordinates to 4 decimal places for display
            const formattedLat = lat.toFixed(4);
            const formattedLng = lng.toFixed(4);
            setCurrentAddress(`Location: ${formattedLat}, ${formattedLng} (Coordinates)`);
            
            toast({
                title: "Location Updated",
                description: "Your location has been updated and nearby hospitals refreshed.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }, 500);
    };

    // Simulate updating nearby hospitals based on location
    const updateNearbyHospitals = (location) => {
        // In a real app, we would fetch real hospitals from an API based on coordinates
        // For now, just update the mock distances
        const updatedHospitals = initialNearbyHospitals.map(hospital => {
            // Generate a somewhat realistic distance based on the hospital's original distance
            // and some random variation to simulate different locations
            const originalDistance = parseFloat(hospital.distance);
            const randomVariation = Math.random() * 2 - 1; // Random value between -1 and 1
            const newDistance = Math.max(0.1, originalDistance + randomVariation).toFixed(1);
            
            return {
                ...hospital,
                distance: `${newDistance} miles`
            };
        });
        
        // Sort by distance
        updatedHospitals.sort((a, b) => {
            return parseFloat(a.distance) - parseFloat(b.distance);
        });
        
        setNearbyHospitals(updatedHospitals);
    };

    const handleAddContact = () => {
        // TODO: Implement modal/form for adding contact
        toast({
            title: "Add Contact",
            description: "Add Emergency Contact functionality not implemented yet.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
        
        const newContact = {
            id: Date.now(),
            name: prompt("Enter contact name:", "Jane Doe"),
            relationship: prompt("Enter relationship:", "Friend"),
            phone: prompt("Enter phone number:", "5551112222")
        };
        if (newContact.name && newContact.phone) {
            setEmergencyContacts([...emergencyContacts, newContact]);
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

    const handleGetDirections = (hospitalName) => {
        // In a real app, this would open Google Maps with directions
        // to the selected hospital from the user's current location
        if (userLocation) {
            // Format coordinates
            const { latitude, longitude } = userLocation;
            
            // Create a Google Maps direction URL
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(hospitalName)}`;
            
            // Open in a new tab
            window.open(googleMapsUrl, '_blank');
            
            toast({
                title: "Opening Directions",
                description: `Opening directions to ${hospitalName}`,
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
                    Emergency Services
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
                                This helps find the nearest emergency services to you
                            </Text>
                        </Box>
                    </Flex>
                </Box>
                
                {/* Map Component */}
                <Box mb={4}>
                    <MapComponent onLocationChange={handleLocationChange} height="350px" />
                </Box>
                
                <Text fontSize="xs" color="gray.500" mt={2}>
                    Your location is only used to show nearby emergency services and is not stored permanently.
                </Text>
            </Card>

            {/* Emergency Contact Options */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                {/* Emergency Numbers */}
                <Card>
                    <Heading as="h3" size="md" mb={4} color="gray.800">
                        Emergency Numbers
                    </Heading>
                    <VStack spacing={4} align="stretch">
                        <Flex 
                            justify="space-between" 
                            align="center" 
                            p={3} 
                            bg="red.50" 
                            borderRadius="md" 
                            border="1px solid" 
                            borderColor="red.100"
                        >
                            <Flex align="center">
                                <Center 
                                    borderRadius="full" 
                                    bg="red.100" 
                                    p={3} 
                                    mr={3} 
                                    flexShrink={0}
                                >
                                    <Box color="red.500">
                                        <FontAwesomeIcon icon={faPhone} />
                                    </Box>
                                </Center>
                                <Box>
                                    <Text fontWeight="medium">Emergency Services</Text>
                                    <Text fontSize="sm" color="gray.600">Fire, Police, Ambulance</Text>
                                </Box>
                            </Flex>
                            <Link 
                                href="tel:999" 
                                bg="red.500" 
                                _hover={{ bg: "red.600" }} 
                                color="white" 
                                px={4} 
                                py={2} 
                                borderRadius="md" 
                                fontWeight="medium" 
                                flexShrink={0}
                            >
                                Call 999
                            </Link>
                        </Flex>
                        
                        <Flex 
                            justify="space-between" 
                            align="center" 
                            p={3} 
                            bg="blue.50" 
                            borderRadius="md" 
                            border="1px solid" 
                            borderColor="blue.100"
                        >
                            <Flex align="center">
                                <Center 
                                    borderRadius="full" 
                                    bg="blue.100" 
                                    p={3} 
                                    mr={3} 
                                    flexShrink={0}
                                >
                                    <Box color="blue.500">
                                        <FontAwesomeIcon icon={faHeadSideMask} />
                                    </Box>
                                </Center>
                                <Box>
                                    <Text fontWeight="medium">Poison Control</Text>
                                    <Text fontSize="sm" color="gray.600">24/7 Helpline</Text>
                                </Box>
                            </Flex>
                            <Link 
                                href="tel:16263" 
                                bg="blue.500" 
                                _hover={{ bg: "blue.600" }} 
                                color="white" 
                                px={4} 
                                py={2} 
                                borderRadius="md" 
                                fontWeight="medium" 
                                flexShrink={0}
                            >
                                Call
                            </Link>
                        </Flex>
                        
                        <Flex 
                            justify="space-between" 
                            align="center" 
                            p={3} 
                            bg="purple.50" 
                            borderRadius="md" 
                            border="1px solid" 
                            borderColor="purple.100"
                        >
                            <Flex align="center">
                                <Center 
                                    borderRadius="full" 
                                    bg="purple.100" 
                                    p={3} 
                                    mr={3} 
                                    flexShrink={0}
                                >
                                    <Box color="purple.500">
                                        <FontAwesomeIcon icon={faBrain} />
                                    </Box>
                                </Center>
                                <Box>
                                    <Text fontWeight="medium">Mental Health Crisis</Text>
                                    <Text fontSize="sm" color="gray.600">Health Helpline</Text>
                                </Box>
                            </Flex>
                            <Link 
                                href="tel:16263" 
                                bg="purple.500" 
                                _hover={{ bg: "purple.600" }} 
                                color="white" 
                                px={4} 
                                py={2} 
                                borderRadius="md" 
                                fontWeight="medium" 
                                flexShrink={0}
                            >
                                Call 16263
                            </Link>
                        </Flex>
                    </VStack>
                </Card>

                {/* Personal Emergency Contacts */}
                <Card>
                    <Flex justifyContent="space-between" alignItems="center" mb={4}>
                        <Heading as="h3" size="md" color="gray.800">
                            Your Emergency Contacts
                        </Heading>
                        <Button
                            onClick={handleAddContact}
                            size="sm"
                            colorScheme="blue"
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                        >
                            Add
                        </Button>
                    </Flex>
                    
                    {emergencyContacts.length === 0 ? (
                        <Center py={4}>
                            <Text color="gray.500">No emergency contacts added yet.</Text>
                        </Center>
                    ) : (
                        <VStack spacing={4} align="stretch">
                            {emergencyContacts.map(contact => (
                                <Flex 
                                    key={contact.id} 
                                    justify="space-between" 
                                    align="center" 
                                    p={3} 
                                    bg="gray.50" 
                                    borderRadius="md"
                                >
                                    <Flex align="center" overflow="hidden" mr={2}>
                                        <Center 
                                            borderRadius="full" 
                                            bg="gray.200" 
                                            p={3} 
                                            mr={3} 
                                            flexShrink={0}
                                        >
                                            <Box color="gray.600">
                                                <FontAwesomeIcon icon={faUser} />
                                            </Box>
                                        </Center>
                                        <Box overflow="hidden">
                                            <Text fontWeight="medium" isTruncated title={contact.name}>
                                                {contact.name}
                                            </Text>
                                            <Text fontSize="sm" color="gray.600" isTruncated title={contact.relationship}>
                                                {contact.relationship}
                                            </Text>
                                        </Box>
                                    </Flex>
                                    <HStack spacing={2} flexShrink={0}>
                                        <IconButton
                                            as={Link}
                                            href={`tel:${contact.phone}`}
                                            aria-label="Call"
                                            icon={<FontAwesomeIcon icon={faPhone} />}
                                            colorScheme="green"
                                            borderRadius="full"
                                            title="Call"
                                        />
                                        <IconButton
                                            as={Link}
                                            href={`sms:${contact.phone}`}
                                            aria-label="Message"
                                            icon={<FontAwesomeIcon icon={faMessage} />}
                                            colorScheme="blue"
                                            borderRadius="full"
                                            title="Message"
                                        />
                                        <IconButton
                                            aria-label="Delete"
                                            icon={<FontAwesomeIcon icon={faTrash} />}
                                            colorScheme="red"
                                            borderRadius="full"
                                            title="Delete"
                                            onClick={() => handleDeleteContact(contact.id)}
                                        />
                                    </HStack>
                                </Flex>
                            ))}
                        </VStack>
                    )}
                </Card>
            </SimpleGrid>

            {/* Nearby Hospitals */}
            <Card>
                <Heading as="h3" size="md" color="gray.800" mb={4}>
                    Nearby Hospitals
                </Heading>
                
                {nearbyHospitals.length === 0 ? (
                    <Center py={6}>
                        <Text color="gray.500">Loading nearby hospitals...</Text>
                    </Center>
                ) : (
                    <VStack spacing={4} align="stretch">
                        {nearbyHospitals.map(hospital => (
                            <Flex 
                                key={hospital.id} 
                                p={4} 
                                borderRadius="md" 
                                boxShadow="sm" 
                                border="1px" 
                                borderColor="gray.200"
                                bg="white"
                                direction={{ base: "column", md: "row" }}
                                align={{ base: "stretch", md: "center" }}
                                justify="space-between"
                            >
                                <Flex align="flex-start" mb={{ base: 4, md: 0 }}>
                                    <Center 
                                        bg="blue.100" 
                                        p={3} 
                                        borderRadius="full" 
                                        mr={4} 
                                        flexShrink={0}
                                        color="blue.500"
                                    >
                                        <FontAwesomeIcon icon={faHospital} />
                                    </Center>
                                    <Box>
                                        <Flex align="center">
                                            <Heading as="h4" size="sm" fontWeight="bold" mr={2}>
                                                {hospital.name}
                                            </Heading>
                                            {hospital.isOpen ? (
                                                <Badge colorScheme="green">Open</Badge>
                                            ) : (
                                                <Badge colorScheme="red">Closed</Badge>
                                            )}
                                        </Flex>
                                        <Text fontSize="sm" color="gray.600" mt={1}>
                                            {hospital.address}
                                        </Text>
                                        <HStack mt={1} spacing={3}>
                                            <Text fontSize="sm" color="gray.500" fontWeight="medium">
                                                {hospital.distance}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {hospital.phone}
                                            </Text>
                                        </HStack>
                                    </Box>
                                </Flex>
                                <HStack spacing={3} justify={{ base: "flex-end", md: "flex-end" }}>
                                    <Button
                                        as={Link}
                                        href={`tel:${hospital.phone}`}
                                        colorScheme="green"
                                        leftIcon={<FontAwesomeIcon icon={faPhone} />}
                                        size="sm"
                                    >
                                        Call
                                    </Button>
                                    <Button
                                        colorScheme="blue"
                                        leftIcon={<FontAwesomeIcon icon={faMapLocationDot} />}
                                        onClick={() => handleGetDirections(hospital.name)}
                                        size="sm"
                                    >
                                        Directions
                                    </Button>
                                </HStack>
                            </Flex>
                        ))}
                    </VStack>
                )}
                
                <Text fontSize="xs" color="gray.500" mt={4}>
                    *Hospital information is provided for reference only. Please call ahead to confirm availability of services.
                </Text>
            </Card>
        </>
    );
};

export default Emergency; 