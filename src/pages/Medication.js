import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faPills, faCapsules } from '@fortawesome/free-solid-svg-icons';
import {
    Box,
    Heading,
    Text,
    Badge,
    Flex,
    Button,
    IconButton,
    SimpleGrid,
    Progress,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Divider,
    VStack,
    HStack,
    useColorModeValue,
    useToast,
    useDisclosure,
    Center
} from '@chakra-ui/react';
import { Card } from '../components/ui';
import MedicationFormModal from '../components/MedicationFormModal';
import { useMedications } from '../context/MedicationContext';

// Initialize history data
const initialHistory = [
    { id: 1, date: 'Today, 8:00 AM', name: 'Lisinopril', dosage: '10mg', status: 'Taken' },
    { id: 2, date: 'Yesterday, 1:00 PM', name: 'Metformin', dosage: '500mg', status: 'Taken' },
];

// Helper function to format date/time if needed (can be expanded)
const formatDateTime = (dateString) => {
    // Basic placeholder, add more robust formatting later
    return dateString;
};

const Medication = () => {
    const { 
        medications, 
        addMedication, 
        updateMedication,
        removeMedication,
        toggleMedicationTaken,
        calculateAdherenceScore
    } = useMedications();
    
    const [history, setHistory] = useState([]);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Load history data from localStorage on initial render
    useEffect(() => {
        const storedHistory = localStorage.getItem('medicationHistory');
        setHistory(storedHistory ? JSON.parse(storedHistory) : initialHistory);
    }, []);

    // Save history data to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('medicationHistory', JSON.stringify(history));
    }, [history]);

    const handleAddMedication = () => {
        setSelectedMedication(null); // Ensure we're in "add" mode
        onOpen();
    };

    const handleEditMedication = (id) => {
        const medToEdit = medications.find(med => med.id === id);
        if (medToEdit) {
            setSelectedMedication(medToEdit);
            onOpen();
        } else {
            toast({
                title: "Error",
                description: "Medication not found",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDeleteMedication = (idToDelete) => {
        if (window.confirm("Are you sure you want to delete this medication?")) {
            removeMedication(idToDelete);
            toast({
                title: "Medication Deleted",
                description: "The medication has been removed from your list.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleSaveMedication = (medicationData) => {
        // If we have an ID, we're editing
        if (medicationData.id && medications.some(m => m.id === medicationData.id)) {
            // Use context function to update the medication
            updateMedication(medicationData);
            
            // Add to history
            const historyEntry = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                name: medicationData.name,
                dosage: medicationData.dosage,
                status: 'Updated'
            };
            setHistory([historyEntry, ...history]);
            
            toast({
                title: "Medication Updated",
                description: `${medicationData.name} has been updated.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } else {
            // New medication
            addMedication(medicationData);
            
            // Add to history
            const historyEntry = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                name: medicationData.name,
                dosage: medicationData.dosage,
                status: 'Added'
            };
            setHistory([historyEntry, ...history]);
            
            toast({
                title: "Medication Added",
                description: `${medicationData.name} has been added to your medications.`,
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleMarkAsTaken = (id) => {
        toggleMedicationTaken(id);
        
        const medication = medications.find(med => med.id === id);
        if (medication) {
            // Add to history
            const historyEntry = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                name: medication.name,
                dosage: medication.dosage,
                status: medication.isTaken ? 'Skipped' : 'Taken'
            };
            setHistory([historyEntry, ...history]);
            
            toast({
                title: medication.isTaken ? "Marked as Not Taken" : "Marked as Taken",
                description: `${medication.name} has been ${medication.isTaken ? 'unmarked' : 'marked'} as taken.`,
                status: "info",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Taken': return 'green';
            case 'Missed': return 'red';
            case 'Added': return 'blue';
            case 'Updated': return 'orange';
            case 'Skipped': return 'yellow';
            default: return 'gray';
        }
    };

    // Calculate adherence score
    const adherenceScore = calculateAdherenceScore();

    return (
        <>
            <Flex align="center" justify="space-between" mb={6}>
                <Flex align="center">
                    <Heading 
                        as="h2" 
                        size="xl"
                        bgGradient="linear(to-r, brand.500, green.500)"
                        bgClip="text"
                    >
                        Medication Management
                    </Heading>
                    <Badge ml={3} colorScheme="blue" px={2.5} py={0.5} borderRadius="md">Health Tool</Badge>
                </Flex>
                <Button
                    onClick={handleAddMedication}
                    colorScheme="blue"
                    leftIcon={<FontAwesomeIcon icon={faPlus} />}
                >
                    Add Medication
                </Button>
            </Flex>

            {/* Current Medications */}
            <Box mb={8}>
                <Heading as="h3" size="md" mb={4} color="gray.800">Current Medications</Heading>
                {medications.length === 0 ? (
                    <Center py={4}>
                        <Text color="gray.500">No current medications added.</Text>
                    </Center>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {medications.map(med => (
                            <Box 
                                key={med.id} 
                                bg={med.bgColor || 'gray.50'} 
                                p={4} 
                                borderRadius="lg" 
                                border="1px solid"
                                borderColor={med.bgColor ? 'transparent' : 'gray.200'}
                            >
                                <Flex justify="space-between" align="start">
                                    <Box>
                                        <Heading as="h4" size="md" fontWeight="semibold">{med.name}</Heading>
                                        <Text fontSize="sm" color="gray.600">{med.dosage}</Text>
                                        <Text fontSize="sm" color="gray.600" mt={1}>Next dose: {med.nextDose}</Text>
                                    </Box>
                                    <HStack spacing={2} flexShrink={0}>
                                        <IconButton
                                            aria-label="Edit medication"
                                            icon={<FontAwesomeIcon icon={faEdit} />}
                                            size="sm"
                                            colorScheme="blue"
                                            variant="ghost"
                                            onClick={() => handleEditMedication(med.id)}
                                        />
                                        <IconButton
                                            aria-label="Delete medication"
                                            icon={<FontAwesomeIcon icon={faTrash} />}
                                            size="sm"
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => handleDeleteMedication(med.id)}
                                        />
                                    </HStack>
                                </Flex>
                                <Box mt={3}>
                                    <Progress 
                                        value={med.remaining} 
                                        colorScheme={med.iconColor?.split('.')[0] || 'gray'}
                                        size="sm"
                                        borderRadius="full"
                                    />
                                    <Text fontSize="xs" color="gray.500" mt={1}>{med.remaining}% remaining</Text>
                                </Box>
                                <Button 
                                    mt={3}
                                    size="sm"
                                    width="full"
                                    colorScheme={med.isTaken ? "green" : "gray"}
                                    variant={med.isTaken ? "solid" : "outline"}
                                    onClick={() => handleMarkAsTaken(med.id)}
                                >
                                    {med.isTaken ? "Taken ✓" : "Mark as Taken"}
                                </Button>
                            </Box>
                        ))}
                    </SimpleGrid>
                )}
            </Box>

            {/* Medication Schedule */}
            <Card mb={8}>
                <Heading as="h3" size="md" mb={4} color="gray.800">Today's Schedule</Heading>
                {medications.filter(med => med.scheduleTime).length === 0 ? (
                    <Center py={4}>
                        <Text color="gray.500">No medications scheduled for today.</Text>
                    </Center>
                ) : (
                    <VStack spacing={0} align="stretch" divider={<Divider />}>
                        {medications
                            .filter(med => med.scheduleTime) // Ensure scheduleTime exists
                            .sort((a, b) => a.scheduleTime.localeCompare(b.scheduleTime)) // Sort by time
                            .map(med => (
                                <Flex 
                                    key={med.id} 
                                    p={4} 
                                    align="center" 
                                    justify="space-between" 
                                    _hover={{ bg: "gray.50" }}
                                >
                                    <Flex align="center">
                                        <Flex 
                                            w="12" 
                                            h="12" 
                                            bg={med.bgColor || 'gray.100'} 
                                            borderRadius="full" 
                                            align="center" 
                                            justify="center" 
                                            mr={4} 
                                            flexShrink={0}
                                        >
                                            <Box color={med.iconColor || 'gray.600'}>
                                                <FontAwesomeIcon icon={med.icon || faPills} />
                                            </Box>
                                        </Flex>
                                        <Box>
                                            <Heading as="h4" size="sm" fontWeight="semibold">{med.name}</Heading>
                                            <Text fontSize="sm" color="gray.600">{med.dosage}</Text>
                                        </Box>
                                    </Flex>
                                    <Box textAlign="right" ml={2}>
                                        <Text fontSize="sm" fontWeight="medium">{med.scheduleTime}</Text>
                                        <Badge 
                                            colorScheme={med.isTaken ? "green" : "yellow"} 
                                            mt={1}
                                        >
                                            {med.isTaken ? "Taken" : med.scheduleStatus || "Pending"}
                                        </Badge>
                                    </Box>
                                </Flex>
                            ))}
                    </VStack>
                )}
            </Card>

            {/* Medication History */}
            <Card mb={8}>
                <Flex justify="space-between" align="center" mb={4}>
                    <Heading as="h3" size="md" color="gray.800">Medication History</Heading>
                    <HStack>
                        <Badge colorScheme="green" fontSize="0.8em">Adherence Score: {adherenceScore}%</Badge>
                    </HStack>
                </Flex>
                <Box overflowX="auto">
                    <Table variant="simple" size="sm">
                        <Thead>
                            <Tr>
                                <Th>Date & Time</Th>
                                <Th>Medication</Th>
                                <Th>Dosage</Th>
                                <Th>Status</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {history.length > 0 ? (
                                history.map(item => (
                                    <Tr key={item.id}>
                                        <Td>{formatDateTime(item.date)}</Td>
                                        <Td>{item.name}</Td>
                                        <Td>{item.dosage}</Td>
                                        <Td>
                                            <Badge colorScheme={getStatusColor(item.status)}>
                                                {item.status}
                                            </Badge>
                                        </Td>
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td colSpan={4} textAlign="center" py={4}>
                                        <Text color="gray.500">No medication history available</Text>
                                    </Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </Box>
            </Card>
            
            {/* Medication Form Modal */}
            <MedicationFormModal
                isOpen={isOpen}
                onClose={onClose}
                medication={selectedMedication}
                onSave={handleSaveMedication}
            />
        </>
    );
};

export default Medication; 