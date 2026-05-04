import { Box, Heading, Text, Container } from '@chakra-ui/react';

export const AboutPage = () => {
  return (
    <Container maxW="container.md" py={10}>
      <Box p={8} borderWidth="1px" borderRadius="lg" shadow="sm" bg="white">
        <Heading mb={4}>Over ons</Heading>
        <Text fontSize="lg" color="gray.600">
          Welkom bij onze Event App! Deze pagina is momenteel nog onder constructie. 
          Binnenkort vind je hier meer informatie over ons team en onze missie om 
          mensen samen te brengen via geweldige evenementen.
        </Text>
      </Box>
    </Container>
  );
};