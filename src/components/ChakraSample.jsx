import React from 'react';
import { Box, Button, Heading, Text, VStack, HStack, useColorModeValue } from '@chakra-ui/react';
import './ChakraSample.scss'; // Import component-specific SCSS

const ChakraSample = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box 
      className="chakra-sample-container"
      bg={bgColor} 
      p={6} 
      rounded="md" 
      shadow="md"
    >
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" color="brand.600">
          Welcome to Medicare
        </Heading>
        
        <Text color={textColor}>
          This component demonstrates the combination of Chakra UI with custom SCSS styling.
        </Text>
        
        <HStack spacing={4}>
          <Button variant="primary">Primary Action</Button>
          <Button variant="outline" colorScheme="brand">Secondary Action</Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ChakraSample; 