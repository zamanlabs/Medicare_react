import React, { useState, useEffect } from 'react';
import { 
    Heading, 
    Text, 
    VStack, 
    HStack,
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Select,
    Tag,
    TagLabel,
    TagCloseButton,
    Flex,
    Divider,
    useToast,
    IconButton,
    Badge,
    Progress,
    Tooltip,
    Alert,
    AlertIcon,
    FormErrorMessage,
    Spinner,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    ButtonGroup,
    useColorModeValue
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faDroplet, faUserMd, faAllergies, faCheckCircle, faSave, faTimes, faEdit, faHistory, faUndo, faVenusMars } from '@fortawesome/free-solid-svg-icons';
import { Card } from '../components/ui';
import { useUserProfile } from '../context/UserProfileContext';
import { useAuth } from '../context/AuthContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDER_OPTIONS = ['male', 'female', 'other', 'prefer not to say'];

const Profile = () => {
    const { userProfile, updateProfile, addMedicalCondition, removeMedicalCondition, addAllergy, removeAllergy, profileCompletion, loading, error, profileUpdated } = useUserProfile();
    const { isAuthenticated, user } = useAuth();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // Local state for form data
    const [formData, setFormData] = useState({ ...userProfile });
    
    // State for new items
    const [newCondition, setNewCondition] = useState('');
    const [newAllergy, setNewAllergy] = useState('');
    
    // Form validation state
    const [formErrors, setFormErrors] = useState({});
    
    // State to track if form has been changed
    const [formChanged, setFormChanged] = useState(false);
    
    // Custom colors for dark mode optimization
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const mutedTextColor = useColorModeValue('gray.600', 'gray.300');
    const labelColor = useColorModeValue('gray.700', 'gray.200');
    const placeholderColor = useColorModeValue('gray.500', 'gray.400');
    const inputBgColor = useColorModeValue('white', 'gray.700');
    const buttonHoverBg = useColorModeValue('gray.100', 'gray.700');
    const sectionBg = useColorModeValue('gray.50', 'gray.800');
    const headerBg = useColorModeValue('gray.50', 'gray.900');
    const headerBorderColor = useColorModeValue('gray.100', 'gray.700');
    const iconColor = useColorModeValue('brand.500', 'brand.300');
    const shadowColor = useColorModeValue(
        '0 4px 6px rgba(49, 130, 206, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        '0 4px 6px rgba(0, 0, 0, 0.4)'
    );
    
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // Update local state when profile changes
    useEffect(() => {
        setFormData({ ...userProfile });
        setFormChanged(false);
    }, [userProfile]);
    
    // Show success toast when profile is updated
    useEffect(() => {
        if (profileUpdated) {
            toast({
                title: 'Profile Updated',
                description: 'Your profile has been successfully updated',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
    }, [profileUpdated, toast]);
    
    // Reset form to original values
    const handleCancelEdit = () => {
        setFormData({ ...userProfile });
        setFormErrors({});
        setFormChanged(false);
        toast({
            title: 'Changes Discarded',
            description: 'Your changes have been reverted',
            status: 'info',
            duration: 2000,
            isClosable: true,
        });
    };
    
    // Validate form data
    const validateForm = () => {
        const errors = {};
        
        if (!formData.fullName.trim()) {
            errors.fullName = 'Full name is required';
        }
        
        if (!formData.age || formData.age <= 0 || formData.age > 120) {
            errors.age = 'Please enter a valid age between 1 and 120';
        }
        
        if (!formData.bloodGroup) {
            errors.bloodGroup = 'Blood group is required';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Changing ${name} to: ${value}`);
        setFormData({ ...formData, [name]: value });
        setFormChanged(true);
        
        // Clear error for this field when user updates it
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: undefined
            });
        }
    };
    
    // Handle number input for age
    const handleAgeChange = (value) => {
        setFormData({ ...formData, age: Number(value) });
        setFormChanged(true);
        
        // Clear age error when updated
        if (formErrors.age) {
            setFormErrors({
                ...formErrors,
                age: undefined
            });
        }
    };
    
    // Open confirmation dialog before saving
    const handleOpenConfirmation = (e) => {
        e.preventDefault();
        
        // Validate form before opening confirmation dialog
        if (validateForm()) {
            onOpen();
        } else {
            toast({
                title: 'Validation Error',
                description: 'Please fix the errors in the form',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };
    
    // Handle form submission
    const handleSubmit = () => {
        console.log("Submitting updated profile data:", formData);
        updateProfile(formData);
        setFormChanged(false);
        onClose();
    };
    
    // Add new medical condition
    const handleAddCondition = () => {
        if (newCondition.trim()) {
            addMedicalCondition(newCondition.trim());
            setNewCondition('');
        } else {
            toast({
                title: 'Error',
                description: 'Please enter a medical condition',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };
    
    // Add new allergy
    const handleAddAllergy = () => {
        if (newAllergy.trim()) {
            addAllergy(newAllergy.trim());
            setNewAllergy('');
        } else {
            toast({
                title: 'Error',
                description: 'Please enter an allergy',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };
    
    // Check if field is completed
    const isFieldCompleted = (fieldName) => {
        switch (fieldName) {
            case 'fullName':
                return !!userProfile.fullName;
            case 'age':
                return userProfile.age > 0;
            case 'bloodGroup':
                return !!userProfile.bloodGroup;
            case 'medicalConditions':
                return userProfile.medicalConditions && userProfile.medicalConditions.length > 0;
            case 'allergies':
                return userProfile.allergies && userProfile.allergies.length > 0;
            default:
                return false;
        }
    };
    
    // Completion indicator component
    const CompletionBadge = ({ fieldName }) => {
        const isCompleted = isFieldCompleted(fieldName);
        return (
            <Tooltip label={isCompleted ? 'Completed' : 'Not completed'}>
                <Badge 
                    ml={2} 
                    colorScheme={isCompleted ? 'green' : 'gray'} 
                    variant="subtle"
                >
                    {isCompleted && <FontAwesomeIcon icon={faCheckCircle} />}
                    {isCompleted ? ' Completed' : ' Incomplete'}
                </Badge>
            </Tooltip>
        );
    };
    
    // Handler for keypress in input fields
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.target.name === 'newCondition') {
                handleAddCondition();
            } else if (e.target.name === 'newAllergy') {
                handleAddAllergy();
            }
        }
    };
    
    // Place after the age form control
    const genderField = (
        <FormControl>
            <Flex alignItems="center">
                <FormLabel display="flex" alignItems="center" color={labelColor}>
                    <Box color={iconColor} mr={2}>
                        <FontAwesomeIcon icon={faVenusMars} />
                    </Box>
                    Gender
                </FormLabel>
            </Flex>
            <Select 
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                placeholder="Select gender (optional)"
                bg={inputBgColor}
                color={textColor}
                borderColor={borderColor}
                _hover={{ borderColor: 'brand.400' }}
                _placeholder={{ color: placeholderColor }}
            >
                {GENDER_OPTIONS.map(option => (
                    <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                ))}
            </Select>
        </FormControl>
    );
    
    // Add these physical attribute fields after the gender field
    const heightField = (
        <FormControl>
            <Flex alignItems="center">
                <FormLabel>Height (cm)</FormLabel>
            </Flex>
            <NumberInput 
                min={1} 
                max={300} 
                value={formData.height || ''}
                onChange={(value) => {
                    setFormData({ ...formData, height: Number(value) });
                    setFormChanged(true);
                }}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </FormControl>
    );
    
    const weightField = (
        <FormControl>
            <Flex alignItems="center">
                <FormLabel>Weight (kg)</FormLabel>
            </Flex>
            <NumberInput 
                min={1} 
                max={500} 
                value={formData.weight || ''}
                onChange={(value) => {
                    setFormData({ ...formData, weight: Number(value) });
                    setFormChanged(true);
                }}
            >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </FormControl>
    );
    
    // Check if user is authenticated
    if (!isAuthenticated) {
        return (
            <Card>
                <Alert status="warning" borderRadius="md">
                    <AlertIcon />
                    You must be logged in to view or edit your profile.
                </Alert>
            </Card>
        );
    }
    
    return (
        <Card>
            <VStack spacing={4} align="stretch" mb={6}>
                <HStack justify="space-between" align="center">
                    <Heading as="h2" size="xl" color="gray.800">
                        User Profile
                    </Heading>
                    {userProfile.updatedAt && (
                        <Tooltip label="Last updated">
                            <Badge colorScheme="blue" p={2} borderRadius="md">
                                <FontAwesomeIcon icon={faHistory} />&nbsp;
                                {formatDate(userProfile.updatedAt)}
                            </Badge>
                        </Tooltip>
                    )}
                </HStack>
                
                <Box>
                    <Text>Profile Completion</Text>
                    <Tooltip label={`${profileCompletion}% completed`}>
                        <Progress 
                            value={profileCompletion} 
                            colorScheme={profileCompletion === 100 ? 'green' : 'blue'} 
                            size="md" 
                            borderRadius="md"
                        />
                    </Tooltip>
                </Box>
                
                {error && (
                    <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        {error}
                    </Alert>
                )}
            </VStack>
            
            <form onSubmit={handleOpenConfirmation}>
                <VStack spacing={6} align="stretch">
                    {/* Personal Information */}
                    <Box>
                        <Heading size="md" mb={4} display="flex" alignItems="center">
                            <Box color="blue.500" mr={2}>
                                <FontAwesomeIcon icon={faUser} />
                            </Box>
                            Personal Information
                        </Heading>
                        
                        <VStack spacing={4} align="stretch">
                            <FormControl isRequired isInvalid={!!formErrors.fullName}>
                                <Flex alignItems="center">
                                    <FormLabel display="flex" alignItems="center" color={labelColor}>
                                        <Box color={iconColor} mr={2}>
                                            <FontAwesomeIcon icon={faUser} />
                                        </Box>
                                        Full Name
                                    </FormLabel>
                                    <CompletionBadge fieldName="fullName" />
                                </Flex>
                                <Input
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    bg={inputBgColor}
                                    color={textColor}
                                    borderColor={borderColor}
                                    _hover={{ borderColor: 'brand.400' }}
                                    _placeholder={{ color: placeholderColor }}
                                />
                                {formErrors.fullName && <FormErrorMessage>{formErrors.fullName}</FormErrorMessage>}
                            </FormControl>
                            
                            <FormControl isRequired isInvalid={!!formErrors.age}>
                                <Flex alignItems="center">
                                    <FormLabel>Age</FormLabel>
                                    <CompletionBadge fieldName="age" />
                                </Flex>
                                <NumberInput
                                    min={0}
                                    max={120}
                                    value={formData.age || ''}
                                    onChange={handleAgeChange}
                                >
                                    <NumberInputField
                                        name="age"
                                        placeholder="Enter your age"
                                        bg={inputBgColor}
                                        color={textColor}
                                        borderColor={borderColor}
                                        _hover={{ borderColor: 'brand.400' }}
                                        _placeholder={{ color: placeholderColor }}
                                    />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                                {formErrors.age && <FormErrorMessage>{formErrors.age}</FormErrorMessage>}
                            </FormControl>
                            
                            {genderField}
                        </VStack>
                    </Box>
                    
                    <Divider />
                    
                    {/* Health Information */}
                    <Box>
                        <Heading size="md" mb={4} display="flex" alignItems="center">
                            <Box color="red.500" mr={2}>
                                <FontAwesomeIcon icon={faDroplet} />
                            </Box>
                            Health Information
                        </Heading>
                        
                        <VStack spacing={4} align="stretch">
                            <FormControl isRequired isInvalid={!!formErrors.bloodGroup}>
                                <Flex alignItems="center">
                                    <FormLabel>Blood Group</FormLabel>
                                    <CompletionBadge fieldName="bloodGroup" />
                                </Flex>
                                <Select
                                    name="bloodGroup"
                                    value={formData.bloodGroup || ''}
                                    onChange={handleChange}
                                    placeholder="Select blood group"
                                    bg={inputBgColor}
                                    color={textColor}
                                    borderColor={borderColor}
                                    _hover={{ borderColor: 'brand.400' }}
                                    _placeholder={{ color: placeholderColor }}
                                >
                                    {BLOOD_GROUPS.map(group => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </Select>
                                {formErrors.bloodGroup && <FormErrorMessage>{formErrors.bloodGroup}</FormErrorMessage>}
                            </FormControl>
                            
                            {heightField}
                            {weightField}
                            
                            <FormControl>
                                <Flex alignItems="center">
                                    <FormLabel display="flex" alignItems="center">
                                        <Box color="green.500" mr={2}>
                                            <FontAwesomeIcon icon={faUserMd} />
                                        </Box>
                                        Medical Conditions
                                    </FormLabel>
                                    <CompletionBadge fieldName="medicalConditions" />
                                </Flex>
                                
                                <HStack mb={2}>
                                    <Input 
                                        name="newCondition"
                                        value={newCondition}
                                        onChange={(e) => setNewCondition(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Add medical condition"
                                        borderColor={isFieldCompleted('medicalConditions') ? 'green.300' : undefined}
                                    />
                                    <IconButton
                                        icon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={handleAddCondition}
                                        aria-label="Add condition"
                                        colorScheme="green"
                                        isLoading={loading && newCondition.trim() !== ''}
                                    />
                                </HStack>
                                
                                <Flex wrap="wrap" gap={2} mt={2}>
                                    {userProfile.medicalConditions.map((condition, index) => (
                                        <Tag
                                            key={index}
                                            size="md"
                                            borderRadius="full"
                                            variant="solid"
                                            colorScheme="green"
                                        >
                                            <TagLabel>{condition}</TagLabel>
                                            <TagCloseButton onClick={() => removeMedicalCondition(index)} />
                                        </Tag>
                                    ))}
                                    {userProfile.medicalConditions.length === 0 && (
                                        <Text fontSize="sm" color="gray.500">No medical conditions added</Text>
                                    )}
                                </Flex>
                            </FormControl>
                            
                            <FormControl>
                                <Flex alignItems="center">
                                    <FormLabel display="flex" alignItems="center">
                                        <Box color="orange.500" mr={2}>
                                            <FontAwesomeIcon icon={faAllergies} />
                                        </Box>
                                        Allergies
                                    </FormLabel>
                                    <CompletionBadge fieldName="allergies" />
                                </Flex>
                                
                                <HStack mb={2}>
                                    <Input 
                                        name="newAllergy"
                                        value={newAllergy}
                                        onChange={(e) => setNewAllergy(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Add allergy"
                                        borderColor={isFieldCompleted('allergies') ? 'green.300' : undefined}
                                    />
                                    <IconButton
                                        icon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={handleAddAllergy}
                                        aria-label="Add allergy"
                                        colorScheme="orange"
                                        isLoading={loading && newAllergy.trim() !== ''}
                                    />
                                </HStack>
                                
                                <Flex wrap="wrap" gap={2} mt={2}>
                                    {userProfile.allergies.map((allergy, index) => (
                                        <Tag
                                            key={index}
                                            size="md"
                                            borderRadius="full"
                                            variant="solid"
                                            colorScheme="orange"
                                        >
                                            <TagLabel>{allergy}</TagLabel>
                                            <TagCloseButton onClick={() => removeAllergy(index)} />
                                        </Tag>
                                    ))}
                                    {userProfile.allergies.length === 0 && (
                                        <Text fontSize="sm" color="gray.500">No allergies added</Text>
                                    )}
                                </Flex>
                            </FormControl>
                        </VStack>
                    </Box>
                    
                    <ButtonGroup spacing={4} mt={4}>
                        <Button 
                            colorScheme="blue" 
                            type="submit"
                            size="lg"
                            leftIcon={<FontAwesomeIcon icon={faSave} />}
                            isLoading={loading}
                            loadingText="Updating..."
                            isDisabled={!formChanged}
                        >
                            Save Changes
                        </Button>
                        
                        {formChanged && (
                            <Button 
                                variant="outline"
                                colorScheme="red" 
                                size="lg"
                                leftIcon={<FontAwesomeIcon icon={faUndo} />}
                                onClick={handleCancelEdit}
                                isDisabled={loading}
                            >
                                Cancel
                            </Button>
                        )}
                    </ButtonGroup>
                </VStack>
            </form>
            
            {/* Confirmation Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Profile Update</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        Are you sure you want to update your profile with these changes?
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Yes, Update Profile
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
};

export default Profile; 