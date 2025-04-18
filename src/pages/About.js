import React from 'react';
import { Box, Heading, Text, Container, VStack, SimpleGrid, Stat, StatLabel, StatNumber, Avatar, Stack, Divider, HStack, Icon } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { InfoIcon, StarIcon, CheckCircleIcon, TimeIcon, AtSignIcon } from '@chakra-ui/icons'; // Example icons
import { Card } from '../components/ui'; // Assuming Card is a custom styled container

// Framer Motion variants for animations
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardHoverEffect = {
    hover: { y: -5, scale: 1.03, boxShadow: 'xl' }
};

// Placeholder data - replace with actual data
const stats = [
    { label: 'Happy Users', value: '10,000+', icon: StarIcon },
    { label: 'Partnered Hospitals', value: '500+', icon: CheckCircleIcon },
    { label: 'Ambulances Available', value: '1,000+', icon: TimeIcon },
    { label: 'Successful Bookings', value: '50,000+', icon: CheckCircleIcon },
];

const reviews = [
    { id: 1, name: 'Jane Doe', feedback: 'Amazing service, very quick response!', rating: 5 },
    { id: 2, name: 'John Smith', feedback: 'Helped me find the nearest hospital in an emergency.', rating: 4.5 },
    { id: 3, name: 'Alice Brown', feedback: 'The platform is user-friendly and reliable.', rating: 5 },
];

const teamMembers = [
    { id: 1, name: 'Alex Johnson', role: 'CEO & Founder', img: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Maria Garcia', role: 'Chief Medical Officer', img: 'https://via.placeholder.com/150' },
    { id: 3, name: 'David Lee', role: 'Head of Technology', img: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Sarah Chen', role: 'Operations Manager', img: 'https://via.placeholder.com/150' },
];

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionVStack = motion(VStack);
const MotionSimpleGrid = motion(SimpleGrid);

const About = () => {
    return (
        <Container maxW="container.xl" py={10}>
            <MotionVStack
                spacing={12}
                align="stretch"
                variants={staggerContainer}
                initial="initial"
                animate="animate" // Use animate for initial load stagger if desired, or rely on whileInView below
            >

                {/* Introduction Section */}
                <MotionCard
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                    overflow="hidden" // Ensure shadow/transforms are contained if needed
                >
                    <HStack spacing={4} mb={4}>
                        <Icon as={InfoIcon} w={6} h={6} color="teal.500" />
                        <Heading as="h2" size="xl" color="gray.800">
                            Welcome to Zentorra Medicare
                        </Heading>
                    </HStack>
                    <Text color="gray.600" fontSize="lg">
                        Zentorra Medicare, a part of Zentora, is dedicated to providing seamless access to emergency medical services. We connect users with nearby hospitals and ambulances efficiently and reliably.
                    </Text>
                </MotionCard>

                {/* Statistics Section */}
                <MotionBox
                     // variants={fadeInUp}
                     // initial="initial"
                     // whileInView="animate"
                     // viewport={{ once: true }}
                >
                    <Heading as="h3" size="lg" color="gray.700" mb={6} textAlign="center">
                        Our Impact in Numbers
                    </Heading>
                    <MotionSimpleGrid
                        columns={{ base: 2, md: 4 }}
                        spacing={10}
                        variants={staggerContainer} // Stagger children cards
                    >
                        {stats.map((stat, index) => (
                            <MotionCard
                                key={index}
                                textAlign="center"
                                p={5}
                                shadow="md"
                                borderWidth="1px"
                                variants={fadeInUp} // Each card fades up
                                whileHover="hover"
                                custom={cardHoverEffect.hover} // Pass hover state for reuse if needed
                                initial="initial" // Ensure variants are applied
                                // animate="animate" // Animation handled by parent whileInView + stagger
                            >
                                <Stat>
                                    <Icon as={stat.icon} w={8} h={8} color="teal.400" mb={3} />
                                    <StatNumber fontSize="3xl" fontWeight="bold" color="teal.500">{stat.value}</StatNumber>
                                    <StatLabel fontSize="md" color="gray.500">{stat.label}</StatLabel>
                                </Stat>
                            </MotionCard>
                        ))}
                    </MotionSimpleGrid>
                </MotionBox>

                {/* User Reviews Section */}
                <MotionBox
                     variants={fadeInUp}
                     initial="initial"
                     whileInView="animate"
                     viewport={{ once: true, amount: 0.2 }}
                >
                    <Heading as="h3" size="lg" color="gray.700" mb={6} textAlign="center">
                        What Our Users Say
                    </Heading>
                    <MotionSimpleGrid
                        columns={{ base: 1, md: 3 }}
                        spacing={8}
                        variants={staggerContainer}
                    >
                        {reviews.map((review) => (
                            <MotionCard
                                key={review.id}
                                p={5}
                                shadow="md"
                                borderWidth="1px"
                                variants={fadeInUp}
                                whileHover="hover"
                                custom={cardHoverEffect.hover}
                            >
                                <Icon as={StarIcon} color="yellow.400" w={5} h={5} mb={2} /> {/* Example Review Icon */}
                                <Text fontStyle="italic" color="gray.600">"{review.feedback}"</Text>
                                <Text fontWeight="bold" mt={3} color="gray.700">- {review.name}</Text>
                                {/* Add rating display if needed, e.g., stars */}
                            </MotionCard>
                        ))}
                    </MotionSimpleGrid>
                </MotionBox>

                {/* Our Team Section */}
                <MotionBox
                     variants={fadeInUp}
                     initial="initial"
                     whileInView="animate"
                     viewport={{ once: true, amount: 0.2 }}
                >
                    <Heading as="h3" size="lg" color="gray.700" mb={6} textAlign="center">
                        Meet Our Team
                    </Heading>
                    <MotionSimpleGrid
                         columns={{ base: 2, md: 4 }}
                         spacing={10}
                         justifyContent="center"
                         variants={staggerContainer}
                    >
                        {teamMembers.map((member) => (
                            <MotionVStack
                                key={member.id}
                                spacing={3}
                                variants={fadeInUp}
                                whileHover="hover"
                                custom={cardHoverEffect.hover} // Apply hover effect to the whole stack
                                p={4} // Add padding for hover effect space
                                borderRadius="md" // Optional: round corners for card feel
                            >
                                <Avatar size="xl" name={member.name} src={member.img} mb={2} />
                                <Text fontWeight="bold" color="gray.800">{member.name}</Text>
                                <Text fontSize="sm" color="gray.500">{member.role}</Text>
                            </MotionVStack>
                        ))}
                    </MotionSimpleGrid>
                </MotionBox>

                <Divider />

                {/* Zentora Info (Expanded) Section */}
                <MotionCard
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                    overflow="hidden"
                >
                     <HStack spacing={4} mb={4}>
                         <Icon as={AtSignIcon} w={6} h={6} color="teal.500" /> {/* Example Icon */}
                         <Heading as="h3" size="lg" color="gray.800">
                             About Zentora
            </Heading>
                     </HStack>
                    <Text color="gray.600" mb={2} fontStyle="italic">
                        "Building Tomorrow Today"
                    </Text>
                    <Text color="gray.600" mb={4}>
                        Zentorra empowers businesses and individuals through cutting-edge technology, creativity, and social impact. Our expert team drives digital transformation by delivering tailored solutions in web and app development, UI/UX design, and tech consultancy.
                    </Text>
                    <Text color="gray.600" mb={4}>
                        From eye-catching graphics and brand design to hands-on online learning and workshops, Zentorra ensures innovation with quality and efficiency. We also assist in solving both software and hardware challenges for a smarter tomorrow.
                    </Text>
                    {/* Add Mission Section */}
                    <Box mt={6}>
                        <Heading as="h4" size="md" color="gray.700" mb={2}>Our Mission</Heading>
                <Text color="gray.600">
                            Zentorra Medicare is dedicated to revolutionizing healthcare accessibility through innovative technology solutions. We aim to empower individuals to take control of their health journey with our comprehensive digital health platform.
                </Text>
                    </Box>
                    {/* Add Vision Section */}
                    <Box mt={4}>
                        <Heading as="h4" size="md" color="gray.700" mb={2}>Our Vision</Heading>
                <Text color="gray.600">
                            To create a world where quality healthcare is accessible to everyone, everywhere, through seamless integration of technology and medical expertise.
                        </Text>
                    </Box>
                     {/* Placeholder for Values if needed later */}
                    <Text color="gray.700" fontWeight="medium" mt={4}>
                        — The Zentorra Team
                </Text>
                </MotionCard>

            </MotionVStack>
        </Container>
    );
};

export default About; 