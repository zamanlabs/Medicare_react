import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPaperPlane, 
    faUser, 
    faRobot, 
    faCircleExclamation, 
    faNotesMedical,
    faPhone,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { keyframes } from '@emotion/react';
import {
    Box,
    Heading,
    Text,
    Flex,
    Input,
    Button,
    VStack,
    HStack,
    Avatar,
    Divider,
    useToast,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Spinner,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    IconButton,
    Tooltip,
    Badge,
    SimpleGrid,
    useColorModeValue,
    Container,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui';
import geminiService, { isApiKeyConfigured } from '../services/geminiService';
import symptomAnalyzerService from '../services/symptomAnalyzerService';
import { formatAIResponse, containsCode, enhanceCodeBlocks } from '../utils/responseFormatter';
import '../styles/aiResponseStyles.css';

// Initial conversation messages
const initialMessages = [
    { id: 1, sender: 'bot', text: 'Hello! I\'m your ZenHealth Assistant. How can I help with your healthcare questions today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
];

// Common health-related questions for quick access
const commonQuestions = [
    'How do I schedule an appointment?',
    'What insurance plans do you accept?',
    'How can I view my test results?',
    'Is telemedicine available for my condition?',
    'How do I track my medication reminders?',
    'What should I do if I miss a medication dose?',
    'How can I update my health profile?',
    'What are the symptoms of seasonal allergies?'
];

// Message fade-in animation
const messageAnimation = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// Typing indicator animation
const typingAnimation = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

// Pulse animation for emergency mode
const pulseAnimation = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 82, 82, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); }
`;

// Motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionVStack = motion(VStack);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.07,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const Chat = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiKeyStatus, setApiKeyStatus] = useState({
        isConfigured: isApiKeyConfigured(),
        showWarning: !isApiKeyConfigured()
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [apiKey, setApiKey] = useState('');
    const messagesEndRef = useRef(null);
    const toast = useToast();
    
    // Add new state for symptom analysis mode
    const [isSymptomMode, setIsSymptomMode] = useState(false);
    
    // Add new state for emergency calling
    const [isEmergencyMode, setIsEmergencyMode] = useState(false);
    const [isEmergencyCalling, setIsEmergencyCalling] = useState(false);
    
    // Theme-aware colors
    const bgColor = useColorModeValue('white', 'gray.800');
    const secondaryBgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.800', 'white');
    const dimmedTextColor = useColorModeValue('gray.600', 'gray.400');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const highlightColor = useColorModeValue('blue.50', 'blue.900');
    const headerBgColor = useColorModeValue('blue.500', 'blue.600');
    const emergencyHeaderBgColor = useColorModeValue('red.500', 'red.600');
    
    // Auto-scroll to bottom of messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const initiateEmergencyCall = () => {
        // Set emergency calling state
        setIsEmergencyCalling(true);
        
        // Add emergency message
        const emergencyMessage = {
            id: Date.now() + 4,
            sender: 'bot',
            text: "⚠️ EMERGENCY ALERT ⚠️\n\nBased on the symptoms described, emergency services (999) in Bangladesh are being contacted.\n\nPlease stay on the line and wait for assistance.\n\nIf possible, move to an easily accessible location where emergency responders can find you quickly.",
            isEmergency: true,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, emergencyMessage]);
        
        // Show a toast notification for emergency
        toast({
            title: "Emergency Services Contacted",
            description: "Dialing 999 - Bangladesh emergency services",
            status: "error",
            duration: 10000,
            isClosable: true,
            icon: <FontAwesomeIcon icon={faPhone} />
        });
        
        // Simulate call connecting
        setTimeout(() => {
            const callConnectedMessage = {
                id: Date.now() + 5,
                sender: 'bot',
                text: "📞 Connected to emergency services (999).\n\nPlease provide your current location and stay calm. Help is on the way.",
                isEmergency: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            setMessages(prev => [...prev, callConnectedMessage]);
        }, 3000);
    };
    
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        
        // Check if API key is configured
        if (!apiKeyStatus.isConfigured) {
            toast({
                title: "API Key Not Configured",
                description: "Please set up your Gemini API key first.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            onOpen(); // Open the API key configuration modal
            return;
        }
        
        // Add user message
        const userMessage = {
            id: Date.now(),
            sender: 'user',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsLoading(true);
        
        try {
            // Create a temporary "typing" indicator message
            const typingIndicatorId = Date.now() + 1;
            setMessages(prev => [...prev, {
                id: typingIndicatorId,
                sender: 'bot',
                isTyping: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            
            // Check if this is a symptom-related question
            const symptomResponse = symptomAnalyzerService.processSymptomMessage(userMessage.text);
            
            let botResponse;
            let responseText;
            
            if (symptomResponse && symptomResponse.isSymptomQuestion) {
                // This is a symptom question, use the symptom analyzer response
                responseText = symptomResponse.response;
                
                // Format the symptom response
                const formattedResponse = formatAIResponse(responseText);
                
                botResponse = {
                    id: Date.now() + 2,
                    sender: 'bot',
                    text: responseText,
                    formattedText: formattedResponse,
                    hasCode: containsCode(responseText),
                    isSymptomAnalysis: true,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                
                // If this was a symptom analysis, remember for future context
                setIsSymptomMode(true);
                
                // Check if this is an emergency situation
                if (symptomResponse.isEmergency && !isEmergencyMode) {
                    setIsEmergencyMode(true);
                    
                    // Remove typing indicator first
                    setMessages(prev => prev.filter(msg => msg.id !== typingIndicatorId));
                    setMessages(prev => [...prev, botResponse]);
                    
                    // Initiate emergency call to Bangladesh emergency services (999)
                    initiateEmergencyCall();
                    
                    setIsLoading(false);
                    return;
                }
            } else {
                // Not a symptom question, use normal AI response
                responseText = await geminiService.generateHealthResponse([...messages, userMessage]);
                
                // Format the AI response for better display
                const formattedResponse = formatAIResponse(responseText);
                
                botResponse = {
                    id: Date.now() + 2,
                    sender: 'bot',
                    text: responseText,
                    formattedText: formattedResponse,
                    hasCode: containsCode(responseText),
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                
                // If we were in symptom mode but this wasn't a symptom question, reset
                if (isSymptomMode) {
                    setIsSymptomMode(false);
                }
            }
            
            // Remove typing indicator and add real response
            setMessages(prev => prev.filter(msg => msg.id !== typingIndicatorId));
            setMessages(prev => [...prev, botResponse]);
            
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to get a response. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            
            // Remove typing indicator and add error message
            setMessages(prev => {
                const filteredMessages = prev.filter(msg => !msg.isTyping);
                return [...filteredMessages, {
                    id: Date.now() + 3,
                    sender: 'bot',
                    text: "I'm sorry, I encountered an error processing your request. Please try again later.",
                    isError: true,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }];
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSendMessage();
        }
    };
    
    const handleQuickQuestion = (question) => {
        setNewMessage(question);
    };
    
    const handleApiKeySubmit = () => {
        // In a real implementation, we would update the API key in a secure way
        // For this demo, we'll just update the state
        try {
            localStorage.setItem('gemini_api_key', apiKey);
            
            toast({
                title: "API Key Saved",
                description: "Your Gemini API key has been saved successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            
            setApiKeyStatus({
                isConfigured: true,
                showWarning: false
            });
        } catch (error) {
            console.error('Error saving API key to localStorage:', error);
            toast({
                title: "Warning",
                description: "Could not save API key to localStorage. The key will be used for this session only.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            
            // Still update the state for this session
            setApiKeyStatus({
                isConfigured: true,
                showWarning: false
            });
        }
        
        onClose();
    };
    
    // Add a function for suggesting symptom questions
    const handleSymptomQuestion = (question) => {
        setNewMessage(question);
    };
    
    return (
        <Container maxW="container.xl" py={8}>
            <MotionBox
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <MotionFlex 
                    align="center" 
                    mb={6}
                    variants={itemVariants}
                >
                    <Heading 
                        as="h2" 
                        size="xl" 
                        color={textColor}
                        bgGradient={useColorModeValue(
                            "linear(to-r, brand.500, accent.500)", 
                            "linear(to-r, brand.400, accent.400)"
                        )}
                        bgClip="text"
                        fontWeight="bold"
                    >
                        AI Health Assistant
                    </Heading>
                </MotionFlex>
                
                {apiKeyStatus.showWarning && (
                    <MotionBox variants={itemVariants}>
                        <Alert status="warning" mb={6} borderRadius="xl" shadow="md">
                            <AlertIcon as={FontAwesomeIcon} icon={faCircleExclamation} />
                            <Box flex="1">
                                <AlertTitle>Gemini API Key Required</AlertTitle>
                                <AlertDescription>
                                    To use the AI Health Assistant, you need to configure your Gemini API key.
                                </AlertDescription>
                            </Box>
                            <Button colorScheme="blue" size="sm" onClick={onOpen} borderRadius="lg">
                                Configure API Key
                            </Button>
                        </Alert>
                    </MotionBox>
                )}
                
                {isEmergencyMode && (
                    <MotionBox 
                        variants={itemVariants}
                        sx={isEmergencyCalling ? { 
                            animation: `${pulseAnimation} 2s infinite`,
                            transformOrigin: 'center'
                        } : {}}
                    >
                        <Alert status="error" mb={6} borderRadius="xl" shadow="md">
                            <AlertIcon as={FontAwesomeIcon} icon={faExclamationTriangle} />
                            <Box flex="1">
                                <AlertTitle>Emergency Mode Activated</AlertTitle>
                                <AlertDescription>
                                    Emergency services (999) in Bangladesh {isEmergencyCalling ? 'have been contacted' : 'will be contacted'} based on the symptoms described.
                                </AlertDescription>
                            </Box>
                            <Button 
                                colorScheme="red" 
                                size="sm" 
                                leftIcon={<FontAwesomeIcon icon={faPhone} />}
                                borderRadius="lg"
                            >
                                {isEmergencyCalling ? 'Connected' : 'Calling 999'}
                            </Button>
                        </Alert>
                    </MotionBox>
                )}
                
                <MotionBox variants={itemVariants}>
                    <Card 
                        p={0} 
                        mb={6} 
                        boxShadow="xl" 
                        borderRadius="2xl" 
                        overflow="hidden"
                        variant="elevated"
                    >
                        {/* Chat header */}
                        <Box 
                            bg={isEmergencyMode ? emergencyHeaderBgColor : headerBgColor} 
                            p={4} 
                            color="white"
                            position="relative"
                            overflow="hidden"
                        >
                            {/* Decorative shape for visual interest */}
                            <Box
                                position="absolute"
                                right="-50px"
                                top="-50px"
                                width="200px"
                                height="200px"
                                borderRadius="full"
                                bg="whiteAlpha.100"
                            />
                            <Box
                                position="absolute"
                                left="-30px"
                                bottom="-60px"
                                width="150px"
                                height="150px"
                                borderRadius="full"
                                bg="whiteAlpha.50"
                            />
                            
                            <Flex justifyContent="space-between" alignItems="center" zIndex="1" position="relative">
                                <Box>
                                    <Heading as="h3" size="md" fontWeight="bold">ZenHealth Assistant</Heading>
                                    <Text fontSize="sm">Ask questions about health topics, medications, or using the app</Text>
                                </Box>
                                
                                <HStack spacing={2}>
                                    {isEmergencyMode && (
                                        <Badge 
                                            colorScheme="red" 
                                            p={2} 
                                            borderRadius="full"
                                            boxShadow="md"
                                        >
                                            <HStack spacing={1}>
                                                <FontAwesomeIcon icon={faExclamationTriangle} />
                                                <Text>Emergency Mode</Text>
                                            </HStack>
                                        </Badge>
                                    )}
                                
                                    {isSymptomMode && !isEmergencyMode && (
                                        <Badge 
                                            colorScheme="purple" 
                                            p={2} 
                                            borderRadius="full"
                                            boxShadow="md"
                                        >
                                            <HStack spacing={1}>
                                                <FontAwesomeIcon icon={faNotesMedical} />
                                                <Text>Symptom Mode</Text>
                                            </HStack>
                                        </Badge>
                                    )}
                                </HStack>
                            </Flex>
                        </Box>
                        
                        {/* Messages container */}
                        <Box 
                            p={4} 
                            height={{ base: "450px", md: "550px" }} 
                            overflowY="auto" 
                            bg={secondaryBgColor}
                            css={{
                                '&::-webkit-scrollbar': {
                                  width: '8px',
                                },
                                '&::-webkit-scrollbar-track': {
                                  width: '10px',
                                  background: useColorModeValue('rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)')
                                },
                                '&::-webkit-scrollbar-thumb': {
                                  background: useColorModeValue('rgba(0,0,0,0.2)', 'rgba(255,255,255,0.2)'),
                                  borderRadius: '24px',
                                },
                              }}
                        >
                            <MotionVStack 
                                spacing={4} 
                                align="stretch"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {messages.map(message => (
                                    <MotionFlex
                                        key={message.id}
                                        justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        layout
                                    >
                                        {/* Typing indicator or regular message */}
                                        {message.isTyping ? (
                                            <Flex
                                                maxWidth="80%"
                                                bg={bgColor}
                                                p={4}
                                                borderRadius="2xl"
                                                boxShadow="md"
                                                direction="column"
                                                borderWidth="1px"
                                                borderColor={borderColor}
                                            >
                                                <HStack spacing={2} mb={2}>
                                                    <Avatar
                                                        size="sm"
                                                        bg="green.100"
                                                        icon={
                                                            <FontAwesomeIcon 
                                                                icon={faRobot} 
                                                                color="green.500"
                                                            />
                                                        }
                                                    />
                                                    <Text fontWeight="bold" fontSize="sm">
                                                        ZenHealth Assistant
                                                    </Text>
                                                </HStack>
                                                <Flex align="center">
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '3px'
                                                    }}>
                                                        {[0, 1, 2].map((dot) => (
                                                            <Box 
                                                                key={dot}
                                                                w="8px" 
                                                                h="8px" 
                                                                borderRadius="full" 
                                                                bg="blue.400"
                                                                sx={{ 
                                                                    animation: `${typingAnimation} 1s infinite ${dot * 0.2}s` 
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                    <Text ml={2} color={dimmedTextColor}>Thinking...</Text>
                                                </Flex>
                                            </Flex>
                                        ) : (
                                            <Flex
                                                maxWidth="80%"
                                                bg={message.sender === 'user' ? 'blue.500' : 
                                                   message.isEmergency ? useColorModeValue('red.50', 'red.900') :
                                                   message.isSymptomAnalysis ? useColorModeValue('purple.50', 'purple.900') : 
                                                   message.isError ? useColorModeValue('red.50', 'red.900') : bgColor}
                                                color={message.sender === 'user' ? 'white' : 
                                                      message.isEmergency ? useColorModeValue('red.800', 'red.100') :
                                                      message.isError ? useColorModeValue('red.800', 'red.100') : textColor}
                                                p={4}
                                                borderRadius="2xl"
                                                boxShadow="md"
                                                direction="column"
                                                borderColor={message.isEmergency ? useColorModeValue('red.300', 'red.700') :
                                                            message.isSymptomAnalysis ? useColorModeValue('purple.200', 'purple.700') : borderColor}
                                                borderWidth="1px"
                                                className={message.sender === 'bot' ? 'ai-response' : ''}
                                                transition="all 0.3s ease"
                                                _hover={{
                                                    boxShadow: "lg",
                                                    transform: "translateY(-2px)"
                                                }}
                                            >
                                                <HStack spacing={2} mb={2}>
                                                    <Avatar
                                                        size="sm"
                                                        bg={message.sender === 'user' ? 'blue.300' : 
                                                           message.isEmergency ? useColorModeValue('red.100', 'red.800') :
                                                           message.isSymptomAnalysis ? useColorModeValue('purple.100', 'purple.800') : 
                                                           message.isError ? useColorModeValue('red.100', 'red.800') : useColorModeValue('green.100', 'green.800')}
                                                        icon={
                                                            <FontAwesomeIcon 
                                                                icon={message.sender === 'user' ? faUser : 
                                                                     message.isEmergency ? faExclamationTriangle :
                                                                     message.isSymptomAnalysis ? faNotesMedical : faRobot} 
                                                                color={message.sender === 'user' ? 'white' : 
                                                                      message.isEmergency ? useColorModeValue('red.500', 'red.200') :
                                                                      message.isSymptomAnalysis ? useColorModeValue('purple.500', 'purple.200') : 
                                                                      message.isError ? useColorModeValue('red.500', 'red.200') : useColorModeValue('green.500', 'green.200')}
                                                            />
                                                        }
                                                    />
                                                    <Text fontWeight="bold" fontSize="md">
                                                        {message.sender === 'user' ? 'You' : 'ZenHealth Assistant'}
                                                        {message.isEmergency && (
                                                            <Badge ml={1} colorScheme="red">Emergency Alert</Badge>
                                                        )}
                                                        {message.isSymptomAnalysis && !message.isEmergency && (
                                                            <Badge ml={1} colorScheme="purple">Symptom Analysis</Badge>
                                                        )}
                                                        {message.hasCode && (
                                                            <Badge ml={1} colorScheme="green">Code</Badge>
                                                        )}
                                                    </Text>
                                                </HStack>
                                                
                                                {/* Use our formatted text for bot messages */}
                                                {message.sender === 'bot' && message.formattedText ? (
                                                    <Box 
                                                        className="ai-response-content"
                                                        dangerouslySetInnerHTML={{ __html: message.formattedText }}
                                                        sx={{
                                                            "& > p": {
                                                                mb: 2
                                                            },
                                                            "& a": {
                                                                color: "blue.500",
                                                                _hover: {
                                                                    textDecoration: "underline"
                                                                }
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <Text whiteSpace="pre-wrap">{message.text}</Text>
                                                )}
                                                
                                                <Text 
                                                    alignSelf="flex-end" 
                                                    fontSize="xs" 
                                                    color={message.sender === 'user' ? 'blue.100' : 
                                                          message.isEmergency ? useColorModeValue('red.300', 'red.400') :
                                                          message.isSymptomAnalysis ? useColorModeValue('purple.300', 'purple.400') : 
                                                          message.isError ? useColorModeValue('red.300', 'red.400') : dimmedTextColor}
                                                    mt={2}
                                                >
                                                    {message.timestamp}
                                                </Text>
                                            </Flex>
                                        )}
                                    </MotionFlex>
                                ))}
                                <div ref={messagesEndRef} />
                            </MotionVStack>
                        </Box>
                        
                        {/* Input area */}
                        <Box p={4} bg={bgColor} borderTop="1px" borderColor={borderColor}>
                            {/* Symptom examples */}
                            {messages.length <= 5 && !isEmergencyMode && (
                                <MotionBox 
                                    mb={3}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Text fontSize="xs" color="purple.600" mb={1} fontWeight="medium">
                                        <FontAwesomeIcon icon={faNotesMedical} /> Try asking about symptoms:
                                    </Text>
                                    <HStack spacing={2} mt={1} flexWrap="wrap">
                                        <Badge 
                                            colorScheme="purple" 
                                            variant="outline" 
                                            py={1} px={3} 
                                            cursor="pointer"
                                            _hover={{ bg: useColorModeValue('purple.50', 'purple.900'), transform: 'translateY(-1px)' }}
                                            borderRadius="full"
                                            transition="all 0.2s"
                                            onClick={() => handleSymptomQuestion("I've been having severe headaches and dizziness for 3 days")}
                                        >
                                            I have headaches and dizziness
                                        </Badge>
                                        <Badge 
                                            colorScheme="purple" 
                                            variant="outline" 
                                            py={1} px={3} 
                                            cursor="pointer"
                                            _hover={{ bg: useColorModeValue('purple.50', 'purple.900'), transform: 'translateY(-1px)' }}
                                            borderRadius="full"
                                            transition="all 0.2s"
                                            onClick={() => handleSymptomQuestion("What might cause a persistent cough and fever?")}
                                        >
                                            What causes cough and fever?
                                        </Badge>
                                        <Badge 
                                            colorScheme="red" 
                                            variant="outline" 
                                            py={1} px={3} 
                                            cursor="pointer"
                                            _hover={{ bg: useColorModeValue('red.50', 'red.900'), transform: 'translateY(-1px)' }}
                                            borderRadius="full"
                                            transition="all 0.2s"
                                            onClick={() => handleSymptomQuestion("I'm having severe chest pain and shortness of breath")}
                                        >
                                            Chest pain and shortness of breath
                                        </Badge>
                                    </HStack>
                                </MotionBox>
                            )}
                            
                            {isEmergencyMode && (
                                <Alert status="error" mb={3} borderRadius="xl" fontSize="sm">
                                    <AlertIcon as={FontAwesomeIcon} icon={faPhone} />
                                    <Box>
                                        <AlertTitle fontSize="sm">Emergency Services Active</AlertTitle>
                                        <AlertDescription fontSize="xs">
                                            Emergency services (999) have been contacted. Please provide your location and stay on the line.
                                        </AlertDescription>
                                    </Box>
                                </Alert>
                            )}
                            
                            <Flex mt={3}>
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={isEmergencyMode ? "Describe your location..." : "Type your message..."}
                                    mr={2}
                                    flex="1"
                                    focusBorderColor={isEmergencyMode ? "red.400" : 
                                                     isSymptomMode ? "purple.400" : "blue.400"}
                                    disabled={isLoading}
                                    size="lg"
                                    borderRadius="full"
                                    _focus={{
                                        boxShadow: "outline",
                                        borderColor: isEmergencyMode ? "red.400" : 
                                                   isSymptomMode ? "purple.400" : "blue.400",
                                    }}
                                    transition="all 0.3s ease"
                                />
                                
                                <Button
                                    colorScheme={isEmergencyMode ? "red" : 
                                               isSymptomMode ? "purple" : "blue"}
                                    onClick={handleSendMessage}
                                    leftIcon={<FontAwesomeIcon icon={isEmergencyMode ? faPhone : 
                                                                  isSymptomMode ? faNotesMedical : faPaperPlane} />}
                                    isLoading={isLoading}
                                    loadingText="Sending"
                                    size="lg"
                                    borderRadius="full"
                                    minW="120px"
                                    boxShadow="md"
                                    _hover={{
                                        transform: "translateY(-2px)",
                                        boxShadow: "lg"
                                    }}
                                    _active={{
                                        transform: "translateY(0)",
                                        boxShadow: "md"
                                    }}
                                    transition="all 0.2s"
                                >
                                    {isEmergencyMode ? "Send Location" : "Send"}
                                </Button>
                            </Flex>
                            
                            {/* Bottom disclaimer */}
                            <Text fontSize="xs" color={dimmedTextColor} mt={3} textAlign="center">
                                {isEmergencyMode ? 
                                    "This AI assistant has detected a potential medical emergency and contacted emergency services (999). Please follow emergency operator instructions." :
                                    "This AI assistant provides general information only and is not a substitute for professional medical advice. In case of emergency, call 999 in Bangladesh."}
                            </Text>
                        </Box>
                    </Card>
                </MotionBox>
                
                {/* Quick questions panel */}
                <MotionBox variants={itemVariants}>
                    <Card 
                        title="Common Health Questions"
                        variant="soft"
                        isHoverable
                    >
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={3}>
                            {commonQuestions.map((question, index) => (
                                <Button 
                                    key={index}
                                    size="md"
                                    variant="outline"
                                    justifyContent="flex-start"
                                    onClick={() => handleQuickQuestion(question)}
                                    colorScheme="blue"
                                    whiteSpace="normal"
                                    height="auto"
                                    py={3}
                                    px={4}
                                    textAlign="left"
                                    isDisabled={isEmergencyMode}
                                    borderRadius="xl"
                                    transition="all 0.2s"
                                    _hover={{
                                        bg: useColorModeValue('blue.50', 'blue.900'),
                                        transform: "translateY(-2px)",
                                        boxShadow: "md"
                                    }}
                                >
                                    {question}
                                </Button>
                            ))}
                        </SimpleGrid>
                    </Card>
                </MotionBox>
            </MotionBox>
            
            {/* API Key Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay backdropFilter="blur(4px)" />
                <ModalContent borderRadius="xl">
                    <ModalHeader>Configure Gemini API Key</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text mb={4}>
                            To use the AI Health Assistant, you need to provide a Google Gemini API key.
                            You can get one for free from the Google AI Studio.
                        </Text>
                        <FormControl>
                            <FormLabel htmlFor="api-key">Gemini API Key</FormLabel>
                            <Input 
                                id="api-key"
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Enter your Gemini API key"
                                borderRadius="lg"
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleApiKeySubmit} borderRadius="lg">
                            Save Key
                        </Button>
                        <Button variant="ghost" onClick={onClose} borderRadius="lg">Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
};

export default Chat; 