import React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    useColorModeValue,
    ScaleFade
} from '@chakra-ui/react';

/**
 * PageLayout component for consistent page layout across the application
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {React.ReactNode} props.subtitle - Optional subtitle component or text
 * @param {React.ReactNode} props.children - Page content
 * @param {Object} props.rest - Additional props passed to the container
 */
const PageLayout = ({ 
    title,
    subtitle,
    children,
    ...rest
}) => {
    // Theme colors
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const headingColor = useColorModeValue('gray.800', 'white');
    const subtitleColor = useColorModeValue('gray.600', 'gray.400');
    
    return (
        <Box
            as="main"
            bg={bgColor}
            minH="calc(100vh - 60px)"
            py={6}
            {...rest}
        >
            <Container maxW="container.xl">
                <ScaleFade in={true} initialScale={0.95}>
                    {title && (
                        <Box mb={6}>
                            <Heading 
                                as="h1" 
                                size="xl" 
                                color={headingColor}
                                fontWeight="bold"
                            >
                                {title}
                            </Heading>
                            {subtitle && (
                                <Text 
                                    mt={2} 
                                    fontSize="lg" 
                                    color={subtitleColor}
                                >
                                    {subtitle}
                                </Text>
                            )}
                        </Box>
                    )}
                    {children}
                </ScaleFade>
            </Container>
        </Box>
    );
};

export default PageLayout; 