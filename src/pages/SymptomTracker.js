import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartLine, 
    faEdit, 
    faTrash, 
    faPlus, 
    faHeadSideCough, 
    faThermometerHalf, 
    faCheckCircle, 
    faExclamationTriangle,
    faCalendarAlt,
    faClock,
    faStickyNote,
    faChevronDown,
    faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import {
    Box,
    Heading,
    Text,
    Flex,
    SimpleGrid,
    FormControl,
    FormLabel,
    Select,
    Input,
    Textarea,
    Button,
    IconButton,
    Badge,
    Stack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Alert,
    AlertIcon,
    useToast,
    VStack,
    HStack,
    useColorModeValue,
    Tooltip,
    ScaleFade,
    SlideFade,
    Divider,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Collapse,
    useDisclosure,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Avatar
} from '@chakra-ui/react';
import { Card, MetricCard } from '../components/ui';
import { useSymptoms } from '../context/SymptomContext';
import { motion } from 'framer-motion';
import SymptomCard from '../components/SymptomCard';

// Create motion components
const MotionBox = motion(Box);

// Animation variants for staggered children
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
        });
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString; // Fallback to original string
    }
};

// Helper function to format short date
const formatShortDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString; // Fallback to original string
    }
};

const SymptomTracker = () => {
    const toast = useToast();
    // Get state and functions from context
    const { symptoms, addSymptom, removeSymptom } = useSymptoms();
    
    // Refs for animations
    const formRef = useRef(null);
    const historyRef = useRef(null);
    
    // State for animation triggers
    const [visibleSections, setVisibleSections] = useState({
        form: false,
        history: false
    });
    
    // State for showing more/less in the history
    const [showFullHistory, setShowFullHistory] = useState(false);
    const { isOpen: isFormOpen, onToggle: onFormToggle } = useDisclosure({ defaultIsOpen: true });
    
    // Tabs state
    const [activeTab, setActiveTab] = useState(0);

    // Local state for the form inputs only
    const [symptomType, setSymptomType] = useState('');
    const [otherSymptom, setOtherSymptom] = useState('');
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [severity, setSeverity] = useState(5);
    const [symptomDate, setSymptomDate] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });
    const [notes, setNotes] = useState('');
    
    // Setup intersection observer for animations
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.dataset.section;
                    if (sectionId) {
                        setVisibleSections(prev => ({
                            ...prev,
                            [sectionId]: true
                        }));
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, options);
        
        // Observe each ref if it exists
        if (formRef.current) observer.observe(formRef.current);
        if (historyRef.current) observer.observe(historyRef.current);

        return () => {
            if (formRef.current) observer.unobserve(formRef.current);
            if (historyRef.current) observer.unobserve(historyRef.current);
        };
    }, []);

    const handleSymptomTypeChange = (e) => {
        const value = e.target.value;
        setSymptomType(value);
        setIsOtherSelected(value === 'other');
        if (value !== 'other') {
            setOtherSymptom('');
        }
    };

    const handleSeverityChange = (value) => {
        setSeverity(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const symptomName = isOtherSelected ? otherSymptom.trim() : symptomType;

        if (!symptomName) {
            toast({
                title: "Error",
                description: "Please select or specify a symptom type.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            });
            return;
        }
        if (!symptomDate) {
            toast({
                title: "Error",
                description: "Please select a date and time.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            });
            return;
        }

        const newSymptom = {
            type: symptomType,
            name: symptomName,
            severity: severity,
            date: symptomDate,
            notes: notes.trim(),
        };

        // Call addSymptom from context
        addSymptom(newSymptom);

        // Reset form
        setSymptomType('');
        setOtherSymptom('');
        setIsOtherSelected(false);
        setSeverity(5);
        setNotes('');
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setSymptomDate(now.toISOString().slice(0, 16));

        toast({
            title: "Success",
            description: "Symptom logged successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right"
        });
        
        // Switch to history tab
        setActiveTab(1);
    };

    const handleDelete = (idToDelete) => {
        if (window.confirm("Are you sure you want to delete this symptom log?")) {
            // Call removeSymptom from context
            removeSymptom(idToDelete);
            toast({
                title: "Deleted",
                description: "Symptom log removed successfully",
                status: "info",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
        }
    };

    // Placeholder for edit functionality
    const handleEdit = (idToEdit) => {
        toast({
            title: "Not Implemented",
            description: `Edit functionality for symptom ID: ${idToEdit} not implemented yet.`,
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right"
        });
    };

    const getSeverityColor = (value) => {
        if (value <= 3) return 'green';
        if (value <= 7) return 'yellow';
        return 'red';
    };

    const getSeverityColorValue = (value) => {
        if (value <= 3) return useColorModeValue('green.500', 'green.300');
        if (value <= 7) return useColorModeValue('yellow.500', 'yellow.300');
        return useColorModeValue('red.500', 'red.300');
    };

    const getSeverityText = (value) => {
        if (value <= 3) return 'Mild';
        if (value <= 7) return 'Moderate';
        return 'Severe';
    };
    
    // Custom colors
    const headerBg = useColorModeValue(
        'linear(to-r, brand.500, accent.400)',
        'linear(to-r, brand.700, accent.600)'
    );
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const labelColor = useColorModeValue('gray.700', 'gray.200');
    const placeholderColor = useColorModeValue('gray.500', 'gray.400');
    const inputBgColor = useColorModeValue('white', 'gray.700');
    const inputBorderColorHover = useColorModeValue('brand.300', 'brand.500');
    const inputBorderColorFocus = useColorModeValue('brand.500', 'brand.300');
    const emptyStateBgColor = useColorModeValue('gray.50', 'gray.700');
    const emptyStateIconColor = useColorModeValue('gray.300', 'gray.600');
    const emptyStateTextColor = useColorModeValue('gray.500', 'gray.400');
    const shadowColor = useColorModeValue(
        '0 4px 6px rgba(49, 130, 206, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        '0 4px 6px rgba(0, 0, 0, 0.4)'
    );

    return (
        <>
            <ScaleFade in={true} initialScale={0.9}>
                {/* Header Section */}
                <Box
                    mb={6}
                    borderRadius="xl"
                    overflow="hidden"
                    boxShadow={shadowColor}
                    position="relative"
                    bgGradient={headerBg}
                    color="white"
                    p={6}
                >
                    <Box 
                        position="absolute" 
                        top="0" 
                        right="0" 
                        bottom="0" 
                        left="0" 
                        bg="url('/images/pattern.svg')" 
                        opacity="0.1" 
                        zIndex="0" 
                    />
                    <Flex 
                        direction={{ base: "column", md: "row" }} 
                        justify="space-between" 
                        align="center"
                        position="relative"
                        zIndex="1"
                    >
                        <Box mb={{ base: 4, md: 0 }}>
                            <Heading as="h1" size="xl" fontWeight="bold">
                                Symptom Tracker
                            </Heading>
                            <Text fontSize="lg" mt={1} opacity={0.9}>
                                Monitor and record your symptoms over time
                            </Text>
                        </Box>
                        
                        <HStack spacing={4}>
                            <MetricCard
                                title="Recorded Symptoms"
                                value={symptoms.length}
                                description="Total logged symptoms"
                                icon={faHeadSideCough}
                                status="normal"
                                isGlassomorphic={true}
                                maxW="200px"
                            />
                        </HStack>
            </Flex>
                </Box>
            </ScaleFade>
            
            {/* Main Content with Tabs */}
            <Tabs 
                variant="soft-rounded" 
                colorScheme="brand" 
                onChange={(index) => setActiveTab(index)}
                index={activeTab}
                mb={6}
            >
                <TabList mb={4} borderBottom="1px solid" borderColor={borderColor} pb={2}>
                    <Tab 
                        _selected={{ 
                            color: useColorModeValue('brand.600', 'brand.200'),
                            bg: useColorModeValue('brand.50', 'rgba(49, 130, 206, 0.1)')
                        }}
                        fontWeight="medium"
                        mr={2}
                    >
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
                        Log Symptom
                    </Tab>
                    <Tab 
                        _selected={{ 
                            color: useColorModeValue('brand.600', 'brand.200'),
                            bg: useColorModeValue('brand.50', 'rgba(49, 130, 206, 0.1)')
                        }}
                        fontWeight="medium"
                    >
                        <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '8px' }} />
                        History
                    </Tab>
                </TabList>
                
                <TabPanels>
                    {/* Log Symptom Tab */}
                    <TabPanel p={0}>
                        <Box ref={formRef} data-section="form">
                            <SlideFade in={visibleSections.form} offsetY="30px">
                                <Card boxShadow={shadowColor}>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                                <FormControl isRequired>
                                                    <FormLabel 
                                                        htmlFor="symptom-type" 
                                                        fontSize="sm" 
                                                        fontWeight="medium" 
                                                        color={labelColor}
                                                    >
                                                        <HStack>
                                                            <FontAwesomeIcon icon={faHeadSideCough} />
                                                            <Text>Symptom Type</Text>
                                                        </HStack>
                                </FormLabel>
                                <Select
                                    id="symptom-type"
                                    value={symptomType}
                                    onChange={handleSymptomTypeChange}
                                    size="md"
                                    placeholder="Select a symptom"
                                                        borderRadius="md"
                                                        bg={inputBgColor}
                                                        transition="all 0.3s"
                                                        _hover={{
                                                            borderColor: inputBorderColorHover
                                                        }}
                                                        _focus={{
                                                            borderColor: inputBorderColorFocus,
                                                            boxShadow: useColorModeValue(
                                                                '0 0 0 1px var(--chakra-colors-brand-500)',
                                                                '0 0 0 1px var(--chakra-colors-brand-300)'
                                                            )
                                                        }}
                                                        color={textColor}
                                                        _placeholder={{ color: placeholderColor }}
                                >
                                    <option value="Headache">Headache</option>
                                    <option value="Nausea">Nausea</option>
                                    <option value="Fatigue">Fatigue</option>
                                    <option value="Fever">Fever</option>
                                    <option value="Cough">Cough</option>
                                    <option value="Muscle Pain">Muscle Pain</option>
                                    <option value="Shortness of Breath">Shortness of Breath</option>
                                    <option value="other">Other (specify)</option>
                                </Select>
                            </FormControl>

                                                <FormControl isRequired>
                                                    <FormLabel 
                                                        htmlFor="severity" 
                                                        fontSize="sm" 
                                                        fontWeight="medium" 
                                                        color={labelColor}
                                                    >
                                                        <HStack>
                                                            <FontAwesomeIcon icon={faThermometerHalf} />
                                                            <Text>Severity</Text>
                                                            <Badge 
                                                                colorScheme={getSeverityColor(severity)} 
                                                                ml={2}
                                                                borderRadius="full"
                                                            >
                                                                {severity}/10 - {getSeverityText(severity)}
                                                            </Badge>
                                                        </HStack>
                                </FormLabel>
                                <Flex align="center">
                                    <Slider
                                        id="severity"
                                        min={1}
                                        max={10}
                                        step={1}
                                        value={severity}
                                        onChange={handleSeverityChange}
                                        flex="1"
                                                            colorScheme={getSeverityColor(severity)}
                                                            focusThumbOnChange={false}
                                                        >
                                                            <SliderTrack 
                                                                bg={useColorModeValue('gray.200', 'gray.600')}
                                                                h="4px"
                                                                borderRadius="full"
                                                            >
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                                            <SliderThumb 
                                                                boxSize={6} 
                                                                boxShadow="lg"
                                                                _focus={{ 
                                                                    boxShadow: "outline" 
                                                                }}
                                                                transition="transform 0.2s"
                                                                _active={{ 
                                                                    transform: "scale(1.2)"
                                                                }}
                                                            />
                                    </Slider>
                                </Flex>
                            </FormControl>

                            {isOtherSelected && (
                                                    <FormControl gridColumn={{ md: "span 2" }} isRequired>
                                                        <FormLabel 
                                                            htmlFor="other-symptom" 
                                                            fontSize="sm" 
                                                            fontWeight="medium" 
                                                            color={labelColor}
                                                        >
                                        Specify Symptom
                                    </FormLabel>
                                    <Input
                                        id="other-symptom"
                                        value={otherSymptom}
                                        onChange={(e) => setOtherSymptom(e.target.value)}
                                        placeholder="Enter your symptom"
                                        size="md"
                                                            borderRadius="md"
                                                            bg={inputBgColor}
                                                            color={textColor}
                                                            transition="all 0.3s"
                                                            _hover={{
                                                                borderColor: inputBorderColorHover
                                                            }}
                                                            _focus={{
                                                                borderColor: inputBorderColorFocus,
                                                                boxShadow: useColorModeValue(
                                                                    '0 0 0 1px var(--chakra-colors-brand-500)',
                                                                    '0 0 0 1px var(--chakra-colors-brand-300)'
                                                                )
                                                            }}
                                                            _placeholder={{ color: placeholderColor }}
                                    />
                                </FormControl>
                            )}

                                                <FormControl isRequired>
                                                    <FormLabel 
                                                        htmlFor="symptom-date" 
                                                        fontSize="sm" 
                                                        fontWeight="medium" 
                                                        color={labelColor}
                                                    >
                                                        <HStack>
                                                            <FontAwesomeIcon icon={faCalendarAlt} />
                                                            <Text>Date & Time</Text>
                                                        </HStack>
                                </FormLabel>
                                <Input
                                    id="symptom-date"
                                    type="datetime-local"
                                    value={symptomDate}
                                    onChange={(e) => setSymptomDate(e.target.value)}
                                    size="md"
                                                        borderRadius="md"
                                                        bg={inputBgColor}
                                                        color={textColor}
                                                        transition="all 0.3s"
                                                        _hover={{
                                                            borderColor: inputBorderColorHover
                                                        }}
                                                        _focus={{
                                                            borderColor: inputBorderColorFocus,
                                                            boxShadow: useColorModeValue(
                                                                '0 0 0 1px var(--chakra-colors-brand-500)',
                                                                '0 0 0 1px var(--chakra-colors-brand-300)'
                                                            )
                                                        }}
                                />
                            </FormControl>

                                                <FormControl gridColumn={{ md: "span 2" }}>
                                                    <FormLabel 
                                                        htmlFor="symptom-notes" 
                                                        fontSize="sm" 
                                                        fontWeight="medium" 
                                                        color={labelColor}
                                                    >
                                                        <HStack>
                                                            <FontAwesomeIcon icon={faStickyNote} />
                                                            <Text>Notes</Text>
                                                        </HStack>
                                </FormLabel>
                                <Textarea
                                                        id="symptom-notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                                        placeholder="Additional details about your symptom..."
                                    size="md"
                                                        borderRadius="md"
                                                        minHeight="100px"
                                                        bg={inputBgColor}
                                                        color={textColor}
                                                        transition="all 0.3s"
                                                        _hover={{
                                                            borderColor: inputBorderColorHover
                                                        }}
                                                        _focus={{
                                                            borderColor: inputBorderColorFocus,
                                                            boxShadow: useColorModeValue(
                                                                '0 0 0 1px var(--chakra-colors-brand-500)',
                                                                '0 0 0 1px var(--chakra-colors-brand-300)'
                                                            )
                                                        }}
                                                        _placeholder={{ color: placeholderColor }}
                                />
                            </FormControl>
                        </SimpleGrid>

                        <Button
                            type="submit"
                                                colorScheme="brand"
                            size="md"
                                                leftIcon={<FontAwesomeIcon icon={faCheckCircle} />}
                                                alignSelf="flex-end"
                                                mt={4}
                                                boxShadow="md"
                                                _hover={{
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: 'lg',
                                                }}
                                                _active={{
                                                    transform: 'translateY(0)',
                                                    boxShadow: 'md',
                                                }}
                                                transition="all 0.2s"
                        >
                            Log Symptom
                        </Button>
                    </VStack>
                </form>
            </Card>
                            </SlideFade>
                        </Box>
                    </TabPanel>
                    
                    {/* History Tab */}
                    <TabPanel p={0}>
                        <Box ref={historyRef} data-section="history">
                            <SlideFade in={visibleSections.history} offsetY="30px">
                                <Card 
                                    boxShadow={shadowColor}
                                    title="Symptom History"
                                    action={
                                        symptoms.length > 0 ? (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                rightIcon={<FontAwesomeIcon icon={showFullHistory ? faChevronUp : faChevronDown} />}
                                                onClick={() => setShowFullHistory(!showFullHistory)}
                                                colorScheme="brand"
                                            >
                                                {showFullHistory ? "Show Less" : "Show All"}
                                            </Button>
                                        ) : null
                                    }
                                >
                {symptoms.length === 0 ? (
                                        <Flex 
                                            direction="column" 
                                            align="center" 
                                            justify="center" 
                                            py={10}
                                            bg={emptyStateBgColor}
                                            borderRadius="lg"
                                        >
                                            <Box 
                                                fontSize="4xl" 
                                                color={emptyStateIconColor} 
                                                mb={3}
                                            >
                                                <FontAwesomeIcon icon={faHeadSideCough} />
                                            </Box>
                                            <Text color={emptyStateTextColor} textAlign="center">
                                                No symptoms have been logged yet.
                                            </Text>
                                            <Button
                                                mt={4}
                                                colorScheme="brand"
                                                    size="sm"
                                                leftIcon={<FontAwesomeIcon icon={faPlus} />}
                                                onClick={() => setActiveTab(0)}
                                            >
                                                Log Your First Symptom
                                            </Button>
                                        </Flex>
                                    ) : (
                                        <motion.div
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="show"
                                        >
                                            <SimpleGrid 
                                                columns={{ base: 1, md: 2, lg: 3 }} 
                                                spacing={5}
                                            >
                                                {(showFullHistory ? symptoms : symptoms.slice(0, 5)).map((symptom, index) => (
                                                    <SymptomCard
                                                        key={symptom.id || index}
                                                        symptom={symptom}
                                                        onEdit={handleEdit}
                                                        onDelete={handleDelete}
                                                        isInView={true}
                                                    />
                                                ))}
                                            </SimpleGrid>
                                            
                                            {symptoms.length > 5 && (
                                                <Flex justify="center" mt={6}>
                                                    <Button
                                                    size="sm"
                                                        onClick={() => setShowFullHistory(!showFullHistory)}
                                                        rightIcon={<FontAwesomeIcon icon={showFullHistory ? faChevronUp : faChevronDown} />}
                                                        variant="outline"
                                                        colorScheme="brand"
                                                    >
                                                        {showFullHistory ? "Show Less" : `Show All (${symptoms.length})`}
                                                    </Button>
                                                </Flex>
                                            )}
                                        </motion.div>
                )}
            </Card>
                            </SlideFade>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    );
};

export default SymptomTracker; 