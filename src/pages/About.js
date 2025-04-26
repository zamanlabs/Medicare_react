import React, { useEffect, useRef } from 'react';
import { 
    Box, 
    Heading, 
    Text, 
    Container, 
    VStack, 
    SimpleGrid, 
    Stat, 
    StatLabel, 
    StatNumber, 
    Avatar, 
    Stack, 
    Divider, 
    HStack, 
    Icon, 
    Flex,
    useColorModeValue,
    Image,
    Button,
    AspectRatio,
    Grid,
    GridItem
} from '@chakra-ui/react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { 
    InfoIcon, 
    StarIcon, 
    CheckCircleIcon, 
    TimeIcon, 
    AtSignIcon,
    ChevronRightIcon
} from '@chakra-ui/icons';
import { Card } from '../components/ui';

// Motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionVStack = motion(VStack);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);
const MotionSimpleGrid = motion(SimpleGrid);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionImage = motion(Image);

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
            duration: 0.7, 
            ease: "easeOut" 
        } 
    }
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
        opacity: 1, 
        x: 0, 
        transition: { 
            duration: 0.7, 
            ease: "easeOut" 
        } 
    }
};

const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
        opacity: 1, 
        x: 0, 
        transition: { 
            duration: 0.7, 
            ease: "easeOut" 
        } 
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

// Placeholder data - replace with actual data
const stats = [
    { label: 'Happy Users', value: '10,000+', icon: StarIcon },
    { label: 'Partnered Hospitals', value: '500+', icon: CheckCircleIcon },
    { label: 'Ambulances Available', value: '1,000+', icon: TimeIcon },
    { label: 'Successful Bookings', value: '50,000+', icon: CheckCircleIcon },
];

const reviews = [
    { id: 1, name: 'Jane Doe', feedback: 'The service response was incredibly fast. The ambulance arrived in minutes, potentially saving my father\'s life.', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/32.jpg', location: 'Dhaka' },
    { id: 2, name: 'John Smith', feedback: 'During a medical emergency, this app helped me find the nearest hospital with available beds. Very reliable.', rating: 4.5, avatar: 'https://randomuser.me/api/portraits/men/44.jpg', location: 'Chattogram' },
    { id: 3, name: 'Alice Brown', feedback: 'The platform is intuitive even during stressful situations. Every feature works exactly as promised.', rating: 5, avatar: 'https://randomuser.me/api/portraits/women/54.jpg', location: 'Sylhet' }
];

const teamMembers = [
    { id: 1, name: 'Alex Johnson', role: 'CEO & Founder', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 2, name: 'Maria Garcia', role: 'Chief Medical Officer', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 3, name: 'David Lee', role: 'Head of Technology', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 4, name: 'Sarah Chen', role: 'Operations Manager', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
];

// Hero images
const heroImages = [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1551601651-bc60f254d532?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80'
];

// Section component with intersection observer for animations
const AnimatedSection = ({ children, variants, delay = 0 }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, threshold: 0.2 });
    
    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);
    
    return (
        <MotionBox
            ref={ref}
            variants={variants || fadeIn}
            initial="hidden"
            animate={controls}
            transition={{ delay }}
            mb={20}
        >
            {children}
        </MotionBox>
    );
};

const About = () => {
    // Theme-aware colors
    const bgColor = useColorModeValue('white', 'gray.800');
    const bgAccent = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'white');
    const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
    const accentColor = useColorModeValue('brand.500', 'brand.400');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const cardBg = useColorModeValue('white', 'gray.800');
    const statBg = useColorModeValue('brand.50', 'brand.900');
    
    return (
        <Box overflow="hidden">
            {/* Hero Section */}
            <Box 
                position="relative" 
                h={{ base: "90vh", md: "80vh", lg: "70vh" }}
                overflow="hidden"
            >
                {/* Background image with overlay */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    w="full"
                    h="full"
                    bgImage={`url(${heroImages[0]})`}
                    bgSize="cover"
                    bgPosition="center"
                    bgRepeat="no-repeat"
                    _after={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bg: 'blackAlpha.600',
                        backdropFilter: 'blur(2px)',
                        zIndex: 1
                    }}
                />
                
                {/* Content */}
                <Container maxW="container.xl" position="relative" zIndex={2} h="full">
                    <Flex direction="column" justify="center" align="start" h="full" py={10} maxW={{ base: "100%", md: "60%" }}>
                        <MotionBox 
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                        >
                            <Heading 
                                as="h1" 
                                size="3xl" 
                                color="white" 
                                fontWeight="bold"
                                lineHeight="shorter"
                                mb={6}
                            >
                                Revolutionizing Healthcare Access
                            </Heading>
                            
                            <Text 
                                fontSize="xl" 
                                color="white" 
                                mb={8}
                                textShadow="0 2px 4px rgba(0,0,0,0.3)"
                            >
                                Zentorra Medicare connects users with emergency medical services efficiently and reliably, creating a future where quality healthcare is accessible to everyone.
                            </Text>
                            
                            <Button 
                                size="lg" 
                                colorScheme="brand" 
                                rightIcon={<ChevronRightIcon />}
                                boxShadow="xl"
                                _hover={{
                                    transform: 'translateY(-2px)',
                                    boxShadow: '2xl',
                                }}
                                transition="all 0.3s"
                            >
                                Learn More
                            </Button>
                        </MotionBox>
                    </Flex>
                </Container>
            </Box>
            
            <Container maxW="container.xl" py={16}>
                {/* Introduction Section */}
                <AnimatedSection>
                    <Grid 
                        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                        gap={10}
                        alignItems="center"
                    >
                        <GridItem>
                            <MotionVStack 
                                align="start" 
                                spacing={6}
                                variants={fadeInLeft}
                            >
                                <Box>
                                    <Text 
                                        color={accentColor} 
                                        fontWeight="bold" 
                                        letterSpacing="wide"
                                        textTransform="uppercase"
                                    >
                                        About Us
                                    </Text>
                                    <Heading 
                                        as="h2" 
                                        size="2xl" 
                                        color={textColor}
                                        lineHeight="shorter"
                                        mt={2}
                                        bgGradient={useColorModeValue(
                                            "linear(to-r, brand.500, brand.700)",
                                            "linear(to-r, brand.400, brand.600)"
                                        )}
                                        bgClip="text"
                                    >
                            Welcome to Zentorra Medicare
                        </Heading>
                                </Box>
                                
                                <Text fontSize="lg" color={secondaryTextColor}>
                                    Zentorra Medicare, a part of Zentora, is dedicated to providing seamless access to emergency medical services. We connect users with nearby hospitals and ambulances efficiently and reliably, ensuring that quality healthcare is just a tap away.
                                </Text>
                                
                                <Text fontSize="lg" color={secondaryTextColor}>
                                    Our platform combines cutting-edge technology with a deep understanding of healthcare needs to create an experience that saves lives and improves outcomes for patients across Bangladesh.
                    </Text>
                            </MotionVStack>
                        </GridItem>
                        
                        <GridItem>
                            <MotionBox 
                                variants={fadeInRight}
                                position="relative"
                                borderRadius="2xl"
                                overflow="hidden"
                                boxShadow="2xl"
                            >
                                <AspectRatio ratio={4/3}>
                                    <Image 
                                        src={heroImages[1]} 
                                        alt="Healthcare professionals" 
                                        objectFit="cover" 
                                    />
                                </AspectRatio>
                                
                                {/* Decorative elements */}
                                <Box 
                                    position="absolute" 
                                    bottom="-20px" 
                                    right="-20px" 
                                    width="100px" 
                                    height="100px" 
                                    borderRadius="full" 
                                    bg="brand.500" 
                                    opacity="0.3" 
                                />
                                <Box 
                                    position="absolute" 
                                    top="-20px" 
                                    left="-20px" 
                                    width="70px" 
                                    height="70px" 
                                    borderRadius="full" 
                                    bg="accent.500" 
                                    opacity="0.3" 
                                />
                            </MotionBox>
                        </GridItem>
                    </Grid>
                </AnimatedSection>

                {/* Statistics Section */}
                <AnimatedSection variants={scaleIn} delay={0.2}>
                    <Box 
                        py={10} 
                        my={10}
                        position="relative"
                        overflow="hidden"
                    >
                        {/* Background decorative elements */}
                        <Box
                            position="absolute"
                            top="0"
                            right="5%"
                            w="300px"
                            h="300px"
                            bg="brand.50"
                            opacity="0.5"
                            borderRadius="full"
                            zIndex={0}
                            display={{ base: "none", md: "block" }}
                        />
                        <Box
                            position="absolute"
                            bottom="10%"
                            left="0"
                            w="200px"
                            h="200px"
                            bg="accent.50"
                            opacity="0.5"
                            borderRadius="full"
                            zIndex={0}
                            display={{ base: "none", md: "block" }}
                        />
                        
                        <VStack spacing={8} position="relative" zIndex={1}>
                            <Box textAlign="center" maxW="container.md" mx="auto">
                                <Heading 
                                    as="h2" 
                                    size="xl" 
                                    mb={4} 
                                    fontWeight="bold"
                                    bgGradient={useColorModeValue(
                                        "linear(to-r, brand.500, accent.500)",
                                        "linear(to-r, brand.400, accent.400)"
                                    )}
                                    bgClip="text"
                                >
                        Our Impact in Numbers
                    </Heading>
                                <Text fontSize="lg" color={secondaryTextColor}>
                                    Since our launch, we've made a significant difference in healthcare accessibility across Bangladesh
                                </Text>
                            </Box>
                            
                    <MotionSimpleGrid
                                columns={{ base: 1, sm: 2, md: 4 }}
                        spacing={10}
                                w="full"
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                    >
                        {stats.map((stat, index) => (
                                    <MotionBox
                                key={index}
                                        variants={fadeIn}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, amount: 0.5 }}
                                    >
                                        <Box
                                            borderRadius="xl"
                                            overflow="hidden"
                                            boxShadow="xl"
                                textAlign="center"
                                            py={10}
                                            px={6}
                                            bg={cardBg}
                                            position="relative"
                                            transition="all 0.3s"
                                            _hover={{
                                                transform: "translateY(-5px)",
                                                boxShadow: "2xl"
                                            }}
                                        >
                                            <Flex 
                                                justify="center" 
                                                align="center" 
                                                bg={useColorModeValue(`${stat.icon === StarIcon ? 'yellow' : stat.icon === CheckCircleIcon ? 'green' : stat.icon === TimeIcon ? 'blue' : 'purple'}.100`, `${stat.icon === StarIcon ? 'yellow' : stat.icon === CheckCircleIcon ? 'green' : stat.icon === TimeIcon ? 'blue' : 'purple'}.900`)}
                                                w="70px"
                                                h="70px"
                                                borderRadius="full"
                                                mx="auto"
                                                mb={4}
                                            >
                                                <Icon 
                                                    as={stat.icon} 
                                                    w={6} 
                                                    h={6} 
                                                    color={useColorModeValue(`${stat.icon === StarIcon ? 'yellow' : stat.icon === CheckCircleIcon ? 'green' : stat.icon === TimeIcon ? 'blue' : 'purple'}.500`, `${stat.icon === StarIcon ? 'yellow' : stat.icon === CheckCircleIcon ? 'green' : stat.icon === TimeIcon ? 'blue' : 'purple'}.300`)} 
                                                />
                                            </Flex>
                                <Stat>
                                                <StatNumber 
                                                    fontSize="4xl" 
                                                    fontWeight="bold" 
                                                    mb={1}
                                                    color={useColorModeValue(`${stat.icon === StarIcon ? 'yellow' : stat.icon === CheckCircleIcon ? 'green' : stat.icon === TimeIcon ? 'blue' : 'purple'}.500`, `${stat.icon === StarIcon ? 'yellow' : stat.icon === CheckCircleIcon ? 'green' : stat.icon === TimeIcon ? 'blue' : 'purple'}.300`)} 
                                                >
                                                    {stat.value}
                                                </StatNumber>
                                                <StatLabel fontSize="lg" fontWeight="medium" color={secondaryTextColor}>{stat.label}</StatLabel>
                                </Stat>
                                        </Box>
                                    </MotionBox>
                        ))}
                    </MotionSimpleGrid>
                        </VStack>
                    </Box>
                </AnimatedSection>

                {/* Features/Mission Section */}
                <AnimatedSection>
                    <Box
                        py={10}
                        position="relative"
                        borderRadius="3xl"
                        overflow="hidden"
                        bg={bgAccent}
                        mb={20}
                >
                        <Box
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            height="30%"
                            bgGradient={useColorModeValue(
                                "linear(to-b, brand.50, transparent)",
                                "linear(to-b, brand.900, transparent)"
                            )}
                            opacity="0.7"
                        />
                        
                        <Container maxW="container.xl" position="relative" zIndex={1}>
                            <Grid 
                                templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
                                gap={12}
                                alignItems="center"
                            >
                                <GridItem order={{ base: 2, lg: 1 }}>
                                    <MotionVStack
                                        align="start"
                                        spacing={6}
                                        variants={fadeInLeft}
                                    >
                                        <Box>
                                            <Text 
                                                color={accentColor} 
                                                fontWeight="bold"
                                                textTransform="uppercase"
                                                letterSpacing="wide"
                                            >
                                                Our Mission
                                            </Text>
                                            <Heading 
                                                as="h2" 
                                                size="xl" 
                                                mt={2}
                                            >
                                                Healthcare For Everyone, Everywhere
                                            </Heading>
                                        </Box>
                                        
                                        <Text fontSize="lg" color={secondaryTextColor}>
                                            Zentorra Medicare is dedicated to revolutionizing healthcare accessibility through innovative technology solutions. We aim to empower individuals to take control of their health journey with our comprehensive digital health platform.
                                        </Text>
                                        
                                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} w="full">
                                            <Box>
                                                <Heading as="h4" size="md" mb={2}>Our Vision</Heading>
                                                <Text color={secondaryTextColor}>
                                                    To create a world where quality healthcare is accessible to everyone, everywhere, through seamless integration of technology and medical expertise.
                                                </Text>
                                            </Box>
                                            
                                            <Box>
                                                <Heading as="h4" size="md" mb={2}>Our Values</Heading>
                                                <Text color={secondaryTextColor}>
                                                    Accessibility, Innovation, Reliability, Compassion, and Excellence in everything we do.
                                                </Text>
                                            </Box>
                                        </Grid>
                                    </MotionVStack>
                                </GridItem>
                                
                                <GridItem order={{ base: 1, lg: 2 }}>
                                    <MotionBox
                                        variants={fadeInRight}
                                        position="relative"
                                    >
                                        <Box
                                            borderRadius="2xl"
                                            overflow="hidden"
                                            boxShadow="2xl"
                                            position="relative"
                                            _after={{
                                                content: '""',
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                right: 0,
                                                bottom: 0,
                                                borderRadius: "2xl",
                                                border: "3px solid",
                                                borderColor: "brand.500",
                                                transform: "translate(15px, 15px)",
                                                pointerEvents: "none"
                                            }}
                                        >
                                            <AspectRatio ratio={1}>
                                                <Image
                                                    src={heroImages[2]}
                                                    alt="Our mission"
                                                    objectFit="cover"
                                                />
                                            </AspectRatio>
                                        </Box>
                </MotionBox>
                                </GridItem>
                            </Grid>
                        </Container>
                    </Box>
                </AnimatedSection>

                {/* Team Section */}
                <AnimatedSection variants={scaleIn}>
                    <Box textAlign="center" mb={10}>
                        <Heading 
                            as="h2" 
                            size="xl" 
                            mb={4}
                            bgGradient={useColorModeValue(
                                "linear(to-r, brand.600, accent.600)",
                                "linear(to-r, brand.400, accent.400)"
                            )}
                            bgClip="text"
                            fontWeight="bold"
                        >
                        Meet Our Team
                    </Heading>
                        <Text fontSize="lg" color={secondaryTextColor} maxW="container.md" mx="auto">
                            Our passionate team of healthcare and technology experts are committed to transforming the healthcare experience
                        </Text>
                    </Box>
                    
                    <MotionSimpleGrid
                         columns={{ base: 2, md: 4 }}
                        spacing={8}
                         variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {teamMembers.map(member => (
                            <MotionBox
                                key={member.id}
                                variants={fadeIn}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            >
                                <VStack
                                    spacing={4}
                                    bg={cardBg}
                                    p={6}
                                    borderRadius="xl"
                                    boxShadow="lg"
                                    transition="all 0.3s"
                                    _hover={{ boxShadow: "xl" }}
                                    height="100%"
                            >
                                    <Box
                                        borderRadius="full"
                                        overflow="hidden"
                                        boxShadow="md"
                                        w="120px"
                                        h="120px"
                                        position="relative"
                                    >
                                        <Image
                                            src={member.img}
                                            alt={member.name}
                                            objectFit="cover"
                                            w="100%"
                                            h="100%"
                                        />
                                    </Box>
                                    
                                    <VStack spacing={1}>
                                        <Heading as="h3" size="md" fontWeight="bold">
                                            {member.name}
                                        </Heading>
                                        <Text color={accentColor} fontWeight="medium">
                                            {member.role}
                                        </Text>
                                    </VStack>
                                </VStack>
                            </MotionBox>
                        ))}
                    </MotionSimpleGrid>
                </AnimatedSection>

                {/* Testimonials Section */}
                <AnimatedSection variants={fadeIn} delay={0.3}>
                    <Box 
                        bg={useColorModeValue("brand.50", "brand.900")} 
                        borderRadius="3xl" 
                        py={12} 
                        px={6}
                        position="relative"
                    overflow="hidden"
                >
                        {/* Decorative elements */}
                        <Box
                            position="absolute"
                            right="-100px"
                            top="-100px"
                            w="300px"
                            h="300px"
                            borderRadius="full"
                            bg={useColorModeValue("brand.100", "brand.800")}
                        />
                        <Box
                            position="absolute"
                            left="-30px"
                            bottom="-30px"
                            w="150px"
                            h="150px"
                            borderRadius="full"
                            bg={useColorModeValue("accent.100", "accent.800")}
                        />
                        
                        <Container maxW="container.lg" position="relative" zIndex={1}>
                            <VStack spacing={10}>
                                <Box textAlign="center">
                                    <Heading as="h2" size="xl" mb={4}>
                                        What Our Users Say
                                    </Heading>
                                    <Text fontSize="lg" color={secondaryTextColor} maxW="container.md" mx="auto">
                                        Hear from people who have experienced the difference our platform makes
                                    </Text>
                                </Box>
                                
                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                                    {reviews.map(review => (
                                        <Box
                                            key={review.id}
                                            bg={cardBg}
                                            p={6}
                                            borderRadius="xl"
                                            boxShadow="lg"
                                            position="relative"
                                            _hover={{ transform: "translateY(-5px)", boxShadow: "xl" }}
                                            transition="all 0.3s"
                                        >
                                            {/* Quote mark */}
                                            <Text 
                                                position="absolute" 
                                                top="-10px" 
                                                left="20px" 
                                                fontSize="6xl" 
                                                color={useColorModeValue("brand.200", "brand.700")}
                                                opacity={0.6}
                                                fontFamily="serif"
                                                fontWeight="bold"
                                            >
                                                "
                                            </Text>
                                            
                                            <Text fontSize="md" fontStyle="italic" color={secondaryTextColor} mb={4} pt={5}>
                                                "{review.feedback}"
                                            </Text>
                                            
                                            <HStack>
                                                <Text fontWeight="bold" color={textColor}>
                                                    — {review.name}
                                                </Text>
                                                <HStack ml="auto">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Icon 
                                                            key={i} 
                                                            as={StarIcon} 
                                                            color={i < Math.floor(review.rating) ? "yellow.400" : i < review.rating ? "yellow.300" : "gray.300"} 
                                                            w={4} 
                                                            h={4} 
                                                        />
                                                    ))}
                                                </HStack>
                                            </HStack>
                                        </Box>
                                    ))}
                                </SimpleGrid>
                            </VStack>
                        </Container>
                    </Box>
                </AnimatedSection>
                
                {/* Zentora Info Section */}
                <AnimatedSection variants={fadeIn} delay={0.4}>
                    <Box pt={16} pb={10}>
                        <Grid 
                            templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
                            gap={12}
                            alignItems="center"
                        >
                            <GridItem>
                                <MotionVStack
                                    align="start"
                                    spacing={6}
                                    variants={fadeInLeft}
                                >
                                    <HStack spacing={3}>
                                        <Icon as={AtSignIcon} w={6} h={6} color={accentColor} />
                                        <Heading 
                                            as="h2" 
                                            size="xl"
                                            bgGradient={useColorModeValue(
                                                "linear(to-r, accent.500, brand.500)",
                                                "linear(to-r, accent.400, brand.400)"
                                            )}
                                            bgClip="text"
                                            fontWeight="bold"
                                        >
                             About Zentora
            </Heading>
                     </HStack>
                                    
                                    <Text 
                                        fontSize="lg" 
                                        fontStyle="italic" 
                                        fontWeight="medium"
                                        color={accentColor}
                                    >
                        "Building Tomorrow Today"
                    </Text>
                                    
                                    <Text fontSize="md" color={secondaryTextColor}>
                        Zentorra empowers businesses and individuals through cutting-edge technology, creativity, and social impact. Our expert team drives digital transformation by delivering tailored solutions in web and app development, UI/UX design, and tech consultancy.
                    </Text>
                                    
                                    <Text fontSize="md" color={secondaryTextColor}>
                        From eye-catching graphics and brand design to hands-on online learning and workshops, Zentorra ensures innovation with quality and efficiency. We also assist in solving both software and hardware challenges for a smarter tomorrow.
                    </Text>
                                    
                                    <Text 
                                        fontWeight="medium" 
                                        fontSize="lg"
                                        mt={4}
                                        alignSelf="flex-end"
                                    >
                                        — The Zentorra Team
                </Text>
                                </MotionVStack>
                            </GridItem>
                            
                            <GridItem>
                                <MotionBox
                                    variants={fadeInRight}
                                    position="relative"
                                >
                                    <SimpleGrid columns={2} spacing={4}>
                                        <Box
                                            gridColumn="1 / 3"
                                            borderRadius="xl"
                                            overflow="hidden"
                                            boxShadow="lg"
                                            transition="all 0.3s"
                                            _hover={{ transform: "scale(1.02)", boxShadow: "xl" }}
                                        >
                                            <AspectRatio ratio={16/9}>
                                                <Image 
                                                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80" 
                                                    alt="Zentora Team" 
                                                    objectFit="cover"
                                                />
                                            </AspectRatio>
                                        </Box>
                                        <Box
                                            borderRadius="xl"
                                            overflow="hidden"
                                            boxShadow="lg"
                                            transition="all 0.3s"
                                            _hover={{ transform: "scale(1.02)", boxShadow: "xl" }}
                                        >
                                            <AspectRatio ratio={1}>
                                                <Image 
                                                    src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                                                    alt="Technology" 
                                                    objectFit="cover"
                                                />
                                            </AspectRatio>
                                        </Box>
                                        <Box
                                            borderRadius="xl"
                                            overflow="hidden"
                                            boxShadow="lg"
                                            transition="all 0.3s"
                                            _hover={{ transform: "scale(1.02)", boxShadow: "xl" }}
                                        >
                                            <AspectRatio ratio={1}>
                                                <Image 
                                                    src="https://images.unsplash.com/photo-1562564055-71e051d33c19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                                                    alt="Innovation" 
                                                    objectFit="cover"
                                                />
                                            </AspectRatio>
                    </Box>
                                    </SimpleGrid>
                                </MotionBox>
                            </GridItem>
                        </Grid>
                    </Box>
                </AnimatedSection>
        </Container>
        </Box>
    );
};

export default About; 