import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPaperPlane, 
    faUser, 
    faRobot, 
    faCircleExclamation, 
    faNotesMedical,
    faPhone,
    faExclamationTriangle,
    faMicrophone,
    faMicrophoneSlash
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
} from '@chakra-ui/react';
import { Card } from '../components/ui';
import geminiService, { isApiKeyConfigured } from '../services/geminiService';
import symptomAnalyzerService from '../services/symptomAnalyzerService';
import useSpeechRecognition from '../hooks/useSpeechRecognition';

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

// Pulse animation for the recording indicator
const pulseAnimation = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 82, 82, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); }
`;

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
    
    // Use our custom hook for speech recognition
    const [interimTranscript, setInterimTranscript] = useState('');
    const {
        isListening,
        transcript,
        interimTranscript: hookInterimTranscript,
        startListening,
        stopListening,
        isSupported: isSpeechSupported,
        error: speechError
    } = useSpeechRecognition({
        onResult: (result, resultType) => {
            if (resultType === 'interim') {
                setInterimTranscript(result);
            } else {
                setNewMessage(result);
                setInterimTranscript('');
            }
        },
        onError: (errorMessage, errorType) => {
            // Only show toast for significant errors
            if (errorType !== 'no-speech') {
                toast({
                    title: "Speech Recognition Error",
                    description: errorMessage,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    });
    
    // Auto-scroll to bottom of messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    // Toggle speech recognition
    const toggleListening = () => {
        if (!isSpeechSupported) {
            toast({
                title: "Speech Recognition Not Supported",
                description: "Your browser doesn't support speech recognition. Please try using Chrome, Edge, or Safari.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };
    
    const initiateEmergencyCall = () => {
        // Set emergency calling state
        setIsEmergencyCalling(true);
        
        // In a real app, this would connect to a native phone API
        // For this demo, we'll simulate the emergency call
        
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
        
        // Stop listening if active
        if (isListening) {
            stopListening();
        }
        
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
            
            if (symptomResponse && symptomResponse.isSymptomQuestion) {
                // This is a symptom question, use the symptom analyzer response
                botResponse = {
                    id: Date.now() + 2,
                    sender: 'bot',
                    text: symptomResponse.response,
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
                const aiResponse = await geminiService.generateHealthResponse([...messages, userMessage]);
                
                botResponse = {
                    id: Date.now() + 2,
                    sender: 'bot',
                    text: aiResponse,
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
        <>
            <Flex align="center" mb={6}>
                <Heading as="h2" size="xl" color="gray.800">
                    AI Health Assistant
                </Heading>
            </Flex>
            
            {apiKeyStatus.showWarning && (
                <Alert status="warning" mb={6} borderRadius="md">
                    <AlertIcon as={FontAwesomeIcon} icon={faCircleExclamation} />
                    <Box flex="1">
                        <AlertTitle>Gemini API Key Required</AlertTitle>
                        <AlertDescription>
                            To use the AI Health Assistant, you need to configure your Gemini API key.
                        </AlertDescription>
                    </Box>
                    <Button colorScheme="blue" size="sm" onClick={onOpen}>
                        Configure API Key
                    </Button>
                </Alert>
            )}
            
            {isEmergencyMode && (
                <Alert status="error" mb={6} borderRadius="md">
                    <AlertIcon as={FontAwesomeIcon} icon={faExclamationTriangle} />
                    <Box flex="1">
                        <AlertTitle>Emergency Mode Activated</AlertTitle>
                        <AlertDescription>
                            Emergency services (999) in Bangladesh {isEmergencyCalling ? 'have been contacted' : 'will be contacted'} based on the symptoms described.
                        </AlertDescription>
                    </Box>
                    <Button colorScheme="red" size="sm" leftIcon={<FontAwesomeIcon icon={faPhone} />}>
                        {isEmergencyCalling ? 'Connected' : 'Calling 999'}
                    </Button>
                </Alert>
            )}
            
            <Card p={0} mb={6} boxShadow="md" borderRadius="lg" overflow="hidden">
                {/* Chat header */}
                <Box bg={isEmergencyMode ? "red.500" : "blue.500"} p={4} color="white">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Box>
                            <Heading as="h3" size="md">ZenHealth Assistant</Heading>
                            <Text fontSize="sm">Ask questions about health topics, medications, or using the app</Text>
                        </Box>
                        
                        <HStack spacing={2}>
                            {isEmergencyMode && (
                                <Badge 
                                    colorScheme="red" 
                                    p={2} 
                                    borderRadius="full"
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
                                >
                                    <HStack spacing={1}>
                                        <FontAwesomeIcon icon={faNotesMedical} />
                                        <Text>Symptom Mode</Text>
                                    </HStack>
                                </Badge>
                            )}
                            
                            {isSpeechSupported && (
                                <Tooltip 
                                    label={isListening ? "Voice recognition active" : "Voice typing available"}
                                    placement="top"
                                    hasArrow
                                >
                                    <Badge 
                                        colorScheme={isListening ? "red" : "green"} 
                                        p={2} 
                                        borderRadius="full"
                                        sx={isListening ? { 
                                            animation: `${pulseAnimation} 2s infinite`,
                                            transformOrigin: 'center'
                                        } : {}}
                                    >
                                        {isListening ? "Listening..." : "Voice Enabled"}
                                    </Badge>
                                </Tooltip>
                            )}
                        </HStack>
                    </Flex>
                </Box>
                
                {/* Messages container */}
                <Box 
                    p={4} 
                    height="400px" 
                    overflowY="auto" 
                    bg="gray.50"
                >
                    <VStack spacing={4} align="stretch">
                        {messages.map(message => (
                            <Flex
                                key={message.id}
                                justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                            >
                                {/* Typing indicator or regular message */}
                                {message.isTyping ? (
                                    <Flex
                                        maxWidth="80%"
                                        bg="white"
                                        p={3}
                                        borderRadius="lg"
                                        boxShadow="sm"
                                        direction="column"
                                    >
                                        <HStack spacing={2} mb={1}>
                                            <Avatar
                                                size="xs"
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
                                            <Spinner size="sm" mr={2} color="blue.400" />
                                            <Text color="gray.500">Thinking...</Text>
                                        </Flex>
                                    </Flex>
                                ) : (
                                    <Flex
                                        maxWidth="80%"
                                        bg={message.sender === 'user' ? 'blue.500' : 
                                           message.isEmergency ? 'red.50' :
                                           message.isSymptomAnalysis ? 'purple.50' : 
                                           message.isError ? 'red.50' : 'white'}
                                        color={message.sender === 'user' ? 'white' : 
                                              message.isEmergency ? 'red.800' :
                                              message.isError ? 'red.800' : 'gray.800'}
                                        p={3}
                                        borderRadius="lg"
                                        boxShadow="sm"
                                        direction="column"
                                        borderColor={message.isEmergency ? 'red.300' :
                                                    message.isSymptomAnalysis ? 'purple.200' : 'transparent'}
                                        borderWidth={message.isEmergency || message.isSymptomAnalysis ? '1px' : '0'}
                                    >
                                        <HStack spacing={2} mb={1}>
                                            <Avatar
                                                size="xs"
                                                bg={message.sender === 'user' ? 'blue.300' : 
                                                   message.isEmergency ? 'red.100' :
                                                   message.isSymptomAnalysis ? 'purple.100' : 
                                                   message.isError ? 'red.100' : 'green.100'}
                                                icon={
                                                    <FontAwesomeIcon 
                                                        icon={message.sender === 'user' ? faUser : 
                                                             message.isEmergency ? faExclamationTriangle :
                                                             message.isSymptomAnalysis ? faNotesMedical : faRobot} 
                                                        color={message.sender === 'user' ? 'white' : 
                                                              message.isEmergency ? 'red.500' :
                                                              message.isSymptomAnalysis ? 'purple.500' : 
                                                              message.isError ? 'red.500' : 'green.500'}
                                                    />
                                                }
                                            />
                                            <Text fontWeight="bold" fontSize="sm">
                                                {message.sender === 'user' ? 'You' : 'ZenHealth Assistant'}
                                                {message.isEmergency && (
                                                    <Badge ml={1} colorScheme="red">Emergency Alert</Badge>
                                                )}
                                                {message.isSymptomAnalysis && !message.isEmergency && (
                                                    <Badge ml={1} colorScheme="purple">Symptom Analysis</Badge>
                                                )}
                                            </Text>
                                        </HStack>
                                        <Text whiteSpace="pre-wrap">{message.text}</Text>
                                        <Text 
                                            alignSelf="flex-end" 
                                            fontSize="xs" 
                                            color={message.sender === 'user' ? 'blue.100' : 
                                                  message.isEmergency ? 'red.300' :
                                                  message.isSymptomAnalysis ? 'purple.300' : 
                                                  message.isError ? 'red.300' : 'gray.500'}
                                            mt={1}
                                        >
                                            {message.timestamp}
                                        </Text>
                                    </Flex>
                                )}
                            </Flex>
                        ))}
                        <div ref={messagesEndRef} />
                    </VStack>
                </Box>
                
                {/* Input area */}
                <Box p={4} bg="white" borderTop="1px" borderColor="gray.200">
                    {/* Transcript display when listening */}
                    {isListening && interimTranscript && (
                        <Box 
                            mb={2} 
                            p={2} 
                            bg="blue.50" 
                            borderRadius="md" 
                            fontSize="sm"
                            color="blue.700"
                        >
                            <Text fontStyle="italic">"{interimTranscript}"</Text>
                        </Box>
                    )}
                    
                    {/* Symptom examples */}
                    {messages.length <= 5 && !isEmergencyMode && (
                        <Box mb={3}>
                            <Text fontSize="xs" color="purple.600" mb={1} fontWeight="medium">
                                <FontAwesomeIcon icon={faNotesMedical} /> Try asking about symptoms:
                            </Text>
                            <HStack spacing={2} mt={1} flexWrap="wrap">
                                <Badge 
                                    colorScheme="purple" 
                                    variant="outline" 
                                    py={1} px={2} 
                                    cursor="pointer"
                                    _hover={{ bg: 'purple.50' }}
                                    onClick={() => handleSymptomQuestion("I've been having severe headaches and dizziness for 3 days")}
                                >
                                    I have headaches and dizziness
                                </Badge>
                                <Badge 
                                    colorScheme="purple" 
                                    variant="outline" 
                                    py={1} px={2} 
                                    cursor="pointer"
                                    _hover={{ bg: 'purple.50' }}
                                    onClick={() => handleSymptomQuestion("What might cause a persistent cough and fever?")}
                                >
                                    What causes cough and fever?
                                </Badge>
                                <Badge 
                                    colorScheme="red" 
                                    variant="outline" 
                                    py={1} px={2} 
                                    cursor="pointer"
                                    _hover={{ bg: 'red.50' }}
                                    onClick={() => handleSymptomQuestion("I'm having severe chest pain and shortness of breath")}
                                >
                                    Chest pain and shortness of breath
                                </Badge>
                            </HStack>
                        </Box>
                    )}
                    
                    {isEmergencyMode && (
                        <Alert status="error" mb={3} borderRadius="md" fontSize="sm">
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
                        />
                        
                        {isSpeechSupported && !isEmergencyMode && (
                            <Tooltip label={isListening ? "Stop listening" : "Speak your message"}>
                                <IconButton
                                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                                    icon={<FontAwesomeIcon icon={isListening ? faMicrophoneSlash : faMicrophone} />}
                                    colorScheme={isListening ? "red" : "blue"}
                                    variant={isListening ? "solid" : "outline"}
                                    onClick={toggleListening}
                                    isDisabled={isLoading}
                                    mr={2}
                                />
                            </Tooltip>
                        )}
                        
                        <Button
                            colorScheme={isEmergencyMode ? "red" : 
                                       isSymptomMode ? "purple" : "blue"}
                            onClick={handleSendMessage}
                            leftIcon={<FontAwesomeIcon icon={isEmergencyMode ? faPhone : 
                                                          isSymptomMode ? faNotesMedical : faPaperPlane} />}
                            isLoading={isLoading}
                            loadingText="Sending"
                        >
                            {isEmergencyMode ? "Send Location" : "Send"}
                        </Button>
                    </Flex>
                    
                    {/* Bottom disclaimer */}
                    <Text fontSize="xs" color="gray.500" mt={3} textAlign="center">
                        {isEmergencyMode ? 
                            "This AI assistant has detected a potential medical emergency and contacted emergency services (999). Please follow emergency operator instructions." :
                            "This AI assistant provides general information only and is not a substitute for professional medical advice. In case of emergency, call 999 in Bangladesh."}
                    </Text>
                </Box>
            </Card>
            
            {/* Quick questions panel */}
            <Card>
                <Heading as="h4" size="sm" mb={3}>
                    Common Health Questions
                </Heading>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                    {commonQuestions.map((question, index) => (
                        <Button 
                            key={index}
                            size="sm"
                            variant="outline"
                            justifyContent="flex-start"
                            onClick={() => handleQuickQuestion(question)}
                            colorScheme="blue"
                            whiteSpace="normal"
                            height="auto"
                            py={2}
                            textAlign="left"
                            isDisabled={isEmergencyMode}
                        >
                            {question}
                        </Button>
                    ))}
                </SimpleGrid>
            </Card>
            
            {/* API Key Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
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
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleApiKeySubmit}>
                            Save Key
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Chat; 