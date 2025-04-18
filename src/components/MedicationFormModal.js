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
    Select,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    VStack,
    HStack,
    Box,
    useToast
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills, faCapsules, faSyringe, faTablets } from '@fortawesome/free-solid-svg-icons';

// Default medication icons and colors
const MEDICATION_ICONS = [
    { icon: faPills, label: 'Pills', iconColor: 'blue.500', bgColor: 'blue.100' },
    { icon: faCapsules, label: 'Capsules', iconColor: 'green.500', bgColor: 'green.100' },
    { icon: faSyringe, label: 'Injection', iconColor: 'red.500', bgColor: 'red.100' },
    { icon: faTablets, label: 'Tablets', iconColor: 'purple.500', bgColor: 'purple.100' }
];

const MedicationFormModal = ({ isOpen, onClose, medication, onSave }) => {
    // Initial form state
    const initialState = {
        id: null,
        name: '',
        dosage: '',
        frequency: 'once-daily',
        time: '08:00',
        remaining: 100,
        icon: faPills,
        iconColor: 'blue.500',
        bgColor: 'blue.100',
        notes: ''
    };

    // Form state
    const [formData, setFormData] = useState(initialState);
    const [selectedIconIndex, setSelectedIconIndex] = useState(0);
    const toast = useToast();

    // Update form data when medication prop changes
    useEffect(() => {
        if (medication) {
            // Find the index of the icon in MEDICATION_ICONS or default to 0
            const iconIndex = MEDICATION_ICONS.findIndex(item => 
                String(item.icon) === String(medication.icon));
            
            setSelectedIconIndex(iconIndex >= 0 ? iconIndex : 0);
            setFormData({
                ...medication,
                // Default any missing fields
                time: medication.scheduleTime || '08:00',
                remaining: medication.remaining || 100,
            });
        } else {
            setFormData(initialState);
            setSelectedIconIndex(0);
        }
    }, [medication, isOpen]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle number input for remaining
    const handleRemainingChange = (value) => {
        setFormData(prev => ({
            ...prev,
            remaining: value
        }));
    };

    // Handle icon selection
    const handleIconSelect = (index) => {
        setSelectedIconIndex(index);
        setFormData(prev => ({
            ...prev,
            icon: MEDICATION_ICONS[index].icon,
            iconColor: MEDICATION_ICONS[index].iconColor,
            bgColor: MEDICATION_ICONS[index].bgColor
        }));
    };

    // Format the form data for saving
    const formatFormDataForSave = () => {
        const timeString = formData.time;
        const [hours, minutes] = timeString.split(':');
        const period = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
        const hour12 = (parseInt(hours, 10) % 12) || 12;
        const formattedTime = `${hour12}:${minutes} ${period}`;
        
        // Next dose calculation
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const scheduleDateText = today.getHours() > parseInt(hours, 10) ? 'Tomorrow' : 'Today';
        
        return {
            ...formData,
            id: formData.id || Date.now(),
            scheduleTime: formattedTime,
            scheduleStatus: 'Upcoming',
            nextDose: `${scheduleDateText} at ${formattedTime}`
        };
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate form
        if (!formData.name.trim()) {
            toast({
                title: "Error",
                description: "Medication name is required",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        
        if (!formData.dosage.trim()) {
            toast({
                title: "Error",
                description: "Dosage information is required",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        
        const formattedData = formatFormDataForSave();
        onSave(formattedData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {medication?.id ? 'Edit Medication' : 'Add New Medication'}
                </ModalHeader>
                <ModalCloseButton />
                
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Medication Name</FormLabel>
                            <Input 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Lisinopril"
                            />
                        </FormControl>
                        
                        <FormControl isRequired>
                            <FormLabel>Dosage</FormLabel>
                            <Input 
                                name="dosage"
                                value={formData.dosage}
                                onChange={handleChange}
                                placeholder="e.g., 10mg"
                            />
                        </FormControl>
                        
                        <FormControl>
                            <FormLabel>Frequency</FormLabel>
                            <Select 
                                name="frequency"
                                value={formData.frequency}
                                onChange={handleChange}
                            >
                                <option value="once-daily">Once Daily</option>
                                <option value="twice-daily">Twice Daily</option>
                                <option value="three-times-daily">Three Times Daily</option>
                                <option value="every-other-day">Every Other Day</option>
                                <option value="weekly">Weekly</option>
                                <option value="as-needed">As Needed</option>
                            </Select>
                        </FormControl>
                        
                        <FormControl>
                            <FormLabel>Time</FormLabel>
                            <Input 
                                name="time"
                                type="time"
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </FormControl>
                        
                        <FormControl>
                            <FormLabel>Remaining (%)</FormLabel>
                            <NumberInput 
                                min={0} 
                                max={100} 
                                value={formData.remaining}
                                onChange={handleRemainingChange}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        
                        <FormControl>
                            <FormLabel>Medication Type</FormLabel>
                            <HStack spacing={3} justify="space-between">
                                {MEDICATION_ICONS.map((iconData, index) => (
                                    <Box
                                        key={index}
                                        p={3}
                                        borderRadius="lg"
                                        bg={selectedIconIndex === index ? iconData.bgColor : 'gray.100'}
                                        color={selectedIconIndex === index ? iconData.iconColor : 'gray.500'}
                                        cursor="pointer"
                                        onClick={() => handleIconSelect(index)}
                                        border="2px"
                                        borderColor={selectedIconIndex === index ? iconData.iconColor : 'transparent'}
                                        textAlign="center"
                                        fontSize="xl"
                                    >
                                        <FontAwesomeIcon icon={iconData.icon} />
                                        <Box fontSize="xs" mt={1}>{iconData.label}</Box>
                                    </Box>
                                ))}
                            </HStack>
                        </FormControl>
                        
                        <FormControl>
                            <FormLabel>Notes</FormLabel>
                            <Input 
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Additional information"
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        {medication?.id ? 'Update' : 'Save'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default MedicationFormModal; 