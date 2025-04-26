import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalFooter, 
    ModalBody, 
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    VStack,
    Select,
    HStack,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Textarea,
    Divider,
    Text,
    Badge,
    Flex,
    useColorModeValue,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    IconButton,
    Box
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPills, 
    faClock, 
    faCalendarAlt, 
    faHashtag, 
    faNotesMedical, 
    faTimes,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

const MotionModalContent = motion(ModalContent);

const MedicationFormModal = ({ isOpen, onClose, initialData, onSubmit }) => {
    // Form state
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        dosage: '',
        time: '08:00',
        frequency: 'daily',
        type: 'pill',
        remaining: 30,
        notes: '',
        history: []
    });

    // Error state
    const [errors, setErrors] = useState({});

    // Colors for UI elements
    const headerBg = useColorModeValue('gray.50', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const infoTextColor = useColorModeValue('gray.500', 'gray.400');

    // Reset form when modal opens with initialData or create new medication
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
            setFormData({
                    ...initialData
            });
        } else {
                // Reset to default values for a new medication
                setFormData({
                    id: uuidv4(),
                    name: '',
                    dosage: '',
                    time: '08:00',
                    frequency: 'daily',
                    type: 'pill',
                    remaining: 30,
                    notes: '',
                    history: []
                });
            }
            // Clear errors
            setErrors({});
        }
    }, [isOpen, initialData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when field is changed
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleNumberChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: parseInt(value, 10)
        }));
        
        // Clear error when field is changed
        if (errors[name]) {
            setErrors(prev => ({
            ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Medication name is required';
        }
        
        if (!formData.dosage.trim()) {
            newErrors.dosage = 'Dosage is required';
        }
        
        if (!formData.time) {
            newErrors.time = 'Time is required';
        }
        
        if (!formData.frequency) {
            newErrors.frequency = 'Frequency is required';
        }
        
        if (formData.remaining < 0) {
            newErrors.remaining = 'Remaining doses must be 0 or greater';
        }
        
        setErrors(newErrors);
        
        // Return true if no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleOnClose = () => {
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleOnClose} size="md">
            <ModalOverlay backdropFilter="blur(4px)" />
            <MotionModalContent
                bg={headerBg}
                borderRadius="xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
            >
                <ModalHeader
                    borderTopRadius="xl"
                    p={4}
                    borderBottom="1px solid"
                    borderColor={borderColor}
                >
                    <Flex align="center">
                        <Box 
                            mr={3} 
                            bg="brand.500" 
                            color="white" 
                            p={2} 
                            borderRadius="md"
                        >
                            <FontAwesomeIcon icon={faPills} />
                        </Box>
                        <Text fontWeight="bold">{initialData ? 'Edit Medication' : 'Add New Medication'}</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                
                <form onSubmit={handleSubmit}>
                    <ModalBody p={6}>
                        <VStack spacing={5} align="stretch">
                            <FormControl isInvalid={errors.name}>
                                <FormLabel fontWeight="medium">Medication Name</FormLabel>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <FontAwesomeIcon icon={faPills} color="gray.300" />
                                    </InputLeftElement>
                            <Input 
                                name="name"
                                        placeholder="e.g., Lisinopril, Metformin"
                                value={formData.name}
                                        onChange={handleInputChange}
                            />
                                </InputGroup>
                                {errors.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                        </FormControl>
                        
                            <HStack spacing={5}>
                                <FormControl isInvalid={errors.dosage} flex="1">
                                    <FormLabel fontWeight="medium">Dosage</FormLabel>
                            <Input 
                                name="dosage"
                                        placeholder="e.g., 10mg, 1 tablet"
                                value={formData.dosage}
                                        onChange={handleInputChange}
                            />
                                    {errors.dosage && <FormErrorMessage>{errors.dosage}</FormErrorMessage>}
                        </FormControl>
                        
                                <FormControl flex="1">
                                    <FormLabel fontWeight="medium">Type</FormLabel>
                            <Select 
                                        name="type" 
                                        value={formData.type} 
                                        onChange={handleInputChange}
                                    >
                                        <option value="pill">Pill/Tablet</option>
                                        <option value="liquid">Liquid</option>
                                        <option value="injection">Injection</option>
                                        <option value="inhaler">Inhaler</option>
                                        <option value="topical">Topical</option>
                                        <option value="drops">Drops</option>
                                        <option value="other">Other</option>
                            </Select>
                        </FormControl>
                            </HStack>

                            <HStack spacing={5}>
                                <FormControl isInvalid={errors.time} flex="1">
                                    <FormLabel fontWeight="medium">Time</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <FontAwesomeIcon icon={faClock} color="gray.300" />
                                        </InputLeftElement>
                            <Input 
                                name="time"
                                type="time"
                                value={formData.time}
                                            onChange={handleInputChange}
                            />
                                    </InputGroup>
                                    {errors.time && <FormErrorMessage>{errors.time}</FormErrorMessage>}
                        </FormControl>
                        
                                <FormControl isInvalid={errors.frequency} flex="1">
                                    <FormLabel fontWeight="medium">Frequency</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <FontAwesomeIcon icon={faCalendarAlt} color="gray.300" />
                                        </InputLeftElement>
                                        <Select 
                                            name="frequency" 
                                            value={formData.frequency} 
                                            onChange={handleInputChange}
                                        >
                                            <option value="daily">Daily</option>
                                            <option value="twice daily">Twice Daily</option>
                                            <option value="three times daily">Three Times Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="as needed">As Needed (PRN)</option>
                                            <option value="monthly">Monthly</option>
                                        </Select>
                                    </InputGroup>
                                    {errors.frequency && <FormErrorMessage>{errors.frequency}</FormErrorMessage>}
                                </FormControl>
                            </HStack>

                            <FormControl isInvalid={errors.remaining}>
                                <FormLabel fontWeight="medium">
                                    <Flex align="center">
                                        <Text>Remaining Doses</Text>
                                        <Badge ml={2} colorScheme="blue" borderRadius="full">
                                            <FontAwesomeIcon icon={faHashtag} style={{ marginRight: '4px' }} />
                                            Count
                                        </Badge>
                                    </Flex>
                                </FormLabel>
                            <NumberInput 
                                min={0} 
                                value={formData.remaining}
                                    onChange={(valueString) => handleNumberChange('remaining', valueString)}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                                {errors.remaining && <FormErrorMessage>{errors.remaining}</FormErrorMessage>}
                                <Text fontSize="xs" color={infoTextColor} mt={1}>
                                    This will help you track when to refill your prescription
                                </Text>
                        </FormControl>
                        
                        <FormControl>
                                <FormLabel fontWeight="medium">
                                    <Flex align="center">
                                        <Text>Notes</Text> 
                                        <Text fontSize="sm" color={infoTextColor} ml={2}>(Optional)</Text>
                                    </Flex>
                                </FormLabel>
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none" h="full" pl={2}>
                                        <FontAwesomeIcon icon={faNotesMedical} color="gray.300" />
                                    </InputLeftElement>
                                    <Textarea
                                        name="notes"
                                        placeholder="Special instructions or notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        pl={10}
                                        minH="100px"
                                    />
                                </InputGroup>
                            </FormControl>
                            
                            {initialData && initialData.history && initialData.history.length > 0 && (
                                <>
                                    <Divider />
                                    <Box>
                                        <Text fontWeight="medium" mb={2}>Medication History</Text>
                                        <Text fontSize="sm" color={infoTextColor} mb={3}>
                                            This medication has been taken {initialData.history.length} times
                                        </Text>
                                    </Box>
                                </>
                            )}
                    </VStack>
                </ModalBody>

                    <ModalFooter bg={headerBg} borderBottomRadius="xl" borderTop="1px solid" borderColor={borderColor}>
                        <Button variant="ghost" mr={3} onClick={handleOnClose}>
                        Cancel
                    </Button>
                        <Button type="submit" colorScheme="brand">
                            {initialData ? 'Update Medication' : 'Add Medication'}
                    </Button>
                </ModalFooter>
                </form>
            </MotionModalContent>
        </Modal>
    );
};

export default MedicationFormModal; 