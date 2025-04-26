import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate, Outlet } from 'react-router-dom';
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
    faLocationDot,
    faSignOutAlt,
    faSun,
    faMoon
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
    useColorMode,
    Container,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Tooltip,
    Divider,
    ScaleFade,
    Slide,
    Image
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Create a motion component
const MotionBox = motion(Box);

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

const Layout = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const { colorMode, toggleColorMode } = useColorMode();

    // State for hover effects
    const [hoveredItem, setHoveredItem] = useState(null);

    // Determine the correct path for comparison
    const currentPath = location.pathname === '/' ? '/' : location.pathname;
    
    // Custom gradient and colors
    const headerBg = useColorModeValue(
        'linear(to-r, brand.500, accent.400)',
        'linear(to-r, brand.700, accent.600)'
    );
    const sidebarBg = useColorModeValue('white', 'gray.800');
    const sidebarActiveColor = useColorModeValue('brand.500', 'brand.300');
    const sidebarActiveBg = useColorModeValue('blue.50', 'whiteAlpha.200');
    const sidebarHoverBg = useColorModeValue('gray.50', 'gray.700');
    const mainBg = useColorModeValue('gray.50', 'gray.900');
    
    // Handle sidebar item hover
    const handleItemHover = (itemPath) => {
        setHoveredItem(itemPath);
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    // Add scroll effect for header
    const [isScrolled, setIsScrolled] = useState(false);
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Logo or app name
    const AppLogo = () => (
        <Flex alignItems="center">
            <Text 
                fontSize="xl" 
                fontWeight="bold" 
                bgGradient={headerBg}
                bgClip="text"
                letterSpacing="tight"
            >
                Zentorra Medicare
            </Text>
        </Flex>
    );

    return (
        <Box minH="100vh" display="flex" flexDirection="column">
            {/* Header */}
            <Box 
                as="header" 
                position="sticky"
                top="0"
                zIndex="40"
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={isScrolled ? 'md' : 'none'}
                transition="all 0.3s"
                borderBottom={isScrolled ? 'none' : '1px solid'}
                borderColor={useColorModeValue('gray.100', 'gray.700')}
            >
                <Container maxW="container.xl" py={3} px={4}>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Flex alignItems="center">
                            <Tooltip label="Menu" placement="bottom">
                                <IconButton
                                    aria-label="Open menu"
                                    icon={<FontAwesomeIcon icon={faBars} />}
                                    fontSize="xl"
                                    mr={4}
                                    onClick={onOpen}
                                    variant="ghost"
                                    color={useColorModeValue('gray.600', 'gray.300')}
                                    _hover={{ 
                                        bg: useColorModeValue('gray.100', 'gray.700'),
                                        transform: 'scale(1.05)'
                                    }}
                                    transition="all 0.2s"
                                />
                            </Tooltip>
                            <AppLogo />
                        </Flex>
                        <HStack spacing={4}>
                            <Tooltip label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}>
                                <IconButton
                                    aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
                                    icon={<FontAwesomeIcon icon={colorMode === 'light' ? faMoon : faSun} />}
                                    onClick={toggleColorMode}
                                    variant="ghost"
                                    color={useColorModeValue('gray.600', 'gray.300')}
                                    _hover={{ 
                                        bg: useColorModeValue('gray.100', 'gray.700'),
                                        transform: 'scale(1.05)'
                                    }}
                                    transition="all 0.2s"
                                />
                            </Tooltip>
                            {isAuthenticated ? (
                                <Menu>
                                    <MenuButton 
                                        as={Button} 
                                        rounded={'full'}
                                        variant={'link'}
                                        cursor={'pointer'}
                                        minW={0}
                                        transition="all 0.2s"
                                        _hover={{
                                            transform: 'scale(1.05)'
                                        }}
                                    >
                                        <Avatar
                                            size={'sm'}
                                            name={user?.name}
                                            bg="brand.500"
                                            boxShadow="sm"
                                        />
                                    </MenuButton>
                                    <MenuList color={useColorModeValue('gray.800', 'white')} shadow="lg">
                                        <MenuItem as={RouterLink} to="/profile" transition="all 0.2s" _hover={{ bg: sidebarHoverBg }}>
                                            <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
                                            Profile
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout} transition="all 0.2s" _hover={{ bg: sidebarHoverBg }}>
                                            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} />
                                            Logout
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            ) : (
                                <Button
                                    as={RouterLink}
                                    to="/auth"
                                    colorScheme="brand"
                                    size="md"
                                    borderRadius="full"
                                    boxShadow="md"
                                    _hover={{ 
                                        transform: 'translateY(-2px)', 
                                        boxShadow: 'lg',
                                        bg: 'brand.600'
                                    }}
                                    transition="all 0.2s"
                                >
                                    Sign In
                                </Button>
                            )}
                        </HStack>
                    </Flex>
                </Container>
            </Box>

            {/* Side Drawer Navigation */}
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                size="xs"
            >
                <DrawerOverlay backdropFilter="blur(3px)" />
                <DrawerContent bg={sidebarBg}>
                    <DrawerHeader 
                        px={6}
                        py={6}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom="1px solid"
                        borderColor={useColorModeValue('gray.100', 'gray.700')}
                    >
                        <AppLogo />
                        <DrawerCloseButton position="static" />
                    </DrawerHeader>
                    <DrawerBody p={0}>
                        <VStack spacing={0} alignItems="stretch" pt={4}>
                            {navItems.map((item) => {
                                const isActive = item.path === currentPath;
                                const isHovered = hoveredItem === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        as={RouterLink}
                                        to={item.path}
                                        onClick={onClose}
                                        textDecoration="none"
                                        _hover={{ textDecoration: 'none' }}
                                        w="100%"
                                        onMouseEnter={() => handleItemHover(item.path)}
                                        onMouseLeave={() => handleItemHover(null)}
                                        position="relative"
                                    >
                                        <Flex
                                            py={3}
                                            px={6}
                                            bg={isActive ? sidebarActiveBg : 'transparent'}
                                            _hover={{ bg: !isActive && sidebarHoverBg }}
                                            transition="all 0.2s ease"
                                            alignItems="center"
                                        >
                                            <Box 
                                                color={isActive ? sidebarActiveColor : useColorModeValue('gray.600', 'gray.400')} 
                                                w="24px" 
                                                textAlign="center" 
                                                mr={4}
                                                transition="all 0.2s"
                                                transform={isHovered && !isActive ? 'scale(1.2)' : 'scale(1)'}
                                            >
                                                <FontAwesomeIcon icon={item.icon} />
                                            </Box>
                                            <Text
                                                color={isActive ? sidebarActiveColor : useColorModeValue('gray.700', 'gray.300')}
                                                fontWeight={isActive ? 'semibold' : 'normal'}
                                                fontSize="md"
                                            >
                                                {item.name}
                                            </Text>
                                            {isActive && (
                                                <Box
                                                    position="absolute"
                                                    left="0"
                                                    top="0"
                                                    bottom="0"
                                                    w="4px"
                                                    bgGradient={headerBg}
                                                    borderRightRadius="md"
                                                />
                                            )}
                                        </Flex>
                                    </Link>
                                );
                            })}
                            {isAuthenticated && (
                                <>
                                    <Divider my={2} borderColor={useColorModeValue('gray.200', 'gray.700')} />
                                    <Box
                                        py={3}
                                        px={6}
                                        bg="transparent"
                                        _hover={{ bg: sidebarHoverBg }}
                                        transition="all 0.2s"
                                        onClick={() => {
                                            handleLogout();
                                            onClose();
                                        }}
                                        cursor="pointer"
                                    >
                                        <Flex alignItems="center">
                                            <Box 
                                                color={useColorModeValue('gray.600', 'gray.400')} 
                                                w="24px" 
                                                textAlign="center" 
                                                mr={4}
                                            >
                                                <FontAwesomeIcon icon={faSignOutAlt} />
                                            </Box>
                                            <Text color={useColorModeValue('gray.700', 'gray.300')}>
                                                Logout
                                            </Text>
                                        </Flex>
                                    </Box>
                                </>
                            )}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Main Content Area */}
            <Box 
                as="main" 
                flexGrow={1}
                bg={mainBg}
                py={6}
                transition="all 0.3s"
            >
                <Container maxW="container.xl" px={4}>
                    <ScaleFade in={true} initialScale={0.95}>
                        <Outlet />
                    </ScaleFade>
                </Container>
            </Box>
            
            {/* Footer */}
            <Box 
                as="footer" 
                py={4} 
                bg={useColorModeValue('white', 'gray.800')}
                borderTop="1px solid"
                borderColor={useColorModeValue('gray.100', 'gray.700')}
            >
                <Container maxW="container.xl">
                    <Flex justifyContent="center" alignItems="center">
                        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                            © {new Date().getFullYear()} Zentorra Medicare. All rights reserved.
                        </Text>
                    </Flex>
                </Container>
            </Box>
        </Box>
    );
};

export default Layout; 