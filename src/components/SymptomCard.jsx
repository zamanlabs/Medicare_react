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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEllipsisV, 
  faEdit, 
  faTrash, 
  faHeadSideCough, 
  faCalendarAlt, 
  faStickyNote 
} from '@fortawesome/free-solid-svg-icons';

const MotionBox = motion(Box);

/**
 * Symptom Card component for displaying symptom information
 * 
 * @param {Object} props
 * @param {Object} props.symptom - Symptom data object
 * @param {Function} props.onEdit - Function to handle edit action
 * @param {Function} props.onDelete - Function to handle delete action
 * @param {boolean} props.isInView - Whether the card is in viewport (for animations)
 */
const SymptomCard = ({ 
  symptom,
  onEdit,
  onDelete,
  isInView = true
}) => {
  const { id, name, severity, date, notes } = symptom;
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const dateColor = useColorModeValue('gray.500', 'gray.300');
  const notesBgColor = useColorModeValue('gray.50', 'gray.700');
  const notesLabelColor = useColorModeValue('gray.500', 'gray.300');
  const notesTextColor = useColorModeValue('gray.600', 'gray.200');
  const iconBgColors = {
    green: useColorModeValue('green.100', 'green.900'),
    yellow: useColorModeValue('yellow.100', 'yellow.900'),
    red: useColorModeValue('red.100', 'red.900')
  };
  const iconTextColors = {
    green: useColorModeValue('green.700', 'green.200'),
    yellow: useColorModeValue('yellow.700', 'yellow.200'),
    red: useColorModeValue('red.700', 'red.200')
  };
  const shadow = useColorModeValue(
    '0 4px 6px rgba(49, 130, 206, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    '0 4px 6px rgba(0, 0, 0, 0.4)'
  );
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  // Helper functions for severity
  const getSeverityColor = (value) => {
    if (value <= 3) return 'green';
    if (value <= 7) return 'yellow';
    return 'red';
  };

  const getSeverityText = (value) => {
    if (value <= 3) return 'Mild';
    if (value <= 7) return 'Moderate';
    return 'Severe';
  };
  
  // Format date
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

  return (
    <MotionBox
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}
      layout
    >
      <Box
        bg={bgColor}
        boxShadow={shadow}
        borderRadius="xl"
        overflow="hidden"
        borderLeft="4px solid"
        borderColor={`${getSeverityColor(severity)}.500`}
        p={5}
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: 'lg',
        }}
      >
        <Flex justify="space-between" align="flex-start">
          <HStack spacing={3} mb={3} align="center">
            <Box 
              bg={iconBgColors[getSeverityColor(severity)]}
              color={iconTextColors[getSeverityColor(severity)]}
              p={2}
              borderRadius="md"
            >
              <FontAwesomeIcon icon={faHeadSideCough} />
            </Box>
            <Heading size="md" color={textColor}>
              {name}
            </Heading>
          </HStack>
          
          <Menu placement="bottom-end">
            <MenuButton
              as={IconButton}
              icon={<FontAwesomeIcon icon={faEllipsisV} />}
              variant="ghost"
              size="sm"
              ml={2}
              aria-label="Options"
            />
            <MenuList fontSize="sm">
              <MenuItem icon={<FontAwesomeIcon icon={faEdit} />} onClick={() => onEdit(id)}>
                Edit
              </MenuItem>
              <MenuItem 
                icon={<FontAwesomeIcon icon={faTrash} />} 
                onClick={() => onDelete(id)}
                color={useColorModeValue('red.600', 'red.300')}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        
        <Badge 
          colorScheme={getSeverityColor(severity)}
          mb={3}
          px={2}
          py={0.5}
          borderRadius="full"
          fontSize="sm"
        >
          {getSeverityText(severity)} ({severity}/10)
        </Badge>
        
        {/* Severity progress bar */}
        <Box mb={4}>
          <Progress 
            value={severity * 10} 
            colorScheme={getSeverityColor(severity)}
            size="sm"
            borderRadius="full"
            bg={useColorModeValue('gray.100', 'gray.700')}
            hasStripe
          />
        </Box>
        
        <VStack spacing={2} align="flex-start">
          {/* Date info */}
          <HStack color={dateColor} fontSize="sm">
            <Box as={FontAwesomeIcon} icon={faCalendarAlt} />
            <Text>{formatDate(date)}</Text>
          </HStack>
          
          {/* Notes (if available) */}
          {notes && (
            <Box
              mt={2}
              p={3}
              bg={notesBgColor}
              borderRadius="md"
              width="100%"
            >
              <HStack mb={1}>
                <Box as={FontAwesomeIcon} icon={faStickyNote} color={notesLabelColor} />
                <Text fontSize="sm" fontWeight="medium" color={notesLabelColor}>Notes</Text>
              </HStack>
              <Text fontSize="sm" color={notesTextColor}>
                {notes}
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </MotionBox>
  );
};

export default SymptomCard; 