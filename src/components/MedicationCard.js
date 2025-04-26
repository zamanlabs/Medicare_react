import React from 'react';
import {
    Box,
    Text,
    Badge,
    IconButton,
    HStack,
    VStack,
    Heading,
    useColorModeValue,
    Flex,
    Spacer,
    Tooltip,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Progress
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaEllipsisV, FaCheckCircle, FaEdit, FaTrash, FaBell } from 'react-icons/fa';

const MotionBox = motion(Box);

const MedicationCard = ({ 
    medication,
    onEdit,
    onDelete,
    onMarkTaken
}) => {
    const { id, name, dosage, time, frequency, remaining, notes, taken } = medication;
    
    // Calculate remaining percentage for progress bar
    const remainingPercentage = Math.min(100, (remaining / 30) * 100);
    
    // Colors
    const bgColor = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'gray.100');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const takenBgColor = useColorModeValue('gray.100', 'gray.700');
    const lowStockColor = useColorModeValue('red.500', 'red.300');
    const mutedTextColor = useColorModeValue('gray.500', 'gray.300');
    const iconColor = useColorModeValue('blue.500', 'blue.300'); 
    const progressTrackBg = useColorModeValue('gray.100', 'gray.700');
    const menuHoverBg = useColorModeValue('gray.100', 'gray.700');
    const badgeBg = useColorModeValue('blue.50', 'blue.800');
    
    // Shadow for the card
    const cardShadow = useColorModeValue(
        '0 4px 6px rgba(49, 130, 206, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        '0 4px 6px rgba(0, 0, 0, 0.4)'
    );
    
    // Status color
    const getStatusColor = () => {
        if (taken) return 'green';
        if (remaining <= 5) return 'red';
        return 'blue';
    };
    
    return (
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            whileHover={{ y: -5 }}
            bg={taken ? takenBgColor : bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            p={4}
            shadow={cardShadow}
            position="relative"
            opacity={taken ? 0.7 : 1}
        >
            {taken && (
                <Badge 
                    position="absolute" 
                    colorScheme="green" 
                    top={2} 
                    right={10}
                >
                    Taken
                </Badge>
            )}
            
            <Menu placement="bottom-end">
                <MenuButton
                    as={IconButton}
                    icon={<FaEllipsisV />}
                    variant="ghost"
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    aria-label="Options"
                    color={mutedTextColor}
                    _hover={{ bg: menuHoverBg }}
                />
                <MenuList borderColor={borderColor} bg={bgColor}>
                    <MenuItem 
                        icon={<FaEdit />} 
                        onClick={() => onEdit(id)} 
                        _hover={{ bg: menuHoverBg }}
                    >
                        Edit
                    </MenuItem>
                    <MenuItem 
                        icon={<FaTrash />} 
                        onClick={() => onDelete(id)} 
                        color="red.500" 
                        _hover={{ bg: menuHoverBg }}
                    >
                        Delete
                    </MenuItem>
                    {!taken && (
                        <MenuItem 
                            icon={<FaCheckCircle />} 
                            onClick={() => onMarkTaken(id)} 
                            _hover={{ bg: menuHoverBg }}
                        >
                            Mark as Taken
                        </MenuItem>
                    )}
                </MenuList>
            </Menu>
            
            <VStack align="start" spacing={3}>
                <Heading size="md" color={textColor} isTruncated maxWidth="90%">
                    {name}
                </Heading>
                
                <Badge colorScheme={getStatusColor()} mb={1}>
                    {dosage}
                </Badge>
                
                <HStack spacing={4} width="100%">
                    <Tooltip label="Time to take">
                        <Flex align="center">
                            <FaBell size="14px" color={iconColor} />
                            <Text ml={2} fontSize="sm" color={textColor}>{time}</Text>
                        </Flex>
                    </Tooltip>
                    
                    <Spacer />
                    
                    <Badge 
                        colorScheme="purple" 
                        variant="outline"
                        bg={badgeBg}
                    >
                        {frequency}
                    </Badge>
                </HStack>
                
                <Box width="100%">
                    <Flex justifyContent="space-between" mb={1}>
                        <Text fontSize="xs" color={mutedTextColor}>Remaining: {remaining} doses</Text>
                        {remaining <= 5 && (
                            <Text fontSize="xs" color={lowStockColor} fontWeight="bold">
                                Low Stock!
                            </Text>
                        )}
                    </Flex>
                    <Progress 
                        value={remainingPercentage} 
                        size="xs" 
                        colorScheme={remaining <= 5 ? 'red' : 'blue'} 
                        borderRadius="full"
                        bg={progressTrackBg}
                    />
                </Box>
                
                {notes && (
                    <Text fontSize="sm" color={mutedTextColor} noOfLines={2}>
                        {notes}
                    </Text>
                )}
            </VStack>
        </MotionBox>
    );
};

export default MedicationCard; 