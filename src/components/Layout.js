import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faTimes,
    faHome,
    faUser,
    faChartSimple,
    faPills,
    faVideo,
    faAddressBook,
    faHospital,
    faMessage,
    faCircleInfo,
    faLocationDot
} from '@fortawesome/free-solid-svg-icons';
import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Link,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    VStack,
    HStack,
    useColorModeValue,
    Container
} from '@chakra-ui/react';

const navItems = [
    { name: 'Dashboard', icon: faHome, path: '/' },
    { name: 'Profile', icon: faUser, path: '/profile' },
    { name: 'Symptom Tracker', icon: faChartSimple, path: '/symptom-tracker' },
    { name: 'Medication', icon: faPills, path: '/medication' },
    { name: 'Telemedicine', icon: faVideo, path: '/telemedicine' },
    { name: 'Contact', icon: faAddressBook, path: '/contact' },
    { name: 'Emergency & Healthcare', icon: faHospital, path: '/emergency-services' },
    { name: 'AI Assistant', icon: faMessage, path: '/chat' },
    { name: 'About', icon: faCircleInfo, path: '/about' },
];

const Layout = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const location = useLocation();

    // Determine the correct path for comparison
    const currentPath = location.pathname === '/' ? '/' : location.pathname;
    
    // Custom gradient and colors
    const headerBg = 'linear(to-r, brand.500, green.500)';
    const sidebarActiveColor = useColorModeValue('brand.500', 'brand.300');
    const sidebarActiveBg = useColorModeValue('blue.50', 'whiteAlpha.200');

    return (
        <Box minH="100vh" display="flex" flexDirection="column">
            {/* Header */}
            <Box 
                as="header" 
                position="sticky"
                top="0"
                zIndex="40"
                bgGradient={headerBg}
                boxShadow="md"
                color="white"
            >
                <Container maxW="container.xl" py={3} px={4}>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Flex alignItems="center">
                            <IconButton
                                variant="ghost"
                                colorScheme="whiteAlpha"
                                aria-label="Open menu"
                                icon={<FontAwesomeIcon icon={faBars} />}
                                fontSize="xl"
                                mr={4}
                                onClick={onOpen}
                                _hover={{ bg: 'whiteAlpha.200' }}
                            />
                            <Text fontSize="xl" fontWeight="bold">Zentorra Medicare</Text>
                        </Flex>
                        <HStack spacing={4}>
                            <Button
                                as={RouterLink}
                                to="/auth"
                                colorScheme="blue"
                                size="md"
                                _hover={{ bg: 'blue.700' }}
                            >
                                Sign In
                            </Button>
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            {/* Side Drawer Navigation */}
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader 
                        bgGradient={headerBg} 
                        color="white"
                        px={4}
                        py={4}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Text fontSize="xl" fontWeight="bold">Zentorra Medicare</Text>
                        <DrawerCloseButton position="static" color="white" />
                    </DrawerHeader>
                    <DrawerBody p={0}>
                        <VStack spacing={0} alignItems="stretch">
                            {navItems.map((item) => {
                                const isActive = item.path === currentPath;
                                return (
                                    <Link
                                        key={item.name}
                                        as={RouterLink}
                                        to={item.path}
                                        onClick={onClose}
                                        textDecoration="none"
                                        _hover={{ textDecoration: 'none' }}
                                        w="100%"
                                    >
                                        <Box
                                            py={2}
                                            px={4}
                                            bg={isActive ? sidebarActiveBg : 'transparent'}
                                            _hover={{ bg: 'gray.100' }}
                                            transition="all 0.2s"
                                        >
                                            <Flex alignItems="center">
                                                <Box 
                                                    color={isActive ? sidebarActiveColor : 'gray.600'} 
                                                    w="24px" 
                                                    textAlign="center" 
                                                    mr={3}
                                                >
                                                    <FontAwesomeIcon icon={item.icon} />
                                                </Box>
                                                <Text
                                                    color={isActive ? sidebarActiveColor : 'gray.700'}
                                                    fontWeight={isActive ? 'medium' : 'normal'}
                                                >
                                                    {item.name}
                                                </Text>
                                            </Flex>
                                        </Box>
                                    </Link>
                                );
                            })}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Main Content Area */}
            <Box 
                as="main" 
                flexGrow={1} 
                bg={useColorModeValue('gray.50', 'gray.800')}
                py={6}
            >
                <Container maxW="container.xl" px={4}>
                    {children}
                </Container>
            </Box>
        </Box>
    );
};

export default Layout; 