import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
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
    HStack
} from '@chakra-ui/react';
import { Card } from '../components/ui';
import { useSymptoms } from '../context/SymptomContext'; // Import the custom hook

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

const SymptomTracker = () => {
    const toast = useToast();
    // Get state and functions from context
    const { symptoms, addSymptom, removeSymptom } = useSymptoms();

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
            duration: 5000,
            isClosable: true,
        });
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
        });
    };

    const getSeverityColor = (value) => {
        if (value <= 3) return 'green.500';
        if (value <= 7) return 'yellow.500';
        return 'red.500';
    };

    return (
        <>
            <Flex align="center" mb={6}>
                <Heading as="h2" size="xl" color="gray.800">Symptom Tracker</Heading>
                <Badge ml={3} colorScheme="blue" px={2.5} py={0.5} borderRadius="md">Health Tool</Badge>
            </Flex>

            {/* Symptom Tracking Form */}
            <Card mb={6}>
                <Heading as="h3" size="md" mb={4} color="gray.800">Log a New Symptom</Heading>
                <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl>
                                <FormLabel htmlFor="symptom-type" fontSize="sm" fontWeight="medium" color="gray.700">
                                    Symptom Type
                                </FormLabel>
                                <Select
                                    id="symptom-type"
                                    value={symptomType}
                                    onChange={handleSymptomTypeChange}
                                    size="md"
                                    placeholder="Select a symptom"
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

                            <FormControl>
                                <FormLabel htmlFor="severity" fontSize="sm" fontWeight="medium" color="gray.700">
                                    Severity: <Text as="span" color={getSeverityColor(severity)} fontWeight="bold">{severity}/10</Text>
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
                                        colorScheme={severity <= 3 ? "green" : severity <= 7 ? "yellow" : "red"}
                                    >
                                        <SliderTrack>
                                            <SliderFilledTrack />
                                        </SliderTrack>
                                        <SliderThumb />
                                    </Slider>
                                </Flex>
                            </FormControl>

                            {isOtherSelected && (
                                <FormControl gridColumn={{ md: "span 2" }}>
                                    <FormLabel htmlFor="other-symptom" fontSize="sm" fontWeight="medium" color="gray.700">
                                        Specify Symptom
                                    </FormLabel>
                                    <Input
                                        id="other-symptom"
                                        value={otherSymptom}
                                        onChange={(e) => setOtherSymptom(e.target.value)}
                                        placeholder="Enter your symptom"
                                        size="md"
                                        isRequired
                                    />
                                </FormControl>
                            )}

                            <FormControl>
                                <FormLabel htmlFor="symptom-date" fontSize="sm" fontWeight="medium" color="gray.700">
                                    Date & Time
                                </FormLabel>
                                <Input
                                    id="symptom-date"
                                    type="datetime-local"
                                    value={symptomDate}
                                    onChange={(e) => setSymptomDate(e.target.value)}
                                    size="md"
                                    isRequired
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor="notes" fontSize="sm" fontWeight="medium" color="gray.700">
                                    Notes (Optional)
                                </FormLabel>
                                <Textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any additional details about the symptom"
                                    size="md"
                                    rows={2}
                                />
                            </FormControl>
                        </SimpleGrid>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            size="md"
                            width={{ base: "full", md: "auto" }}
                            alignSelf={{ md: "flex-end" }}
                            mt={2}
                        >
                            Log Symptom
                        </Button>
                    </VStack>
                </form>
            </Card>

            {/* Symptoms Log */}
            <Card>
                <Heading as="h3" size="md" mb={4} color="gray.800">Your Symptom History</Heading>

                {symptoms.length === 0 ? (
                    <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        No symptoms logged yet. Use the form above to track your symptoms.
                    </Alert>
                ) : (
                    <Box overflowX="auto">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Symptom</Th>
                                    <Th>Severity</Th>
                                    <Th>Date & Time</Th>
                                    <Th>Notes</Th>
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {symptoms.map(symptom => (
                                    <Tr key={symptom.id}>
                                        <Td fontWeight="medium">{symptom.name}</Td>
                                        <Td>
                                            <HStack>
                                                <Box 
                                                    w="12px" 
                                                    h="12px" 
                                                    borderRadius="full" 
                                                    bg={getSeverityColor(symptom.severity)} 
                                                    mr={2}
                                                />
                                                <Text>{symptom.severity}/10</Text>
                                            </HStack>
                                        </Td>
                                        <Td>{formatDate(symptom.date)}</Td>
                                        <Td>
                                            {symptom.notes ? symptom.notes : <Text color="gray.400" fontStyle="italic">No notes</Text>}
                                        </Td>
                                        <Td>
                                            <HStack spacing={2}>
                                                <IconButton
                                                    aria-label="Edit symptom"
                                                    icon={<FontAwesomeIcon icon={faEdit} />}
                                                    size="sm"
                                                    colorScheme="blue"
                                                    onClick={() => handleEdit(symptom.id)}
                                                />
                                                <IconButton
                                                    aria-label="Delete symptom"
                                                    icon={<FontAwesomeIcon icon={faTrash} />}
                                                    size="sm"
                                                    colorScheme="red"
                                                    onClick={() => handleDelete(symptom.id)}
                                                />
                                            </HStack>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Box>
                )}
            </Card>
        </>
    );
};

export default SymptomTracker; 