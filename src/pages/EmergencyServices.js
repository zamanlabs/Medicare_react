import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTriangleExclamation, faLocationDot, faRotate, faPhone, faHeadSideMask, faBrain,
    faUser, faMessage, faPlus, faHospital, faMapLocationDot, faEdit, faTrash, faHouseMedical,
    faCircleInfo, faAmbulance, faStethoscope, faHeartPulse, faShieldHeart, faListCheck, faCheckCircle, faMapPin,
    faSort, faSortUp, faSortDown, faFilter, faSearch, faTable
} from '@fortawesome/free-solid-svg-icons';
import {
    Box,
    Heading,
    Text,
    Flex,
    Button,
    IconButton,
    Badge,
    SimpleGrid,
    VStack,
    HStack,
    Link,
    Stack,
    Divider,
    Center,
    useToast,
    List,
    ListItem,
    Container,
    Spinner,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useColorModeValue,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    InputGroup,
    Input,
    InputLeftElement,
    InputRightElement,
    useDisclosure,
    Collapse,
    Tooltip,
    Avatar,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    ButtonGroup,
    CloseButton
} from '@chakra-ui/react';
import { Card, StatusBadge } from '../components/ui';
import MapComponent from '../components/MapComponent';
import { useHospitalLocation } from '../context/HospitalLocationContext';
import { motion } from 'framer-motion';
import emergencyContactService from '../services/emergencyContactService';
import { useAuth } from '../context/AuthContext';

// Create motion components for animations
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

// Update emergency contact numbers and hospital data for Bangladesh
const initialEmergencyContacts = [
    { id: 1, name: 'Dr. Rahman Ahmed', relationship: 'Primary Care Physician', phone: '01711234567' },
    { id: 2, name: 'Fatima Begum', relationship: 'Emergency Contact (Family)', phone: '01819876543' },
];

// Bangladeshi hospital information
const bangladeshHospitals = [
    {
        id: 1,
        name: 'Square Hospital',
        location: { latitude: 23.7507, longitude: 90.3738 },
        address: '18/F, Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka 1205',
        distance: '2.5 km',
        phone: '0288330565',
        emergencyType: '24/7 Emergency'
    },
    {
        id: 2,
        name: 'Dhaka Medical College Hospital',
        location: { latitude: 23.7267, longitude: 90.3996 },
        address: 'Secretariat Rd, Dhaka 1000',
        distance: '4.1 km',
        phone: '0255165088',
        emergencyType: 'Trauma Center'
    },
    {
        id: 3,
        name: 'United Hospital Limited',
        location: { latitude: 23.7982, longitude: 90.4071 },
        address: 'Plot 15, Road 71, Gulshan, Dhaka 1212',
        distance: '5.3 km',
        phone: '0288367801',
        emergencyType: '24/7 Emergency'
    },
    {
        id: 4,
        name: 'Evercare Hospital Dhaka',
        location: { latitude: 23.8178, longitude: 90.4321 },
        address: 'Plot 81, Block E, Bashundhara R/A, Dhaka 1229',
        distance: '7.8 km',
        phone: '0289331661',
        emergencyType: 'Emergency & Urgent Care'
    },
    {
        id: 5,
        name: 'Chittagong Medical College Hospital',
        location: { latitude: 22.3569, longitude: 91.8317 },
        address: 'Chittagong Medical College Rd, Chittagong',
        distance: '256 km',
        phone: '0241356110',
        emergencyType: 'Trauma Center'
    },
    {
        id: 6,
        name: 'Rajshahi Medical College Hospital',
        location: { latitude: 24.3636, longitude: 88.6241 },
        address: 'Medical College Rd, Rajshahi',
        distance: '258 km',
        phone: '0721772150',
        emergencyType: 'Critical Care'
    },
];

// Update city names to Bangladesh cities
const facilityPrefixes = ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Barishal', 'Rangpur'];

// Emergency types specific to Bangladesh
const emergencyTypes = ['24/7 Emergency', 'Trauma Center', 'Emergency & Urgent Care', 'Critical Care'];

const EmergencyContactModal = ({ isOpen, onClose, onSave, contact = null, isEditing = false }) => {
    const [contactData, setContactData] = useState({
        name: '',
        relationship: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const toast = useToast();

    // Reset form when modal opens or contact changes
    useEffect(() => {
        if (isOpen) {
            if (isEditing && contact) {
                // If editing, populate with existing contact data
                setContactData({
                    name: contact.name || '',
                    relationship: contact.relationship || '',
                    phone: contact.phone || ''
                });
            } else {
                // If adding new, reset form
                setContactData({
                    name: '',
                    relationship: '',
                    phone: ''
                });
            }
            setErrors({});
        }
    }, [isOpen, contact, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactData({
            ...contactData,
            [name]: value
        });
        
        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!contactData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!contactData.relationship.trim()) {
            newErrors.relationship = 'Relationship is required';
        }
        
        if (!contactData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10,15}$/.test(contactData.phone.replace(/[^0-9]/g, ''))) {
            newErrors.phone = 'Enter a valid phone number';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave({
                ...contactData,
                id: isEditing && contact ? contact.id : Date.now()
            });
            onClose();
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
            <ModalContent borderRadius="xl" boxShadow="xl">
                <ModalHeader 
                    bg={useColorModeValue('red.50', 'red.900')} 
                    color={useColorModeValue('red.600', 'red.200')}
                    borderTopRadius="xl"
                    px={6}
                    py={4}
                >
                    <HStack>
                        <Center
                            bg={useColorModeValue('red.100', 'red.800')}
                            color={useColorModeValue('red.500', 'red.300')}
                            p={2}
                            borderRadius="md"
                            boxShadow="sm"
                        >
                            <FontAwesomeIcon icon={isEditing ? faEdit : faUser} />
                        </Center>
                        <Text>{isEditing ? 'Edit Emergency Contact' : 'Add Emergency Contact'}</Text>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton top={4} right={4} />
                
                <ModalBody py={6} px={6}>
                    <VStack spacing={4} align="stretch">
                        <Text fontSize="sm" mb={2}>
                            Add contact information for someone who should be contacted in case of emergency.
                        </Text>
                        
                        <FormControl isRequired isInvalid={errors.name}>
                            <FormLabel fontSize="sm" fontWeight="medium">Full Name</FormLabel>
                            <Input 
                                name="name"
                                placeholder="Enter contact name"
                                value={contactData.name}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                bg={useColorModeValue('gray.50', 'gray.700')}
                                borderColor={useColorModeValue('gray.200', 'gray.600')}
                                _focus={{ borderColor: 'red.400', boxShadow: '0 0 0 1px var(--chakra-colors-red-400)' }}
                            />
                            {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                        </FormControl>
                        
                        <FormControl isRequired isInvalid={errors.relationship}>
                            <FormLabel fontSize="sm" fontWeight="medium">Relationship</FormLabel>
                            <Input 
                                name="relationship"
                                placeholder="E.g., Spouse, Parent, Friend, Doctor"
                                value={contactData.relationship}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                bg={useColorModeValue('gray.50', 'gray.700')}
                                borderColor={useColorModeValue('gray.200', 'gray.600')}
                                _focus={{ borderColor: 'red.400', boxShadow: '0 0 0 1px var(--chakra-colors-red-400)' }}
                            />
                            {errors.relationship && <FormErrorMessage>{errors.relationship}</FormErrorMessage>}
                        </FormControl>
                        
                        <FormControl isRequired isInvalid={errors.phone}>
                            <FormLabel fontSize="sm" fontWeight="medium">Phone Number</FormLabel>
                            <Input 
                                name="phone"
                                placeholder="Enter phone number"
                                value={contactData.phone}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                bg={useColorModeValue('gray.50', 'gray.700')}
                                borderColor={useColorModeValue('gray.200', 'gray.600')}
                                _focus={{ borderColor: 'red.400', boxShadow: '0 0 0 1px var(--chakra-colors-red-400)' }}
                            />
                            {errors.phone && <FormErrorMessage>{errors.phone}</FormErrorMessage>}
                            <FormHelperText>
                                Include country code for international numbers
                            </FormHelperText>
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter bg={useColorModeValue('gray.50', 'gray.700')} borderBottomRadius="xl" gap={3}>
                    <Button 
                        onClick={onClose} 
                        size="md" 
                        variant="ghost"
                    >
                        Cancel
                    </Button>
                    <Button 
                        colorScheme="red" 
                        onClick={handleSubmit} 
                        size="md"
                        leftIcon={<FontAwesomeIcon icon={isEditing ? faEdit : faPlus} />}
                        _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'md',
                        }}
                        transition="all 0.2s"
                    >
                        {isEditing ? 'Save Changes' : 'Add Contact'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

// Contact card component for displaying a contact with action buttons
const ContactCard = ({ contact, onEdit, onDelete }) => {
    const textPrimary = useColorModeValue('gray.700', 'gray.200');
    const textSecondary = useColorModeValue('gray.600', 'gray.400');
    const subtleBg = useColorModeValue('gray.50', 'gray.700');
    const cardHoverBg = useColorModeValue('gray.50', 'gray.700');
    const subtleIconBg = useColorModeValue('white', 'gray.900');
    const subtleBorderColor = useColorModeValue('gray.200', 'gray.600');
    
    // Format phone number for display
    const formatPhone = (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        // Simple formatting based on length
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 11) {
            return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
        }
        return phone; // Return original if we can't format
    };
    
    // Handle both API and localStorage contact data structures
    const contactId = contact._id || contact.id;
    
    return (
        <MotionBox 
            whileHover={{ y: -2 }}
        >
            <Flex 
                p={4} 
                bg={subtleBg} 
                borderRadius="lg"
                boxShadow="sm"
                _hover={{ bg: cardHoverBg }}
                transition="all 0.3s"
                position="relative"
            >
                <Center 
                    bg={subtleIconBg} 
                    p={3} 
                    borderRadius="full" 
                    mr={4}
                    boxShadow="sm"
                >
                    <Avatar 
                        size="sm" 
                        name={contact.name} 
                        bg="blue.500" 
                        color="white" 
                    />
                </Center>
                <Box flex="1">
                    <Flex justify="space-between" align="center">
                        <Box>
                            <Text fontWeight="bold">{contact.name}</Text>
                            <Text fontSize="sm" color={textSecondary}>{contact.relationship}</Text>
                        </Box>
                        <HStack spacing={1}>
                            <Tooltip label="Edit contact" hasArrow placement="top">
                                <IconButton
                                    aria-label="Edit contact"
                                    icon={<FontAwesomeIcon icon={faEdit} />}
                                    size="sm"
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => onEdit(contact)}
                                />
                            </Tooltip>
                            <Tooltip label="Delete contact" hasArrow placement="top">
                                <IconButton
                                    aria-label="Delete contact"
                                    icon={<FontAwesomeIcon icon={faTrash} />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => onDelete(contactId)}
                                />
                            </Tooltip>
                        </HStack>
                    </Flex>
                    
                    <Divider my={3} borderColor={subtleBorderColor} />
                    
                    <HStack spacing={4}>
                        <Button
                            size="xs"
                            leftIcon={<FontAwesomeIcon icon={faPhone} />}
                            colorScheme="green"
                            variant="outline"
                            as="a"
                            href={`tel:${contact.phone}`}
                        >
                            Call: {formatPhone(contact.phone)}
                        </Button>
                        <Button
                            size="xs"
                            leftIcon={<FontAwesomeIcon icon={faMessage} />}
                            colorScheme="blue"
                            variant="outline"
                            as="a"
                            href={`sms:${contact.phone}`}
                        >
                            Message
                        </Button>
                    </HStack>
                </Box>
            </Flex>
        </MotionBox>
    );
};

// Delete confirmation dialog component
const DeleteConfirmationDialog = ({ isOpen, onClose, onConfirm, contactName }) => {
    const cancelRef = React.useRef();
    
    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent borderRadius="xl">
                    <AlertDialogHeader 
                        fontSize="lg" 
                        fontWeight="bold"
                        bg={useColorModeValue('red.50', 'red.900')}
                        color={useColorModeValue('red.600', 'red.200')}
                        borderTopRadius="xl"
                        px={6}
                        py={4}
                    >
                        Delete Emergency Contact
                    </AlertDialogHeader>

                    <AlertDialogBody py={6}>
                        Are you sure you want to delete <strong>{contactName}</strong> from your emergency contacts? 
                        This action cannot be undone.
                    </AlertDialogBody>

                    <AlertDialogFooter bg={useColorModeValue('gray.50', 'gray.700')} borderBottomRadius="xl">
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            colorScheme="red" 
                            onClick={onConfirm} 
                            ml={3}
                            leftIcon={<FontAwesomeIcon icon={faTrash} />}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

// EmergencyContactsTable component
const EmergencyContactsTable = ({ contacts, onEdit, onDelete, isLoading }) => {
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    
    const textPrimary = useColorModeValue('gray.700', 'gray.200');
    const textSecondary = useColorModeValue('gray.600', 'gray.400');
    const tableBg = useColorModeValue('white', 'gray.800');
    const headerBg = useColorModeValue('gray.50', 'gray.700');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    
    // Format phone number for display
    const formatPhone = (phone) => {
        const cleaned = phone?.replace(/\D/g, '') || '';
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 11) {
            return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
        }
        return phone; // Return original if we can't format
    };
    
    // Filter and sort contacts
    useEffect(() => {
        let result = [...contacts];
        
        // Apply search filter
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(
                contact => 
                    contact.name.toLowerCase().includes(lowerSearchTerm) ||
                    contact.relationship.toLowerCase().includes(lowerSearchTerm) ||
                    contact.phone.includes(searchTerm)
            );
        }
        
        // Apply sorting
        result.sort((a, b) => {
            let aValue = a[sortField] || '';
            let bValue = b[sortField] || '';
            
            // Case insensitive string comparison
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        setFilteredContacts(result);
    }, [contacts, searchTerm, sortField, sortDirection]);
    
    const handleSort = (field) => {
        if (sortField === field) {
            // Toggle direction if clicking the same field
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // New field, default to ascending
            setSortField(field);
            setSortDirection('asc');
        }
    };
    
    const getSortIcon = (field) => {
        if (sortField !== field) return <FontAwesomeIcon icon={faSort} opacity={0.3} />;
        return sortDirection === 'asc' 
            ? <FontAwesomeIcon icon={faSortUp} />
            : <FontAwesomeIcon icon={faSortDown} />;
    };
    
    // Generate skeleton loaders for the table
    const renderSkeletonRows = () => {
        return Array(3).fill(0).map((_, i) => (
            <Tr key={i}>
                <Td><SkeletonText noOfLines={1} width="80%" /></Td>
                <Td><SkeletonText noOfLines={1} width="60%" /></Td>
                <Td><SkeletonText noOfLines={1} width="70%" /></Td>
                <Td textAlign="right"><Skeleton height="10px" width="80px" /></Td>
            </Tr>
        ));
    };
    
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg={tableBg}
            borderColor={borderColor}
            boxShadow="sm"
        >
            <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
                <InputGroup size="md">
                    <InputLeftElement pointerEvents="none">
                        <Box color="gray.400">
                            <FontAwesomeIcon icon={faSearch} />
                        </Box>
                    </InputLeftElement>
                    <Input
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        borderRadius="md"
                    />
                    {searchTerm && (
                        <InputRightElement>
                            <IconButton
                                aria-label="Clear search"
                                icon={<CloseButton />}
                                size="sm"
                                variant="ghost"
                                onClick={() => setSearchTerm('')}
                            />
                        </InputRightElement>
                    )}
                </InputGroup>
            </Box>
            
            <Box overflowX="auto">
                <Table variant="simple" size="md">
                    <Thead bg={headerBg}>
                        <Tr>
                            <Th 
                                cursor="pointer" 
                                onClick={() => handleSort('name')}
                                _hover={{ bg: hoverBg }}
                                transition="background 0.2s"
                            >
                                <Flex align="center">
                                    <Text mr={2}>Name</Text>
                                    {getSortIcon('name')}
                                </Flex>
                            </Th>
                            <Th 
                                cursor="pointer" 
                                onClick={() => handleSort('relationship')}
                                _hover={{ bg: hoverBg }}
                                transition="background 0.2s"
                            >
                                <Flex align="center">
                                    <Text mr={2}>Relationship</Text>
                                    {getSortIcon('relationship')}
                                </Flex>
                            </Th>
                            <Th 
                                cursor="pointer" 
                                onClick={() => handleSort('phone')}
                                _hover={{ bg: hoverBg }}
                                transition="background 0.2s"
                            >
                                <Flex align="center">
                                    <Text mr={2}>Phone</Text>
                                    {getSortIcon('phone')}
                                </Flex>
                            </Th>
                            <Th textAlign="right">Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {isLoading ? (
                            renderSkeletonRows()
                        ) : filteredContacts.length === 0 ? (
                            <Tr>
                                <Td colSpan={4} textAlign="center" py={6}>
                                    <Text color={textSecondary}>
                                        {searchTerm 
                                            ? 'No contacts match your search' 
                                            : 'No emergency contacts added yet'}
                                    </Text>
                                </Td>
                            </Tr>
                        ) : (
                            filteredContacts.map(contact => {
                                const contactId = contact._id || contact.id;
                                return (
                                    <Tr 
                                        key={contactId}
                                        _hover={{ bg: hoverBg }}
                                        transition="background 0.2s"
                                    >
                                        <Td fontWeight="medium">{contact.name}</Td>
                                        <Td>{contact.relationship}</Td>
                                        <Td>
                                            <Link href={`tel:${contact.phone}`} color="blue.500">
                                                {formatPhone(contact.phone)}
                                            </Link>
                                        </Td>
                                        <Td textAlign="right">
                                            <HStack spacing={2} justifyContent="flex-end">
                                                <Tooltip label="Edit" hasArrow>
                                                    <IconButton
                                                        aria-label="Edit contact"
                                                        icon={<FontAwesomeIcon icon={faEdit} />}
                                                        size="sm"
                                                        colorScheme="blue"
                                                        variant="ghost"
                                                        onClick={() => onEdit(contact)}
                                                    />
                                                </Tooltip>
                                                <Tooltip label="Delete" hasArrow>
                                                    <IconButton
                                                        aria-label="Delete contact"
                                                        icon={<FontAwesomeIcon icon={faTrash} />}
                                                        size="sm"
                                                        colorScheme="red"
                                                        variant="ghost"
                                                        onClick={() => onDelete(contactId)}
                                                    />
                                                </Tooltip>
                                                <Tooltip label="Call" hasArrow>
                                                    <IconButton
                                                        aria-label="Call contact"
                                                        icon={<FontAwesomeIcon icon={faPhone} />}
                                                        size="sm"
                                                        colorScheme="green"
                                                        variant="ghost"
                                                        as="a"
                                                        href={`tel:${contact.phone}`}
                                                    />
                                                </Tooltip>
                                                <Tooltip label="Message" hasArrow>
                                                    <IconButton
                                                        aria-label="Message contact"
                                                        icon={<FontAwesomeIcon icon={faMessage} />}
                                                        size="sm"
                                                        colorScheme="purple"
                                                        variant="ghost"
                                                        as="a"
                                                        href={`sms:${contact.phone}`}
                                                    />
                                                </Tooltip>
                                            </HStack>
                                        </Td>
                                    </Tr>
                                );
                            })
                        )}
                    </Tbody>
                </Table>
            </Box>
            
            <Flex 
                justify="space-between" 
                align="center" 
                p={4} 
                borderTopWidth="1px" 
                borderColor={borderColor}
            >
                <Text fontSize="sm" color={textSecondary}>
                    {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
                    {searchTerm && ' found'}
                </Text>
                <Flex align="center">
                    <Text fontSize="sm" color={textSecondary} mr={2}>View as:</Text>
                    <ButtonGroup size="sm" isAttached variant="outline">
                        <Button leftIcon={<FontAwesomeIcon icon={faTable} />}>
                            Table
                        </Button>
                        <Button leftIcon={<FontAwesomeIcon icon={faUser} />}>
                            Cards
                        </Button>
                    </ButtonGroup>
                </Flex>
            </Flex>
        </Box>
    );
};

const EmergencyServices = () => {
    // Use hospital location context for shared state
    const { 
        userLocation, 
        nearbyHospitals, 
        currentAddress, 
        isLoading: isLocationLoading, 
        updateUserLocation,
        getDirectionsUrl
    } = useHospitalLocation();
    
    const { isAuthenticated, token, user } = useAuth();

    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [medicalFacilities, setMedicalFacilities] = useState([]);
    const [mapMarkers, setMapMarkers] = useState([]);
    const [currentContact, setCurrentContact] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [contactToDelete, setContactToDelete] = useState(null);
    const [isContactsLoading, setIsContactsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const toast = useToast();
    const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
    const { isOpen: isContactModalOpen, onOpen: onOpenContactModal, onClose: onCloseContactModal } = useDisclosure();
    const { 
        isOpen: isDeleteDialogOpen, 
        onOpen: onOpenDeleteDialog, 
        onClose: onCloseDeleteDialog 
    } = useDisclosure();

    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

    // Theme-aware colors
    const headerGradient = useColorModeValue(
        'linear(to-r, red.500, brand.500)',
        'linear(to-r, red.400, brand.400)'
    );
    const cardBg = useColorModeValue('white', 'gray.800');
    const cardHoverBg = useColorModeValue('gray.50', 'gray.700');
    const subtleBg = useColorModeValue('gray.50', 'gray.700');
    const subtleIconBg = useColorModeValue('white', 'gray.900');
    const subtleBorderColor = useColorModeValue('gray.200', 'gray.600');
    const textPrimary = useColorModeValue('gray.700', 'gray.200');
    const textSecondary = useColorModeValue('gray.600', 'gray.400');
    const emergencyBannerBg = useColorModeValue('red.600', 'red.800');
    const emergencyBannerColor = 'white';
    const alertBg = useColorModeValue('red.50', 'rgba(254, 178, 178, 0.12)');
    const alertBorderColor = useColorModeValue('red.500', 'red.400');
    const alertTextColor = useColorModeValue('red.700', 'red.300');

    // Load emergency contacts from API instead of localStorage
    useEffect(() => {
        const fetchEmergencyContacts = async () => {
            // Only fetch contacts if user is authenticated
            if (!isAuthenticated) {
                // Use initial contacts for demo if not authenticated
                setEmergencyContacts(initialEmergencyContacts);
                return;
            }
            
            try {
                setIsContactsLoading(true);
                setError(null);
                const contacts = await emergencyContactService.getEmergencyContacts();
                setEmergencyContacts(contacts);
            } catch (err) {
                console.error('Error fetching emergency contacts:', err);
                setError('Failed to load your emergency contacts. Please try again.');
                toast({
                    title: 'Error',
                    description: err.message || 'Failed to load emergency contacts',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            } finally {
                setIsContactsLoading(false);
            }
        };
        
        fetchEmergencyContacts();
    }, [isAuthenticated, toast]);

    // Create map markers when user location or nearby hospitals change
    useEffect(() => {
        if (userLocation) {
            const markers = [];
            
            // Add user marker
            markers.push({
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                name: 'Your Location',
                iconType: 'user'
            });
            
            // Add hospital markers
            nearbyHospitals.forEach(hospital => {
                if (hospital.location) {
                    markers.push({
                        latitude: hospital.location.latitude,
                        longitude: hospital.location.longitude,
                        name: hospital.name,
                        iconType: 'hospital'
                    });
                }
            });
            
            // Add any additional medical facility markers
            medicalFacilities.forEach(facility => {
                if (facility.location && facility.type !== 'Hospital') { // Only add non-hospital facilities to avoid duplication
                    markers.push({
                        latitude: facility.location.latitude,
                        longitude: facility.location.longitude,
                        name: facility.name,
                        iconType: facility.type === 'Hospital' ? 'hospital' : 'clinic'
                    });
                }
            });
            
            setMapMarkers(markers);
        }
    }, [userLocation, nearbyHospitals, medicalFacilities]);

    // Handle location change from map component
    const handleLocationChange = (location) => {
        // Update location in the shared context
        updateUserLocation(location);
        
        // Find nearby medical facilities (this part remains local to this component)
        findNearbyMedicalCenters(location);
        
        toast({
            title: "Location Updated",
            description: "Your location has been updated and nearby facilities refreshed.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
        });
    };

    // Find nearby medical facilities based on location (non-hospital facilities)
    const findNearbyMedicalCenters = (location) => {
        // In a real app, this would make an API call to a service like Google Places API
        // For this implementation, we'll simulate the API call with a timeout and mock data
        setTimeout(() => {
            // Generate 3-5 random medical facilities (clinics, not hospitals)
            const numberOfFacilities = Math.floor(Math.random() * 3) + 3;
            const facilities = [];
            
            const facilityTypes = ['Clinic', 'Medical Center', 'Diagnostic Center'];
            
            for (let i = 0; i < numberOfFacilities; i++) {
                // Generate a random distance between 0.1 and 3.5 miles
                const distance = (Math.random() * 3.4 + 0.1).toFixed(1);
                const facilityType = facilityTypes[Math.floor(Math.random() * facilityTypes.length)];
                const prefix = facilityPrefixes[Math.floor(Math.random() * facilityPrefixes.length)];
                
                facilities.push({
                    id: i + 1,
                    name: `${prefix} ${facilityType}`,
                    type: 'Clinic', // Only clinics here, hospitals come from context
                    distance: `${distance} km`,
                    // Generate a random position near the user's location
                    location: {
                        latitude: location.latitude + (Math.random() * 0.02 - 0.01),
                        longitude: location.longitude + (Math.random() * 0.02 - 0.01)
                    }
                });
            }
            
            // Sort by distance
            facilities.sort((a, b) => {
                return parseFloat(a.distance) - parseFloat(b.distance);
            });
            
            setMedicalFacilities(facilities);
        }, 1500); // Simulate API delay
    };

    const handleAddContact = () => {
        setCurrentContact(null);
        setIsEditing(false);
        onOpenContactModal();
    };

    const handleEditContact = (contact) => {
        setCurrentContact(contact);
        setIsEditing(true);
        onOpenContactModal();
    };

    const handleSaveContact = async (contactData) => {
        if (!isAuthenticated) {
            toast({
                title: 'Authentication Required',
                description: 'Please log in to save emergency contacts',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            return;
        }
        
        try {
            if (isEditing) {
                // Update existing contact
                const { id, ...contactUpdateData } = contactData;
                const updatedContact = await emergencyContactService.updateEmergencyContact(id, contactUpdateData);
                
                // Update state with the returned contact
                setEmergencyContacts(
                    emergencyContacts.map(contact => 
                        contact._id === updatedContact._id ? updatedContact : contact
                    )
                );
                
                toast({
                    title: "Contact Updated",
                    description: "The emergency contact has been updated.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
            } else {
                // Add new contact
                const newContact = await emergencyContactService.createEmergencyContact(contactData);
                setEmergencyContacts([...emergencyContacts, newContact]);
                
                toast({
                    title: "Contact Added",
                    description: "The emergency contact has been added.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
            }
        } catch (err) {
            toast({
                title: isEditing ? 'Update Failed' : 'Save Failed',
                description: err.message || 'Failed to save emergency contact',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        }
    };

    const handleDeleteContact = (contactId) => {
        const contactToRemove = emergencyContacts.find(contact => contact._id === contactId);
        if (contactToRemove) {
            setContactToDelete(contactToRemove);
            onOpenDeleteDialog();
        }
    };

    const confirmDeleteContact = async () => {
        if (!isAuthenticated) {
            toast({
                title: 'Authentication Required',
                description: 'Please log in to delete emergency contacts',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            return;
        }
        
        if (contactToDelete) {
            try {
                await emergencyContactService.deleteEmergencyContact(contactToDelete._id);
                setEmergencyContacts(emergencyContacts.filter(contact => contact._id !== contactToDelete._id));
                
                toast({
                    title: "Contact Deleted",
                    description: "The emergency contact has been removed.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top",
                });
            } catch (err) {
                toast({
                    title: 'Delete Failed',
                    description: err.message || 'Failed to delete emergency contact',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            } finally {
                onCloseDeleteDialog();
                setContactToDelete(null);
            }
        }
    };

    const handleGetDirections = (hospital) => {
        // Get directions URL from context
        const directionsUrl = getDirectionsUrl(hospital);
        
        if (directionsUrl) {
            // Open in a new tab
            window.open(directionsUrl, '_blank');
            
            toast({
                title: "Opening Directions",
                description: `Opening directions to ${hospital.name}`,
                status: "info",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        } else {
            toast({
                title: "Location Required",
                description: "Please allow location access to get directions.",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    };

    // Toggle view mode
    const toggleViewMode = () => {
        setViewMode(viewMode === 'cards' ? 'table' : 'cards');
    };

    // Function to render emergency contacts with loading/error states
    const renderEmergencyContacts = () => {
        if (error) {
            return (
                <Alert status="error" borderRadius="lg">
                    <AlertIcon />
                    <Box flex="1">
                        <AlertTitle>Error loading contacts</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Box>
                    <Button onClick={() => window.location.reload()} size="sm" colorScheme="red">
                        Retry
                    </Button>
                </Alert>
            );
        }

        if (viewMode === 'table') {
            return (
                <EmergencyContactsTable
                    contacts={emergencyContacts}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                    isLoading={isContactsLoading}
                />
            );
        }

        // Card View
        if (isContactsLoading) {
            return Array(3).fill(0).map((_, i) => (
                <Box key={i} p={4} bg={subtleBg} borderRadius="lg" mb={3}>
                    <Flex>
                        <SkeletonCircle size="12" mr={4} />
                        <Box flex="1">
                            <SkeletonText mt="2" noOfLines={2} spacing="2" skeletonHeight="2" />
                            <Divider my={3} />
                            <SkeletonText mt="2" noOfLines={1} spacing="2" skeletonHeight="8" width="60%" />
                        </Box>
                    </Flex>
                </Box>
            ));
        }

        if (emergencyContacts.length === 0) {
            return (
                <Center py={8} bg={subtleBg} borderRadius="lg">
                    <VStack spacing={3}>
                        <Box fontSize="3xl" color={textSecondary}>
                            <FontAwesomeIcon icon={faUser} />
                        </Box>
                        <Text fontWeight="medium">No emergency contacts added</Text>
                        <Text fontSize="sm" color={textSecondary} textAlign="center">
                            Add contacts that should be notified in case of an emergency
                        </Text>
                    </VStack>
                </Center>
            );
        }

        return emergencyContacts.map((contact) => (
            <ContactCard
                key={contact._id || contact.id}
                contact={contact}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
            />
        ));
    };

    // Add this effect for debugging authentication
    useEffect(() => {
        console.log('Auth status:', { isAuthenticated, hasToken: !!token, user });
        if (!isAuthenticated) {
            console.warn('User is not authenticated. Emergency contacts will use demo data.');
        }
    }, [isAuthenticated, token, user]);

    return (
        <Container maxW="container.xl" px={4} pt={0}>
            {/* Emergency Banner */}
            <MotionBox 
                bg={emergencyBannerBg}
                color={emergencyBannerColor}
                py={4} 
                px={6} 
                mb={8} 
                mx={-4} 
                mt="-1.5rem"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                borderBottomRadius="md"
                position="relative"
                boxShadow="md"
            >
                    <Flex 
                        flexWrap="wrap" 
                        justifyContent="space-between" 
                        alignItems="center"
                    maxW="container.xl"
                    mx="auto"
                >
                    <HStack spacing={4}>
                        <Center 
                            bg="rgba(255,255,255,0.2)" 
                            p={2} 
                            borderRadius="full"
                        >
                            <FontAwesomeIcon icon={faTriangleExclamation} size="lg" />
                        </Center>
                        <VStack align="flex-start" spacing={0}>
                            <Heading as="h2" size="md" fontWeight="bold">
                                Emergency Services
                            </Heading>
                            <Text fontSize="sm">
                                Call 999 immediately for life-threatening emergencies
                            </Text>
                        </VStack>
                    </HStack>
                    
                    <HStack mt={{ base: 4, md: 0 }}>
                        <Button 
                            leftIcon={<FontAwesomeIcon icon={faPhone} />} 
                            colorScheme="white" 
                            variant="outline"
                            borderWidth="2px"
                            size="md"
                            _hover={{ bg: 'rgba(255,255,255,0.1)' }}
                            as="a"
                            href="tel:999" 
                        >
                            Call 999
                        </Button>
                        <Button
                            leftIcon={<FontAwesomeIcon icon={faHospital} />}
                            colorScheme="white"
                            variant="solid"
                            size="md"
                            bg="white" 
                            color="red.600" 
                            _hover={{ bg: 'gray.100' }}
                            onClick={onToggle}
                        >
                            Emergency Info
                        </Button>
                    </HStack>
                    </Flex>
            </MotionBox>
            
            {/* Emergency Information Box */}
            <Collapse in={isOpen} animateOpacity>
                <MotionBox 
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    mb={8}
                >
                    <Alert
                        status="info"
                        variant="left-accent"
                        flexDirection="column"
                        alignItems="flex-start"
                        p={6}
                        borderRadius="lg"
                        bg={alertBg}
                        borderColor={alertBorderColor}
                    >
                        <Flex width="100%" justifyContent="space-between">
                            <AlertTitle mb={4} fontSize="lg" fontWeight="bold" color={alertTextColor}>
                                When to Call Emergency Services (999)
                            </AlertTitle>
                            <IconButton
                                aria-label="Close alert"
                                icon={<FontAwesomeIcon icon={faTriangleExclamation} />}
                                size="sm"
                                onClick={onToggle}
                                variant="ghost"
                                color={alertTextColor}
                            />
            </Flex>

                        <AlertDescription>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <Box>
                                    <Text fontWeight="bold" mb={2} color={alertTextColor}>Call 999 immediately for:</Text>
                                    <List spacing={2}>
                                        {[
                                            "Difficulty breathing or shortness of breath",
                                            "Chest or upper abdominal pain or pressure",
                                            "Fainting, sudden dizziness, weakness",
                                            "Changes in vision",
                                            "Confusion or changes in mental status",
                                            "Any sudden or severe pain",
                                            "Uncontrolled bleeding",
                                            "Severe or persistent vomiting or diarrhea",
                                            "Coughing or vomiting blood",
                                            "Suicidal or homicidal feelings"
                                        ].map((item, index) => (
                                            <ListItem key={index} display="flex" alignItems="center">
                                                <Box color={alertBorderColor} mr={2}>•</Box>
                                                <Text color={textPrimary}>{item}</Text>
                                            </ListItem>
                                        ))}
                                    </List>
                </Box>
                
                                <Box>
                                    <Text fontWeight="bold" mb={2} color={alertTextColor}>Using This Page:</Text>
                                    <List spacing={2}>
                                        {[
                                            "Find nearby emergency facilities",
                                            "Get directions to the closest emergency room",
                                            "Store important emergency contacts",
                                            "Learn about local emergency resources",
                                            "Access emergency preparedness information"
                                        ].map((item, index) => (
                                            <ListItem key={index} display="flex" alignItems="center">
                                                <Box color="green.500" mr={2}><FontAwesomeIcon icon={faCheckCircle} /></Box>
                                                <Text color={textPrimary}>{item}</Text>
                                            </ListItem>
                                        ))}
                                    </List>
                </Box>
                            </SimpleGrid>
                        </AlertDescription>
                    </Alert>
                </MotionBox>
            </Collapse>
            
            <MotionFlex 
                align="center" 
                mb={8} 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Heading 
                    as="h1" 
                    size="xl" 
                    fontWeight="bold"
                    bgGradient={headerGradient}
                    bgClip="text"
                    letterSpacing="tight"
                >
                    Emergency & Healthcare
                </Heading>
                <Badge 
                    ml={3} 
                    colorScheme="red" 
                    px={3} 
                    py={1} 
                    borderRadius="full" 
                    fontSize="sm"
                    fontWeight="medium"
                    textTransform="capitalize"
                >
                    Priority Care
                </Badge>
            </MotionFlex>

            {/* Main Content */}
            <Tabs variant="soft-rounded" colorScheme="red" mb={8}>
                <TabList mb={6} overflowX="auto" py={2} flexWrap={{ base: "nowrap", md: "wrap" }} width="100%">
                    <Tab 
                        _selected={{ 
                            color: 'white', 
                            bg: 'red.500',
                            boxShadow: 'md' 
                        }}
                        fontWeight="medium"
                        mr={2}
                        mb={{ base: 0, md: 2 }}
                        px={5}
                        py={3}
                        transition="all 0.3s"
                    >
                        <Box mr={2}><FontAwesomeIcon icon={faAmbulance} /></Box>
                        Nearby ER
                    </Tab>
                    <Tab 
                        _selected={{ 
                            color: 'white', 
                            bg: 'red.500',
                            boxShadow: 'md' 
                        }}
                        fontWeight="medium"
                        mr={2}
                        mb={{ base: 0, md: 2 }}
                        px={5}
                        py={3}
                        transition="all 0.3s"
                    >
                        <Box mr={2}><FontAwesomeIcon icon={faHeartPulse} /></Box>
                        Emergency Contacts
                    </Tab>
                    <Tab 
                        _selected={{ 
                            color: 'white', 
                            bg: 'red.500',
                            boxShadow: 'md' 
                        }}
                        fontWeight="medium"
                        mr={2}
                        mb={{ base: 0, md: 2 }}
                        px={5}
                        py={3}
                        transition="all 0.3s"
                    >
                        <Box mr={2}><FontAwesomeIcon icon={faShieldHeart} /></Box>
                        Emergency Readiness
                    </Tab>
                    <Tab 
                        _selected={{ 
                            color: 'white', 
                            bg: 'red.500',
                            boxShadow: 'md' 
                        }}
                        fontWeight="medium"
                        px={5}
                        py={3}
                        mb={{ base: 0, md: 2 }}
                        transition="all 0.3s"
                    >
                        <Box mr={2}><FontAwesomeIcon icon={faListCheck} /></Box>
                        Resources
                    </Tab>
                </TabList>

                <TabPanels>
                    {/* Nearby Emergency Locations Tab */}
                    <TabPanel p={0}>
                        <MotionBox
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                                {/* Map Section */}
                                <MotionBox variants={itemVariants}>
                                    <Card height="100%">
                                        <Heading 
                                            as="h2" 
                                            size="lg" 
                                            mb={4}
                                            fontWeight="bold"
                                            bgGradient={headerGradient}
                                            bgClip="text"
                                        >
                                            Nearby Emergency Facilities
                                </Heading>
                                        
                                        <HStack spacing={4} mb={4}>
                                <Button 
                                                leftIcon={<FontAwesomeIcon icon={faLocationDot} />}
                                    colorScheme="blue"
                                                size="sm"
                                                onClick={() => {
                                                    if (navigator.geolocation) {
                                                        navigator.geolocation.getCurrentPosition(
                                                            (position) => {
                                                                handleLocationChange({
                                                                    latitude: position.coords.latitude,
                                                                    longitude: position.coords.longitude
                                                                });
                                                            },
                                                            (error) => {
                                                                console.error("Error getting location:", error);
                                                                toast({
                                                                    title: "Location Error",
                                                                    description: "Could not access your location. Please check your browser permissions.",
                                                                    status: "error",
                                                                    duration: 5000,
                                                                    isClosable: true,
                                                                    position: "top",
                                                                });
                                                            }
                                                        );
                                                    }
                                                }}
                                            >
                                                Update My Location
                                </Button>
                                            
                                            <InputGroup size="sm" maxW="200px">
                                                <Input 
                                                    placeholder="Search location..." 
                                                    bg={subtleBg}
                                                    borderColor={subtleBorderColor}
                                                />
                                                <InputRightElement>
                                                    <FontAwesomeIcon icon={faRotate} />
                                                </InputRightElement>
                                            </InputGroup>
                                        </HStack>
                                        
                                        <Box 
                                            height="400px" 
                                            width="100%" 
                                            borderRadius="md" 
                                            overflow="hidden"
                                            boxShadow="sm"
                                            mb={4}
                                        >
                                            {isLocationLoading ? (
                                                <Center height="100%">
                                                    <VStack spacing={4}>
                                                        <Spinner size="xl" color="red.500" thickness="4px" />
                                                        <Text>Finding nearby emergency services...</Text>
                                                    </VStack>
                                                </Center>
                                            ) : (
                                                <MapComponent
                                                    onLocationChange={handleLocationChange}
                                                    additionalMarkers={mapMarkers}
                                                    height="400px"
                                                    colorScheme="red"
                                                />
                                            )}
                                        </Box>
                                        
                                        {userLocation && (
                                            <HStack spacing={2} fontSize="sm" color={textSecondary}>
                                                <Box><FontAwesomeIcon icon={faMapPin} /></Box>
                                                <Text>Current location: {currentAddress || 'Location set'}</Text>
                                            </HStack>
                            )}
                        </Card>
                                </MotionBox>
                                
                                {/* Hospitals and Medical Facilities List */}
                                <MotionBox variants={itemVariants}>
                                    <VStack align="stretch" spacing={6}>
                                        {/* Hospitals Section */}
                        <Card>
                                            <Heading 
                                                as="h2" 
                                                size="lg" 
                                                mb={6}
                                                fontWeight="bold"
                                                color={useColorModeValue('red.600', 'red.300')}
                                            >
                                                Emergency Hospitals
                            </Heading>
                            
                                            {!userLocation ? (
                                                <Center p={6} bg={subtleBg} borderRadius="lg">
                                                    <VStack spacing={3}>
                                                        <Box fontSize="3xl" color={textSecondary}>
                                                            <FontAwesomeIcon icon={faLocationDot} />
                                                        </Box>
                                                        <Text fontWeight="medium">Share your location</Text>
                                                        <Text fontSize="sm" color={textSecondary} textAlign="center">
                                                            Allow location access to find emergency services near you
                                                        </Text>
                                                        <Button
                                                            colorScheme="red"
                                                            size="sm"
                                                            leftIcon={<FontAwesomeIcon icon={faLocationDot} />}
                                                            onClick={() => {
                                                                if (navigator.geolocation) {
                                                                    navigator.geolocation.getCurrentPosition(
                                                                        (position) => {
                                                                            handleLocationChange({
                                                                                latitude: position.coords.latitude,
                                                                                longitude: position.coords.longitude
                                                                            });
                                                                        },
                                                                        (error) => {
                                                                            console.error("Error getting location:", error);
                                                                        }
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            Enable Location
                                                        </Button>
                                                    </VStack>
                                </Center>
                            ) : nearbyHospitals.length === 0 ? (
                                                <Center p={6} bg={subtleBg} borderRadius="lg">
                                                    <VStack spacing={3}>
                                                        <Box fontSize="3xl" color={textSecondary}>
                                                            <FontAwesomeIcon icon={faHospital} />
                                                        </Box>
                                                        <Text fontWeight="medium">No hospitals found nearby</Text>
                                                        <Text fontSize="sm" color={textSecondary} textAlign="center">
                                                            Try updating your location or expanding search radius
                                    </Text>
                                                    </VStack>
                                </Center>
                            ) : (
                                                <VStack align="stretch" spacing={4} maxH="300px" overflowY="auto" pr={2}>
                                                    {nearbyHospitals.map((hospital, index) => (
                                                        <MotionBox 
                                                            key={index}
                                                            variants={itemVariants}
                                                            whileHover={{ y: -2 }}
                                                        >
                                                            <Flex 
                                            p={4}
                                                                bg={subtleBg}
                                                                borderRadius="lg"
                                                                boxShadow="sm"
                                                                _hover={{ bg: cardHoverBg }}
                                                                transition="all 0.3s"
                                                                borderLeft="4px solid"
                                                                borderColor="red.500"
                                                            >
                                                                <Center 
                                                                    bg={useColorModeValue('white', 'gray.900')} 
                                                                    color="red.500"
                                                                    p={3} 
                                                                    borderRadius="full" 
                                                                    mr={4}
                                                                    boxShadow="sm"
                                                >
                                                    <FontAwesomeIcon icon={faHospital} />
                                                                </Center>
                                                                <Box flex="1">
                                                                    <Flex justify="space-between" mb={1}>
                                                                        <Heading size="sm" fontWeight="semibold">
                                                        {hospital.name}
                                                    </Heading>
                                                                        <Badge colorScheme="red" borderRadius="full">
                                                                            {hospital.distance}
                                                </Badge>
                                            </Flex>
                                                                    <Text fontSize="sm" color={textSecondary} mb={2}>
                                                                        {emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)]}
                                                                    </Text>
                                                                    <HStack spacing={2}>
                                                <Button
                                                                            size="xs"
                                                    leftIcon={<FontAwesomeIcon icon={faMapLocationDot} />}
                                                    colorScheme="blue"
                                                    variant="outline"
                                                    onClick={() => handleGetDirections(hospital)}
                                                >
                                                                            Directions
                                                </Button>
                                                                        <Button
                                                                            size="xs"
                                                                            leftIcon={<FontAwesomeIcon icon={faPhone} />}
                                                                            colorScheme="green"
                                                                            variant="outline"
                                                                            as="a"
                                                                            href={`tel:${hospital.phone || '5551234567'}`}
                                                                        >
                                                                            Call
                                                                        </Button>
                                            </HStack>
                                        </Box>
                                                            </Flex>
                                                        </MotionBox>
                                    ))}
                                                </VStack>
                            )}
                        </Card>
                                    </VStack>
                                </MotionBox>
                            </SimpleGrid>
                        </MotionBox>
                    </TabPanel>

                    {/* Emergency Contacts Tab */}
                    <TabPanel px={0}>
                        <MotionBox
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Card mb={6}>
                                <Heading 
                                    as="h2" 
                                    size="lg" 
                                    mb={6}
                                    fontWeight="bold"
                                    bgGradient={headerGradient}
                                    bgClip="text"
                                >
                                    Your Emergency Contacts
                            </Heading>
                            
                                <Flex 
                                    bg={alertBg}
                                    p={4}
                                    borderRadius="lg"
                                    mb={6}
                                    align="center"
                                >
                                    <Center 
                                        bg={useColorModeValue('red.100', 'red.900')} 
                                        color={useColorModeValue('red.600', 'red.300')}
                                        p={3} 
                                        borderRadius="full"
                                        boxShadow="sm"
                                        mr={4}
                                    >
                                        <FontAwesomeIcon icon={faTriangleExclamation} />
                                    </Center>
                                    <Box flex="1">
                                        <Text fontSize="sm" color={textPrimary}>
                                            In an emergency situation, first responders can access your emergency contacts from your phone. 
                                            Make sure your contacts are up to date.
                                    </Text>
                                    </Box>
                                </Flex>
                                
                                <Flex 
                                    justify="space-between" 
                                    align="center" 
                                    mb={6}
                                >
                                    <Button
                                        leftIcon={<FontAwesomeIcon icon={faPlus} />}
                                        colorScheme="blue"
                                        borderRadius="full"
                                        onClick={handleAddContact}
                                        _hover={{
                                            transform: 'translateY(-2px)',
                                            boxShadow: 'md'
                                        }}
                                        transition="all 0.3s"
                                    >
                                        Add Emergency Contact
                                    </Button>
                                    
                                    <ButtonGroup size="md" isAttached variant="outline">
                                        <Button 
                                            leftIcon={<FontAwesomeIcon icon={faTable} />}
                                            onClick={() => setViewMode('table')}
                                            colorScheme={viewMode === 'table' ? 'blue' : 'gray'}
                                            variant={viewMode === 'table' ? 'solid' : 'outline'}
                                        >
                                            Table
                                        </Button>
                                        <Button 
                                            leftIcon={<FontAwesomeIcon icon={faUser} />}
                                            onClick={() => setViewMode('cards')}
                                            colorScheme={viewMode === 'cards' ? 'blue' : 'gray'}
                                            variant={viewMode === 'cards' ? 'solid' : 'outline'}
                                        >
                                            Cards
                                        </Button>
                                    </ButtonGroup>
                                </Flex>
                                
                                <VStack align="stretch" spacing={4} width="100%">
                                    {renderEmergencyContacts()}
                                </VStack>
                        </Card>
                            
                            <Card>
                                <Heading 
                                    as="h2" 
                                    size="lg" 
                                    mb={6}
                                    fontWeight="bold"
                                    bgGradient={headerGradient}
                                    bgClip="text"
                                >
                                    Important Service Numbers
                </Heading>
                
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {[
                                        { name: "Emergency Services", phone: "999", icon: faAmbulance, color: "red" },
                                        { name: "Fire Service", phone: "16163", icon: faHeadSideMask, color: "purple" },
                                        { name: "National Emergency Service", phone: "999", icon: faBrain, color: "blue" },
                                        { name: "Police Helpline", phone: "333", icon: faShieldHeart, color: "green" }
                                    ].map((service, index) => (
                                        <MotionBox 
                                            key={index}
                                            variants={itemVariants}
                                            whileHover={{ y: -2 }}
                                        >
                                            <Flex 
                                                p={4} 
                                                bg={subtleBg} 
                                                borderRadius="lg"
                                                boxShadow="sm"
                                                _hover={{ bg: cardHoverBg }}
                                                transition="all 0.3s"
                                                borderLeft="4px solid"
                                                borderColor={`${service.color}.500`}
                                            >
                                                <Center 
                                                    bg={useColorModeValue(`${service.color}.100`, `${service.color}.900`)} 
                                                    color={useColorModeValue(`${service.color}.600`, `${service.color}.300`)}
                                                    p={3} 
                                                    borderRadius="full" 
                                                    mr={4}
                                                    boxShadow="sm"
                                                >
                                                    <FontAwesomeIcon icon={service.icon} />
                                                </Center>
                                                <Box flex="1">
                                                    <Text fontWeight="bold">{service.name}</Text>
                                                    <Button
                                                        size="sm"
                                                        leftIcon={<FontAwesomeIcon icon={faPhone} />}
                                                        colorScheme={service.color}
                                                        variant="outline"
                                                        mt={2}
                                                        as="a"
                                                        href={`tel:${service.phone.replace(/[^0-9]/g, '')}`}
                                                    >
                                                        {service.phone}
                                                    </Button>
                            </Box>
                        </Flex>
                                        </MotionBox>
                                    ))}
                                </SimpleGrid>
                            </Card>
                        </MotionBox>
                    </TabPanel>

                    {/* Emergency Readiness Tab */}
                    <TabPanel px={0}>
                        <MotionBox
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Card mb={6}>
                                <Heading 
                                    as="h2" 
                                    size="lg" 
                                    mb={6}
                            fontWeight="bold" 
                                    bgGradient={headerGradient}
                                    bgClip="text"
                                >
                                    Emergency Preparedness
                                </Heading>
                                <Text color={textPrimary} mb={4}>
                                    Being prepared for medical emergencies can save lives. Review these important preparedness resources.
                                </Text>
                                
                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
                                    {[
                                        {
                                            title: "Home Emergency Kit",
                                            icon: faHouseMedical,
                                            color: "green",
                                            content: "Keep a well-stocked home emergency kit with first aid supplies, medications, and emergency contact information."
                                        },
                                        {
                                            title: "Know Health History",
                                            icon: faStethoscope,
                                            color: "blue",
                                            content: "Maintain an updated list of medical conditions, medications, allergies, and healthcare provider information."
                                        },
                                        {
                                            title: "Learn Basic First Aid",
                                            icon: faHeartPulse,
                                            color: "red",
                                            content: "Consider taking a basic first aid and CPR course to be prepared to help in emergency situations."
                                        }
                                    ].map((item, index) => (
                                        <MotionBox 
                                            key={index}
                                            variants={itemVariants}
                                            whileHover={{ y: -5 }}
                                        >
                                            <VStack 
                                                bg={subtleBg}
                                                p={6}
                                                borderRadius="lg"
                                                boxShadow="sm"
                                                _hover={{ boxShadow: "md" }}
                                                transition="all 0.3s"
                                                spacing={4}
                                                align="center"
                                                textAlign="center"
                                                height="100%"
                                            >
                                                <Center 
                                                    bg={useColorModeValue(`${item.color}.100`, `${item.color}.900`)} 
                                                    color={useColorModeValue(`${item.color}.600`, `${item.color}.300`)}
                                                    p={4} 
                                                    borderRadius="full" 
                                                    boxShadow="sm"
                                                >
                                                    <FontAwesomeIcon icon={item.icon} size="lg" />
                                                </Center>
                                                <Heading as="h3" size="md" fontWeight="semibold">
                                                    {item.title}
                                                </Heading>
                                                <Text color={textSecondary} fontSize="sm">
                                                    {item.content}
                                                </Text>
                                            </VStack>
                                        </MotionBox>
                                    ))}
                                </SimpleGrid>
                                
                                <Heading 
                                    as="h3" 
                                    size="md" 
                                    mb={4}
                                    color={useColorModeValue('red.600', 'red.300')}
                                >
                                    Emergency Checklist
                                </Heading>
                                
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    {[
                                        "Know the location of the nearest emergency room",
                                        "Save emergency contact numbers in your phone",
                                        "Keep a list of current medications and allergies",
                                        "Know your blood type and medical conditions",
                                        "Have a family emergency plan",
                                        "Know how to perform basic first aid",
                                        "Keep a first aid kit at home and in your car",
                                        "Know how to recognize signs of common emergencies"
                                    ].map((item, index) => (
                                        <MotionBox 
                                            key={index}
                                            variants={itemVariants}
                                        >
                                            <Flex 
                                                p={3} 
                                                bg={subtleBg} 
                                                borderRadius="md"
                                                _hover={{ bg: cardHoverBg }}
                                                transition="all 0.2s"
                                                align="center"
                                            >
                                                <Box color="green.500" mr={3}>
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                            </Box>
                                                <Text fontWeight="medium" fontSize="sm">{item}</Text>
                        </Flex>
                                        </MotionBox>
                                    ))}
                                </SimpleGrid>
                            </Card>
                        </MotionBox>
                    </TabPanel>

                    {/* Resources Tab */}
                    <TabPanel px={0}>
                        <MotionBox
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Card>
                                <Heading 
                                    as="h2" 
                                    size="lg" 
                                    mb={6}
                            fontWeight="bold" 
                                    bgGradient={headerGradient}
                                    bgClip="text"
                                >
                                    Emergency & Healthcare Resources
                                </Heading>
                                <Text color={textPrimary} mb={6}>
                                    Access important emergency and healthcare resources to stay informed and prepared.
                                </Text>
                                
                                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                                    {[
                                        {
                                            title: "Directorate General of Health Services",
                                            description: "Official health information and guidelines from Bangladesh's DGHS.",
                                            buttonText: "Visit DGHS",
                                            url: "https://dghs.gov.bd/",
                                            icon: faCircleInfo,
                                            color: "blue"
                                        },
                                        {
                                            title: "Bangladesh Red Crescent Society",
                                            description: "Emergency preparedness, first aid training, and disaster response information.",
                                            buttonText: "Visit BDRCS",
                                            url: "https://bdrcs.org/",
                                            icon: faHeartPulse,
                                            color: "red"
                                        },
                                        {
                                            title: "Fire Service & Civil Defense",
                                            description: "Guidelines for fire emergencies and safety procedures in Bangladesh.",
                                            buttonText: "Learn More",
                                            url: "http://www.fireservice.gov.bd/",
                                            icon: faShieldHeart,
                                            color: "purple"
                                        },
                                        {
                                            title: "National Institute of Mental Health",
                                            description: "Mental health resources and emergency support in Bangladesh.",
                                            buttonText: "Visit NIMH",
                                            url: "https://nimhbd.com/",
                                            icon: faBrain, 
                                            color: "green"
                                        },
                                        {
                                            title: "Dhaka Medical College Hospital",
                                            description: "Information about Bangladesh's largest public hospital and emergency services.",
                                            buttonText: "Learn More",
                                            url: "http://dmch.gov.bd/",
                                            icon: faHospital,
                                            color: "teal"
                                        },
                                        {
                                            title: "Bangladesh First Aid Training",
                                            description: "CPR and first aid training resources for Bangladesh residents.",
                                            buttonText: "First Aid",
                                            url: "https://bdrcs.org/",
                                            icon: faStethoscope,
                                            color: "pink"
                                        }
                                    ].map((resource, index) => (
                                        <MotionBox 
                                            key={index}
                                            variants={itemVariants}
                                            whileHover={{ y: -3 }}
                                        >
                                            <Flex 
                                                direction="column"
                                                bg={subtleBg} 
                                                p={5} 
                                                borderRadius="lg"
                                                boxShadow="sm"
                                                transition="all 0.3s"
                                                _hover={{ boxShadow: "md" }}
                                                height="100%"
                                                justify="space-between"
                                            >
                                                <Box>
                                                    <Flex align="center" mb={3}>
                                                        <Center 
                                                            bg={useColorModeValue(`${resource.color}.100`, `${resource.color}.900`)} 
                                                            color={useColorModeValue(`${resource.color}.600`, `${resource.color}.300`)}
                                                            p={3} 
                                                            borderRadius="full" 
                                                            mr={3}
                                                            boxShadow="sm"
                                                        >
                                                            <FontAwesomeIcon icon={resource.icon} />
                                                        </Center>
                                                        <Heading as="h3" size="sm" fontWeight="semibold">
                                                            {resource.title}
                                                        </Heading>
                        </Flex>
                                                    
                                                    <Text fontSize="sm" color={textSecondary} mb={4}>
                                                        {resource.description}
                        </Text>
                    </Box>
                                                
                                                <Button
                                                    as="a"
                                                    href={resource.url}
                                                    target="_blank"
                                                    colorScheme={resource.color}
                                                    size="sm"
                                                    variant="outline"
                                                    width="100%"
                                                    _hover={{
                                                        transform: 'translateY(-2px)',
                                                    }}
                                                    transition="all 0.3s"
                                                >
                                                    {resource.buttonText}
                                                </Button>
                                            </Flex>
                                        </MotionBox>
                                    ))}
                </SimpleGrid>
            </Card>
                        </MotionBox>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            
            {/* Modal for adding/editing emergency contacts */}
            <EmergencyContactModal 
                isOpen={isContactModalOpen} 
                onClose={onCloseContactModal} 
                onSave={handleSaveContact}
                contact={currentContact}
                isEditing={isEditing}
            />
            
            {/* Confirmation dialog for deleting contacts */}
            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onClose={onCloseDeleteDialog}
                onConfirm={confirmDeleteContact}
                contactName={contactToDelete?.name || ''}
            />
        </Container>
    );
};

export default EmergencyServices; 