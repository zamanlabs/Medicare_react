import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarCheck, faCalendarDays, faLaptopMedical, faVideo, faStethoscope,
    faPrescriptionBottle, faNotesMedical, faBrain, faAllergies, faLeaf, faVial,
    faUserDoctor, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import {
    Box,
    Heading,
    Text,
    Badge,
    Flex,
    Grid,
    GridItem,
    SimpleGrid,
    VStack,
    HStack,
    Center,
    Button,
    List,
    ListItem,
    ListIcon,
    Icon,
    Image,
} from '@chakra-ui/react';
import { Card } from '../components/ui';

const Telemedicine = () => {
    const specialties = [
        { name: 'General Consultations', icon: faStethoscope, color: 'blue.500' },
        { name: 'Medication Refills', icon: faPrescriptionBottle, color: 'green.500' },
        { name: 'Follow-up Visits', icon: faNotesMedical, color: 'red.500' },
        { name: 'Mental Health', icon: faBrain, color: 'purple.500' },
        { name: 'Allergy Consults', icon: faAllergies, color: 'yellow.500' },
        { name: 'Wellness Coaching', icon: faLeaf, color: 'teal.500' },
        { name: 'Lab Result Review', icon: faVial, color: 'indigo.500' },
        { name: 'Minor Illnesses', icon: faUserDoctor, color: 'pink.500' },
    ];

    const requirements = [
        'A smartphone, tablet, or computer with a camera and microphone.',
        'A stable internet connection (Wi-Fi or cellular data).',
        'A private, quiet space for your appointment.',
        'An up-to-date web browser (Chrome, Firefox, Safari, Edge).',
    ];

    return (
        <>
            <Flex align="center" mb={6}>
                <Heading as="h2" size="xl" color="gray.800">Telemedicine Services</Heading>
                <Badge ml={3} colorScheme="purple" px={2.5} py={0.5} borderRadius="md">Virtual Care</Badge>
            </Flex>

            {/* Introduction Section */}
            <Card mb={6}>
                <Flex direction={{ base: 'column', md: 'row' }} align="center">
                    <Box flex={{ md: 2 }} pr={{ md: 6 }}>
                        <Heading 
                            as="h3" 
                            size="lg" 
                            mb={3} 
                            pb={2} 
                            borderBottom="1px" 
                            borderColor="gray.200"
                            bgGradient="linear(to-r, brand.500, green.500)"
                            bgClip="text"
                        >
                            Consult with Your Doctor from Home
                        </Heading>
                        <Text color="gray.700" mb={3}>
                            Zentorra Medicare offers convenient and secure telemedicine appointments, allowing you to connect with our healthcare professionals from the comfort of your home. Save time, reduce travel, and get the care you need, when you need it.
                        </Text>
                        <Text color="gray.700" mb={4}>
                            Our virtual visits are suitable for follow-up appointments, medication management, consultations for non-emergency conditions, mental health support, and more.
                        </Text>
                        <Button
                            as={RouterLink}
                            to="/contact.html"
                            colorScheme="blue"
                            leftIcon={<FontAwesomeIcon icon={faCalendarCheck} />}
                        >
                            Schedule a Virtual Visit
                        </Button>
                    </Box>
                    <Box flex={{ md: 1 }} mt={{ base: 4, md: 0 }}>
                        {/* Use placeholder or actual image if available */}
                        <Image 
                            src="/images/telemedicine-illustration.svg" 
                            alt="Telemedicine Illustration" 
                            borderRadius="lg"
                            fallbackSrc="https://via.placeholder.com/300x200?text=Telemedicine"
                        />
                    </Box>
                </Flex>
            </Card>

            {/* How It Works Section */}
            <Card mb={6}>
                <Heading 
                    as="h3" 
                    size="md" 
                    mb={4}
                    pb={2} 
                    borderBottom="1px" 
                    borderColor="gray.200"
                    bgGradient="linear(to-r, brand.500, green.500)"
                    bgClip="text"
                >
                    How Telemedicine Works
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <VStack align="center">
                        <Center 
                            bg="blue.100" 
                            p={4} 
                            borderRadius="full" 
                            mb={3}
                        >
                            <Icon as={FontAwesomeIcon} icon={faCalendarDays} color="blue.600" boxSize={6} />
                        </Center>
                        <Heading as="h4" size="sm" fontWeight="medium" mb={2}>
                            1. Schedule Your Visit
                        </Heading>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                            Book a virtual appointment online or by calling our office. Choose a time that works best for you.
                        </Text>
                    </VStack>
                    
                    <VStack align="center">
                        <Center 
                            bg="green.100" 
                            p={4} 
                            borderRadius="full" 
                            mb={3}
                        >
                            <Icon as={FontAwesomeIcon} icon={faLaptopMedical} color="green.600" boxSize={6} />
                        </Center>
                        <Heading as="h4" size="sm" fontWeight="medium" mb={2}>
                            2. Prepare for Your Call
                        </Heading>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                            You'll receive a secure link via email. Ensure you have a stable internet connection and a device with a camera and microphone.
                        </Text>
                    </VStack>
                    
                    <VStack align="center">
                        <Center 
                            bg="purple.100" 
                            p={4} 
                            borderRadius="full" 
                            mb={3}
                        >
                            <Icon as={FontAwesomeIcon} icon={faVideo} color="purple.600" boxSize={6} />
                        </Center>
                        <Heading as="h4" size="sm" fontWeight="medium" mb={2}>
                            3. Connect with Your Doctor
                        </Heading>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                            Click the link at your appointment time to join the secure video call with your healthcare provider.
                        </Text>
                    </VStack>
                </SimpleGrid>
            </Card>

            {/* Available Specialties */}
            <Card mb={6}>
                <Heading 
                    as="h3" 
                    size="md" 
                    mb={4}
                    pb={2} 
                    borderBottom="1px" 
                    borderColor="gray.200"
                    bgGradient="linear(to-r, brand.500, green.500)"
                    bgClip="text"
                >
                    Services Available via Telemedicine
                </Heading>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={4}>
                    {specialties.map((spec, index) => (
                        <Flex 
                            key={index} 
                            align="center" 
                            p={3} 
                            bg="gray.50" 
                            borderRadius="md"
                        >
                            <Box color={spec.color} mr={2}>
                                <FontAwesomeIcon icon={spec.icon} />
                            </Box>
                            <Text fontSize="sm">{spec.name}</Text>
                        </Flex>
                    ))}
                </SimpleGrid>
                <Text fontSize="xs" color="gray.500" mt={4}>
                    *Note: Telemedicine is not suitable for emergencies or conditions requiring a physical examination. Call 999 for emergencies.
                </Text>
            </Card>

            {/* Technical Requirements */}
            <Card>
                <Heading 
                    as="h3" 
                    size="md" 
                    mb={4}
                    pb={2} 
                    borderBottom="1px" 
                    borderColor="gray.200"
                    bgGradient="linear(to-r, brand.500, green.500)"
                    bgClip="text"
                >
                    What You Need
                </Heading>
                <List spacing={3}>
                    {requirements.map((req, index) => (
                        <ListItem key={index} display="flex" alignItems="center">
                            <Box color="green.500" mr={3}>
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </Box>
                            <Text>{req}</Text>
                        </ListItem>
                    ))}
                </List>
                <Text fontSize="sm" color="gray.600" mt={4}>
                    If you have technical difficulties, please call our support line at (555) 123-4567.
                </Text>
            </Card>
        </>
    );
};

export default Telemedicine; 