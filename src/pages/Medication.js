import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPills, 
    faCheckCircle, 
    faHistory, 
    faPlus, 
    faEdit, 
    faTrash, 
    faCalendarAlt, 
    faClock, 
    faInfoCircle,
    faChevronDown,
    faChevronUp,
    faStickyNote,
    faCheck,
    faTimes,
    faSearch,
    faFilter,
    faSortAmountDown,
    faSortAmountUp,
    faSort
} from '@fortawesome/free-solid-svg-icons';
import {
    Box,
    Heading,
    Text,
    Flex,
    Button,
    Badge,
    SimpleGrid,
    VStack,
    HStack,
    IconButton,
    useToast,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useDisclosure,
    Collapse,
    useColorModeValue,
    ScaleFade,
    SlideFade,
    Tooltip,
    Avatar,
    Divider,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    CircularProgress,
    CircularProgressLabel,
    Grid,
    GridItem,
    Progress,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Input,
    InputGroup,
    InputLeftElement,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Container,
    Skeleton
} from '@chakra-ui/react';
import { Card, MetricCard } from '../components/ui';
import MedicationFormModal from '../components/MedicationFormModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedications } from '../context/MedicationContext';
import { useInView } from 'react-intersection-observer';
import MedicationCard from '../components/MedicationCard';
import PageLayout from '../components/PageLayout';

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionContainer = motion(Container);

// Animation variants for staggered children
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

// Format date helper
const formatDateTime = (date) => {
    if (!date) return 'N/A';
    try {
        const dateObj = new Date(date);
        return dateObj.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch (e) {
        console.error('Error formatting date:', e);
        return 'Invalid date';
    }
};

// Format time helper
const formatTime = (time) => {
    if (!time) return 'N/A';
    try {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${period}`;
    } catch (e) {
        console.error('Error formatting time:', e);
        return time; // Fallback to original string
    }
};

const Medication = () => {
    const toast = useToast();
    const { medications, addMedication, updateMedication, deleteMedication, markTaken } = useMedications();
    
    // Refs for animations
    const currentMedsRef = useRef(null);
    const historyRef = useRef(null);
    
    // State for animation triggers
    const [visibleSections, setVisibleSections] = useState({
        current: false,
        history: false
    });
    
    // State management
    const [selectedMed, setSelectedMed] = useState(null);
    const [historyFilter, setHistoryFilter] = useState('all');
    const [showFullHistory, setShowFullHistory] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    
    // Use disclosure hooks for modals and expandable sections
    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isHistoryOpen, onToggle: toggleHistory } = useDisclosure({ defaultIsOpen: true });
    
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
        if (currentMedsRef.current) observer.observe(currentMedsRef.current);
        if (historyRef.current) observer.observe(historyRef.current);

        return () => {
            if (currentMedsRef.current) observer.unobserve(currentMedsRef.current);
            if (historyRef.current) observer.unobserve(historyRef.current);
        };
    }, []);

    // Action handlers
    const handleAddClick = () => {
        setSelectedMed(null); // Clear any selected medication
        onFormOpen();
    };

    const handleEditClick = (med) => {
        setSelectedMed(med);
        onFormOpen();
    };

    const handleDeleteClick = (medId) => {
        if (window.confirm('Are you sure you want to delete this medication?')) {
            deleteMedication(medId);
            toast({
                title: 'Medication deleted',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            });
        }
    };

    const handleTakenClick = (medId) => {
        markTaken(medId);
            toast({
            title: 'Medication marked as taken',
            status: 'success',
                duration: 3000,
                isClosable: true,
            position: 'top-right'
        });
    };

    const handleFormSubmit = (medicationData) => {
        if (selectedMed) {
            // Update existing medication
            updateMedication({ ...selectedMed, ...medicationData });
            toast({
                title: 'Medication updated',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            });
        } else {
            // Add new medication
            addMedication(medicationData);
            toast({
                title: 'Medication added',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            });
        }
        onFormClose();
    };

    // Filter medications for active tab
    const activeMedications = medications.filter(med => med.remaining > 0);
    const medicationHistory = medications
        .filter(med => {
            if (historyFilter === 'all') return true;
            if (historyFilter === 'completed') return med.history && med.history.length > 0;
            if (historyFilter === 'low') return med.remaining <= 5 && med.remaining > 0;
            return true;
        })
        .sort((a, b) => {
            // Sort by most recently taken first
            const aLastTaken = a.history && a.history.length ? new Date(a.history[0].timestamp) : new Date(0);
            const bLastTaken = b.history && b.history.length ? new Date(b.history[0].timestamp) : new Date(0);
            return bLastTaken - aLastTaken;
        });

    // Calculate metrics
    const totalDosesToday = medications.reduce((total, med) => {
        const today = new Date();
        const takenToday = med.history ? med.history.filter(h => {
            const takenDate = new Date(h.timestamp);
            return takenDate.toDateString() === today.toDateString();
        }).length : 0;
        return total + takenToday;
    }, 0);

    const medicationsNeedingRefill = medications.filter(med => med.remaining <= 5 && med.remaining > 0).length;

    // Custom colors
    const headerBg = useColorModeValue(
        'linear(to-r, brand.500, accent.400)',
        'linear(to-r, brand.700, accent.600)'
    );
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.300');
    const inputBgColor = useColorModeValue('white', 'gray.700');
    const buttonHoverBg = useColorModeValue('gray.100', 'gray.700');
    const menuBg = useColorModeValue('white', 'gray.800');
    const menuHoverBg = useColorModeValue('gray.100', 'gray.700');
    const shadowColor = useColorModeValue(
        '0 4px 6px rgba(49, 130, 206, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        '0 4px 6px rgba(0, 0, 0, 0.4)'
    );

    // Get medication type color
    const getMedicationTypeColor = (type) => {
        const colors = {
            pill: 'blue',
            liquid: 'teal',
            injection: 'purple',
            inhaler: 'cyan',
            topical: 'green',
            drops: 'indigo',
            other: 'gray'
        };
        return colors[type] || 'gray';
    };

    const { ref, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true
    });
    
    // Color mode values
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const emptyStateColor = useColorModeValue('gray.400', 'gray.500');
    const placeholderColor = useColorModeValue('gray.500', 'gray.400');
    const skeletonStartColor = useColorModeValue('gray.100', 'gray.800');
    const skeletonEndColor = useColorModeValue('gray.400', 'gray.600');
    
    // State for medications
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    
    // State for form modal
    const { isOpen: isFormOpenModal, onOpen: onFormOpenModal, onClose: onFormCloseModal } = useDisclosure();
    const [editingId, setEditingId] = useState(null);
    
    // Sample medication data - replace with API calls in production
    useEffect(() => {
        const fetchMedications = () => {
            // Simulating API call
            setTimeout(() => {
                // Instead of setting local state, we'll just stop the loading
                setLoading(false);
            }, 1000);
        };
        
        fetchMedications();
    }, []);
    
    // Filter and sort medications
    const filteredMedications = medications
        .filter(med => 
            med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.dosage.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.frequency.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            let comparison = 0;
            
            if (sortBy === 'remaining') {
                comparison = a.remaining - b.remaining;
            } else if (sortBy === 'time') {
                comparison = a.time.localeCompare(b.time);
            } else {
                comparison = a[sortBy].localeCompare(b[sortBy]);
            }
            
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    
    // Handle adding a new medication
    const handleAddMedication = (medication) => {
        const newMedication = {
            id: Date.now().toString(),
            ...medication,
            history: []
        };
        
        addMedication(newMedication);
        
        toast({
            title: 'Medication added',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        
        onFormCloseModal();
    };
    
    // Handle editing a medication
    const handleEditMedication = (medication) => {
        if (editingId) {
            updateMedication({ id: editingId, ...medication });
            
            toast({
                title: 'Medication updated',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            
            setEditingId(null);
            onFormCloseModal();
        }
    };
    
    // Handle deleting a medication
    const handleDeleteMedication = (id) => {
        deleteMedication(id);
        
        toast({
            title: 'Medication deleted',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    };
    
    // Open edit modal with current medication data
    const openEditModal = (id) => {
        // Find medication using the provided ID from medications in context
        setEditingId(id);
        onFormOpenModal();
    };
    
    // Open add modal
    const openAddModal = () => {
        setEditingId(null);
        onFormOpenModal();
    };
    
    // Toggle sort direction
    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };
    
    // Change sort field
    const handleSortChange = (field) => {
        if (sortBy === field) {
            toggleSortDirection();
        } else {
            setSortBy(field);
            setSortDirection('asc');
        }
    };

    // Mark medication as taken
    const markMedicationTaken = (id) => {
        markTaken(id);
    };

    return (
        <PageLayout title="Medications">
            <MotionBox
                ref={ref}
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                maxW="container.xl"
                py={6}
            >
                {/* Toolbar */}
                <Flex 
                    direction={{ base: 'column', md: 'row' }} 
                    justify="space-between" 
                    align={{ base: 'stretch', md: 'center' }} 
                    mb={5}
                    gap={4}
                >
                    <InputGroup maxW={{ base: '100%', md: '320px' }}>
                        <InputLeftElement pointerEvents='none'>
                            <FontAwesomeIcon icon={faSearch} color={placeholderColor} />
                        </InputLeftElement>
                        <Input
                            placeholder="Search medications"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="filled"
                            borderRadius="lg"
                            bg={inputBgColor}
                            color={textColor}
                            _placeholder={{ color: placeholderColor }}
                            _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                            _focus={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                        />
                        {searchTerm && (
                            <IconButton
                                icon={<FontAwesomeIcon icon={faTimes} />}
                                aria-label="Clear search"
                                variant="ghost"
                                position="absolute"
                                right="0"
                                onClick={() => setSearchTerm('')}
                                color={mutedTextColor}
                                _hover={{ bg: buttonHoverBg }}
                            />
                        )}
                    </InputGroup>
                    
                    <HStack spacing={2}>
                        <Menu>
                            <MenuButton 
                                as={Button} 
                                rightIcon={<FontAwesomeIcon icon={faSort} />}
                                variant="outline"
                                color={textColor}
                                borderColor={borderColor}
                                _hover={{ bg: buttonHoverBg }}
                            >
                                Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                            </MenuButton>
                            <MenuList bg={menuBg} borderColor={borderColor} boxShadow={shadowColor}>
                                <MenuItem onClick={() => handleSortChange('name')} _hover={{ bg: menuHoverBg }}>Name</MenuItem>
                                <MenuItem onClick={() => handleSortChange('time')} _hover={{ bg: menuHoverBg }}>Time</MenuItem>
                                <MenuItem onClick={() => handleSortChange('frequency')} _hover={{ bg: menuHoverBg }}>Frequency</MenuItem>
                                <MenuItem onClick={() => handleSortChange('remaining')} _hover={{ bg: menuHoverBg }}>Remaining</MenuItem>
                            </MenuList>
                        </Menu>
                        
                                        <IconButton
                            icon={
                                <FontAwesomeIcon 
                                    icon={sortDirection === 'asc' ? faSortAmountUp : faSortAmountDown} 
                                />
                            }
                            aria-label="Toggle sort direction"
                            variant="outline"
                            color={textColor}
                            borderColor={borderColor}
                            _hover={{ bg: buttonHoverBg }}
                        />
                        
                        <Button 
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            colorScheme="brand"
                            onClick={openAddModal}
                        >
                            Add
                        </Button>
                                    </HStack>
                                </Flex>
                
                {/* Medications Grid */}
                {loading ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {[1, 2, 3, 4].map(i => (
                            <Box key={i} bg={cardBg} p={5} borderRadius="xl" boxShadow="md">
                                <Skeleton 
                                    height="20px" 
                                    mb={4} 
                                    startColor={skeletonStartColor} 
                                    endColor={skeletonEndColor}
                                />
                                <Skeleton 
                                    height="15px" 
                                    mb={3} 
                                    startColor={skeletonStartColor} 
                                    endColor={skeletonEndColor}
                                />
                                <Skeleton 
                                    height="15px" 
                                    mb={3} 
                                    startColor={skeletonStartColor} 
                                    endColor={skeletonEndColor}
                                />
                                <Skeleton 
                                    height="15px" 
                                    mb={3} 
                                    startColor={skeletonStartColor} 
                                    endColor={skeletonEndColor}
                                />
                                <Skeleton 
                                    height="40px" 
                                    mt={6} 
                                    startColor={skeletonStartColor} 
                                    endColor={skeletonEndColor}
                                />
                            </Box>
                        ))}
                    </SimpleGrid>
                ) : filteredMedications.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        <AnimatePresence>
                            {filteredMedications.map((medication, index) => (
                                <MedicationCard
                                    key={medication.id}
                                    medication={medication}
                                    onEdit={openEditModal}
                                    onDelete={handleDeleteMedication}
                                    onMarkTaken={handleTakenClick}
                                    isInView={inView}
                                />
                            ))}
                        </AnimatePresence>
                    </SimpleGrid>
                ) : searchTerm ? (
                    <Flex 
                        direction="column" 
                        align="center" 
                        justify="center" 
                        p={10} 
                        bg={cardBg}
                        borderRadius="xl"
                        boxShadow="md"
                    >
                        <Text fontSize="xl" mb={4} color={emptyStateColor}>
                            No medications found matching "{searchTerm}"
                        </Text>
                        <Button 
                            onClick={() => setSearchTerm('')} 
                            variant="outline"
                            color={textColor}
                            borderColor={borderColor}
                            _hover={{ bg: buttonHoverBg }}
                        >
                            Clear search
                        </Button>
                    </Flex>
                ) : (
                                <Flex 
                        direction="column" 
                                            align="center" 
                                            justify="center" 
                        p={10} 
                        bg={cardBg}
                        borderRadius="xl"
                        boxShadow="md"
                    >
                        <Text fontSize="xl" mb={4} color={emptyStateColor}>
                            No medications added yet
                        </Text>
                        <Button 
                            leftIcon={<FontAwesomeIcon icon={faPlus} />}
                            colorScheme="brand"
                            onClick={openAddModal}
                        >
                            Add your first medication
                        </Button>
                                </Flex>
                )}
            
            {/* Medication Form Modal */}
            <MedicationFormModal
                    isOpen={isFormOpenModal}
                    onClose={onFormCloseModal}
                    onSubmit={editingId ? handleEditMedication : handleAddMedication}
                    medication={
                        editingId 
                            ? medications.find(med => med.id === editingId) 
                            : {
                                name: '',
                                dosage: '',
                                time: '',
                                frequency: 'Daily',
                                remaining: 30,
                                notes: ''
                            }
                    }
                    isEditing={!!editingId}
                />
            </MotionBox>
        </PageLayout>
    );
};

export default Medication; 