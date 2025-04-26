import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarCheck, faCalendarDays, faLaptopMedical, faVideo, faStethoscope,
    faPrescriptionBottle, faNotesMedical, faBrain, faAllergies, faLeaf, faVial,
    faUserDoctor, faCheckCircle, faArrowRight, faPhone
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
    useColorModeValue,
    chakra,
    Container,
    Divider,
} from '@chakra-ui/react';
import { Card } from '../components/ui';
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
    const accentColor = useColorModeValue('brand.500', 'brand.300');

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
                    Telemedicine Services
                </Heading>
                <Badge 
                    ml={3} 
                    colorScheme="purple" 
                    px={3} 
                    py={1} 
                    borderRadius="full" 
                    fontSize="sm"
                    fontWeight="medium"
                    textTransform="capitalize"
                >
                    Virtual Care
                </Badge>
            </MotionFlex>

            {/* Introduction Section */}
            <MotionBox
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                mb={8}
            >
                <Card 
                    variant="gradient" 
                    colorScheme="brand" 
                    mb={0}
                    overflow="hidden"
                >
                    <Flex 
                        direction={{ base: 'column', md: 'row' }} 
                        align="center"
                        gap={8}
                    >
                        <Box flex={{ base: 1, md: 3 }} pr={{ md: 6 }}>
                            <MotionText
                                variants={itemVariants}
                                as="h2" 
                                fontSize="2xl" 
                                fontWeight="bold" 
                                mb={4}
                                letterSpacing="tight"
                                color={useColorModeValue('gray.800', 'white')}
                            >
                                Connect with Healthcare Professionals from Anywhere
                            </MotionText>
                            <MotionText 
                                variants={itemVariants}
                                color={textPrimary} 
                                mb={4}
                                fontSize="lg"
                            >
                                Our secure telemedicine platform allows you to receive quality care from the comfort of your home. Save time, reduce travel, and get the medical attention you need.
                            </MotionText>
                            <MotionText 
                                variants={itemVariants}
                                color={textSecondary} 
                                mb={6}
                            >
                                Ideal for follow-ups, medication management, non-emergency consultations, mental health support, and more.
                            </MotionText>
                            <MotionBox variants={itemVariants}>
                        <Button
                            as={RouterLink}
                                    to="/contact"
                                    colorScheme="brand"
                                    size="lg"
                                    rightIcon={<FontAwesomeIcon icon={faCalendarCheck} />}
                                    borderRadius="full"
                                    px={8}
                                    py={6}
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        boxShadow: 'lg',
                                    }}
                                    transition="all 0.3s"
                        >
                            Schedule a Virtual Visit
                        </Button>
                            </MotionBox>
                    </Box>
                        <MotionBox 
                            variants={itemVariants}
                            flex={{ base: 1, md: 2 }} 
                            w="full"
                            h="100%"
                            display="flex"
                            justifyContent="center"
                        >
                        <Image 
                            src="/images/telemedicine-illustration.svg" 
                            alt="Telemedicine Illustration" 
                                borderRadius="xl"
                                maxH="300px"
                                objectFit="contain"
                                fallbackSrc="https://via.placeholder.com/500x300?text=Telemedicine"
                                shadow="md"
                                transition="transform 0.3s"
                                _hover={{ transform: 'scale(1.02)' }}
                        />
                        </MotionBox>
                </Flex>
            </Card>
            </MotionBox>

            {/* How It Works Section */}
            <MotionBox
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                mb={8}
            >
                <Card mb={0}>
                <Heading 
                        as="h2" 
                        size="lg" 
                        mb={6}
                        fontWeight="bold"
                        bgGradient={headerGradient}
                    bgClip="text"
                >
                    How Telemedicine Works
                </Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                        {[
                            { icon: faCalendarDays, title: "Schedule Your Visit", color: "blue", description: "Book a virtual appointment online or by calling our office. Choose a time that works best for you." },
                            { icon: faLaptopMedical, title: "Prepare for Your Call", color: "green", description: "You'll receive a secure link via email. Ensure you have a stable internet connection and a device with a camera and microphone." },
                            { icon: faVideo, title: "Connect with Your Doctor", color: "purple", description: "Click the link at your appointment time to join the secure video call with your healthcare provider." }
                        ].map((step, index) => (
                            <MotionBox 
                                key={index}
                                variants={itemVariants}
                                as={Card}
                                variant="outline"
                                p={6}
                                height="100%"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                textAlign="center"
                                position="relative"
                                _before={{
                                    content: `"${index + 1}"`,
                                    position: "absolute",
                                    top: "-15px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "full",
                                    bg: `${step.color}.500`,
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                    boxShadow: "md"
                                }}
                            >
                        <Center 
                                    bg={`${step.color}.100`} 
                                    color={`${step.color}.600`}
                            p={4} 
                            borderRadius="full" 
                                    mb={4}
                                    boxShadow="sm"
                        >
                                    <Icon as={FontAwesomeIcon} icon={step.icon} boxSize={6} />
                        </Center>
                                <Heading as="h3" size="md" fontWeight="semibold" mb={3}>
                                    {step.title}
                        </Heading>
                                <Text fontSize="md" color={textSecondary}>
                                    {step.description}
                        </Text>
                            </MotionBox>
                        ))}
                </SimpleGrid>
            </Card>
            </MotionBox>

            {/* Available Specialties */}
            <MotionBox
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                mb={8}
            >
                <Card mb={0}>
                <Heading 
                        as="h2" 
                        size="lg" 
                        mb={6}
                        fontWeight="bold"
                        bgGradient={headerGradient}
                    bgClip="text"
                >
                    Services Available via Telemedicine
                </Heading>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={4}>
                    {specialties.map((spec, index) => (
                            <MotionBox 
                                key={index}
                                variants={itemVariants}
                            >
                        <Flex 
                            align="center" 
                                    p={4} 
                                    bg={subtleBg} 
                                    borderRadius="lg"
                                    boxShadow="sm"
                                    transition="all 0.3s"
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        boxShadow: 'md',
                                        bg: cardHoverBg
                                    }}
                                    height="100%"
                                >
                                    <Center 
                                        bg={subtleIconBg} 
                                        p={2.5} 
                                        borderRadius="full" 
                                        mr={3}
                                        boxShadow="sm"
                                    >
                                        <Icon as={FontAwesomeIcon} icon={spec.icon} color={spec.color} boxSize={4} />
                                    </Center>
                                    <Text fontWeight="medium" fontSize="sm">{spec.name}</Text>
                        </Flex>
                            </MotionBox>
                    ))}
                </SimpleGrid>
                    
                    <Divider my={6} borderColor={subtleBorderColor} />
                    
                    <MotionBox 
                        variants={itemVariants}
                        bg={useColorModeValue('red.50', 'rgba(254, 178, 178, 0.12)')}
                        color={useColorModeValue('red.600', 'red.300')}
                        p={4}
                        borderRadius="lg"
                        borderLeft="4px solid"
                        borderColor={useColorModeValue('red.500', 'red.400')}
                    >
                        <Text fontSize="sm" fontWeight="medium">
                    *Note: Telemedicine is not suitable for emergencies or conditions requiring a physical examination. Call 999 for emergencies.
                </Text>
                    </MotionBox>
            </Card>
            </MotionBox>

            {/* Technical Requirements */}
            <MotionBox
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
            <Card>
                <Heading 
                        as="h2" 
                        size="lg" 
                        mb={6}
                        fontWeight="bold"
                        bgGradient={headerGradient}
                    bgClip="text"
                >
                    What You Need
                </Heading>
                    <MotionBox
                        variants={containerVariants}
                        as={SimpleGrid}
                        columns={{ base: 1, md: 2 }}
                        spacing={6}
                    >
                        <List spacing={4}>
                    {requirements.map((req, index) => (
                                <MotionBox key={index} variants={itemVariants}>
                                    <ListItem 
                                        display="flex" 
                                        alignItems="center"
                                        p={3}
                                        bg={subtleBg}
                                        borderRadius="md"
                                        transition="all 0.2s"
                                        _hover={{
                                            bg: cardHoverBg,
                                            transform: 'translateX(5px)'
                                        }}
                                    >
                                        <Center
                                            bg={useColorModeValue('green.100', 'green.900')}
                                            color={useColorModeValue('green.500', 'green.300')}
                                            p={2}
                                            borderRadius="full"
                                            mr={4}
                                        >
                                <FontAwesomeIcon icon={faCheckCircle} />
                                        </Center>
                                        <Text fontWeight="medium">{req}</Text>
                        </ListItem>
                                </MotionBox>
                    ))}
                </List>
                        
                        <MotionBox 
                            variants={itemVariants}
                            bg={useColorModeValue('blue.50', 'rgba(144, 205, 244, 0.12)')}
                            p={6}
                            borderRadius="xl"
                            borderLeft="4px solid"
                            borderColor={useColorModeValue('blue.500', 'blue.400')}
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                        >
                            <Heading size="md" mb={4} color={useColorModeValue('blue.700', 'blue.300')}>
                                Need Technical Help?
                            </Heading>
                            <Text mb={5} color={textPrimary}>
                                If you have technical difficulties during your telemedicine visit, our support team is ready to assist you.
                </Text>
                            <Button
                                leftIcon={<FontAwesomeIcon icon={faPhone} />}
                                colorScheme="blue"
                                variant="outline"
                                _hover={{
                                    bg: useColorModeValue('blue.100', 'blue.900'),
                                    transform: 'translateY(-2px)'
                                }}
                                transition="all 0.3s"
                            >
                                Call Support: (555) 123-4567
                            </Button>
                        </MotionBox>
                    </MotionBox>
            </Card>
            </MotionBox>
        </Container>
    );
};

export default Telemedicine; 