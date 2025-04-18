import React, { useState } from 'react';
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
    Divider,
    useToast
} from '@chakra-ui/react';
import { Card } from '../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Placeholder component for Authentication page
const Auth = () => {
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
    
    // Toggle password visibility
    const handleTogglePassword = () => setShowPassword(!showPassword);
    
    // Handle login form submission
    const handleLogin = (e) => {
        e.preventDefault();
        
        // Add validation here
        if (!loginEmail || !loginPassword) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        
        // Placeholder for actual login functionality
        toast({
            title: "Login Attempt",
            description: `Login attempt with email: ${loginEmail}`,
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };
    
    // Handle registration form submission
    const handleRegister = (e) => {
        e.preventDefault();
        
        // Add validation here
        if (!registerName || !registerEmail || !registerPassword || !confirmPassword) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        
        if (registerPassword !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        
        // Placeholder for actual registration functionality
        toast({
            title: "Registration Attempt",
            description: `Registration attempt for ${registerName} with email: ${registerEmail}`,
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Box maxW="md" mx="auto">
            <Card>
                <Heading as="h2" size="xl" color="gray.800" mb={6} textAlign="center">
                    Welcome to Zentorra Medicare
                </Heading>
                
                <Tabs isFitted variant="enclosed" index={tabIndex} onChange={(index) => setTabIndex(index)}>
                    <TabList mb="1em">
                        <Tab _selected={{ color: 'blue.500', borderColor: 'blue.500', borderBottomColor: 'white' }}>Sign In</Tab>
                        <Tab _selected={{ color: 'blue.500', borderColor: 'blue.500', borderBottomColor: 'white' }}>Create Account</Tab>
                    </TabList>
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
                                            />
                                            <InputRightElement width="4.5rem">
                                                <Button h="1.75rem" size="sm" onClick={handleTogglePassword} bg="transparent">
                                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    
                                    <Flex justify="space-between" align="center">
                                        <Checkbox colorScheme="blue">Remember me</Checkbox>
                                        <Link fontSize="sm" color="blue.500">Forgot password?</Link>
                                    </Flex>
                                    
                                    <Button type="submit" colorScheme="blue" size="lg" mt={2}>
                                        Sign In
                                    </Button>
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
                                        />
                                    </FormControl>
                                    
                                    <FormControl id="register-email" isRequired>
                                        <FormLabel>Email address</FormLabel>
                                        <Input 
                                            type="email" 
                                            value={registerEmail}
                                            onChange={(e) => setRegisterEmail(e.target.value)}
                                            placeholder="your.email@example.com"
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
                                            />
                                            <InputRightElement width="4.5rem">
                                                <Button h="1.75rem" size="sm" onClick={handleTogglePassword} bg="transparent">
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
                                        />
                                    </FormControl>
                                    
                                    <Box mt={2}>
                                        <Text fontSize="sm" color="gray.600">
                                            By creating an account, you agree to our{' '}
                                            <Link color="blue.500">Terms of Service</Link> and{' '}
                                            <Link color="blue.500">Privacy Policy</Link>
                                        </Text>
                                    </Box>
                                    
                                    <Button type="submit" colorScheme="blue" size="lg" mt={2}>
                                        Create Account
                                    </Button>
                                </VStack>
                            </form>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Card>
        </Box>
    );
};

export default Auth; 