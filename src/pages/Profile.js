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
    IconButton
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faDroplet, faUserMd, faAllergies } from '@fortawesome/free-solid-svg-icons';
import { Card } from '../components/ui';
import { useUserProfile } from '../context/UserProfileContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Profile = () => {
    const { userProfile, updateProfile, addMedicalCondition, removeMedicalCondition, addAllergy, removeAllergy } = useUserProfile();
    const toast = useToast();
    
    // Local state for form data
    const [formData, setFormData] = useState({ ...userProfile });
    
    // State for new items
    const [newCondition, setNewCondition] = useState('');
    const [newAllergy, setNewAllergy] = useState('');
    
    // Update local state when profile changes
    useEffect(() => {
        setFormData({ ...userProfile });
    }, [userProfile]);
    
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    // Handle number input for age
    const handleAgeChange = (value) => {
        setFormData({ ...formData, age: Number(value) });
    };
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile(formData);
        toast({
            title: 'Profile updated',
            description: 'Your profile has been updated successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };
    
    // Add new medical condition
    const handleAddCondition = () => {
        if (newCondition.trim()) {
            addMedicalCondition(newCondition.trim());
            setNewCondition('');
        }
    };
    
    // Add new allergy
    const handleAddAllergy = () => {
        if (newAllergy.trim()) {
            addAllergy(newAllergy.trim());
            setNewAllergy('');
        }
    };
    
    return (
        <Card>
            <Heading as="h2" size="xl" color="gray.800" mb={4}>
                User Profile
            </Heading>
            
            <form onSubmit={handleSubmit}>
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
                            <FormControl isRequired>
                                <FormLabel>Full Name</FormLabel>
                                <Input 
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                />
                            </FormControl>
                            
                            <FormControl isRequired>
                                <FormLabel>Age</FormLabel>
                                <NumberInput 
                                    min={1} 
                                    max={120} 
                                    value={formData.age}
                                    onChange={handleAgeChange}
                                >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>
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
                            <FormControl isRequired>
                                <FormLabel>Blood Group</FormLabel>
                                <Select 
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    placeholder="Select blood group"
                                >
                                    {BLOOD_GROUPS.map(group => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            <FormControl>
                                <FormLabel display="flex" alignItems="center">
                                    <Box color="green.500" mr={2}>
                                        <FontAwesomeIcon icon={faUserMd} />
                                    </Box>
                                    Medical Conditions
                                </FormLabel>
                                
                                <HStack mb={2}>
                                    <Input 
                                        value={newCondition}
                                        onChange={(e) => setNewCondition(e.target.value)}
                                        placeholder="Add medical condition"
                                    />
                                    <IconButton
                                        icon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={handleAddCondition}
                                        aria-label="Add condition"
                                        colorScheme="green"
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
                                <FormLabel display="flex" alignItems="center">
                                    <Box color="orange.500" mr={2}>
                                        <FontAwesomeIcon icon={faAllergies} />
                                    </Box>
                                    Allergies
                                </FormLabel>
                                
                                <HStack mb={2}>
                                    <Input 
                                        value={newAllergy}
                                        onChange={(e) => setNewAllergy(e.target.value)}
                                        placeholder="Add allergy"
                                    />
                                    <IconButton
                                        icon={<FontAwesomeIcon icon={faPlus} />}
                                        onClick={handleAddAllergy}
                                        aria-label="Add allergy"
                                        colorScheme="orange"
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
                    
                    <Button 
                        mt={4} 
                        colorScheme="blue" 
                        type="submit"
                        size="lg"
                    >
                        Save Profile
                    </Button>
                </VStack>
            </form>
        </Card>
    );
};

export default Profile; 