import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Heading,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    FormControl,
    FormLabel,
    Input,
    Button,
    InputGroup,
    InputRightElement,
    Checkbox,
    Link,
    Flex,
    VStack,
    HStack,
    Grid,
    GridItem,
    Divider,
    useToast,
    Alert,
    AlertIcon,
    AlertDescription,
    useColorModeValue,
    Image,
    Container
} from '@chakra-ui/react';
import { Card } from '../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faHeartPulse, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

// Placeholder component for Authentication page
const Auth = () => {
    const navigate = useNavigate();
    const { login, register, loading, error, setError, isAuthenticated } = useAuth();
    const toast = useToast();
    const [tabIndex, setTabIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    
    // Login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    
    // Registration form state
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Local message state
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    
    // Colors
    const bgGradient = "linear(to-r, brand.600, brand.400)";
    const cardBg = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const subtleTextColor = useColorModeValue('gray.600', 'gray.400');
    const primaryColor = useColorModeValue('brand.500', 'brand.400');
    const accentBg = useColorModeValue('blue.50', 'blue.900');
    
    // Check if user is already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);
    
    // Effect to display errors coming from context
    useEffect(() => {
        if (error) {
            setMessage(error);
            setIsError(true);
        }
    }, [error]);
    
    // Toggle password visibility
    const handleTogglePassword = () => setShowPassword(!showPassword);
    
    // Clear messages
    const clearMessages = () => {
        setMessage('');
        setIsError(false);
        if (error) setError(null); // Clear context error as well
    };
    
    // Handle login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        clearMessages();
        
        // Validate inputs
        if (!loginEmail || !loginPassword) {
            setMessage("Please fill in all fields");
            setIsError(true);
            return;
        }
        
        const result = await login(loginEmail, loginPassword);
        
        if (result && result.success) {
            setMessage('Login successful! Redirecting...');
            setIsError(false);
            // Clear form
            setLoginEmail('');
            setLoginPassword('');
            // Navigate handled by the useEffect that watches isAuthenticated
        }
    };
    
    // Handle registration form submission
    const handleRegister = async (e) => {
        e.preventDefault();
        clearMessages();
        
        // Validate inputs
        if (!registerName || !registerEmail || !registerPassword || !confirmPassword) {
            setMessage("Please fill in all fields");
            setIsError(true);
            return;
        }
        
        if (registerPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            setIsError(true);
            return;
        }
        
        if (registerPassword.length < 6) {
            setMessage("Password must be at least 6 characters");
            setIsError(true);
            return;
        }
        
        const result = await register(registerName, registerEmail, registerPassword);
        
        if (result && result.success) {
            // Clear form
            setRegisterName('');
            setRegisterEmail('');
            setRegisterPassword('');
            setConfirmPassword('');
            
            setMessage('Registration successful! Redirecting...');
            setIsError(false);
            // Navigate handled by the useEffect that watches isAuthenticated
        }
    };

    return (
        <Container maxW="container.xl" p={0}>
            <Grid 
                templateColumns={{ base: "1fr", md: "5fr 7fr" }} 
                minH={{ base: "auto", md: "calc(100vh - 60px)" }}
            >
                {/* Left Side - Branding and Welcome */}
                <GridItem 
                    bgGradient={bgGradient} 
                    color="white"
                    p={{ base: 8, md: 12 }}
                    display={{ base: "none", md: "flex" }}
                    flexDirection="column"
                    justifyContent="center"
                    position="relative"
                    borderRadius="lg"
                    mx={2}
                    my={4}
                    boxShadow="xl"
                >
                    <Box maxW="480px" mx="auto">
                        <Flex align="center" mb={4}>
                            <Box color="white" mr={3} fontSize="3xl">
                                <FontAwesomeIcon icon={faHeartPulse} />
                            </Box>
                            <Heading as="h1" size="2xl">
                                Zentorra Medicare
                            </Heading>
                        </Flex>
                        
                        <Text fontSize="xl" fontWeight="light" mb={8} opacity={0.9}>
                            Your comprehensive health management platform for tracking symptoms, 
                            managing medications, and accessing healthcare resources.
                        </Text>
                        
                        <Box 
                            bg="whiteAlpha.200" 
                            p={6} 
                            borderRadius="md" 
                            backdropFilter="blur(10px)"
                            borderLeft="4px solid"
                            borderColor="white"
                        >
                            <Heading size="md" mb={4} fontWeight="medium">
                                {tabIndex === 0 ? "Welcome Back" : "Join Our Community"}
                </Heading>
                
                            <VStack align="start" spacing={4}>
                                <Text>
                                    {tabIndex === 0 
                                        ? "If you already have an account, please sign in with your credentials to access your personalized dashboard." 
                                        : "New to Zentorra Medicare? Create an account to get started with personalized health tracking and recommendations."}
                                </Text>
                                
                                <HStack spacing={4} align="center" pt={2}>
                                    <Box fontSize="xl">
                                        <FontAwesomeIcon icon={faUserDoctor} />
                                    </Box>
                                    <Text fontStyle="italic" fontWeight="medium">
                                        "Taking care of your health is an investment, not an expense."
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                    </Box>
                </GridItem>

                {/* Right Side - Authentication Forms */}
                <GridItem 
                    p={{ base: 4, md: 8 }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Box 
                        w="100%" 
                        maxW="500px" 
                        mx="auto"
                        bg={cardBg}
                        borderRadius="lg"
                        boxShadow="md"
                        p={{ base: 6, md: 8 }}
                    >
                        {/* Mobile Welcome - Only visible on small screens */}
                        <Box display={{ base: "block", md: "none" }} mb={6} textAlign="center">
                            <Flex justify="center" align="center" mb={2}>
                                <Box color={primaryColor} mr={2} fontSize="2xl">
                                    <FontAwesomeIcon icon={faHeartPulse} />
                                </Box>
                                <Heading as="h1" size="xl" color={textColor}>
                                    Zentorra Medicare
                                </Heading>
                            </Flex>
                            <Text color={subtleTextColor} fontSize="md">
                                {tabIndex === 0 
                                    ? "Welcome back! Please sign in to continue" 
                                    : "Create an account to get started"}
                            </Text>
                        </Box>
                        
                        <Tabs 
                            isFitted 
                            variant="soft-rounded" 
                            colorScheme="blue" 
                            index={tabIndex} 
                            onChange={(index) => {
                                setTabIndex(index);
                                clearMessages();
                            }}
                            mb={4}
                        >
                            <TabList mb="1.5em">
                                <Tab 
                                    _selected={{ 
                                        color: 'white', 
                                        bg: 'brand.500'
                                    }}
                                    fontWeight="medium"
                                >
                                    Sign In
                                </Tab>
                                <Tab 
                                    _selected={{ 
                                        color: 'white', 
                                        bg: 'brand.500'
                                    }}
                                    fontWeight="medium"
                                >
                                    Create Account
                                </Tab>
                    </TabList>
                            
                            {/* Display Messages */}
                            {message && (
                                <Alert status={isError ? 'error' : 'success'} mb={4} borderRadius="md">
                                    <AlertIcon />
                                    <AlertDescription>{message}</AlertDescription>
                                </Alert>
                            )}
                            
                    <TabPanels>
                        {/* Login Panel */}
                        <TabPanel p={0}>
                            <form onSubmit={handleLogin}>
                                <VStack spacing={4} align="stretch">
                                    <FormControl id="email" isRequired>
                                        <FormLabel>Email address</FormLabel>
                                        <Input 
                                            type="email" 
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                                    isDisabled={loading}
                                                    size="lg"
                                        />
                                    </FormControl>
                                    
                                    <FormControl id="password" isRequired>
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup>
                                            <Input 
                                                type={showPassword ? 'text' : 'password'}
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                placeholder="Enter your password"
                                                        isDisabled={loading}
                                                        size="lg"
                                            />
                                                    <InputRightElement width="4.5rem" height="100%">
                                                        <Button h="1.75rem" size="sm" onClick={handleTogglePassword} bg="transparent" isDisabled={loading}>
                                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    
                                    <Flex justify="space-between" align="center">
                                                <Checkbox colorScheme="blue" isDisabled={loading}>Remember me</Checkbox>
                                                <Link fontSize="sm" color={primaryColor}>Forgot password?</Link>
                                    </Flex>
                                    
                                            <Button 
                                                type="submit" 
                                                colorScheme="blue" 
                                                size="lg" 
                                                mt={6}
                                                isLoading={loading}
                                                loadingText="Signing In"
                                                w="100%"
                                            >
                                        Sign In
                                    </Button>
                                            
                                            <Box display={{ base: "block", md: "none" }} textAlign="center" mt={4}>
                                                <Text color={subtleTextColor} fontSize="sm">
                                                    Don't have an account?{" "}
                                                    <Link 
                                                        color={primaryColor}
                                                        onClick={() => setTabIndex(1)}
                                                        fontWeight="medium"
                                                    >
                                                        Create one
                                                    </Link>
                                                </Text>
                                            </Box>
                                </VStack>
                            </form>
                        </TabPanel>
                        
                        {/* Registration Panel */}
                        <TabPanel p={0}>
                            <form onSubmit={handleRegister}>
                                <VStack spacing={4} align="stretch">
                                    <FormControl id="name" isRequired>
                                        <FormLabel>Full Name</FormLabel>
                                        <Input 
                                            type="text" 
                                            value={registerName}
                                            onChange={(e) => setRegisterName(e.target.value)}
                                            placeholder="Enter your full name"
                                                    isDisabled={loading}
                                                    size="lg"
                                        />
                                    </FormControl>
                                    
                                    <FormControl id="register-email" isRequired>
                                        <FormLabel>Email address</FormLabel>
                                        <Input 
                                            type="email" 
                                            value={registerEmail}
                                            onChange={(e) => setRegisterEmail(e.target.value)}
                                            placeholder="your.email@example.com"
                                                    isDisabled={loading}
                                                    size="lg"
                                        />
                                    </FormControl>
                                    
                                    <FormControl id="register-password" isRequired>
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup>
                                            <Input 
                                                type={showPassword ? 'text' : 'password'}
                                                value={registerPassword}
                                                onChange={(e) => setRegisterPassword(e.target.value)}
                                                placeholder="Create a password"
                                                        isDisabled={loading}
                                                        size="lg"
                                            />
                                                    <InputRightElement width="4.5rem" height="100%">
                                                        <Button h="1.75rem" size="sm" onClick={handleTogglePassword} bg="transparent" isDisabled={loading}>
                                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    
                                    <FormControl id="confirm-password" isRequired>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <Input 
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm your password"
                                                    isDisabled={loading}
                                                    size="lg"
                                        />
                                    </FormControl>
                                    
                                    <Box mt={2}>
                                                <Text fontSize="sm" color={subtleTextColor}>
                                            By creating an account, you agree to our{' '}
                                                    <Link color={primaryColor}>Terms of Service</Link> and{' '}
                                                    <Link color={primaryColor}>Privacy Policy</Link>
                                        </Text>
                                    </Box>
                                    
                                            <Button 
                                                type="submit" 
                                                colorScheme="blue" 
                                                size="lg" 
                                                mt={6}
                                                isLoading={loading}
                                                loadingText="Creating Account"
                                                w="100%"
                                            >
                                        Create Account
                                    </Button>
                                            
                                            <Box display={{ base: "block", md: "none" }} textAlign="center" mt={4}>
                                                <Text color={subtleTextColor} fontSize="sm">
                                                    Already have an account?{" "}
                                                    <Link 
                                                        color={primaryColor}
                                                        onClick={() => setTabIndex(0)}
                                                        fontWeight="medium"
                                                    >
                                                        Sign in
                                                    </Link>
                                                </Text>
                                            </Box>
                                </VStack>
                            </form>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
        </Box>
                </GridItem>
            </Grid>
        </Container>
    );
};

export default Auth; 