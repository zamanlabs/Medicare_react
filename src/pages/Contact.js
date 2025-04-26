import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPhone, faEnvelope, faLocationDot, faUserDoctor, faStethoscope, faMapLocationDot, 
    faCalendar, faEdit, faTrash, faMapPin, faPaperPlane, faClinicMedical, faClock
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
    Input,
    Select,
    Textarea,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    useColorModeValue,
    InputGroup,
    InputLeftElement,
    FormErrorMessage,
} from '@chakra-ui/react';
import { Card } from '../components/ui';
import MapComponent from '../components/MapComponent';
import { motion } from 'framer-motion';

// Create motion components for animations
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

// Placeholder for upcoming appointments data
const upcomingAppointments = [
    { id: 1, doctor: 'Dr. Sarah Johnson', type: 'Cardiology Follow-up', date: 'May 15, 2025', time: '10:30 AM', icon: faUserDoctor, iconColor: 'green.500', bgColor: 'green.100' },
    { id: 2, doctor: 'Dr. Michael Chen', type: 'Annual Physical', date: 'June 2, 2025', time: '2:00 PM', icon: faStethoscope, iconColor: 'purple.500', bgColor: 'purple.100' },
];

const Contact = () => {
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [appointmentForm, setAppointmentForm] = useState({
        type: '',
        doctor: '',
        date: '',
        time: '',
        notes: '',
    });
    const toast = useToast();
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    // Theme-aware colors
    const headerGradient = useColorModeValue(
        'linear(to-r, brand.500, accent.500)',
        'linear(to-r, brand.400, accent.400)'
    );
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardHoverBg = useColorModeValue('gray.50', 'gray.700');
    const subtleBg = useColorModeValue('gray.50', 'gray.700');
    const subtleIconBg = useColorModeValue('white', 'gray.900');
    const subtleBorderColor = useColorModeValue('gray.200', 'gray.600');
    const textPrimary = useColorModeValue('gray.700', 'gray.200');
    const textSecondary = useColorModeValue('gray.600', 'gray.400');
    const inputBg = useColorModeValue('white', 'gray.800');
    const accentColor = useColorModeValue('brand.500', 'brand.300');

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContactForm(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAppointmentChange = (e) => {
        const { name, value } = e.target;
        setAppointmentForm(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement actual contact form submission (e.g., API call)
        console.log('Contact Form Data:', contactForm);
        toast({
            title: "Message sent",
            description: "Contact message sent successfully! (Simulation)",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        // Optionally reset form
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    const handleAppointmentSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement actual appointment request submission (e.g., API call)
        console.log('Appointment Request Data:', appointmentForm);
        toast({
            title: "Appointment requested",
            description: "Appointment requested successfully! (Simulation)",
            status: "success",
            duration: 5000,
            isClosable: true,
        });
        // Optionally reset form
        setAppointmentForm({ type: '', doctor: '', date: '', time: '', notes: '' });
    };

    // Handle location change from the map component
    const handleLocationChange = (location) => {
        setUserLocation(location);
        
        toast({
            title: "Location Updated",
            description: "Your location has been updated.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
    };

    // Set selected location for appointment
    const handleSelectAppointmentLocation = (appointment) => {
        // This would normally use the real coordinates of the location
        // For demo purposes, we're using mock coordinates
        const mockLocation = {
            latitude: userLocation ? userLocation.latitude + 0.01 : 37.7749,
            longitude: userLocation ? userLocation.longitude + 0.01 : -122.4194,
            name: appointment.location
        };
        
        setSelectedLocation(mockLocation);
        
        toast({
            title: "Location Selected",
            description: `Selected location: ${appointment.location}`,
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Container maxW="container.xl" px={4}>
            <MotionFlex 
                align="center" 
                mb={8} 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Heading 
                    as="h1" 
                    size="xl" 
                    fontWeight="bold"
                    bgGradient={headerGradient}
                    bgClip="text"
                    letterSpacing="tight"
                >
                    Contact & Appointments
                </Heading>
                <Badge 
                    ml={3} 
                    colorScheme="blue" 
                    px={3} 
                    py={1} 
                    borderRadius="full" 
                    fontSize="sm"
                    fontWeight="medium"
                    textTransform="capitalize"
                >
                    Support
                </Badge>
            </MotionFlex>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                {/* Left Column - Contact Form and Info */}
                <MotionBox
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Stack spacing={8}>
                    {/* Contact Form */}
                        <MotionBox variants={itemVariants}>
                    <Card>
                        <Heading 
                                    as="h2" 
                                    size="lg" 
                                    mb={6}
                                    fontWeight="bold"
                                    bgGradient={headerGradient}
                            bgClip="text"
                        >
                            Get in Touch
                        </Heading>
                        <form onSubmit={handleContactSubmit}>
                                    <VStack spacing={5}>
                                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5} width="100%">
                                    <FormControl>
                                                <FormLabel fontWeight="medium">Full Name</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none">
                                                        <Box color={accentColor}>
                                                            <FontAwesomeIcon icon={faUserDoctor} />
                                                        </Box>
                                                    </InputLeftElement>
                                        <Input 
                                            id="name" 
                                            name="name" 
                                            value={contactForm.name} 
                                            onChange={handleContactChange} 
                                            placeholder="Your name" 
                                            required 
                                                        bg={inputBg}
                                                        borderColor={subtleBorderColor}
                                                        _hover={{ borderColor: accentColor }}
                                                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                                                        transition="all 0.3s"
                                        />
                                                </InputGroup>
                                    </FormControl>
                                    <FormControl>
                                                <FormLabel fontWeight="medium">Email Address</FormLabel>
                                                <InputGroup>
                                                    <InputLeftElement pointerEvents="none">
                                                        <Box color={accentColor}>
                                                            <FontAwesomeIcon icon={faEnvelope} />
                                                        </Box>
                                                    </InputLeftElement>
                                        <Input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            value={contactForm.email} 
                                            onChange={handleContactChange} 
                                            placeholder="your.email@example.com" 
                                            required 
                                                        bg={inputBg}
                                                        borderColor={subtleBorderColor}
                                                        _hover={{ borderColor: accentColor }}
                                                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                                                        transition="all 0.3s"
                                        />
                                                </InputGroup>
                                    </FormControl>
                                </SimpleGrid>

                                <FormControl>
                                            <FormLabel fontWeight="medium">Phone Number</FormLabel>
                                            <InputGroup>
                                                <InputLeftElement pointerEvents="none">
                                                    <Box color={accentColor}>
                                                        <FontAwesomeIcon icon={faPhone} />
                                                    </Box>
                                                </InputLeftElement>
                                    <Input 
                                        type="tel" 
                                        id="phone" 
                                        name="phone" 
                                        value={contactForm.phone} 
                                        onChange={handleContactChange} 
                                        placeholder="(123) 456-7890" 
                                                    bg={inputBg}
                                                    borderColor={subtleBorderColor}
                                                    _hover={{ borderColor: accentColor }}
                                                    _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                                                    transition="all 0.3s"
                                    />
                                            </InputGroup>
                                </FormControl>

                                <FormControl>
                                            <FormLabel fontWeight="medium">Subject</FormLabel>
                                    <Select 
                                        id="subject" 
                                        name="subject" 
                                        value={contactForm.subject} 
                                        onChange={handleContactChange} 
                                        required 
                                                bg={inputBg}
                                                borderColor={subtleBorderColor}
                                                _hover={{ borderColor: accentColor }}
                                                _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                                                transition="all 0.3s"
                                                icon={<FontAwesomeIcon icon={faEdit} />}
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="feedback">Feedback</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                            <FormLabel fontWeight="medium">Message</FormLabel>
                                    <Textarea 
                                        id="message" 
                                        name="message" 
                                        rows={4} 
                                        value={contactForm.message} 
                                        onChange={handleContactChange} 
                                        placeholder="How can we help you?" 
                                        required 
                                                bg={inputBg}
                                                borderColor={subtleBorderColor}
                                                _hover={{ borderColor: accentColor }}
                                                _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                                                transition="all 0.3s"
                                    />
                                </FormControl>

                                <Flex justify="flex-end" width="100%">
                                    <Button 
                                        type="submit" 
                                                colorScheme="brand" 
                                                px={8}
                                                py={6}
                                                borderRadius="full"
                                                rightIcon={<FontAwesomeIcon icon={faPaperPlane} />}
                                                _hover={{
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: 'lg'
                                                }}
                                                transition="all 0.3s"
                                    >
                                        Send Message
                                    </Button>
                                </Flex>
                            </VStack>
                        </form>
                    </Card>
                        </MotionBox>

                        {/* Contact Information */}
                        <MotionBox variants={itemVariants}>
                            <Card variant="gradient" colorScheme="accent">
                                <Heading 
                                    as="h2" 
                                    size="lg" 
                                    mb={6}
                                    fontWeight="bold"
                                    color={useColorModeValue('gray.800', 'white')}
                                >
                                    Contact Information
                        </Heading>
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                    <VStack align="start" spacing={4}>
                                        <HStack spacing={4}>
                                            <Center 
                                                bg={useColorModeValue('blue.100', 'blue.900')} 
                                                color={useColorModeValue('blue.600', 'blue.300')}
                                                p={3} 
                                                borderRadius="full"
                                                boxShadow="sm"
                                            >
                                                <FontAwesomeIcon icon={faPhone} />
                                            </Center>
                                            <Box>
                                                <Text fontWeight="medium" color={textPrimary}>Phone</Text>
                                                <Link href="tel:+15551234567" color={accentColor} fontWeight="semibold">
                                                    (555) 123-4567
                                                </Link>
                                            </Box>
                                        </HStack>
                                        
                                        <HStack spacing={4}>
                                            <Center 
                                                bg={useColorModeValue('green.100', 'green.900')} 
                                                color={useColorModeValue('green.600', 'green.300')}
                                                p={3} 
                                                borderRadius="full"
                                                boxShadow="sm"
                                            >
                                                <FontAwesomeIcon icon={faEnvelope} />
                                            </Center>
                                            <Box>
                                                <Text fontWeight="medium" color={textPrimary}>Email</Text>
                                                <Link href="mailto:contact@zentorramedicare.com" color={accentColor} fontWeight="semibold">
                                                    contact@zentorramedicare.com
                                                </Link>
                                            </Box>
                                        </HStack>
                                    </VStack>
                                    
                                    <VStack align="start" spacing={4}>
                                        <HStack spacing={4}>
                                            <Center 
                                                bg={useColorModeValue('purple.100', 'purple.900')} 
                                                color={useColorModeValue('purple.600', 'purple.300')}
                                                p={3} 
                                                borderRadius="full"
                                                boxShadow="sm"
                                            >
                                                <FontAwesomeIcon icon={faLocationDot} />
                                            </Center>
                                            <Box>
                                                <Text fontWeight="medium" color={textPrimary}>Main Office</Text>
                                                <Text color={textSecondary}>123 Healthcare Avenue<br />Medical District, CA 90210</Text>
                                            </Box>
                                        </HStack>
                                        
                                        <HStack spacing={4}>
                                            <Center 
                                                bg={useColorModeValue('red.100', 'red.900')} 
                                                color={useColorModeValue('red.600', 'red.300')}
                                                p={3} 
                                                borderRadius="full"
                                                boxShadow="sm"
                                            >
                                                <FontAwesomeIcon icon={faClock} />
                                            </Center>
                                            <Box>
                                                <Text fontWeight="medium" color={textPrimary}>Business Hours</Text>
                                                <Text color={textSecondary}>Mon-Fri: 8am-6pm<br />Sat: 9am-1pm, Sun: Closed</Text>
                        </Box>
                                        </HStack>
                                    </VStack>
                                </SimpleGrid>
                    </Card>
                        </MotionBox>
                </Stack>
                </MotionBox>

                {/* Right Column - Appointment Booking and Map */}
                <MotionBox
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Stack spacing={8}>
                    {/* Appointment Request Form */}
                        <MotionBox variants={itemVariants}>
                    <Card>
                        <Heading 
                                    as="h2" 
                                    size="lg" 
                                    mb={6}
                                    fontWeight="bold"
                                    bgGradient={headerGradient}
                            bgClip="text"
                        >
                                    Request an Appointment
                        </Heading>
                            <form onSubmit={handleAppointmentSubmit}>
                                    <VStack spacing={5}>
                                        <FormControl>
                                            <FormLabel fontWeight="medium">Appointment Type</FormLabel>
                                            <Select 
                                                id="type" 
                                                name="type" 
                                                value={appointmentForm.type} 
                                                onChange={handleAppointmentChange} 
                                                required 
                                                bg={inputBg}
                                                borderColor={subtleBorderColor}
                                                _hover={{ borderColor: accentColor }}
                                                _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                                                transition="all 0.3s"
                                                icon={<FontAwesomeIcon icon={faStethoscope} />}
                                            >
                                                <option value="">Select appointment type</option>
                                                <option value="checkup">Regular Checkup</option>
                                                <option value="followup">Follow-up Visit</option>
                                                <option value="consultation">Consultation</option>
                                                <option value="urgent">Urgent Care</option>
                                                <option value="telehealth">Telehealth Visit</option>
                                            </Select>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel fontWeight="medium">Preferred Doctor</FormLabel>
                                            <Select 
                                                id="doctor" 
                                                name="doctor" 
                                                value={appointmentForm.doctor} 
                                                onChange={handleAppointmentChange} 
                                                bg={inputBg}
                                                borderColor={subtleBorderColor}
                                                _hover={{ borderColor: accentColor }}
                                                _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                                                transition="all 0.3s"
                                                icon={<FontAwesomeIcon icon={faUserDoctor} />}
                                            >
                                                <option value="">No preference</option>
                                                <option value="dr-johnson">Dr. Sarah Johnson</option>
                                                <option value="dr-chen">Dr. Michael Chen</option>
                                                <option value="dr-patel">Dr. Priya Patel</option>
                                                <option value="dr-wong">Dr. David Wong</option>
                                            </Select>
                                        </FormControl>

                                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5} width="100%">
                                        <FormControl>
                                                <FormLabel fontWeight="medium">Preferred Date</FormLabel>
                                            <Input 
                                                type="date" 
                                                    id="date" 
                                                name="date" 
                                                value={appointmentForm.date} 
                                                onChange={handleAppointmentChange} 
                                                required 
                                                    bg={inputBg}
                                                    borderColor={subtleBorderColor}
                                                    _hover={{ borderColor: accentColor }}
                                                    _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                                                    transition="all 0.3s"
                                            />
                                        </FormControl>
                                        <FormControl>
                                                <FormLabel fontWeight="medium">Preferred Time</FormLabel>
                                                <Input 
                                                    type="time" 
                                                    id="time" 
                                                name="time" 
                                                value={appointmentForm.time} 
                                                onChange={handleAppointmentChange} 
                                                required 
                                                    bg={inputBg}
                                                    borderColor={subtleBorderColor}
                                                    _hover={{ borderColor: accentColor }}
                                                    _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                                                    transition="all 0.3s"
                                                />
                                        </FormControl>
                                    </SimpleGrid>

                                    <FormControl>
                                            <FormLabel fontWeight="medium">Additional Notes</FormLabel>
                                        <Textarea 
                                                id="notes" 
                                            name="notes" 
                                                rows={3} 
                                            value={appointmentForm.notes} 
                                            onChange={handleAppointmentChange} 
                                                placeholder="Please share any specific concerns or requirements..." 
                                                bg={inputBg}
                                                borderColor={subtleBorderColor}
                                                _hover={{ borderColor: accentColor }}
                                                _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                                                transition="all 0.3s"
                                        />
                                    </FormControl>

                                    <Flex justify="flex-end" width="100%">
                                        <Button 
                                            type="submit" 
                                                colorScheme="brand" 
                                                px={8}
                                                py={6}
                                                borderRadius="full"
                                                rightIcon={<FontAwesomeIcon icon={faCalendar} />}
                                                _hover={{
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: 'lg'
                                                }}
                                                transition="all 0.3s"
                                        >
                                            Request Appointment
                                        </Button>
                                    </Flex>
                                </VStack>
                            </form>
                            </Card>
                        </MotionBox>

                        {/* Map */}
                        <MotionBox variants={itemVariants} height="400px">
                            <Card height="100%">
                                <Heading 
                                    as="h2" 
                                    size="lg" 
                                    mb={4}
                                    fontWeight="bold"
                                    bgGradient={headerGradient}
                                    bgClip="text"
                                >
                                    Find Our Locations
                                </Heading>
                                <Box bg={subtleBg} borderRadius="md" overflow="hidden" h="100%">
                                    <MapComponent
                                        userLocation={userLocation} 
                                        onLocationChange={handleLocationChange}
                                        markers={[
                                            { 
                                                latitude: 37.7749, 
                                                longitude: -122.4194, 
                                                name: "Zentorra Medicare Main Clinic",
                                                iconType: "hospital"
                                            },
                                            { 
                                                latitude: 37.7850, 
                                                longitude: -122.4000, 
                                                name: "Zentorra Medicare Downtown Branch",
                                                iconType: "clinic" 
                                            }
                                        ]}
                                    />
                        </Box>
                                
                                <HStack mt={4} spacing={4} justifyContent="flex-end">
                                    <Button
                                        size="sm"
                                        leftIcon={<FontAwesomeIcon icon={faMapPin} />}
                                        colorScheme="blue"
                                        variant="outline"
                                        onClick={() => handleLocationChange({ latitude: 37.7749, longitude: -122.4194 })}
                                    >
                                        Set My Location
                                    </Button>
                                    <Button
                                        size="sm"
                                        leftIcon={<FontAwesomeIcon icon={faClinicMedical} />}
                                        colorScheme="green"
                                        variant="outline"
                                        onClick={() => handleLocationChange({ latitude: 37.7749, longitude: -122.4194 })}
                                    >
                                        Show All Clinics
                                    </Button>
                                </HStack>
                    </Card>
                        </MotionBox>

                    {/* Upcoming Appointments */}
                        {upcomingAppointments.length > 0 && (
                            <MotionBox variants={itemVariants}>
                    <Card>
                                    <Heading 
                                        as="h2" 
                                        size="lg" 
                                        mb={6}
                                        fontWeight="bold"
                                        bgGradient={headerGradient}
                                        bgClip="text"
                                    >
                            Your Upcoming Appointments
                        </Heading>
                            <VStack spacing={4} align="stretch">
                                        {upcomingAppointments.map((appointment) => (
                                            <Flex 
                                                key={appointment.id} 
                                        p={4} 
                                                bg={useColorModeValue(appointment.bgColor, 'gray.700')}
                                                borderRadius="lg"
                                                boxShadow="sm"
                                                transition="all 0.3s"
                                                _hover={{
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: 'md'
                                                }}
                                            >
                                                <Center 
                                                    bg={useColorModeValue('white', 'gray.900')}
                                                    color={appointment.iconColor} 
                                                    p={3} 
                                                    borderRadius="full" 
                                                    mr={4}
                                        boxShadow="sm" 
                                                >
                                                    <FontAwesomeIcon icon={appointment.icon} />
                                                </Center>
                                                <Box flex="1">
                                                    <Flex justifyContent="space-between" alignItems="flex-start">
                                                        <Box>
                                                            <Text fontWeight="bold">{appointment.doctor}</Text>
                                                            <Text fontSize="sm" color={textSecondary}>{appointment.type}</Text>
                                                    </Box>
                                            <HStack>
                                                <IconButton
                                                    aria-label="Edit appointment"
                                                    icon={<FontAwesomeIcon icon={faEdit} />}
                                                    size="sm"
                                                                variant="ghost"
                                                    colorScheme="blue"
                                                />
                                                <IconButton
                                                    aria-label="Cancel appointment"
                                                    icon={<FontAwesomeIcon icon={faTrash} />}
                                                    size="sm"
                                                                variant="ghost"
                                                    colorScheme="red"
                                                />
                                            </HStack>
                                        </Flex>
                                                    <Divider my={2} borderColor={subtleBorderColor} />
                                                    <Flex justifyContent="space-between" alignItems="center">
                                                        <Text fontSize="sm" fontWeight="medium">
                                                            <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '0.5rem' }} />
                                                            {appointment.date}
                                                        </Text>
                                                        <Text fontSize="sm" fontWeight="medium">
                                                            <FontAwesomeIcon icon={faClock} style={{ marginRight: '0.5rem' }} />
                                                            {appointment.time}
                                                        </Text>
                                                    </Flex>
                                    </Box>
                                            </Flex>
                                ))}
                            </VStack>
                                </Card>
                            </MotionBox>
                        )}
                </Stack>
                </MotionBox>
            </SimpleGrid>
        </Container>
    );
};

export default Contact; 