import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  useColorModeValue, 
  Flex, 
  Icon,
  SimpleGrid
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHeadSideCough } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Card } from './ui';
import SymptomCard from './SymptomCard';
import { useSymptoms } from '../context/SymptomContext';

const MotionBox = motion(Box);

/**
 * Symptom Summary component for displaying recent symptoms
 * Can be used on the Dashboard
 */
const SymptomSummary = () => {
  // Get symptoms from context
  const { symptoms } = useSymptoms();
  
  // Take only the 3 most recent symptoms
  const recentSymptoms = symptoms.slice(0, 3);
  
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
  
  return (
    <Card 
      title="Recent Symptoms" 
      variant="elevated"
      action={
        <Button
          as={RouterLink}
          to="/symptom-tracker"
          size="sm"
          colorScheme="brand"
          variant="ghost"
          rightIcon={<FontAwesomeIcon icon={faChevronRight} />}
        >
          View All
        </Button>
      }
    >
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {recentSymptoms.length > 0 ? (
          <SimpleGrid columns={{ base: 1, xl: recentSymptoms.length }} spacing={4}>
            {recentSymptoms.map((symptom, index) => (
              <SymptomCard
                key={symptom.id || index}
                symptom={symptom}
                onEdit={() => {}}
                onDelete={() => {}}
                isInView={true}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            py={8}
            bg={useColorModeValue('gray.50', 'gray.700')} 
            borderRadius="lg"
          >
            <Box 
              fontSize="3xl" 
              color={useColorModeValue('gray.300', 'gray.600')} 
              mb={3}
            >
              <FontAwesomeIcon icon={faHeadSideCough} />
            </Box>
            <Text color={useColorModeValue('gray.500', 'gray.400')} mb={4} textAlign="center">
              No symptoms have been logged yet.
            </Text>
            <Button
              as={RouterLink}
              to="/symptom-tracker"
              size="sm"
              colorScheme="brand"
              rightIcon={<FontAwesomeIcon icon={faChevronRight} />}
            >
              Track Symptoms
            </Button>
          </Flex>
        )}
      </MotionBox>
    </Card>
  );
};

export default SymptomSummary; 