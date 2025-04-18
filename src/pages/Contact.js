import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPhone, faEnvelope, faLocationDot, faUserDoctor, faStethoscope, faMapLocationDot, faCalendar, faEdit, faTrash, faMapPin
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
    GridItem
} from '@chakra-ui/react';
import { Card } from '../components/ui';
import MapComponent from '../components/MapComponent';

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
        <Box>
            <Flex align="center" mb={6}>
                <Heading as="h2" size="xl" color="gray.800">
                    Contact & Appointments
                </Heading>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {/* Left Column - Contact Form and Location */}
                <Stack spacing={6}>
                    {/* Contact Form */}
                    <Card>
                        <Heading 
                            as="h3" 
                            size="md" 
                            mb={4} 
                            pb={2} 
                            borderBottom="1px" 
                            borderColor="gray.200"
                            bgGradient="linear(to-r, blue.600, green.600)"
                            bgClip="text"
                        >
                            Get in Touch
                        </Heading>
                        <form onSubmit={handleContactSubmit}>
                            <VStack spacing={4}>
                                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} width="100%">
                                    <FormControl>
                                        <FormLabel htmlFor="name" fontSize="sm" fontWeight="medium">Full Name</FormLabel>
                                        <Input 
                                            id="name" 
                                            name="name" 
                                            value={contactForm.name} 
                                            onChange={handleContactChange} 
                                            p={3}
                                            placeholder="Your name" 
                                            required 
                                            focusBorderColor="blue.500"
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="email" fontSize="sm" fontWeight="medium">Email Address</FormLabel>
                                        <Input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            value={contactForm.email} 
                                            onChange={handleContactChange} 
                                            p={3}
                                            placeholder="your.email@example.com" 
                                            required 
                                            focusBorderColor="blue.500"
                                        />
                                    </FormControl>
                                </SimpleGrid>

                                <FormControl>
                                    <FormLabel htmlFor="phone" fontSize="sm" fontWeight="medium">Phone Number</FormLabel>
                                    <Input 
                                        type="tel" 
                                        id="phone" 
                                        name="phone" 
                                        value={contactForm.phone} 
                                        onChange={handleContactChange} 
                                        p={3}
                                        placeholder="(123) 456-7890" 
                                        focusBorderColor="blue.500"
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor="subject" fontSize="sm" fontWeight="medium">Subject</FormLabel>
                                    <Select 
                                        id="subject" 
                                        name="subject" 
                                        value={contactForm.subject} 
                                        onChange={handleContactChange} 
                                        p={3}
                                        required 
                                        focusBorderColor="blue.500"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="support">Technical Support</option>
                                        <option value="billing">Billing Question</option>
                                        <option value="feedback">Feedback</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor="message" fontSize="sm" fontWeight="medium">Message</FormLabel>
                                    <Textarea 
                                        id="message" 
                                        name="message" 
                                        rows={4} 
                                        value={contactForm.message} 
                                        onChange={handleContactChange} 
                                        p={3}
                                        placeholder="How can we help you?" 
                                        required 
                                        focusBorderColor="blue.500"
                                    />
                                </FormControl>

                                <Flex justify="flex-end" width="100%">
                                    <Button 
                                        type="submit" 
                                        colorScheme="blue" 
                                        px={6} 
                                        py={2}
                                        _hover={{ bg: 'blue.600' }}
                                        transition="colors 0.2s"
                                    >
                                        Send Message
                                    </Button>
                                </Flex>
                            </VStack>
                        </form>
                    </Card>

                    {/* Location Map */}
                    <Card>
                        <Heading as="h3" size="md" mb={4}>
                            Your Location
                        </Heading>
                        <Text mb={4}>
                            Allow access to your location to find nearby appointment locations and get directions.
                        </Text>
                        <Box mb={4}>
                            <MapComponent 
                                onLocationChange={handleLocationChange} 
                                height="300px"
                                additionalMarker={selectedLocation}
                            />
                        </Box>
                        <Text fontSize="xs" color="gray.500">
                            Your location is used only to provide relevant appointment locations and directions.
                        </Text>
                    </Card>
                </Stack>

                {/* Right Column - Appointment Request Form and Upcoming Appointments */}
                <Stack spacing={6}>
                    {/* Appointment Request Form */}
                    <Card>
                        <Heading 
                            as="h3" 
                            size="md" 
                            mb={4} 
                            pb={2} 
                            borderBottom="1px" 
                            borderColor="gray.200"
                            bgGradient="linear(to-r, blue.600, green.600)"
                            bgClip="text"
                        >
                            Schedule an Appointment
                        </Heading>
                        <Box bg="gray.50" p={4} borderRadius="md" mb={6}>
                            <Text fontWeight="medium" mb={3}>Request New Appointment</Text>
                            <form onSubmit={handleAppointmentSubmit}>
                                <VStack spacing={4}>
                                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} width="100%">
                                        <FormControl>
                                            <FormLabel htmlFor="appointment-type" fontSize="sm" fontWeight="medium">Appointment Type</FormLabel>
                                            <Select 
                                                id="appointment-type" 
                                                name="type" 
                                                value={appointmentForm.type} 
                                                onChange={handleAppointmentChange} 
                                                p={2}
                                                required 
                                                focusBorderColor="blue.500"
                                            >
                                                <option value="">Select type</option>
                                                <option value="consultation">General Consultation</option>
                                                <option value="checkup">Annual Checkup</option>
                                                <option value="followup">Follow-up Visit</option>
                                                <option value="specialist">Specialist Referral</option>
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel htmlFor="appointment-doctor" fontSize="sm" fontWeight="medium">Preferred Doctor</FormLabel>
                                            <Select 
                                                id="appointment-doctor" 
                                                name="doctor" 
                                                value={appointmentForm.doctor} 
                                                onChange={handleAppointmentChange} 
                                                p={2}
                                                required 
                                                focusBorderColor="blue.500"
                                            >
                                                <option value="">Select doctor</option>
                                                <option value="dr-johnson">Dr. Sarah Johnson</option>
                                                <option value="dr-chen">Dr. Michael Chen</option>
                                                <option value="dr-patel">Dr. Anita Patel</option>
                                                <option value="any">No preference</option>
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel htmlFor="appointment-date" fontSize="sm" fontWeight="medium">Preferred Date</FormLabel>
                                            <Input 
                                                type="date" 
                                                id="appointment-date" 
                                                name="date" 
                                                value={appointmentForm.date} 
                                                onChange={handleAppointmentChange} 
                                                p={2}
                                                required 
                                                focusBorderColor="blue.500"
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel htmlFor="appointment-time" fontSize="sm" fontWeight="medium">Preferred Time</FormLabel>
                                            <Select 
                                                id="appointment-time" 
                                                name="time" 
                                                value={appointmentForm.time} 
                                                onChange={handleAppointmentChange} 
                                                p={2}
                                                required 
                                                focusBorderColor="blue.500"
                                            >
                                                <option value="">Select time</option>
                                                <option value="morning">Morning (9AM - 12PM)</option>
                                                <option value="afternoon">Afternoon (1PM - 5PM)</option>
                                                <option value="any">Any available time</option>
                                            </Select>
                                        </FormControl>
                                    </SimpleGrid>

                                    <FormControl>
                                        <FormLabel htmlFor="appointment-notes" fontSize="sm" fontWeight="medium">Reason for Visit</FormLabel>
                                        <Textarea 
                                            id="appointment-notes" 
                                            name="notes" 
                                            rows={2} 
                                            value={appointmentForm.notes} 
                                            onChange={handleAppointmentChange} 
                                            p={2}
                                            placeholder="Briefly describe your reason for the appointment" 
                                            required 
                                            focusBorderColor="blue.500"
                                        />
                                    </FormControl>

                                    <Flex justify="flex-end" width="100%">
                                        <Button 
                                            type="submit" 
                                            colorScheme="blue" 
                                            px={4} 
                                            py={2}
                                            _hover={{ bg: 'blue.600' }}
                                            transition="colors 0.2s"
                                        >
                                            Request Appointment
                                        </Button>
                                    </Flex>
                                </VStack>
                            </form>
                        </Box>
                    </Card>

                    {/* Upcoming Appointments */}
                    <Card>
                        <Heading as="h3" size="md" mb={4}>
                            Your Upcoming Appointments
                        </Heading>
                        
                        {upcomingAppointments.length === 0 ? (
                            <Center py={10}>
                                <VStack spacing={3}>
                                    <Box fontSize="xl" color="gray.400">
                                        <FontAwesomeIcon icon={faCalendar} />
                                    </Box>
                                    <Text color="gray.500">No upcoming appointments</Text>
                                    <Text fontSize="sm" color="gray.400">
                                        Use the form above to schedule an appointment
                                    </Text>
                                </VStack>
                            </Center>
                        ) : (
                            <VStack spacing={4} align="stretch">
                                {upcomingAppointments.map((appointment, index) => (
                                    <Box 
                                        key={index} 
                                        p={4} 
                                        borderRadius="md" 
                                        boxShadow="sm" 
                                        bg={index === 0 ? 'blue.50' : 'white'}
                                        borderWidth="1px"
                                        borderColor={index === 0 ? 'blue.200' : 'gray.200'}
                                    >
                                        <Flex justify="space-between" align="flex-start">
                                            <VStack align="flex-start" spacing={1}>
                                                <Heading as="h4" size="sm" fontWeight="semibold">
                                                    {appointment.type}
                                                </Heading>
                                                <Text fontSize="sm">
                                                    <b>Date:</b> {appointment.date}
                                                </Text>
                                                <Text fontSize="sm">
                                                    <b>Time:</b> {appointment.time}
                                                </Text>
                                                <Text fontSize="sm">
                                                    <b>Doctor:</b> {appointment.doctor}
                                                </Text>
                                                <Flex align="center" mt={1}>
                                                    <Box color="gray.500" mr={1}>
                                                        <FontAwesomeIcon icon={faLocationDot} size="sm" />
                                                    </Box>
                                                    <Text fontSize="sm" color="gray.600">
                                                        {appointment.location}
                                                    </Text>
                                                </Flex>
                                            </VStack>
                                            <HStack>
                                                <IconButton
                                                    aria-label="Show on map"
                                                    icon={<FontAwesomeIcon icon={faMapPin} />}
                                                    size="sm"
                                                    colorScheme="blue"
                                                    variant="outline"
                                                    onClick={() => handleSelectAppointmentLocation(appointment)}
                                                />
                                                <IconButton
                                                    aria-label="Edit appointment"
                                                    icon={<FontAwesomeIcon icon={faEdit} />}
                                                    size="sm"
                                                    colorScheme="blue"
                                                    variant="outline"
                                                />
                                                <IconButton
                                                    aria-label="Cancel appointment"
                                                    icon={<FontAwesomeIcon icon={faTrash} />}
                                                    size="sm"
                                                    colorScheme="red"
                                                    variant="outline"
                                                />
                                            </HStack>
                                        </Flex>
                                        {index === 0 && (
                                            <Badge mt={3} colorScheme="blue">
                                                Upcoming
                                            </Badge>
                                        )}
                                    </Box>
                                ))}
                            </VStack>
                        )}
                    </Card>
                </Stack>
            </SimpleGrid>
        </Box>
    );
};

export default Contact; 